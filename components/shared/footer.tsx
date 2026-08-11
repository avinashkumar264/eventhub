import Link from "next/link";
import { Ticket } from "lucide-react";

const FOOTER_LINKS = {
  Company: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Services", href: "#services" },
    { label: "For Vendors", href: "#vendors" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="vendors" className="mt-auto bg-ink px-6 py-16 text-ivory">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="#home" className="flex items-center gap-2">
              <Ticket className="size-5 text-gold" aria-hidden="true" />
              <span className="font-display text-xl font-medium">
                EventHub
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/55">
              Connecting customers with trusted, verified event management
              professionals.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="font-display text-sm uppercase tracking-[0.2em] text-ivory/50">
                {group}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-ivory/70 transition-colors hover:text-ivory"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ivory/10 pt-8 text-xs text-ivory/45 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} EventHub. All rights reserved.</p>
          <p>Made for people planning something worth celebrating.</p>
        </div>
      </div>
    </footer>
  );
}
