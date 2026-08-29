# Raahi

A mobile-first, bilingual Build What Moves India prototype that reorganises Parivahan's public service families into an independent editorial service hub. It includes a complete driving-licence renewal, reusable synthetic flows for other citizen transactions, informational guides, and sample dashboards.

## Architecture

- OpenAI Sites / Vinext, React, TypeScript, and Tailwind CSS
- shadcn/ui with Radix primitives and Lucide icons
- Sites authentication (ChatGPT sign-in) plus a signed public demo session
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

Sites development provides a local test identity. Apply the generated D1 migration to the local database if it has not been applied yet:

```bash
npm run build
npx wrangler d1 execute DB --local --config=dist/server/wrangler.json --file=drizzle/0000_chunky_impossible_man.sql --persist-to=.wrangler/state
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

The design authority is [`Design.md`](./Design.md).
