import { redirect } from "next/navigation";

export default function LegacyRoute() {
  redirect("/" + 'meal-plans');
}
