# Licence Renewal Guide

A mobile-first, bilingual Build What Moves India hackathon prototype that guides a citizen through one complete synthetic driving-licence renewal.

## Architecture

- OpenAI Sites / Vinext, React, TypeScript, and Tailwind CSS
- shadcn/ui with Radix primitives and Lucide icons
- Sites authentication (ChatGPT sign-in)
- Cloudflare D1 with Drizzle ORM
- React Hook Form and Zod
- Optional OpenAI Responses API helper using `gpt-5.6-luna`; deterministic bilingual fallback when no key is configured

No request is sent to Parivahan or any other government system. Document bytes and payment details are never collected.

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
