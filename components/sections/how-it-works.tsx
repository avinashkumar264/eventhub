import type { ProcessStep } from "@/types";

const STEPS: ProcessStep[] = [
  {
    index: "01",
    title: "Create Your Event",
    description:
      "Tell us what you're planning and when — a wedding, a launch, a birthday.",
  },
  {
    index: "02",
    title: "Receive Quotations",
    description:
      "Verified vendors send tailored proposals straight to your inbox.",
  },
  {
    index: "03",
    title: "Compare & Choose",
    description:
      "Weigh price, portfolio, and reviews side by side before deciding.",
  },
  {
    index: "04",
    title: "Book Securely",
    description:
      "Confirm your vendor and lock in the date through EventHub.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-plum px-6 py-24 text-ivory">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <p className="font-display text-sm uppercase tracking-[0.25em] text-gold">
            How It Works
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium sm:text-4xl">
            From idea to booked date, in four steps
          </h2>
        </div>

        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.index} className="relative pl-1">
              <span className="font-display text-4xl text-gold/80">
                {step.index}
              </span>
              <h3 className="mt-4 font-display text-lg font-medium">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory/65">
                {step.description}
              </p>
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute right-[-1.25rem] top-3 hidden h-px w-6 bg-ivory/20 lg:block"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
