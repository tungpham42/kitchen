import type { Metadata } from "next";
import WeeklySuggestions from "@/components/recipes/WeeklySuggestions";
export const metadata: Metadata = {
  title: "Weekly dish suggestions",
  description: "Vietnamese menu suggestions for each day of the week.",
  openGraph: {
    title: "Weekly dish suggestions",
    description: "Vietnamese menu suggestions for each day of the week.",
    images: [
      {
        url: "/meal-plans.jpg",
        width: 1200,
        height: 630,
        alt: "Vietnamese menu suggestions for each day of the week.",
      },
    ],
  },
};
export default function WeeklyPage() {
  return <WeeklySuggestions />;
}
