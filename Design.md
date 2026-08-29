# Raahi — Editorial iOS Civic Service Design Contract

Status: Approved by user direction on 2026-08-29

This document is the single design authority for the hackathon prototype. Product code must follow it unless a later decision is recorded in the change log.

## Product promise

Help a citizen find, understand, and complete a synthetic transport-service journey without making them decode a directory of government portals. Driving-licence renewal remains the showcase end-to-end flow; every other surfaced service must either have a working mock flow or be clearly presented as an informational prototype.

**Visual thesis:** a premium public-service field guide rendered with the quiet confidence of an iOS first-party app: oversized editorial type, warm white paper, near-black actions, translucent chrome, precise dividers, and soft tactile panels over a restrained security-paper route texture.

**Content plan:** public service discovery → service detail and requirements → secure demo sign-in → guided workflow → review → mock payment where relevant → receipt and trackable status. Each screen answers three questions: where am I, what is needed now, and what happens next?

**Interaction thesis:** one clear action at a time. Controls acknowledge hover and press with a small lift/scale response, panels reveal with short opacity/translate transitions, progress persists across the journey, and every simulated dependency is labelled at the point of use.

## Non-negotiable disclosure

Show “Independent hackathon prototype—not an official government service” in the persistent header or immediately below it. Never use the official Parivahan logo, State Emblem, ministry marks, or any identity treatment that implies endorsement. Use the original Raahi wordmark and a simple route motif. Never send requests to Parivahan, Sarathi, Vahan, eChallan, PUCC, or any government system.

Every licence, document, OTP, payment, receipt, and status is synthetic or mocked and must be labelled accordingly.

## Visual system

The theme is light-only with high-contrast and forced-colors compatibility.

### Colour tokens

| Role | Value | Usage |
|---|---:|---|
| Canvas | `#F7F7F5` | Warm paper page background |
| Surface | `#FFFFFF` | Forms and meaningful containers |
| Ink | `#0A0A0A` | Primary text, header, filled actions |
| Muted text | `#666664` | Supporting copy |
| Quiet surface | `#EFEFEC` | Secondary controls and subtle grouping |
| Border | `#D8D8D3` | Inputs and semantic boundaries |
| Primary | `#0A0A0A` | Buttons, active steps, important links |
| Primary hover | `#242424` | Interactive feedback |
| Civic texture | `#E8EDF3` | Sparse route/security-paper background only |
| Focus | `#2563EB` | Keyboard focus ring |
| Success | `#17613E` | Success plus icon/text |
| Warning | `#7A4B00` | Warnings plus icon/text |
| Danger | `#B42318` | Errors and destructive actions |

Contrast is mandatory. Status never relies on colour alone; pair it with an icon and text. Near-black is the only routine action colour; blue is reserved for focus and civic blue-grey is atmospheric rather than interactive.

### Typography

- English display and headings: **Fraunces**, weights 500–600, matching the supplied editorial reference.
- English body and controls: **Geist**, weights 400–600.
- Hindi headings: **Anek Devanagari**, weights 600–700; Hindi body/UI: **Noto Sans Devanagari**, weights 400–600.
- Locale-specific CSS selects the appropriate pair so English and Hindi both receive intentional typography.
- Display heading: `clamp(3.25rem, 8vw, 7.4rem)`, tight `0.94–1.02` line height, maximum three lines on narrow screens and two on wide screens.
- Page title: `clamp(1.85rem, 4vw, 3rem)`.
- Body: 1rem minimum with 1.6 line height; supporting text 0.875rem minimum.

### Shape and spacing

- 8px spacing scale; allow 4px only for tightly related micro-elements.
- Shell maximum width: 1200px.
- Form measure: 760–840px.
- Minimum touch target: 44×44px.
- Control radius: 14–18px; primary buttons use a full pill radius.
- Meaningful-panel radius: 24–32px, matching the reference project’s image and prompt panels.
- Use borders and spacing before shadows. iOS-style shadows are diffuse, low-opacity, and reserved for interactive panels, sticky chrome, or overlays.
- Public pages use a subtle, non-symbolic security-paper/route texture made from CSS lines and dots. Text always sits on an opaque or calm region.

## Composition

### Public introduction

Use a 64px translucent header and an asymmetric editorial hero derived from `editorial-landing-page`: a desktop section rail, a very large serif promise, short supporting copy, a round black primary action, and one dominant dark transport-route visual. Put service search immediately after the promise, then offer “Explore all services” and “Try licence renewal.” The hero visual is an original Raahi composition—not the reference project’s automation artwork.

Below the fold, show popular citizen tasks, the full grouped service directory, the improved renewal path, and a concise mock-data disclosure. Prefer connected sections, ruled lists, and editorial indexes to repeated floating cards. Category pages must support search, quick filters, and direct task entry.

### Portal navigation

- The compact header always exposes Home, Services, Driving licence, Vehicle, Safety & compliance, Guides, language, and account state.
- Desktop uses restrained text links plus a keyboard-operable shadcn service dropdown; mobile uses one rounded, opaque navigation panel with the same destinations and a scrollable full-service menu.
- Search is a first-class labelled control, never an icon-only affordance.
- The authenticated account area shows active and past synthetic applications across service types; it is not an admin dashboard.

### Authenticated workspace

Use a persistent compact header with product name, prototype notice, language switcher, account control, and sign-out. The main area contains:

1. a small orientation eyebrow;
2. one clear page title and contextual status;
3. a horizontal progress indicator on desktop and compact current-step indicator on mobile;
4. the primary form or task surface;
5. contextual help adjacent on desktop and below on mobile;
6. a stable action footer for Back and Continue.

The dashboard is a readable licence summary and next action, not a metrics dashboard. Status uses a vertical timeline with next-step guidance.

The authenticated area also includes a persistent left account rail with Overview, My applications, Profile, and Browse services. My applications separates resumable drafts from submitted journeys; Profile allows only clearly fictional `@bwmi.test` identity values. The public landing-page rail remains sticky for the full editorial index and exposes account destinations below the page sections.

### Shared footer

Every locale page ends with one common Raahi footer derived from the supplied editorial reference: a quiet moving capability strip, large service CTA, useful link columns, oversized low-contrast Raahi wordmark, prototype disclosure, and back-to-top action. It is navigational and brand-building, not a duplicate sitemap wall. Reduced-motion users receive a static strip.

### Differentiating feature — Journey Preview

Every service brief exposes a dark, route-textured Journey Preview before the form. It makes estimated time, sample fee, number of stages, requirements, draft persistence, recovery behaviour, and mocked handoffs visible before sign-in. This is the core product contrast: organise around the citizen’s goal and preserve context through receipt/status rather than making the citizen discover portals and dependencies mid-task.

## Component rules

- Use shadcn primitives for Button, Input, Label, Select, Checkbox, Dialog/Sheet, Alert, Separator, and accessible form composition.
- Buttons use verb-first labels. One filled near-black pill action per region; secondary actions are quiet grey or outline pills. Hover lifts by 1px and press scales to `0.98` without delaying activation.
- Inputs have persistent labels, optional hint text, and inline errors. Placeholder text is never the only label.
- Use native date semantics where possible; never ask users to infer a date format.
- Document selection stores metadata only and clearly says “No file is uploaded in this prototype.”
- The mock OTP field exposes demo code `123456` beside the control.
- The payment screen never renders card, bank, or UPI inputs. It only confirms a mocked ₹450 transaction.
- The AI explainer opens in a Sheet and includes its limits above the question field.
- Panels are used only for an interactive object, receipt, form, or meaningful status group. Use `24–32px` rounding, hairline borders, and generous insets; avoid nested rounded containers and icon-only controls without accessible names.

## Bilingual behaviour

- English lives at `/en/*`; Hindi lives at `/hi/*`.
- Typed dictionaries are the only source of user-facing strings.
- Switching locale preserves the equivalent page, current wizard step, and saved draft.
- Layouts must tolerate 35% text expansion and natural Devanagari wrapping.
- Do not mix Hindi transliterations into English copy or leave core flow strings untranslated.

## Responsive behaviour

- Start at 390px. Single-column reading order is primary.
- At 768px, actions may sit inline and the progress indicator expands.
- At 1024px, contextual help may become a right rail while the form remains within 840px.
- Never shrink tap targets or hide requirements to make a layout fit.
- At 200% zoom, no horizontal page scroll and no clipped actions.

## Motion and feedback

- Feedback and step continuity transitions: 160–240ms, `cubic-bezier(.22,1,.36,1)`.
- Hero copy enters once with a short stagger; meaningful panels reveal with opacity plus no more than 12px translation; hover/press motion clarifies affordance. No parallax, looping decoration, or motion that blocks input.
- Honour `prefers-reduced-motion` by removing non-essential transitions and smooth scrolling.
- Loading controls preserve their width and announce progress. Success never blocks the next action with confetti or a modal.

## Accessibility and trust

- Visible `#2563EB` focus ring with sufficient offset.
- Semantic landmarks, one `h1`, logical heading hierarchy, and explicit form associations.
- Keyboard-only completion, screen-reader announcements for validation and status changes, and touch targets of at least 44px.
- Forced-colors mode keeps borders, focus, and state labels visible.
- Plain language comes before legal or transport terminology; offer short explanations in context.
- Never use urgency, countdowns, false authority, or dead-end error messages.

## Anti-goals

No official Parivahan logo, government emblem, campaign carousel, full-screen popup, tricolour gradient, generic dashboard card wall, hidden requirements, admin panel, decorative 3D, dark theme, glossy gradients, excessive glass effects, or live government integration.

## Reference evidence

- `clone-audit/parivahan-gov-in-20260829/01-home-desktop-full.png`: the official portal blocks the page with a large update-mobile-number dialog before task selection.
- `clone-audit/parivahan-gov-in-20260829/02-home-mobile-popup.png`: at 390px, the same dialog becomes taller than the viewport and delays navigation.
- Live DOM audit, 2026-08-29: the useful service model is grouped into licence, vehicle, manufacturer, other products, dashboards, public media, and informational services. Raahi preserves these citizen-recognisable groupings while removing campaign-first content and external handoffs.
- `editorial-landing-page/app/page.tsx` and `editorial-landing-page/app/globals.css`, supplied locally by the user: adopt the sticky translucent header, `1280px` editorial shell, serif display hierarchy, monochrome palette, rounded black/neutral actions, soft large-radius media panels, generous section rhythm, and restrained hover/transition language. Do not copy the Cofounder brand, copy, automation illustrations, or product-specific composition.

## Change log

- 2026-08-28: Approved initial design contract from the hackathon plan.
- 2026-08-28: Hosting changed from Vercel to OpenAI Sites. Supabase Auth/Postgres changed to Sites authentication and D1. The user journey, visual system, security constraints, and synthetic-data policy are unchanged.
- 2026-08-29: Scope expanded to a searchable transport-service hub. Adopted an editorial civic field-guide interface, added complete portal navigation and synthetic service workflows, retained licence renewal as the hero flow, and explicitly rejected official Parivahan identity under the hackathon non-endorsement rule.
- 2026-08-29: Production hosting changed from OpenAI Sites to Cloudflare Workers because Sites access was unavailable in the active Enterprise workspace. D1 and the signed synthetic demo session remain unchanged.
- 2026-08-29: User approved a complete frontend redesign based on the supplied `editorial-landing-page` folder. The system now uses Fraunces/Geist for English, supported Devanagari companions for Hindi, near-monochrome editorial colour, iOS-like rounded panels and motion, and an original security-paper route texture.
- 2026-08-29: Added a genuinely sticky page/account rail, shared editorial Raahi footer, dedicated My applications and editable synthetic Profile pages, and the Journey Preview feature that reveals time, fee, requirements, resumability, and recovery before a citizen starts.
- 2026-08-29: Refined the mobile account experience with overflow-safe layouts, an opaque navigation surface, animated menu state, visible sign-out, subtle civic-blue/mint highlights, and a shadcn service dropdown exposing the complete bilingual catalogue on desktop and mobile.
- 2026-08-30: Replaced the service dropdown and loose category links with one shadcn Navigation Menu for All services, Licence, Vehicle, and Safety. Header hierarchy now prioritises brand, structured task discovery, search, language, and account actions; category calls-to-action are borderless text links with balanced spacing.
