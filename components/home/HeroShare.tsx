"use client";

import { useSyncExternalStore } from "react";
import { isMobileOrTablet } from "@/lib/device";
import { SITE_NAME } from "@/lib/seo";

type BrandName = "facebook" | "x" | "linkedin";

function BrandMark({ name }: { name: BrandName }) {
  if (name === "facebook") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-4 fill-current"
      >
        <path d="M13.7 21v-7.2h2.4l.4-2.8h-2.8V9.2c0-.8.2-1.4 1.4-1.4h1.5V5.3c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8.2v2.8h2.5V21h3Z" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-4 fill-current"
      >
        <path d="M6.2 8.1A1.9 1.9 0 1 0 6.2 4.3a1.9 1.9 0 0 0 0 3.8ZM4.5 19.7h3.4V9.8H4.5v9.9ZM9.8 9.8v9.9h3.4v-5.1c0-1.3.2-2.6 1.9-2.6 1.7 0 1.7 1.5 1.7 2.7v5h3.4v-5.7c0-2.8-.6-5-4-5-1.6 0-2.7.9-3.2 1.7h-.1V9.8H9.8Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
      <path d="M18.7 4h2.5l-5.5 6.3 6.5 9.7h-5.1l-4-5.9-5.1 5.9H5.5l5.9-6.7L5.2 4h5.2l3.6 5.3L18.7 4Zm-.9 14.3h1.4L9.8 5.6H8.3l9.5 12.7Z" />
    </svg>
  );
}

const shareLinkClass =
  "group inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-extrabold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-light/70";

const brandClasses: Record<BrandName, string> = {
  facebook:
    "border-[#1877F2] bg-[#1877F2] hover:border-[#4293FF] hover:bg-[#4293FF]",

  x: "border-white/30 bg-black hover:border-white/60 hover:bg-[#15181C]",

  linkedin:
    "border-[#0A66C2] bg-[#0A66C2] hover:border-[#2D8BE3] hover:bg-[#2D8BE3]",
};

const shareOptions: Array<{
  name: BrandName;
  displayName: string;
  label: string;
}> = [
  {
    name: "facebook",
    displayName: "Facebook",
    label: "Invite your friends",
  },
  {
    name: "x",
    displayName: "X",
    label: "Tell this dish’s story",
  },
  {
    name: "linkedin",
    displayName: "LinkedIn",
    label: "Spread inspiration",
  },
];

const shareMessages: Record<BrandName, string> = {
  facebook:
    "🔥 JUST SCROLLED PAST THIS AND NOW I’M HUNGRY 😋\n\nSome dishes are more than delicious — they bring family memories flooding back. ❤️\n\nI just found a dish worth saving for this week’s meals. Love Vietnamese food? Tag the person you’d invite into the kitchen with you! 👇",

  x: "🔥 Not sure what to eat tonight? Here’s your sign to try an irresistible Vietnamese dish 😋\n\nDelicious, easy to make, and full of homemade flavor — the kind of dish that makes you want to head straight to the kitchen. 👇",

  linkedin:
    "🍲 Some dishes do more than bring a meal to the table — they create memories and stories worth sharing.\n\nI just discovered a recipe that captures that spirit: approachable, practical, and full of Vietnamese character. A little inspiration for your kitchen and for more meaningful meals. ✨\n\nDefinitely worth saving and sharing with others who love Vietnamese cuisine.",
};

export default function HeroShare() {
  const shareUrl = useSyncExternalStore(
    (callback) => {
      window.addEventListener("popstate", callback);
      window.addEventListener("hashchange", callback);

      return () => {
        window.removeEventListener("popstate", callback);
        window.removeEventListener("hashchange", callback);
      };
    },
    () => window.location.href,
    () => "",
  );

  const encodedUrl = encodeURIComponent(shareUrl);

  const shareLinks = {
    facebook: shareUrl
      ? `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
      : "#",

    x: shareUrl
      ? `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(
          `${shareMessages.x}\n\n${shareUrl}`,
        )}`
      : "#",

    linkedin: shareUrl
      ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
      : "#",
  };

  /**
   * Share the current page using the native Web Share API.
   *
   * On iOS / Android:
   *
   * Website
   *   ↓
   * navigator.share()
   *   ↓
   * Native Share Sheet
   *   ↓
   * Facebook app
   *
   * On unsupported browsers:
   *   → Facebook web share dialog
   */
  async function handleFacebookShare() {
    if (!shareUrl) {
      return;
    }

    const shareData: ShareData = {
      title: SITE_NAME,
      text: shareMessages.facebook,
      url: shareUrl,
    };

    // Only use Web Share API on mobile/tablet.
    if (
      isMobileOrTablet() &&
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        if (
          typeof navigator.canShare !== "function" ||
          navigator.canShare(shareData)
        ) {
          await navigator.share(shareData);
          return;
        }
      } catch (error) {
        // User closed/cancelled the native share sheet.
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Web Share API failed:", error);
      }
    }

    // PC / Laptop / unsupported browser:
    // Use Facebook's normal web share dialog.
    window.open(shareLinks.facebook, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mt-7">
      <p className="text-sm font-extrabold text-gold-light sm:text-base">
        Looks delicious? Don’t keep it to yourself!
      </p>

      <p className="mt-1 text-xs leading-5 text-ivory/65 sm:text-sm">
        One tap puts your favorite home-cooked dishes in the spotlight — invite friends into the kitchen and share the inspiration.
      </p>

      <div className="mt-3 flex flex-wrap gap-2" aria-label="Share this page">
        {shareOptions.map(({ name, displayName, label }) => {
          // Facebook uses Web Share API.
          if (name === "facebook") {
            return (
              <button
                key={name}
                type="button"
                onClick={handleFacebookShare}
                disabled={!shareUrl}
                aria-label={`${label} on ${displayName}`}
                data-share-message={shareMessages[name]}
                className={`${shareLinkClass} ${brandClasses[name]} disabled:pointer-events-none disabled:opacity-50`}
              >
                <BrandMark name={name} />

                <span>{label}</span>
              </button>
            );
          }

          // X and LinkedIn keep their existing web-share behaviour.
          return (
            <a
              key={name}
              href={shareLinks[name]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label} on ${displayName}`}
              data-share-message={shareMessages[name]}
              onClick={(event) => {
                if (!shareUrl) {
                  event.preventDefault();
                }
              }}
              className={`${shareLinkClass} ${brandClasses[name]}`}
            >
              <BrandMark name={name} />

              <span>{label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
