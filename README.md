# Raahi

A mobile-first, bilingual Build What Moves India prototype that reorganises Parivahan's public service families into an independent editorial service hub. It includes a complete driving-licence renewal, reusable synthetic flows for other citizen transactions, informational guides, and sample dashboards.

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
npm install
npm run db:generate
npm run dev
```

Apply the generated D1 migrations to the local database if they have not been applied yet:

```bash
npm run build
npx wrangler d1 migrations apply DB --local --persist-to=.wrangler/state
```

Copy `.env.example` to `.env.local` only if the live AI explainer is needed. The complete citizen journey works without it.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

To run the same browser suite against a deployed environment:

```bash
PLAYWRIGHT_BASE_URL=https://your-worker.workers.dev npm run test:e2e
```

The design authority is [`Design.md`](./Design.md).

## Cloudflare deployment

The production Worker and D1 binding are declared in `wrangler.jsonc`.

```bash
npx wrangler login
npx wrangler d1 create raahi-parivahan-db
npx wrangler d1 migrations apply raahi-parivahan-db --remote
npx wrangler secret put DEMO_SESSION_SECRET
npm run build
npx wrangler deploy --config=dist/server/wrangler.json
```
