# Street Culture Tattoo & Academy — website

Public site for Street Culture Tattoo Studio & Academy (Kandivali West, Mumbai), deployed at
https://www.streetculturetattoos.com/.

## Stack

- **Next.js 16 (App Router, Turbopack) + React 19 + TypeScript** — production app, deployed on Vercel
- Tailwind CSS v4 (via `@tailwindcss/postcss`) + shadcn/ui primitives (`src/components/ui/`)
- Framer Motion for animation, Lucide for icons
- Convex backend (database + auth) in `src/convex/`
- Page content lives in `src/legacy-pages/` and is rendered client-side through the
  route shell in `src/next/` (a react-router `MemoryRouter` seeded from the Next route);
  every route still gets server-generated metadata, canonical URLs, Open Graph tags
  and JSON-LD at build time (SSG).

## Commands

```bash
npm ci          # install dependencies
npm run dev     # next dev (http://localhost:3000)
npm run build   # next build — static-prerenders every page, type-checks the app
npm run start   # next start — serve the production build locally
npm run lint    # eslint
npm run format  # prettier write
```

## Project structure

```
src/
  app/                  # App Router: layout, per-route metadata, error/loading files
    api/enquiry/        # hardened form endpoint (Zod + DOMPurify + rate limit + Turnstile)
    api/ink-lab/        # AI brief endpoint (rate limited, server-side key only)
    robots.ts sitemap.ts  # generated robots.txt + sitemap.xml
    privacy/ terms/     # utility pages
  legacy-pages/         # all page content: Home, About, Artists, Book, Academy, Blog,
                        # Careers, Contact, ConceptLab, Gallery, Privacy, Terms, NotFound
  next/                 # Next <-> legacy glue: ClientRouteBoundary, Link, JsonLd, metadata
  components/           # site UI (Navbar, Footer, StickyBookBar, CookieConsent, Turnstile…)
  config/               # seo.ts (schema/meta builders, siteUrl), contact.ts (NAP, socials)
  hooks/                # use-seo.ts (per-page head manager), use-mobile.ts
  convex/               # backend: schema, users, auth, http routes (own tsconfig)
  lib/                  # forms.ts (API-backed submissions), rate-limit.ts, whatsapp…
public/                 # favicon.png, apple-touch-icon.png, og-image.png, llms.txt,
                        # manifest.webmanifest, images/
```

## Security & hardening

- **Headers** (all in `next.config.ts`): CSP with a strict origin allowlist,
  `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  HSTS `max-age=31536000`, `Permissions-Policy`, `poweredByHeader: false`.
  A nonce-based CSP was deliberately not used because it forces dynamic rendering and
  would forfeit SSG/ISR.
- **Forms** all post to `/api/enquiry`: Zod validation → DOMPurify sanitizing →
  per-IP rate limit (5/min) → Cloudflare Turnstile verification → server-side forward
  to Google Forms. `/api/ink-lab` is rate limited to 10/min.
- **Cookies/consent**: Google Analytics loads only after the visitor presses Accept
  in the banner (`NEXT_PUBLIC_*`-only public values; server secrets never reach the
  client bundle — Ink Lab key and Turnstile secret are server-only).

## Environment variables

Copy `.env.example` to `.env.local` (all `.env*` files are gitignored except `.env.example`):

- `VITE_CONVEX_URL` — Convex deployment URL (`npx convex dev` prints it)
- `CONVEX_SITE_URL` — site URL for Convex auth HTTP routes
- `CONVEX_DEPLOYMENT` — deployment used by `npx convex dev`
- `NEXT_PUBLIC_SITE_URL` — optional canonical URL override (defaults to `https://www.streetculturetattoos.com`)
- `NEXT_PUBLIC_CONVEX_URL` — Convex client URL; enables the live visit/active-users badge on the home page (printed by `npx convex dev`)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile spam protection (client key public, secret server-only)
- `OPENAI_API_KEY` — server-only key for the Ink Lab endpoint

## Convex backend

Server code lives in `src/convex/`. Follow these conventions:

**Do not modify** `src/convex/auth.config.ts`, `src/convex/auth.ts`, or
`src/convex/auth/emailOtp.ts` — they define the shared auth configuration (email OTP +
anonymous sign-in).

Schema rules:

- Document IDs are `_id` (type `Id<"TableName">`), creation time is `_creationTime` —
  never add or index them yourself; no duplicate indexes
- Type documents with `Doc<"TableName">` from `@/convex/_generated/dataModel`
- Always import via the `@/convex/...` alias, including `_generated` files
- Handle `null` / `undefined` from queries instead of assuming data exists
- Keep queries/mutations authorized at the base layer

`src/convex/_generated` is gitignored; run `npx convex dev` to (re)generate it.
The Next build excludes `src/convex` from type-checking so Vercel deploys work
without generated files.

## Frontend conventions

- Make elements that are clickable use `cursor-pointer`; headings use `tracking-tight font-bold`
- Always build mobile-responsive, wrapped in a centered container — no off-center stretching
- Avoid nested cards and shadows; prefer a thin border
- Prefer the `Loader2` spinner over skeleton placeholders
- Use toasts via `sonner` + the shadcn `Button` pattern for confirmations/errors
- Animate page content and interactions with Framer Motion
- Theme colors are oklch variables in `src/index.css`; override the shadcn components
  (`src/components/ui/`) and those variables rather than hardcoding colors
- Respect light/dark mode through the shadcn theme variables

## Assets & SEO

- Favicon: `public/favicon.png` (dark brand emblem), plus `public/apple-touch-icon.png`;
  wired through `src/app/layout.tsx` metadata
- Social share image: `public/og-image.png` (real 1200×630 PNG; `og-image.svg` is its
  vector source)
- Structured data: `TattooShop`/`LocalBusiness`, `Organization` and
  `EducationalOrganization` JSON-LD injected site-wide from `src/config/seo.ts`
- `/llms.txt` (public/llms.txt) summarizes the studio for AI scrapers; `robots.ts`
  explicitly allows GPTBot, PerplexityBot, ClaudeBot and Google-Extended
- Use **npm** — `package-lock.json` is the canonical lockfile (`bun.lock` predates the
  current toolchain)
