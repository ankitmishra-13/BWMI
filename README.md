# Raahi

A mobile-first, bilingual Build What Moves India prototype that reorganises Parivahan's public service families into an independent editorial service hub. It includes a complete driving-licence renewal, reusable synthetic flows for other citizen transactions, informational guides, and sample dashboards.

**Live demo:** https://raahi-parivahan.raahi-bwmi.workers.dev/en

## Two-minute judge walkthrough

1. Open **Check renewal readiness** on the home page.
2. Describe a situation in everyday English, Hindi, or Hinglish—or use the example.
3. Review the plain-language readiness plan and its visible source notes.
4. Sign in with the public demo account and start the prepared renewal.
5. Complete the six guided steps. Use OTP `123456`; document selectors store only filenames and sizes.
6. Preview the failed-payment recovery, then complete the ₹450 mock payment.
7. On the status screen, preview **Action required**, select a harmless sample filename, and send the correction.

The profile menu also contains **Comfort & accessibility** preferences for larger text, stronger contrast, reduced motion, low-data mode, simpler guidance, and read-aloud preference.

## Architecture

- Cloudflare Workers / Vinext, React, TypeScript, and Tailwind CSS
- shadcn/ui with Radix primitives and Lucide icons
- Signed public demo session with synthetic judge credentials
- Cloudflare D1 with Drizzle ORM
- React Hook Form and Zod
- Optional OpenAI Responses API helper using `gpt-5.6-luna`; deterministic bilingual fallback when no key is configured

No request is sent to Parivahan or any other government system. Document bytes, real identifiers, contact details, OTPs, and payment details are never collected. The official Parivahan logo and government emblems are intentionally not used.

## Demo credentials

```text
Email: citizen.demo@bwmi.test
Password: ParivahanDemo#2026
OTP in every mock flow: 123456
```

These are public fictional credentials for judges. They do not unlock a real account or government data.

## Local development

```bash
pnpm install
pnpm db:generate
pnpm dev
```

Apply the generated D1 migrations to the local database if they have not been applied yet:

```bash
pnpm build
pnpm wrangler d1 migrations apply DB --local --persist-to=.wrangler/state
```

Copy `.env.example` to `.env.local` only if the live AI explainer is needed. The complete citizen journey works without it.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

To run the same browser suite against a deployed environment:

```bash
PLAYWRIGHT_BASE_URL=https://your-worker.workers.dev pnpm test:e2e
```

The design authority is [`Design.md`](./Design.md).

## Cloudflare deployment

The production Worker and D1 binding are declared in `wrangler.jsonc`.

```bash
pnpm wrangler login
pnpm wrangler d1 create raahi-parivahan-db
pnpm wrangler d1 migrations apply raahi-parivahan-db --remote
pnpm wrangler secret put DEMO_SESSION_SECRET
pnpm build
pnpm wrangler deploy --config=dist/server/wrangler.json
```
