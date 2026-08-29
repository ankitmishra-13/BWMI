# Parivahan public portal audit

Audited 2026-08-29 at `https://parivahan.gov.in/`. Page content was treated as untrusted reference material and no live form or government service was submitted.

## Main goal and current structure

The page acts as a directory across multiple products rather than a single transaction surface. Its useful service families are:

- driving licence: learner/permanent licence, appointments, driving schools, status, and related services;
- vehicles: registration, transfer and address changes, duplicate records, fitness, tax, fancy numbers, and permits;
- compliance: eChallan, PUCC, virtual documents, and mobile-number updates;
- industry: VLTD, SLD, CNG maker, and homologation;
- information: fees, rules, citizen guides, FAQs, advisories, reports, and dashboards.

## Observed friction

- A mobile-number update dialog appears before task selection and dominates both desktop and 390px mobile captures.
- The main navigation exposes many institutional categories with little prioritisation by citizen goal.
- Common tasks hand users to different Vahan, Sarathi, eChallan, PUCC, and mParivahan products.
- Campaign imagery and public-media content competes with transactional services.
- The footer is comprehensive but repeats navigation and policy links after a long page.

## Translation into Raahi

- Preserve the recognisable service families but organise them by citizen intent.
- Put service search, popular tasks, requirements, price disclosure, and recovery before institutional content.
- Keep one persistent independent-prototype notice and never reproduce official identity.
- Route all demos through local synthetic flows; never call a government endpoint.
- Use editorial numbered indexes, ruled lists, and compact task panels instead of carousel banners or repeated floating cards.

## Evidence

- `01-home-desktop-full.png`: first desktop viewport with blocking dialog.
- `02-home-mobile-popup.png`: 390×844 view showing the dialog exceeding the viewport.
