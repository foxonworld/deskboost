# DeskBoost Docs

Active documentation index for DeskBoost EXE201 MVP.

## Source of Truth

Use this directory as the active source of truth. Archived docs are historical/reference only and must not override active docs.

Authoritative docs:

1. [`project-overview.md`](project-overview.md) — product scope, MVP guardrails, current status.
2. [`api-contract.md`](api-contract.md) — backend/frontend API contract.
3. [`backend-api-checklist-for-tuan.md`](backend-api-checklist-for-tuan.md) — backend handoff checklist for Tuấn.
4. [`backend-qr-claim-requirements-vi.md`](backend-qr-claim-requirements-vi.md) — future QR/Claim backend requirements.
5. [`frontend-architecture.md`](frontend-architecture.md) — current frontend architecture and route/service map.
6. [`ui-redesign-plan-vi.md`](ui-redesign-plan-vi.md), [`design-tokens-vi.md`](design-tokens-vi.md), [`motion-system-plan-vi.md`](motion-system-plan-vi.md) — frontend redesign/design/motion source docs.
7. [`qr-claim-future-plan-vi.md`](qr-claim-future-plan-vi.md) — future Plant Code / QR / Claim planning.
8. [`../plans/backend-plan.md`](../plans/backend-plan.md) — active backend implementation roadmap.

## Project Overview

DeskBoost is a frontend-first EXE201 startup MVP for desk plant care, contact-only marketplace validation, manually verified customer feedback, AI diagnosis/chat, reminders, and lightweight admin.

Core thesis: validate demand and trust first; do not build heavy ecommerce, ownership, or enterprise infrastructure before evidence exists.

## Recommended Reading Order

For new developers, Roo, Codex, or reviewers:

1. [`project-overview.md`](project-overview.md)
2. [`api-contract.md`](api-contract.md)
3. [`frontend-architecture.md`](frontend-architecture.md)
4. [`backend-api-checklist-for-tuan.md`](backend-api-checklist-for-tuan.md)
5. [`../plans/backend-plan.md`](../plans/backend-plan.md)
6. [`ui-redesign-plan-vi.md`](ui-redesign-plan-vi.md)
7. [`design-tokens-vi.md`](design-tokens-vi.md)
8. [`motion-system-plan-vi.md`](motion-system-plan-vi.md)
9. [`qr-claim-future-plan-vi.md`](qr-claim-future-plan-vi.md)
10. [`backend-qr-claim-requirements-vi.md`](backend-qr-claim-requirements-vi.md)

## Frontend Docs

- [`frontend-architecture.md`](frontend-architecture.md) — stack, routes, services, UI/motion rules.
- [`ui-redesign-plan-vi.md`](ui-redesign-plan-vi.md) — redesign direction.
- [`design-tokens-vi.md`](design-tokens-vi.md) — visual tokens.
- [`motion-system-plan-vi.md`](motion-system-plan-vi.md) — safe GSAP/motion rules.

## Backend Docs

- [`api-contract.md`](api-contract.md) — API source of truth.
- [`backend-api-checklist-for-tuan.md`](backend-api-checklist-for-tuan.md) — implementation checklist for Tuấn.
- [`../plans/backend-plan.md`](../plans/backend-plan.md) — backend roadmap.
- [`backend-qr-claim-requirements-vi.md`](backend-qr-claim-requirements-vi.md) — future QR/Claim backend notes only.

## Future Planning Docs

- [`qr-claim-future-plan-vi.md`](qr-claim-future-plan-vi.md) — future Plant Code / QR / Claim.
- [`backend-qr-claim-requirements-vi.md`](backend-qr-claim-requirements-vi.md) — backend requirements for that future phase.

QR/Claim is preserved, but remains future-only until explicitly approved for implementation.

## Current Implementation Status

- Frontend: active React 19 + Vite 6 SPA.
- Backend: target ASP.NET Core Web API + PostgreSQL; handoff docs ready.
- Marketplace: contact-only; no transaction workflow.
- Feedback: manually verified feedback first.
- AI: plant-care diagnosis/chat; not gated by claimed plants.
- QR/Claim: planned future enhancement only.

## Important Guardrails

- Marketplace remains contact-only: price/reference info + Zalo/Facebook/manual contact.
- Verified feedback first: manual/social purchase → admin manually verifies feedback → public trust cards.
- AI remains plant-care focused and usable without claimed plants.
- My Plants remains free-add; claimed plants may become a future trusted subset only.
- QR/Claim is future trust/context enhancement only; not AI gate, payment proof, anti-fraud, or ownership enforcement.
- Admin stays lightweight; no enterprise dashboard.
- No cart, checkout, payment, orders, shipping, refunds.
- Do not expose AI/API keys in frontend/admin UI.

## AI-Assisted Workflow Notes

- Start with this README, then [`project-overview.md`](project-overview.md), then the area-specific doc.
- Prefer minimal diffs and local conventions.
- Do not revive archived docs as active scope without updating this README and [`../plans/README.md`](../plans/README.md).
- For frontend changes, check [`frontend-architecture.md`](frontend-architecture.md) plus redesign/token/motion docs.
- For backend handoff, check [`api-contract.md`](api-contract.md), [`backend-api-checklist-for-tuan.md`](backend-api-checklist-for-tuan.md), and [`../plans/backend-plan.md`](../plans/backend-plan.md).
- For QR/Claim, keep it future-only and preserve AI-not-gated/free-add My Plants rules.

## Archive

Historical docs live in [`archive/`](archive/). They are historical/reference only.

Do not use archive docs as current source of truth unless an active doc explicitly points to them.

- [`archive/changelog.md`](archive/changelog.md) — historical/reference only.
- [`archive/exe201-scope-adjustment.md`](archive/exe201-scope-adjustment.md) — historical/reference only.
- [`archive/frontend-adjustment-plan.md`](archive/frontend-adjustment-plan.md) — historical/reference only.
- [`archive/frontend-redesign-implementation-roadmap-vi.md`](archive/frontend-redesign-implementation-roadmap-vi.md) — historical/reference only.
- [`archive/mvp-scope.md`](archive/mvp-scope.md) — historical/reference only.
