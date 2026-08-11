# EventHub

EventHub is an event-management marketplace that connects customers with
verified event management companies. This is the **Day 1 foundation**:
project setup, UI system, and a static landing page.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- shadcn/ui-style component foundation (Radix Slot + CVA + `cn()` utility)
- [lucide-react](https://lucide.dev) icons

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command         | Description                     |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the dev server             |
| `npm run build` | Production build                 |
| `npm run start` | Run the production build         |
| `npm run lint`  | Run ESLint                       |

## Project structure

```text
eventhub/
├── app/                  # App Router pages, layout, global styles
├── components/
│   ├── ui/               # Reusable primitives (button, etc.)
│   └── shared/            # Navbar, footer
│   └── sections/          # Landing page sections (hero, services, ...)
├── lib/                  # Shared utilities (cn helper)
├── types/                # Shared TypeScript types
├── public/               # Static assets
├── .env.example          # Environment variable template
└── components.json       # shadcn/ui config
```

## Environment variables

Copy `.env.example` to `.env` and fill in real values. Never commit `.env`.

## Status

Day 1 scope only: project foundation + landing page UI. Authentication,
payments, chat, the vendor system, admin dashboard, and the quotation
system are intentionally out of scope and will follow in later days.
