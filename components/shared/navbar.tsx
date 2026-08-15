"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Services", href: "#services" },
  { label: "For Vendors", href: "#vendors" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-ivory/90 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6 py-4"
      >
        <Link href="#home" className="flex items-center gap-2">
          <Ticket className="size-5 text-plum" aria-hidden="true" />
          <span className="font-display text-xl font-medium tracking-tight">
            EventHub
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/login"
            className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
          >
            Login
          </a>
          <Button variant="primary" size="sm" asChild>
            <a href="/register">Get Started</a>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full p-2 text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink/10 bg-ivory md:hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-2.5 text-sm font-medium text-ink/80 hover:bg-ink/5"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/login"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-2 py-2.5 text-sm font-medium text-ink/80 hover:bg-ink/5"
              >
                Login
              </a>
            </li>
          </ul>
          <div className="px-6 pb-5">
            <Button variant="primary" className="w-full" asChild>
              <a href="/register" onClick={() => setOpen(false)}>
                Get Started
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
