import type { Metadata } from "next";
import { AddRecipePage } from "@/components/recipes/RecipeEditor";
export const metadata: Metadata = { title: "Add a recipe" };
export default function AddPage() {
  return <AddRecipePage />;
}
