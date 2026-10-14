import type { Metadata } from "next";
import Link from "next/link";
import Icon, { type IconName } from "@/components/ui/Icon";
import { SITE_NAME } from "@/lib/seo";

const description =
  "User guide for " +
  SITE_NAME +
  ": find recipes, create dish drafts with AI from YouTube videos or Facebook Reels, plan weekly menus, prepare shopping lists, and view nutrition information.";

export const metadata: Metadata = {
  title: "User guide",
  description,
  alternates: { canonical: "/guide" },
  openGraph: {
    title: "User guide",
    description,
    url: "/guide",
    images: [
      {
        url: "/guide.jpg",
        width: 1200,
        height: 630,
        alt: "User guide for " + SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "User guide",
    description,
    images: ["/guide.jpg"],
  },
};

type GuideSection = {
  icon: IconName;
  title: string;
  intro: string;
  steps: string[];
  action?: { label: string; href: string };
};

const sections: GuideSection[] = [
  {
    icon: "search",
    title: "Find a dish for today's meal",
    intro:
      "Start from the home page to find inspiration, whether you already know the dish name or only have a few ingredients in your kitchen.",
    steps: [
      "Enter a dish name or keyword in the search box.",
      "Filter by group such as breakfast, lunch, dinner, vegan, wellness, or dessert.",
      "Change the sort order to view recipes by name or posting date.",
    ],
    action: { label: "Explore recipes", href: "/" },
  },
  {
    icon: "book",
    title: "Open a recipe and cook step by step",
    intro:
      "Each recipe page is a cooking notebook: you can check the ingredients, follow the method, and watch the YouTube video or Facebook Reel if the author added a link.",
    steps: [
      "Read the description and prepare all the ingredients before you start.",
      "Check off ingredients and each step as you prepare or complete them.",
      "See related dishes to find more options for your meal.",
    ],
  },
  {
    icon: "calendar",
    title: "Plan the menu for the whole week",
    intro:
      "In the Weekly dish suggestions section, the system suggests dishes for breakfast, lunch, and dinner based on the available recipes.",
    steps: [
      "Switch between day view and week view to plan more easily.",
      "Choose a different dish from the list, click Swap dish, or remove a dish that does not fit.",
      "Fill the empty meals, or generate a new menu when you want to start over.",
      "The menu is saved in the browser of the device you are using; reopen it in the same browser to continue.",
    ],
    action: { label: "Plan the weekly menu", href: "/meal-plans" },
  },
  {
    icon: "list",
    title: "Create a shopping list from your menu",
    intro:
      "No need to copy each ingredient from several recipes. The shopping list is compiled from the dishes you have chosen.",
    steps: [
      "Open the Shopping tab on the weekly suggestions page.",
      "Choose to view the ingredients for a specific day or for the whole week.",
      "Search ingredients, mark what you have bought, and copy what still needs to be bought to take with you.",
      "Quantities with compatible units may be added together; please double-check ingredient lines written in free form.",
    ],
    action: { label: "Open the shopping list", href: "/meal-plans" },
  },
  {
    icon: "check",
    title: "Consult nutrition information",
    intro:
      "If a recipe has data, you can see values such as calories, protein, carbohydrates, fat, fiber, and sodium.",
    steps: [
      "Open the nutrition information on the recipe page or in the menu section.",
      "Read the units and the accompanying serving size to understand the numbers correctly.",
      "If an item says there is no data yet, it means the recipe has not provided that information — the system does not fill in substitute figures.",
    ],
  },
  {
    icon: "plus",
    title: "Post a recipe or create a draft with AI",
    intro:
      "You can record your family dishes, add images and YouTube or Facebook Reel links. AI helps draft a recipe from a video or Reel to save you time.",
    steps: [
      "Open Add a recipe and sign in or create an account if asked.",
      "Enter the dish name, description, and category; put each ingredient and each cooking step on its own line.",
      "Paste the YouTube or Facebook Reel link and choose Generate recipe with AI. The generated content is a draft and is not posted until you save it yourself.",
      "If the server cannot fetch the subtitles or caption, paste the dialogue or description into the corresponding box. Not every video's or Reel's content can be read automatically, and private or restricted Facebook Reels cannot be accessed.",
      "Reels are short and often leave out exact quantities, so fill in any missing amounts yourself.",
      "Carefully check the quantities, the process, and the nutrition information suggested by AI before posting the recipe.",
    ],
    action: { label: "Add a recipe", href: "/recipes/new" },
  },
  {
    icon: "comment",
    title: "Comments and feedback",
    intro:
      "Exchanging cooking experience helps everyone understand a dish better and get more ideas for variations.",
    steps: [
      "Open the dish page and enter your comment.",
      "You can comment under a guest name or use an account for a more consistent experience.",
      "If you find unclear information or run into an error, send feedback through the Contact page.",
    ],
    action: { label: "Send feedback", href: "/contact-us" },
  },
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <section className="hero-paper overflow-hidden rounded-[2rem] px-6 py-10 text-ivory shadow-lg sm:px-10 sm:py-14">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-ivory/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.15em] text-gold-light">
          <Icon name="book" size={15} /> User handbook
        </span>
        <h1 className="mt-4 max-w-3xl font-serif text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          From “what to eat today?” to “what to buy at the market?”
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-ivory/85 sm:text-lg sm:leading-8">
          {SITE_NAME} helps you discover delicious dishes, arrange meals,
          prepare ingredients, and step into the kitchen more easily — one step
          at a time, without planning across many different places.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/meal-plans" className="btn-gold">
            <Icon name="calendar" size={17} /> Plan the weekly menu
          </Link>
          <Link href="/" className="btn-outline-dark">
            <Icon name="search" size={17} /> Find dishes
          </Link>
          <Link href="/recipes/new" className="btn-outline-dark">
            <Icon name="youtube" size={17} /> Generate recipe with AI
          </Link>
        </div>
      </section>

      <section
        className="rounded-[2rem] border border-gold/30 bg-gold/10 p-6 sm:p-8"
        aria-labelledby="ai-recipe-title"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gold/25 text-lacquer">
            <Icon name="youtube" size={23} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="eyebrow">
              <Icon name="refresh" size={15} /> AI-assisted tool
            </span>
            <h2
              id="ai-recipe-title"
              className="mt-2 font-serif text-2xl font-bold text-lacquer sm:text-3xl"
            >
              Generate recipes with AI from YouTube videos and Facebook Reels
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              Paste a YouTube video or Facebook Reel link to let AI help draft
              the title, description, ingredients, preparation steps, and
              nutrition information when suitable data is available. If the
              server cannot fetch the subtitles or caption, you can paste the
              dialogue or a description into the notes box as a reference
              source.
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
              The result is only a draft in the form and is not posted
              automatically. Please check the source, quantities, cooking
              method, and nutrition estimates before saving; AI cannot guarantee
              that every detail in the video or Reel is extracted accurately.
              Short Reels in particular may omit amounts and timings.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/recipes/new" className="btn-primary">
                <Icon name="refresh" size={17} /> Start generating a recipe
              </Link>
              <Link href="/recipes/new" className="btn-secondary">
                <Icon name="plus" size={17} /> Enter a recipe manually
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="guide-sections-title">
        <div className="mb-6">
          <span className="eyebrow">
            <Icon name="route" size={15} /> Step-by-step guide
          </span>
          <h2 id="guide-sections-title" className="section-title">
            Use {SITE_NAME} your way
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
            You do not need to follow the order. Open the feature you need: find
            a dish quickly, prepare dinner, or plan the whole week.
          </p>
        </div>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <article
              key={section.title}
              className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7"
            >
              <div className="flex items-start gap-4">
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gold/15 text-lacquer sm:size-12">
                  <Icon name={section.icon} size={21} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs font-extrabold uppercase tracking-wider text-muted">
                    Step {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-serif text-xl font-bold text-lacquer sm:text-2xl">
                    {section.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {section.intro}
                  </p>
                  <ol className="mt-4 space-y-3">
                    {section.steps.map((step, stepIndex) => (
                      <li
                        key={step}
                        className="flex items-start gap-3 text-sm leading-7 text-ink"
                      >
                        <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-cream text-xs font-bold text-lacquer">
                          {stepIndex + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  {section.action && (
                    <div className="mt-5">
                      <Link
                        href={section.action.href}
                        className="inline-flex items-center gap-1 text-sm font-bold text-lacquer underline decoration-gold underline-offset-4 hover:decoration-2"
                      >
                        {section.action.label}
                        <Icon name="chevron-right" size={16} />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-gold/30 bg-gold/10 p-6 sm:p-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-serif text-2xl font-bold text-lacquer sm:text-3xl">
              Still looking for an answer?
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted">
              Send a question or feedback so we know what could make your
              cooking experience more convenient.
            </p>
          </div>
          <Link
            href="/contact-us"
            className="btn-primary shrink-0 justify-center"
          >
            <Icon name="mail" size={17} /> Contact support
          </Link>
        </div>
      </section>
    </div>
  );
}
