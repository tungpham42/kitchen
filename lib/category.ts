import { RECIPE_CATEGORIES } from "@/lib/types";
import type { RecipeCategory } from "@/lib/types";

export { RECIPE_CATEGORIES };

const labels: Record<string, string> = {
  Breakfast: "Breakfast",
  Lunch: "Lunch",
  Dinner: "Dinner",
  Dessert: "Dessert",
  Vegan: "Vegan dishes",
  Wellness: "Wellness dishes",
};

export function categoryLabel(category?: string) {
  return category ? (labels[category] ?? category) : "Vietnamese cuisine";
}

export function isRecipeCategory(value?: string): value is RecipeCategory {
  return !!value && (RECIPE_CATEGORIES as readonly string[]).includes(value);
}

export const categoryAccent: Record<string, string> = {
  Breakfast: "bg-turmeric-700 text-white border-white/70",
  Lunch: "bg-gold text-lacquer border-white/70",
  Dinner: "bg-lacquer text-white border-white/70",
  Vegan: "bg-bamboo text-white border-white/70",
  Dessert: "bg-plum text-white border-white/70",
  Wellness: "bg-bamboo text-white border-white/70",
};
