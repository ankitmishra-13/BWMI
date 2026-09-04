# Raahi — Editorial iOS Civic Service Design Contract

Status: Approved by user direction on 2026-08-29

This document is the single design authority for the hackathon prototype. Product code must follow it unless a later decision is recorded in the change log.

## Product promise

Help a citizen find, understand, and complete a synthetic transport-service journey without making them decode a directory of government portals. Driving-licence renewal remains the showcase end-to-end flow; every other surfaced service must either have a working mock flow or be clearly presented as an informational prototype.

**Visual thesis:** a premium public-service field guide rendered with the quiet confidence of an iOS first-party app: oversized editorial type, warm beige paper, near-black actions, translucent chrome, precise dividers, and soft tactile panels over a restrained security-paper route texture. The citizen surface feels calm and guided; the admin surface feels compact, operational, and Cloudflare-like without copying Cloudflare branding.

**Content plan:** describe a renewal need → confirm a personalized readiness plan → secure demo sign-in → prepared renewal workflow → review → recoverable mock payment → receipt and an explicit next-action centre. The wider service directory remains available, but the Top-10 narrative follows one non-technical, Hindi-first citizen from uncertainty to a completed synthetic renewal.

**Interaction thesis:** one clear action at a time. Controls acknowledge hover and press with a small lift/scale response, panels reveal with short opacity/translate transitions, progress persists across the journey, and every simulated dependency is labelled at the point of use.

**Top-10 experience goal:** a citizen should never need to know the name of a portal, form, or backend system before beginning. Raahi first asks about the citizen’s situation in ordinary language, reflects back what it understood, then exposes the smallest useful set of decisions. AI interprets language only; deterministic, inspectable rules produce the readiness result.

## Non-negotiable disclosure

Show “Independent hackathon prototype—not an official government service” in the persistent header or immediately below it. Never use the official Parivahan logo, State Emblem, ministry marks, or any identity treatment that implies endorsement. Use the original Raahi wordmark and a simple route motif. Never send requests to Parivahan, Sarathi, Vahan, eChallan, PUCC, or any government system.

Every licence, document, OTP, payment, receipt, and status is synthetic or mocked and must be labelled accordingly.

## Visual system

The theme is light-only with high-contrast and forced-colors compatibility.

### Colour tokens

| Role | Value | Usage |
|---|---:|---|
| Canvas | `#F5F0E7` | Warm beige paper page background |
| Surface | `#FFFCF7` | Forms and meaningful containers |
| Ink | `#0A0A0A` | Primary text, header, filled actions |
| Muted text | `#6B6257` | Supporting copy |
| Quiet surface | `#EDE4D7` | Secondary controls, cards, and subtle grouping |
| Border | `#D7CBBA` | Inputs and semantic boundaries |
| Primary | `#0A0A0A` | Buttons, active steps, important links |
| Primary hover | `#242424` | Interactive feedback |
| Civic texture | `#E6DED0` | Sparse route/security-paper background only |
| Focus | `#2563EB` | Keyboard focus ring |
| Success | `#17613E` | Success plus icon/text |
| Warning | `#7A4B00` | Warnings plus icon/text |
| Danger | `#B42318` | Errors and destructive actions |

Contrast is mandatory. Status never relies on colour alone; pair it with an icon and text. Near-black is the only routine action colour; blue is reserved for focus. Beige communicates calm and material warmth, never disabled state.

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

- The compact header always exposes Home, Services, Driving licence, Vehicle, Safety & compliance, Guides, search, and account state. Once signed in, a single profile navigation control contains Overview, My applications, Profile, the page-preserving language switch, and Sign out; these actions must not appear as a competing row of pills.
- Desktop uses restrained text links plus a keyboard-operable shadcn service dropdown; mobile uses one rounded, opaque navigation panel with the same destinations and a scrollable full-service menu.
- Search is a first-class labelled control, never an icon-only affordance.
- The authenticated account area shows active and past synthetic applications across service types; it is not an admin dashboard.

### Authenticated workspace

Use a persistent compact header with product name, prototype notice, service navigation, and one account menu. The main area contains:

1. a small orientation eyebrow;
2. one clear page title and contextual status;
3. a horizontal progress indicator on desktop and compact current-step indicator on mobile;
4. the primary form or task surface;
5. contextual help adjacent on desktop and below on mobile;
6. a stable action footer for Back and Continue.

The dashboard is a readable licence summary and next action, not a metrics dashboard. Status uses a vertical timeline with next-step guidance.

The citizen dashboard starts with the most recent application and a clear four-stage progress rail: submitted, document verification, review, and decision. Each stage shows who owns it, what has happened, and what the citizen needs to do. Technical event logs remain hidden behind progressive disclosure.

The authenticated area also includes a persistent left account rail with Overview, My applications, Profile, and Browse services. My applications separates resumable drafts from submitted journeys; Profile allows only clearly fictional `@bwmi.test` identity values. The public landing-page rail remains sticky for the full editorial index and exposes account destinations below the page sections.

### Shared footer

Every locale page ends with one common Raahi footer derived from the supplied editorial reference: a quiet moving capability strip, large service CTA, useful link columns, oversized low-contrast Raahi wordmark, prototype disclosure, and back-to-top action. It is navigational and brand-building, not a duplicate sitemap wall. Reduced-motion users receive a static strip.

### Authentication and synthetic onboarding

- Sign in and registration open in a shadcn Dialog from the persistent header so a citizen can authenticate without losing page context. Dedicated `/en/login`, `/hi/login`, and registration URLs remain available as accessible fallbacks and direct links.
- The shared judge account remains the fastest path. Registration is a complete synthetic funnel: choose language and consent, enter fictional contact details, enter visible demo OTP `123456`, connect a mocked DigiLocker record, review, and open the workspace.
- “Connect DigiLocker” never opens or contacts DigiLocker. It visibly simulates consent, redirect, verification, and selective document import. Only safe synthetic metadata is persisted; no document bytes, Aadhaar data, tokens, or government identifiers are accepted.
- Every auth and DigiLocker overlay has a title, description, escape/close behavior, keyboard focus management, and a dedicated full-page fallback.

### Citizen notifications

- Signed-in citizens receive a labelled notification bell in the header with unread count, newest-first updates, read/unread state, application reference, and direct links to the relevant status view.
- Admin status changes create an in-app notification and a **mock WhatsApp delivery record**. The UI must say “WhatsApp simulation” and never send to or store a real number.
- Notifications describe the change and next action in plain language. Status colour is paired with an icon and label.

### Admin operations workspace

- `/admin` is a separate English multi-page operational workspace. It does not reuse the citizen editorial hero. Its calm, compact hierarchy is inspired by established infrastructure dashboards without copying their branding or composition.
- The route architecture is `/admin` overview, `/admin/applications`, `/admin/applications/[id]`, `/admin/regions`, `/admin/regions/[code]`, `/admin/citizens`, `/admin/notifications`, `/admin/assistant`, `/admin/audit`, and `/admin/settings`.
- Desktop uses the shadcn sidebar in `icon` collapse mode: 256px expanded, 72px collapsed, click to persist the preference, and a temporary pointer-hover preview when collapsed. Labels remain available through tooltips, focus, and accessible names. Mobile uses an off-canvas sheet; no workflow depends on hover.
- Information architecture moves from national health to state/UT queues to an individual application. Each page has one primary task, visible data freshness, scoped filters, empty/error states, and a route-aware breadcrumb.
- Seed all 28 Indian states and eight union territories as synthetic operational regions. Region detail may include fictional districts and RTO offices, but must never imply a connection to a real authority.
- Region permissions use four demo roles: national administrator (all regions), state/UT administrator (one jurisdiction), RTO reviewer (assigned offices), and support viewer (read-only). Server queries and mutations enforce the same scope shown in the interface.
- Every application carries a state/UT code, district, RTO code, assignment, priority, SLA due time, and last citizen update. Publishing a change atomically updates the application, status event, citizen notification, mock WhatsApp delivery record, and audit log.
- Admins can move a renewal through `Submitted`, `Documents checking`, `Under review`, `Approved`, or `Action required`; set a 0–100 progress value; write a short citizen-facing update; and preview in-app plus mock WhatsApp copy before saving.
- Every mutation is authenticated as the demo admin, allow-listed, validated, and audit logged. Admin actions never call a government service or real messaging provider.
- The admin demo credentials are public synthetic credentials, distinct from the citizen account. A persistent banner identifies the panel as a hackathon prototype.

### Raahi Ops Copilot

- A contextual AI helper is available as a right-side Sheet on every admin page and as a larger `/admin/assistant` workspace.
- “Complete context” means complete **permitted** context: current route, active filters, aggregate queue statistics, the selected redacted synthetic application, relevant workflow rules, and the signed-in administrator's role and region. It never means dumping the database into a prompt.
- The helper can summarise an application, explain delays, identify missing synthetic metadata, surface SLA risk, suggest routing, draft English/Hindi citizen updates, and answer workflow questions. Each response states the evidence it used and offers a reviewable next step.
- The helper cannot approve, reject, transfer, change progress, send a message, or access another region. Suggested actions require an explicit human confirmation through the existing validated mutation path.
- `/api/admin/assistant` performs authentication and regional authorization before retrieval, passes redacted structured context to the model, caps input/output, rate-limits by administrator, provides deterministic fallbacks, and records token-safe audit metadata without retaining question text or citizen PII.

### Differentiating feature — Journey Preview

Every service brief exposes a dark, route-textured Journey Preview before the form. It makes estimated time, sample fee, number of stages, requirements, draft persistence, recovery behaviour, and mocked handoffs visible before sign-in. This is the core product contrast: organise around the citizen’s goal and preserve context through receipt/status rather than making the citizen discover portals and dependencies mid-task.

### Flagship feature — Renewal Readiness Copilot

- `/en/readiness` and `/hi/readiness` are the preferred entry points for licence renewal.
- A citizen may type or, where the browser supports it, speak a short English, Hindi, or Hinglish description. The interface immediately shows which fields were understood and leaves every extracted answer editable.
- The Copilot may classify intent and extract non-sensitive readiness fields. It must not decide eligibility, invent requirements, or conceal uncertainty. Deterministic versioned rules create the checklist and attention states.
- The readiness result presents: what Raahi understood, ready items, documents to prepare, possible blockers, mock time and fee, whether an illustrative visit may be required, source links, and a prominent synthetic-data disclosure.
- Starting from a readiness result persists the assessment and connects it to the new renewal draft. Refreshing or signing in must not discard the public assessment.
- The primary persona is Meena Sharma, a 55-year-old Hindi-first synthetic citizen using a low-cost mobile connection. Interface copy still addresses the current user rather than narrating the persona.

### Recovery and next-action centre

- Save feedback uses understandable language such as “Saved just now · Safe to continue later.” Never expose storage or API terminology.
- Wrong OTP, simulated connection interruption, mock-payment failure, refresh, and back navigation preserve earlier work and provide one recovery action.
- The submitted status view answers five questions in order: what happened, who acts next, what the citizen should do, expected timing, and how to recover if progress stops.
- An action-required scenario is an interactive, persisted mock state. The citizen can inspect the issue, select harmless correction metadata, resolve it, and return to the normal timeline.

### Citizen display preferences

- Authenticated citizens can open one “Accessibility & display” destination from the profile menu and account rail.
- Large text, high contrast, reduced motion, low-bandwidth mode, simplified guidance, and read-aloud preference are independent, persistent choices.
- Low-bandwidth mode removes atmospheric images, backdrop filters, diffuse shadows, and non-essential animation without hiding content or actions.
- Simplified guidance hides secondary explanation only when the same requirement remains explicit nearby. Read-aloud actions use browser speech synthesis and always retain visible text.

### Evidence section

The readiness completion view includes a compact, honestly labelled prototype comparison. It may compare observable interface properties—handoffs, requirements shown before starting, draft recovery, language continuity, and next-action clarity—but must not present invented time savings, adoption statistics, or official performance claims.

## Component rules

- Use shadcn primitives for Button, Input, Label, Select, Checkbox, Dialog/Sheet, Alert, Separator, and accessible form composition.
- Buttons use verb-first labels. One filled near-black pill action per region; secondary actions are quiet grey or outline pills. Hover lifts by 1px and press scales to `0.98` without delaying activation.
- Inputs have persistent labels, optional hint text, and inline errors. Placeholder text is never the only label.
- Text fields, textareas, selects, and search controls use a quiet neutral border with a soft civic-blue focus halo. Search focus belongs to the complete rounded search shell rather than drawing a sharp rectangle around the raw input; forced-colors mode retains the native high-contrast outline.
- Use native date semantics where possible; never ask users to infer a date format.
- Document selection stores metadata only and clearly says “No file is uploaded in this prototype.”
- The mock OTP field exposes demo code `123456` beside the control.
- Every transactional service uses a persisted, resumable form: confirm the synthetic source record, edit the requested fictional value and contact details, enter the visible mock OTP, compare an explicit before/after review, accept the declaration, then enter the mock gateway.
- The payment gateway never renders card, bank, or UPI credential inputs. It offers clearly labelled mock UPI, mock card, and mock net-banking choices; shows the sample amount and application reference; provides an intentional failed-payment recovery preview; and records only the chosen mock method and generated transaction reference.
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

No official Parivahan logo, government emblem, campaign carousel, full-screen blocking popup, tricolour gradient, generic dashboard card wall, hidden requirements, decorative 3D, dark theme, glossy gradients, excessive glass effects, live government integration, live DigiLocker integration, or real WhatsApp delivery.

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
- 2026-08-30: Standardised form focus styling across search, text, textarea, and select controls. Rounded controls now receive a restrained neutral edge and soft civic-blue halo, while service searches suppress irrelevant browser autocomplete suggestions and forced-colors focus remains explicit.
- 2026-08-30: Consolidated authenticated header actions into one shadcn profile navigation menu. Replaced the generic service demo with a persisted five-step application flow containing editable synthetic data, explicit before/after review, visible demo OTP, recoverable validation, and a dedicated credential-free mock payment gateway with receipt metadata.
- 2026-09-03: Approved the Top-10 flagship direction. Added a bilingual Renewal Readiness Copilot, deterministic explainable requirement rules, prepared renewal handoff, persistent accessibility and low-bandwidth preferences, recovery event handling, an interactive next-action centre, and an evidence-based prototype comparison. The visual system and non-endorsement rules remain unchanged.
- 2026-09-04: Review direction approved a warmer beige citizen theme with black action accents, an Ask Raahi hero entry, modal-first authentication with a full synthetic registration/DigiLocker-linking funnel, a citizen notification centre, clearer application progress, and a separate Cloudflare-inspired admin operations workspace. DigiLocker and WhatsApp are simulated only; no live government or messaging integration is permitted.
- 2026-09-05: User approved the multi-page operations architecture, all-state/UT regional controls, role-scoped administration, collapsible shadcn sidebar, citizen-visible regional updates, and Raahi Ops Copilot. AI context is explicitly permission-scoped, redacted, auditable, and human-confirmed.
