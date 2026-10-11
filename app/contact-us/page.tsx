import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/site/ContactForm";
import Icon, { type IconName } from "@/components/ui/Icon";
import { CONTACT, phoneHref } from "@/lib/contact";
import { SITE_NAME } from "@/lib/seo";

const description = `Contact ${SITE_NAME} for feedback, support, or to discuss collaboration. We are always glad to listen.`;

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact-us" },
  openGraph: {
    title: "Contact",
    description,
    url: "/contact-us",
    images: [
      {
        url: "/contact-us.jpg",
        width: 1200,
        height: 630,
        alt: `Contact ${SITE_NAME}`,
      },
    ],
  },
};

type Item = {
  icon: IconName;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

function buildItems(): Item[] {
  const items: Item[] = [];
  if (CONTACT.email)
    items.push({
      icon: "mail",
      label: "Email",
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
    });
  if (CONTACT.phone)
    items.push({
      icon: "phone",
      label: "Phone",
      value: CONTACT.phone,
      href: phoneHref(CONTACT.phone),
    });
  if (CONTACT.address)
    items.push({ icon: "map-pin", label: "Address", value: CONTACT.address });
  if (CONTACT.hours)
    items.push({
      icon: "calendar",
      label: "Response hours",
      value: CONTACT.hours,
    });
  return items;
}

export default function ContactPage() {
  const items = buildItems();
  const socials = [
    CONTACT.facebook && {
      icon: "facebook" as const,
      label: "Facebook",
      href: CONTACT.facebook,
    },
    CONTACT.youtube && {
      icon: "youtube" as const,
      label: "YouTube",
      href: CONTACT.youtube,
    },
  ].filter(Boolean) as { icon: IconName; label: string; href: string }[];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <span className="eyebrow">
          <Icon name="mail" size={15} /> Contact
        </span>
        <h1 className="section-title">We are always glad to listen</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
          Have a question, feedback, or want to collaborate? Send a message to{" "}
          {CONTACT.name}. You can also read the{" "}
          <Link href="/guide" className="font-semibold text-lacquer underline">
            user guide
          </Link>{" "}
          to find quick answers.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <section
          aria-labelledby="contact-form-title"
          className="rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          <h2
            id="contact-form-title"
            className="mb-5 font-serif text-2xl font-bold text-lacquer"
          >
            Send a message
          </h2>
          <ContactForm />
        </section>

        <aside className="space-y-4" aria-label="Contact information">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="font-serif text-xl font-bold text-lacquer">
              Contact information
            </h2>
            {items.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {items.map((item) => (
                  <li key={item.label} className="flex gap-3">
                    <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-gold/15 text-lacquer">
                      <Icon name={item.icon} size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold uppercase tracking-wider text-muted">
                        {item.label}
                      </div>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="break-words text-sm font-semibold text-ink hover:text-lacquer"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-sm font-semibold text-ink">
                          {item.value}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">
                Please use the form to send us a message.
              </p>
            )}
          </div>

          {socials.length > 0 && (
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <h2 className="font-serif text-xl font-bold text-lacquer">
                Connect
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn-secondary"
                  >
                    <Icon name={s.icon} size={17} /> {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-gold/30 bg-gold/10 p-5 text-sm leading-7 text-muted sm:p-6">
            Want to know more about us?{" "}
            <Link href="/about-us" className="font-bold text-lacquer underline">
              Read the About page
            </Link>
            .
          </div>
        </aside>
      </div>
    </div>
  );
}
