import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/seo";
export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy ${SITE_NAME}`,
  openGraph: {
    title: "Privacy Policy",
    description: `Privacy Policy ${SITE_NAME}`,
    images: [
      {
        url: "/privacy-policy.jpg",
        width: 1200,
        height: 630,
        alt: `Privacy Policy ${SITE_NAME}`,
      },
    ],
  },
};
export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-4xl rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="prose-viet">
        <h1 className="font-serif text-4xl font-bold text-lacquer">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted">Updated: October 4, 2026</p>
        <h2>Information we collect</h2>
        <p>
          We may store your email, display name, and account information when
          you register or sign in; the recipe data you submit; and the comments
          you post.
        </p>
        <h2>How we use information</h2>
        <p>
          Data is used to authenticate accounts, display recipes and comments,
          maintain user profiles, and improve the experience.
        </p>
        <h2>Third-party services</h2>
        <p>
          {SITE_NAME} uses Firebase for authentication and Firestore, Cloudinary
          for image storage, and may use Google Analytics/Tag Manager for
          traffic statistics.
        </p>
        <h2>Public information</h2>
        <p>
          Recipes and comments posted on the platform may be viewed by other
          users. Do not post sensitive information in recipe content or
          comments.
        </p>
        <h2>Contact</h2>
        <p>
          For requests regarding personal data, please use the contact channel
          published on the website.
        </p>
      </div>
    </article>
  );
}
