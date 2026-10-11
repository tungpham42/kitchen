import type { Metadata } from "next";
import Link from "next/link";
import type { IconName } from "@/components/ui/Icon";
import RecipeExplorer from "@/components/recipes/RecipeExplorer";
import Icon from "@/components/ui/Icon";
import HeroShare from "@/components/home/HeroShare";
import { getCategoryMeta, SITE_NAME } from "@/lib/seo";

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: HomeProps): Promise<Metadata> {
  const { category } = await searchParams;
  const value = Array.isArray(category) ? category[0] : category;
  const meta = getCategoryMeta(value);
  if (meta.isDefault) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: { absolute: meta.fullTitle },
    description: meta.description,
    alternates: { canonical: `/?category=${value}` },
    openGraph: {
      title: meta.fullTitle,
      description: meta.ogDescription,
      type: "website",
      url: `${siteUrl}/?category=${value}`,
      siteName: SITE_NAME,
      images: [
        { url: meta.ogImage, width: 1200, height: 630, alt: meta.fullTitle },
      ],
    },
  };
}

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="hero-paper relative overflow-hidden rounded-[2rem] px-6 py-12 text-ivory shadow-[0_22px_65px_rgba(125,36,24,0.18)] sm:px-10 sm:py-16">
        <div className="absolute -right-20 -top-20 size-72 rounded-full border border-gold/20 bg-gold/5" />
        <div className="absolute -bottom-20 -left-16 size-64 rounded-full border border-ivory/10 bg-ivory/5" />
        <div className="relative max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-ivory/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-gold-light">
            <Icon name="bowl" size={15} /> Vietnamese flavors
          </span>
          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight sm:text-6xl">
            Every dish is a family story.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-ivory/80 sm:text-lg">
            Discover recipes, find ideas for meals through the week, and share
            the delicious dishes tied to your kitchen.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/meal-plans" className="btn-gold">
              <Icon name="calendar" size={17} /> Plan the weekly menu
            </Link>
            <Link href="/recipes/new" className="btn-outline-dark">
              <Icon name="plus" size={17} /> Share a home dish
            </Link>
          </div>
          <HeroShare />
        </div>
      </section>
      <RecipeExplorer />
      <section className="grid gap-4 md:grid-cols-3">
        {[
          [
            "Family kitchen",
            "Familiar everyday dishes, easy-to-find ingredients, and methods that are easy to follow.",
            "bowl",
          ],
          [
            "Weekly suggestions",
            "Shuffle menus for breakfast — lunch — dinner — dessert — vegan — wellness dishes to suit your taste.",
            "calendar",
          ],
          [
            "Share & preserve",
            "Post recipes and leave the story behind the dish.",
            "book",
          ],
        ].map(([title, text, icon]) => (
          <div
            key={title}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="mb-4 grid size-11 place-items-center rounded-2xl bg-gold/15 text-lacquer">
              <Icon name={icon as IconName} size={22} />
            </div>
            <h2 className="font-serif text-xl font-bold text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
