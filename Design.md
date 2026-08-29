# Raahi — Editorial Transport Service Design Contract

This document is the single design authority for the hackathon prototype. Product code must follow it unless a later decision is recorded in the change log.

## Product promise

Help a citizen find, understand, and complete a synthetic transport-service journey without making them decode a directory of government portals. Driving-licence renewal remains the showcase end-to-end flow; every other surfaced service must either have a working mock flow or be clearly presented as an informational prototype.

**Visual thesis:** an editorial civic field guide: confident type, generous white space, crisp rules, numbered wayfinding, and calm task surfaces. It should feel like a knowledgeable help desk edited into a modern public-interest publication—not an institutional portal, promotional campaign, or generic app dashboard.

**Content plan:** public service discovery → service detail and requirements → secure demo sign-in → guided workflow → review → mock payment where relevant → receipt and trackable status. Each screen answers three questions: where am I, what is needed now, and what happens next?

**Interaction thesis:** one clear action at a time. Progress is persistent, drafts survive navigation, requirements appear before inputs, and every simulated dependency is labelled at the point of use.

## Non-negotiable disclosure

Show “Independent hackathon prototype—not an official government service” in the persistent header or immediately below it. Never use the official Parivahan logo, State Emblem, ministry marks, or any identity treatment that implies endorsement. Use the original Raahi wordmark and a simple route motif. Never send requests to Parivahan, Sarathi, Vahan, eChallan, PUCC, or any government system.

Every licence, document, OTP, payment, receipt, and status is synthetic or mocked and must be labelled accordingly.

## Visual system

The theme is light-only with high-contrast and forced-colors compatibility.

### Colour tokens

| Role | Value | Usage |
|---|---:|---|
| Canvas | `#F6F8FB` | Page background |
| Surface | `#FFFFFF` | Forms and meaningful containers |
| Structural navy | `#102A43` | Text, header, orientation |
| Muted text | `#52667A` | Supporting copy |
| Border | `#CBD5E1` | Inputs and semantic boundaries |
| Primary teal | `#0F766E` | Buttons, active steps, links |
| Teal hover | `#0B5F59` | Interactive feedback |
| Saffron | `#C76A15` | Sparse Indian identity cue; never routine actions or small text |
| Focus | `#2563EB` | Keyboard focus ring |
| Success | `#1F7A4C` | Success plus icon/text |
| Warning | `#8A5A00` | Warnings plus icon/text |
| Danger | `#B42318` | Errors and destructive actions |

Contrast is mandatory. Status never relies on colour alone; pair it with an icon and text. Saffron is an orientation accent, not a second call-to-action colour.

### Typography

- Headings: **Anek Devanagari**, weights 600–700.
- Body and controls: **Noto Sans Devanagari**, weights 400–600.
- Both fonts must support English and Hindi without a fallback-layout downgrade.
- Display heading: `clamp(2.35rem, 6vw, 5.25rem)`, tight line height, maximum two lines.
- Page title: `clamp(1.85rem, 4vw, 3rem)`.
- Body: 1rem minimum with 1.6 line height; supporting text 0.875rem minimum.

### Shape and spacing

- 8px spacing scale; allow 4px only for tightly related micro-elements.
- Shell maximum width: 1200px.
- Form measure: 760–840px.
- Minimum touch target: 44×44px.
- Control radius: 12px.
- Meaningful-panel radius: 16px.
- Use borders and spacing before shadows. Shadows are soft, sparse, and reserved for lifted overlays.

## Composition

### Public introduction

Use a compact civic header and an asymmetric editorial hero. Lead with “Transport services, without the maze” and a short, concrete promise. Put a service search field at the decision point, then offer “Explore all services” and “Try licence renewal.” On wide screens, pair the copy with a numbered service index and active-application excerpt—not a stock photograph or decorative dashboard.

Below the fold, show popular citizen tasks, the full grouped service directory, the improved renewal path, and a concise mock-data disclosure. Prefer connected sections, ruled lists, and editorial indexes to repeated floating cards. Category pages must support search, quick filters, and direct task entry.

### Portal navigation

- The compact header always exposes Home, Services, Driving licence, Vehicle, Safety & compliance, Guides, language, and account state.
- Desktop uses small, keyboard-operable disclosure menus; mobile uses a single readable navigation panel with the same destinations.
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

## Component rules

- Use shadcn primitives for Button, Input, Label, Select, Checkbox, Dialog/Sheet, Alert, Separator, and accessible form composition.
- Buttons use verb-first labels. One filled primary action per region.
- Inputs have persistent labels, optional hint text, and inline errors. Placeholder text is never the only label.
- Use native date semantics where possible; never ask users to infer a date format.
- Document selection stores metadata only and clearly says “No file is uploaded in this prototype.”
- The mock OTP field exposes demo code `123456` beside the control.
- The payment screen never renders card, bank, or UPI inputs. It only confirms a mocked ₹450 transaction.
- The AI explainer opens in a Sheet and includes its limits above the question field.
- Avoid generic card walls, excessive pills, nested rounded containers, and icon-only controls without accessible names.

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

- Feedback and step continuity transitions: 150–220ms, standard ease-out.
- Animate opacity and small transforms only. No scroll spectacle, parallax, or looping decoration.
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

No official Parivahan logo, government emblem, campaign carousel, full-screen popup, tricolour gradient, generic card wall, hidden requirements, admin panel, decorative 3D, dark theme, glossy gradients, glassmorphism, or live government integration.

## Reference evidence

- `clone-audit/parivahan-gov-in-20260829/01-home-desktop-full.png`: the official portal blocks the page with a large update-mobile-number dialog before task selection.
- `clone-audit/parivahan-gov-in-20260829/02-home-mobile-popup.png`: at 390px, the same dialog becomes taller than the viewport and delays navigation.
- Live DOM audit, 2026-08-29: the useful service model is grouped into licence, vehicle, manufacturer, other products, dashboards, public media, and informational services. Raahi preserves these citizen-recognisable groupings while removing campaign-first content and external handoffs.
- `editorial-landing-page.zip` could not be used as evidence because the supplied file was 0 bytes. The editorial direction in this revision is an explicit product interpretation, not a claim about unseen ZIP contents.

## Change log

- 2026-08-28: Approved initial design contract from the hackathon plan.
- 2026-08-28: Hosting changed from Vercel to OpenAI Sites. Supabase Auth/Postgres changed to Sites authentication and D1. The user journey, visual system, security constraints, and synthetic-data policy are unchanged.
- 2026-08-29: Scope expanded to a searchable transport-service hub. Adopted an editorial civic field-guide interface, added complete portal navigation and synthetic service workflows, retained licence renewal as the hero flow, and explicitly rejected official Parivahan identity under the hackathon non-endorsement rule.
