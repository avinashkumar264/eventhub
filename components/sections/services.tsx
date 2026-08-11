import {
  Heart,
  Cake,
  Building2,
  Flower2,
  UtensilsCrossed,
  Camera,
} from "lucide-react";
import type { ServiceCategory } from "@/types";

const SERVICES: ServiceCategory[] = [
  {
    name: "Wedding",
    description: "Full-service planners for ceremonies and receptions.",
    icon: Heart,
  },
  {
    name: "Birthday",
    description: "Themed parties for every age, big or intimate.",
    icon: Cake,
  },
  {
    name: "Corporate Events",
    description: "Conferences, launches, and offsites handled end-to-end.",
    icon: Building2,
  },
  {
    name: "Decoration",
    description: "Florals, lighting, and stage design that set the tone.",
    icon: Flower2,
  },
  {
    name: "Catering",
    description: "Menus and service staff for any guest count.",
    icon: UtensilsCrossed,
  },
  {
    name: "Photography",
    description: "Photo and video teams who capture the day as it happens.",
    icon: Camera,
  },
];

export function Services() {
  return (
    <section id="services" className="bg-ivory px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <p className="font-display text-sm uppercase tracking-[0.25em] text-plum">
            Services
          </p>
          <h2 className="mt-3 font-display text-3xl font-medium sm:text-4xl">
            Every category, one guest list of professionals
          </h2>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <li
              key={service.name}
              className="perforated-bottom group relative rounded-t-2xl border border-ink/10 bg-white px-6 pb-7 pt-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="inline-flex size-11 items-center justify-center rounded-full bg-plum/10 text-plum">
                <service.icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-display text-lg font-medium">
                {service.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">
                {service.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
