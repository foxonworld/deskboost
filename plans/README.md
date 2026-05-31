# DeskBoost Plans

Planning index for active roadmap docs.

## Source of Truth

Authoritative planning source:

1. [`backend-plan.md`](backend-plan.md) — active backend roadmap; authoritative plan for backend implementation.
2. [`../docs/README.md`](../docs/README.md) — active docs navigation and product guardrails.
3. [`../docs/project-overview.md`](../docs/project-overview.md) — product scope and MVP boundaries.
4. [`../docs/api-contract.md`](../docs/api-contract.md) — API contract source of truth.
5. [`../PROJECT_AI_NOTES.md`](../PROJECT_AI_NOTES.md) — durable AI-agent working memory for repo conventions/decisions.

Archived plans are historical/reference only.

## Active Plans

- [`backend-plan.md`](backend-plan.md) — active backend roadmap for Tuấn/backend work.

## Which Plan Is Authoritative

- Backend implementation: [`backend-plan.md`](backend-plan.md), constrained by [`../docs/api-contract.md`](../docs/api-contract.md).
- Product scope: [`../docs/project-overview.md`](../docs/project-overview.md).
- Frontend architecture/redesign: use docs in [`../docs/README.md`](../docs/README.md), not archived plans.
- QR/Claim: future-only docs under [`../docs/qr-claim-future-plan-vi.md`](../docs/qr-claim-future-plan-vi.md) and [`../docs/backend-qr-claim-requirements-vi.md`](../docs/backend-qr-claim-requirements-vi.md).

## Future / Backend Ownership Notes

- Tuấn/backend owns ASP.NET Core API, persistence, auth/roles, AI provider calls, secrets, and future QR/Claim backend lifecycle.
- Frontend owns current SPA UX, mock fallback handling, contact-only marketplace UI, and later QR/Claim UI only after backend/API approval.
- QR/Claim remains future planning; do not treat it as current MVP implementation scope.
- Do not expand backend plan into cart, checkout, payment, orders, shipping, refunds, enterprise admin, QR scanner/NFC, or AI billing.

## Archived Plans

Historical/audit context only:

- [`archive/frontend-completion-audit.md`](archive/frontend-completion-audit.md) — historical/reference only.
- [`archive/future-fb-code.md`](archive/future-fb-code.md) — historical/reference only.

## Planning Guardrails

- Keep plans MVP-first and implementation-ready.
- Do not duplicate architecture already covered in [`../docs/project-overview.md`](../docs/project-overview.md) or [`../docs/frontend-architecture.md`](../docs/frontend-architecture.md).
- Preserve future QR/Claim planning in docs, but do not treat it as current MVP implementation scope.
- Update this README when a plan changes authority/status.
