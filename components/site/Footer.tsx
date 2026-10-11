import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { SITE_NAME } from "@/lib/seo";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-[#f3e7d3]">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <div className="flex items-center gap-2 font-serif text-lg font-bold text-ink">
            <Icon name="bowl" size={20} /> {SITE_NAME}
          </div>
          <p className="mt-1">
            Preserving delicious dishes, stories, and memories around the
            Vietnamese family table.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {" "}
          <Link href="/about-us" className="hover:text-lacquer">
            About
          </Link>
          <span className="text-border">•</span>{" "}
          <Link href="/contact-us" className="hover:text-lacquer">
            Contact
          </Link>
          <span className="text-border">•</span>
          <a
            href="https://soft.io.vn"
            target="_blank"
            rel="noreferrer"
            className="hover:text-lacquer"
          >
            Phạm Tùng
          </a>
          <span className="text-border">•</span>
          <Link href="/privacy-policy" className="hover:text-lacquer">
            Privacy Policys
          </Link>
        </div>
      </div>
    </footer>
  );
}
