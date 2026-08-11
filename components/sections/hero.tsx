import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-ink text-ivory">
      {/* ambient gold rule, evoking foil letterpress lines on an invitation */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <p className="mb-5 font-display text-sm uppercase tracking-[0.25em] text-gold">
            You&apos;re invited to plan something unforgettable
          </p>
          <h1 className="font-display text-4xl font-medium leading-[1.08] text-balance sm:text-5xl lg:text-6xl">
            Plan Your Perfect Event With Trusted Professionals
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/70">
            EventHub connects customers with verified event management
            companies &mdash; so you can request quotations, compare real
            proposals, and book with confidence, all in one place.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button variant="gold" size="lg" asChild>
              <a href="#get-started">
                Plan an Event
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <a href="#services">
                <Compass className="size-4" />
                Explore Services
              </a>
            </Button>
          </div>
        </div>

        {/* Signature element: a tilted invitation / ticket stub card */}
        <div className="relative mx-auto w-full max-w-sm md:rotate-2">
          <div className="perforated-bottom rounded-t-2xl border border-ivory/15 bg-plum px-8 pb-8 pt-9">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-gold">
              Admit One &middot; Your Event
            </p>
            <p className="mt-4 font-display text-2xl leading-snug">
              &ldquo;Every celebration deserves a professional behind
              it.&rdquo;
            </p>
          </div>
          <div className="flex items-center justify-between rounded-b-2xl border border-t-0 border-ivory/15 bg-plum/90 px-8 py-5 text-xs uppercase tracking-widest text-ivory/60">
            <span>Verified Vendors</span>
            <span>Live Quotations</span>
          </div>
        </div>
      </div>
    </section>
  );
}
