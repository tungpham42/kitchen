import type { Metadata } from "next";
import Link from "next/link";
import Icon, { type IconName } from "@/components/ui/Icon";
import { SITE_NAME } from "@/lib/seo";

const description =
  SITE_NAME +
  " helps you discover recipes, create recipe drafts with AI from YouTube videos or Facebook Reels, plan weekly menus, prepare shopping lists, and preserve the stories around the Vietnamese family table.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about-us" },
  openGraph: {
    title: "About",
    description,
    url: "/about-us",
    images: [
      {
        url: "/about-us.jpg",
        width: 1200,
        height: 630,
        alt: "About " + SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About",
    description,
    images: ["/about-us.jpg"],
  },
};

type Feature = {
  icon: IconName;
  title: string;
  text: string;
  href: string;
  linkLabel: string;
};

type Value = {
  icon: IconName;
  title: string;
  text: string;
};

const values: Value[] = [
  {
    icon: "heart",
    title: "Bringing family dishes closer together",
    text: "Familiar recipes are often passed down through stories and experience. Writing down the ingredients, the method, and the story behind them makes delicious dishes easier to cook again and share.",
  },
  {
    icon: "route",
    title: "Practical from choosing a dish to stepping into the kitchen",
    text: "Finding a recipe is only the first step. Weekly menus and shopping lists connect choosing dishes with preparing ingredients, so you do not have to piece everything together in different places.",
  },
  {
    icon: "check",
    title: "Clear about information",
    text: "Ingredients and steps are presented separately so they are easy to follow. Nutrition data is only shown when the recipe provides it; AI-generated content needs to be checked by the user before posting.",
  },
];

const features: Feature[] = [
  {
    icon: "search",
    title: "Discover recipes",
    text: "Search by dish name, browse by meal group, and open detailed instructions to prepare dishes that suit your family.",
    href: "/",
    linkLabel: "Find dishes",
  },
  {
    icon: "calendar",
    title: "Plan menus and shopping lists",
    text: "Arrange breakfast, lunch, and dinner for 7 days; swap dishes to your liking, compile the ingredients, and mark what you have bought.",
    href: "/meal-plans",
    linkLabel: "Plan the week",
  },
  {
    icon: "book",
    title: "Cook step by step",
    text: "Follow the ingredients and method, watch the YouTube video or Facebook Reel if there is one, consult the nutrition information provided, and find related dishes.",
    href: "/guide",
    linkLabel: "View the guide",
  },
  {
    icon: "youtube",
    title: "Generate recipes with AI",
    text: "Paste a YouTube video or Facebook Reel link and let AI help draft the title, description, ingredients, and cooking steps into a draft. If the subtitles or caption cannot be fetched, you can add the dialogue or a description; please check carefully before saving.",
    href: "/recipes/new",
    linkLabel: "Create a draft with AI",
  },
  {
    icon: "plus",
    title: "Record your own dishes",
    text: "Enter recipes yourself with photos, ingredients, each step, and a YouTube video or Facebook Reel to keep your signature dishes or share your cooking experience with the community.",
    href: "/recipes/new",
    linkLabel: "Add a recipe manually",
  },
  {
    icon: "check",
    title: "Nutrition reference",
    text: "See information on calories, protein, carbohydrates, fat, fiber, and other values when the recipe provides the data. It gives you more information to consider suitable dishes and portions.",
    href: "/",
    linkLabel: "Explore dishes",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12">
      <section className="hero-paper overflow-hidden rounded-[2rem] px-6 py-12 text-ivory shadow-lg sm:px-10 sm:py-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-ivory/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.15em] text-gold-light">
          <Icon name="bowl" size={15} /> About {SITE_NAME}
        </span>
        <h1 className="mt-4 max-w-3xl font-serif text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          Not just asking “what should we eat today?” — prepare a complete meal
          together
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-ivory/85 sm:text-lg sm:leading-8">
          {SITE_NAME} is an online kitchen corner for discovering delicious
          dishes, saving recipes, planning menus, and preparing shopping lists.
          The goal is simple: make deciding what to cook each day less
          confusing, leaving more time for what matters more — the meal and the
          people enjoying it together.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn-gold">
            <Icon name="search" size={17} /> Explore recipes
          </Link>
          <Link href="/recipes/new" className="btn-outline-dark">
            <Icon name="youtube" size={17} /> Generate recipe with AI
          </Link>
          <Link href="/contact-us" className="btn-outline-dark">
            <Icon name="mail" size={17} /> Contact us
          </Link>
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8">
        <span className="eyebrow">
          <Icon name="book" size={15} /> Our story
        </span>
        <h2 className="section-title">One place for the whole meal journey</h2>
        <div className="prose-viet mt-4 space-y-4">
          <p>
            Some days we know we want something delicious but cannot think of a
            dish. Other days we have chosen a dish but forget which ingredients
            to buy. And sometimes, a family recipe lives only in memory, in an
            old text message, or in a cooking Reel you once saw on Facebook and
            can no longer find.
          </p>
          <p>
            {SITE_NAME} is designed to connect these tasks into one simple
            journey: discover recipes, see how to cook, choose dishes for each
            meal, gather ingredients into a shopping list, and consult nutrition
            information when data is available. You can also record your
            signature dishes so others can find and try cooking them.
          </p>
          <p>
            We believe technology should make kitchen work easier, not replace
            the taste, experience, or creativity of the cook. A good recipe
            still needs to be presented clearly, checked carefully, and adjusted
            to the ingredients you actually have.
          </p>
        </div>
      </section>

      <section
        className="rounded-[2rem] border border-gold/30 bg-gold/10 p-6 sm:p-8"
        aria-labelledby="about-ai-title"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gold/25 text-lacquer">
            <Icon name="youtube" size={23} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="eyebrow">
              <Icon name="refresh" size={15} /> Featured tool
            </span>
            <h2
              id="about-ai-title"
              className="mt-2 font-serif text-2xl font-bold text-lacquer sm:text-3xl"
            >
              Turn cooking videos and Facebook Reels into recipe drafts with AI
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              No need to start from a blank page: enter a YouTube or Facebook
              Reel link and let AI help sketch the dish description,
              ingredients, and preparation steps. Saw a great dish in a Reel?
              Paste its link before it disappears from your feed. You can also
              paste the dialogue, caption, or a description manually when the
              subtitles cannot be accessed.
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
              Reels are short and often skip exact quantities, so the draft may
              be less complete than one from a longer video. The generated
              content is not posted automatically. The cook remains the final
              decision maker: please check the quantities, the soundness of the
              steps, and the nutrition information before saving the recipe.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/recipes/new" className="btn-primary">
                <Icon name="refresh" size={17} /> Generate recipe with AI
              </Link>
              <Link href="/guide" className="btn-secondary">
                <Icon name="book" size={17} /> View the user guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="about-values-title">
        <div className="mb-6">
          <span className="eyebrow">
            <Icon name="heart" size={15} /> What we value
          </span>
          <h2 id="about-values-title" className="section-title">
            Friendly, useful, and transparent
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {values.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6"
            >
              <div className="grid size-11 place-items-center rounded-2xl bg-gold/15 text-lacquer">
                <Icon name={item.icon} size={20} />
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-lacquer">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="about-features-title">
        <div className="mb-6">
          <span className="eyebrow">
            <Icon name="list" size={15} /> What you can do
          </span>
          <h2 id="about-features-title" className="section-title">
            Tools for the everyday kitchen
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
            Each feature solves one specific task — from finding inspiration to
            preparing ingredients and sharing cooking experience.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-lacquer/30 sm:p-6"
            >
              <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gold/15 text-lacquer">
                <Icon name={item.icon} size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="flex items-start gap-1 font-serif text-lg font-bold text-lacquer">
                  <span>{item.title}</span>
                  <Icon
                    name="chevron-right"
                    size={16}
                    className="mt-1 shrink-0 transition group-hover:translate-x-1"
                  />
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted">{item.text}</p>
                <span className="mt-3 inline-flex items-center text-sm font-bold text-lacquer underline decoration-gold underline-offset-4">
                  {item.linkLabel}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-gold/30 bg-gold/10 p-6 text-center sm:p-10">
        <h2 className="font-serif text-2xl font-bold text-lacquer sm:text-3xl">
          Let us make the recipe collection richer together
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted">
          Share a dish you love, send feedback about your experience, or get in
          touch if you have ideas for collaboration. Practical contributions
          help {SITE_NAME} become more and more useful for people who love
          cooking.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/recipes/new" className="btn-primary">
            <Icon name="youtube" size={17} /> Generate recipe with AI
          </Link>
          <Link href="/recipes/new" className="btn-secondary">
            <Icon name="plus" size={17} /> Add a recipe manually
          </Link>
          <Link href="/contact-us" className="btn-secondary">
            <Icon name="mail" size={17} /> Send a message
          </Link>
        </div>
      </section>
    </div>
  );
}
