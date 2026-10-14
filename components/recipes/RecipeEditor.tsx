"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Recipe } from "@/lib/types";
import {
  createRecipe,
  fetchRecipeBySlug,
  recipeSlugExists,
  saveRecipe,
} from "@/lib/firebase/data";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { useAuth } from "@/components/auth/AuthProvider";
import { categoryLabel, RECIPE_CATEGORIES } from "@/lib/category";
import slugify from "@/lib/slug";
import Icon from "@/components/ui/Icon";
import Alert, { LoadingBlock } from "@/components/ui/Alert";
import ThemedSelect from "@/components/ui/ThemedSelect";
import RequireAuth from "@/components/auth/RequireAuth";
import { extractYouTubeId, resolveYouTubeThumbnail } from "@/lib/youtube";
import { getVideoPlatform, normalizeVideoUrl } from "@/lib/video";
import {
  EMPTY_NUTRITION_FORM,
  NUTRITION_FIELDS,
  formToNutrition,
  nutritionToForm,
  type NutritionForm,
} from "@/lib/nutrition";

type GeneratedRecipe = Pick<
  Recipe,
  "title" | "description" | "category" | "ingredients" | "steps"
> & {
  recipeYield?: string;
  nutrition?: NonNullable<Recipe["nutrition"]>;
};

/** Turns a data: URL (from the server-fetched Reel thumbnail) into an uploadable File. */
async function dataUrlToFile(dataUrl: string, name: string): Promise<File> {
  const blob = await (await fetch(dataUrl)).blob();
  const extension = blob.type.split("/")[1] || "jpg";
  return new File([blob], `${name}.${extension}`, { type: blob.type });
}

function EditorForm({
  mode,
  slug,
}: {
  mode: "create" | "edit";
  slug?: string;
}) {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [initialLoading, setInitialLoading] = useState(mode === "edit");
  const [recipeId, setRecipeId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [category, setCategory] = useState<Recipe["category"]>("Dinner");
  const [recipeYield, setRecipeYield] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [transcriptInput, setTranscriptInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAuto, setImageAuto] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [nutrition, setNutrition] =
    useState<NutritionForm>(EMPTY_NUTRITION_FORM);

  useEffect(() => {
    if (mode !== "edit" || !slug) return;
    void fetchRecipeBySlug(slug)
      .then((recipe) => {
        if (!recipe) {
          setError("Recipe to edit not found.");
          return;
        }
        setRecipeId(recipe.id);
        setTitle(recipe.title);
        setDescription(recipe.description);
        setIngredients(recipe.ingredients.join("\n"));
        setSteps(recipe.steps.join("\n"));
        setCategory(recipe.category);
        setRecipeYield(recipe.recipeYield ?? "");
        setVideoUrl(recipe.videoUrl ?? "");
        setImageUrl(recipe.imageUrl ?? "");
        setNutrition(nutritionToForm(recipe.nutrition));
      })
      .catch(() => setError("Could not load the recipe."))
      .finally(() => setInitialLoading(false));
  }, [mode, slug]);

  // Automatically use the YouTube thumbnail when the user has not selected or provided an image.
  useEffect(() => {
    const videoId = extractYouTubeId(videoUrl);
    if (!videoId) return;
    if (imageFile) return;
    if (imageUrl.trim() && !imageAuto) return;
    let cancelled = false;
    void resolveYouTubeThumbnail(videoId).then((thumbnail) => {
      if (cancelled) return;
      setImageUrl(thumbnail);
      setImageAuto(true);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl, imageFile]);

  const generatedSlug = useMemo(() => slugify(title), [title]);

  async function generateFromVideo() {
    if (!currentUser) {
      setError("Please sign in before generating a recipe with AI.");
      return;
    }
    if (!getVideoPlatform(videoUrl)) {
      setError(
        "Enter a valid YouTube video or Facebook Reel URL before generating content.",
      );
      return;
    }

    const hasExistingContent = Boolean(
      title.trim() || description.trim() || ingredients.trim() || steps.trim(),
    );
    if (
      hasExistingContent &&
      !window.confirm(
        "AI will replace the current title, description, servings, ingredients, instructions, category, and nutrition. Do you want to continue?",
      )
    ) {
      return;
    }

    setAiBusy(true);
    setError("");
    setSuccess("");
    setAiMessage("");
    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetch("/api/ai/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          videoUrl: normalizeVideoUrl(videoUrl) ?? "",
          transcript: transcriptInput.trim(),
        }),
      });
      const result = (await response.json()) as {
        recipe?: GeneratedRecipe;
        error?: string;
        source?: {
          videoTitle?: string;
          channel?: string;
          transcriptLanguage?: string;
          platform?: "youtube" | "facebook";
          thumbnailDataUrl?: string | null;
        };
      };
      if (!response.ok) {
        throw new Error(
          result.error || "Could not generate content from this video.",
        );
      }
      const recipe = result.recipe;
      if (
        !recipe ||
        !recipe.title ||
        !recipe.description ||
        !Array.isArray(recipe.ingredients) ||
        !Array.isArray(recipe.steps)
      ) {
        throw new Error(
          "The AI returned an incomplete draft. Please try again.",
        );
      }

      setTitle(recipe.title);
      setDescription(recipe.description);
      setCategory(recipe.category);
      setRecipeYield(recipe.recipeYield?.trim() ?? "");
      setIngredients(recipe.ingredients.join("\n"));
      setSteps(recipe.steps.join("\n"));
      setNutrition(nutritionToForm(recipe.nutrition));
      // Facebook Reels have no public thumbnail URL, so the server sends the preview image.
      // Only fill the dish photo when the user hasn't chosen or pasted their own.
      const thumbnail = result.source?.thumbnailDataUrl;
      if (
        typeof thumbnail === "string" &&
        thumbnail.startsWith("data:image/") &&
        !imageFile &&
        (!imageUrl.trim() || imageAuto)
      ) {
        setImageUrl(thumbnail);
        setImageAuto(true);
      }
      setAiMessage(
        `Draft created${result.source?.videoTitle ? ` from video “${result.source.videoTitle}”` : result.source?.platform === "facebook" ? " from the Facebook Reel" : " from the YouTube video"}. Please check the quantities, instructions, and nutrition estimates before saving.`,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not generate the recipe with AI.",
      );
    } finally {
      setAiBusy(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser) return;
    const normalizedVideoUrl = normalizeVideoUrl(videoUrl);
    if (videoUrl.trim() && !normalizedVideoUrl) {
      setError("Enter a valid YouTube or Facebook video URL.");
      return;
    }
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const finalSlug = await (async () => {
        const base = generatedSlug || `mon-${Date.now()}`;
        if (!(await recipeSlugExists(base, recipeId || undefined))) return base;
        let index = 2;
        while (
          await recipeSlugExists(`${base}-${index}`, recipeId || undefined)
        )
          index += 1;
        return `${base}-${index}`;
      })();

      let finalImage = imageUrl.trim();
      if (imageFile) {
        finalImage = await uploadImageToCloudinary(imageFile);
      } else if (finalImage.startsWith("data:image/")) {
        finalImage = await uploadImageToCloudinary(
          await dataUrlToFile(finalImage, "facebook-reel-thumbnail"),
        );
      }
      const payload: Partial<Recipe> = {
        title: title.trim(),
        description: description.trim(),
        category,
        recipeYield: recipeYield.trim(),
        ingredients: ingredients
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean),
        steps: steps
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean),
        videoUrl: normalizedVideoUrl ?? "",
        imageUrl: finalImage,
        nutrition: formToNutrition(nutrition),
        slug: finalSlug,
      };
      if (mode === "create") payload.userId = currentUser.uid;

      if (mode === "edit") {
        await saveRecipe(recipeId, payload);
      } else {
        await createRecipe(payload as Omit<Recipe, "id">);
      }
      setSuccess(mode === "edit" ? "Recipe updated." : "New recipe added.");
      window.setTimeout(() => router.push(`/recipes/${finalSlug}`), 500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save the recipe.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (initialLoading) return <LoadingBlock label="Opening recipe..." />;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-7 flex flex-col gap-2">
        <span className="eyebrow">
          <Icon name={mode === "edit" ? "edit" : "plus"} size={15} /> Kitchen
          notebook
        </span>
        <h1 className="section-title">
          {mode === "edit" ? "Edit recipe" : "Add a recipe"}
        </h1>
        <p className="text-sm leading-6 text-muted">
          Write down delicious dishes in a way that is easy to read, easy to
          cook, and easy to pass on to loved ones. You can also generate a draft
          from a video link with AI.
        </p>
      </div>
      <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-8">
        {error && (
          <div className="mb-5">
            <Alert tone="danger">{error}</Alert>
          </div>
        )}
        {success && (
          <div className="mb-5">
            <Alert tone="success">{success}</Alert>
          </div>
        )}
        <form onSubmit={submit} className="space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="form-label">
                <Icon name="bowl" size={15} /> Dish name / title
              </span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                required
                placeholder="Example: Traditional beef pho"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="form-label">
                <Icon name="book" size={15} /> Description
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input min-h-28"
                required
                placeholder="A few sentences introducing the dish, when it's usually cooked, or its signature flavors..."
              />
            </label>
            <label className="block">
              <span className="form-label">
                <Icon name="tag" size={15} /> Category
              </span>
              <ThemedSelect
                name="category"
                ariaLabel="Category"
                value={category}
                onChange={(value) => setCategory(value as Recipe["category"])}
                options={[
                  ...RECIPE_CATEGORIES.map((item) => ({
                    value: item,
                    label: categoryLabel(item),
                  })),
                ]}
                placeholder="Select a category"
              />
            </label>
            <label className="block">
              <span className="form-label">
                <Icon name="bowl" size={15} /> Servings{" "}
                <span className="font-normal text-muted">
                  (e.g. 4 or 4 servings)
                </span>
              </span>
              <input
                value={recipeYield}
                onChange={(e) => setRecipeYield(e.target.value)}
                className="form-input"
                maxLength={60}
                placeholder="4 servings"
              />
            </label>
            <div className="block md:col-span-2">
              <label htmlFor="recipe-video-url" className="form-label">
                <Icon name="youtube" size={15} /> Video URL (YouTube or
                Facebook Reel)
              </label>
              <input
                id="recipe-video-url"
                value={videoUrl}
                onChange={(e) => {
                  setVideoUrl(e.target.value);
                  setAiMessage("");
                  if (imageAuto) {
                    setImageUrl("");
                    setImageAuto(false);
                  }
                }}
                className="form-input"
                placeholder="https://youtu.be/... or https://www.facebook.com/reel/..."
              />
              <p className="mt-2 text-xs leading-5 text-muted">
                AI uses YouTube subtitles (or Facebook Reel captions) to draft the
                title, description, servings, ingredients, instructions, and nutrition information.
              </p>
            </div>
            <div className="md:col-span-2 rounded-2xl border border-border bg-cream/40 p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold text-ink">
                    Generate content with AI
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    Use AI to create a draft for you to review; the recipe is
                    not saved until you click the publish button.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void generateFromVideo()}
                  disabled={aiBusy || busy || !videoUrl.trim()}
                  className="btn-primary shrink-0 justify-center disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {aiBusy ? (
                    <span className="size-4 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory" />
                  ) : (
                    <Icon name="refresh" size={17} />
                  )}{" "}
                  {aiBusy ? "Generating draft..." : "Generate recipe with AI"}
                </button>
              </div>
              <label className="mt-4 block">
                <span className="mb-1 block text-sm font-medium text-ink">
                  Video dialogue / subtitles (optional)
                </span>
                <textarea
                  value={transcriptInput}
                  onChange={(e) => setTranscriptInput(e.target.value)}
                  className="form-input min-h-24"
                  maxLength={60000}
                  placeholder="Leave blank to let AI fetch the YouTube subtitles or Facebook Reel caption automatically. If the video has no subtitles or the server cannot read them (Facebook Reels often need this), paste the dialogue/recipe text here."
                />
                <span className="mt-1 block text-xs text-muted">
                  {transcriptInput.length.toLocaleString("en-US")} / 60,000
                  characters
                </span>
              </label>
              {aiMessage && (
                <p
                  className="mt-3 text-sm leading-6 text-green-800"
                  role="status"
                >
                  {aiMessage}
                </p>
              )}
            </div>
            <label className="block md:col-span-2">
              <span className="form-label">
                <Icon name="list" size={15} /> Ingredients{" "}
                <span className="font-normal text-muted">
                  (one ingredient per line)
                </span>
              </span>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="form-input min-h-40"
                required
                placeholder={"500g beef\n1kg marrow bones\n..."}
              />
            </label>
            <label className="block md:col-span-2">
              <span className="form-label">
                <Icon name="route" size={15} /> Instructions{" "}
                <span className="font-normal text-muted">
                  (one step per line)
                </span>
              </span>
              <textarea
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                className="form-input min-h-44"
                required
                placeholder={
                  "Prepare the ingredients...\nSimmer the broth...\nPlate and enjoy..."
                }
              />
            </label>
            <fieldset className="md:col-span-2">
              <legend className="form-label">
                <Icon name="list" size={15} /> Nutritional values{" "}
                <span className="font-normal text-muted">
                  (optional, per serving)
                </span>
              </legend>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {NUTRITION_FIELDS.map((field) => (
                  <label key={field.key} className="block">
                    <span className="mb-1 block text-xs text-muted">
                      {field.label} ({field.unit})
                    </span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="any"
                      value={nutrition[field.key]}
                      onChange={(e) =>
                        setNutrition((prev) => ({
                          ...prev,
                          [field.key]: e.target.value,
                        }))
                      }
                      className="form-input"
                      placeholder="0"
                    />
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="block md:col-span-2">
              <span className="form-label">
                <Icon name="image" size={15} /> Dish photo
              </span>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setImageFile(e.target.files?.[0] ?? null);
                    setImageAuto(false);
                  }}
                  className="file-input"
                />
                <input
                  value={imageUrl.startsWith("data:") ? "" : imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImageAuto(false);
                  }}
                  className="form-input"
                  placeholder="Or paste an image URL (https://...)"
                />
              </div>
              {!imageFile && imageUrl.trim() && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Dish photo preview"
                    className="aspect-video w-full object-cover"
                  />
                </div>
              )}
              <span className="mt-2 block text-xs text-muted">
                {imageAuto
                  ? "Using the video thumbnail. Choose another image or paste a URL to replace it."
                  : "A new image will be uploaded to Cloudinary using an unsigned upload preset; a URL is kept as-is when you paste an existing image. If left blank, the YouTube thumbnail is used automatically, and for a Facebook Reel the preview image is added when you generate with AI."}
              </span>
            </div>
          </div>
          <div className="rounded-2xl bg-cream/70 p-4 text-sm text-muted">
            <strong className="text-ink">Expected URL:</strong> /recipes/
            {generatedSlug || "ten-mon"}
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link href="/" className="btn-secondary justify-center">
              Cancel
            </Link>
            <button
              disabled={busy || aiBusy}
              className="btn-primary justify-center"
            >
              {busy ? (
                <span className="size-4 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory" />
              ) : (
                <Icon name="check" size={17} />
              )}{" "}
              {mode === "edit" ? "Save changes" : "Publish recipe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AddRecipePage() {
  return (
    <RequireAuth>
      <EditorForm mode="create" />
    </RequireAuth>
  );
}

export function EditRecipePage() {
  const params = useParams<{ slug: string }>();
  return (
    <RequireAuth adminOnly>
      <EditorForm mode="edit" slug={params.slug} />
    </RequireAuth>
  );
}
