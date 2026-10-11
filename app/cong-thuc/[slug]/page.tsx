import { redirect } from "next/navigation";

export default async function LegacyRoute({ params }: { params: any }) {
  const routeParams = await params;
  redirect("/" + 'recipes' + "/" + encodeURIComponent(String(routeParams['slug'])));
}
