import type { Metadata } from "next";
import { cache } from "react";
import { EditRecipePage } from "@/components/recipes/RecipeEditor";
import { fetchRecipeBySlugServer } from "@/lib/firebase/server";
import { categoryLabel } from "@/lib/category";
import type { Recipe } from "@/lib/types";
import { SITE_NAME, RECIPE_PATH } from "@/lib/seo";

const getRecipeBySlug = cache((slug: string) => fetchRecipeBySlugServer(slug));

type EditRecipePageProps = {
  params: Promise<{ slug: string }>;
};

function cleanText(value: string | undefined | null): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function truncate(value: string, maxLength: number): string {
  const text = cleanText(value);

  if (text.length <= maxLength) {
    return text;
  }

  const shortened = text
    .slice(0, maxLength - 1)
    .replace(/\s+\S*$/, "")
    .trim();

  return `${shortened}…`;
}

function unique(values: string[]): string[] {
  return [...new Set(values.map(cleanText).filter(Boolean))];
}

function getRecipeUrl(slug: string): string {
  return `${RECIPE_PATH}/${encodeURIComponent(slug)}`;
}

function getMetadataBase(): URL | undefined {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

  return value ? new URL(value) : undefined;
}

function resolveUrl(
  value: string | undefined,
  base: URL | undefined,
): string | undefined {
  if (!value) return undefined;

  try {
    return new URL(value, base).toString();
  } catch {
    return value;
  }
}

function buildKeywords(recipe: Recipe): string[] {
  const category = categoryLabel(recipe.category);

  return unique([
    recipe.title,
    "edit recipe",
    "recipe",
    "dish recipe",
    "cooking",
    "delicious food",
    category,
    category ? `${category} recipe` : "",
    ...recipe.ingredients.slice(0, 8),
  ]).slice(0, 15);
}

export async function generateMetadata({
  params,
}: EditRecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  const noIndexRobots: Metadata["robots"] = {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    },
  };

  if (!recipe) {
    return {
      title: "Edit recipe",
      description: `Recipe editing page on ${SITE_NAME}. The recipe does not exist or has been removed.`,
      applicationName: SITE_NAME,
      robots: noIndexRobots,
    };
  }

  const metadataBase = getMetadataBase();
  const canonical = getRecipeUrl(recipe.slug);
  const imageUrl = resolveUrl(recipe.imageUrl, metadataBase);
  const category = categoryLabel(recipe.category);
  const title = `Edit "${recipe.title}"`;
  const description = truncate(
    `Edit and update the recipe "${recipe.title}"${
      category ? `, in the ${category} category` : ""
    } on ${SITE_NAME}.`,
    160,
  );
  const keywords = buildKeywords(recipe);

  const openGraphImages = imageUrl
    ? [
        {
          url: imageUrl,
          alt: `${recipe.title} - ${SITE_NAME}`,
        },
      ]
    : undefined;

  return {
    ...(metadataBase ? { metadataBase } : {}),
    title: title,
    description,
    keywords,
    applicationName: SITE_NAME,
    category: category || "Dish recipes",
    alternates: {
      canonical,
    },
    robots: noIndexRobots,
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      ...(openGraphImages ? { images: openGraphImages } : {}),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

export default function EditRecipeRoute() {
  return <EditRecipePage />;
}
