import { categoryLabel, isRecipeCategory } from "@/lib/category";

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Bếp nhà Quỳnh";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const DEFAULT_TITLE = `${SITE_NAME} — Dishes & memories`;
export const DEFAULT_DESCRIPTION =
  "A platform for sharing recipes and dish suggestions with the traditional flavors of Vietnam.";
export const DEFAULT_OG_DESCRIPTION =
  "Preserving delicious dishes and stories around the Vietnamese family table.";

export const RECIPE_PATH = "/recipes";

export const DEFAULT_OG_IMAGE = "/1200x630.jpg";
const CATEGORY_OG_EXT = "jpg"; // change to "jpg" if the images in public/category are .jpg

export function getCategoryOgImage(category: string) {
  return `/category/${category.toLowerCase()}.${CATEGORY_OG_EXT}`;
}

export function getCategoryMeta(category?: string) {
  if (!isRecipeCategory(category)) {
    return {
      isDefault: true as const,
      fullTitle: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      ogDescription: DEFAULT_OG_DESCRIPTION,
      ogImage: DEFAULT_OG_IMAGE,
    };
  }
  const label = categoryLabel(category);
  const description = `Explore ${label.toLowerCase()} recipes with the traditional flavors of Vietnam at ${SITE_NAME}.`;
  return {
    isDefault: false as const,
    pageTitle: `${label} Recipes`, // goes through the layout title template
    fullTitle: `${label} Recipes | ${SITE_NAME}`,
    description,
    ogDescription: description,
    ogImage: getCategoryOgImage(category),
  };
}
