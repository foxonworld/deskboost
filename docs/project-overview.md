# DeskBoost – Project Overview

> Active product/source-of-truth summary for DeskBoost EXE201 MVP. Use with [`README.md`](README.md) as the primary docs entry point.

## Current Status

DeskBoost is a frontend-first EXE201 MVP for desk plant care, contact-only marketplace validation, manually verified customer feedback, AI diagnosis/chat, reminders, and lightweight admin.

| Area              | Current state                                                            |
| ----------------- | ------------------------------------------------------------------------ |
| Frontend          | React 19 + Vite 6 SPA                                                    |
| Router            | React Router DOM v7 + `HashRouter`                                       |
| Backend direction | ASP.NET Core Web API + PostgreSQL                                        |
| Auth              | Frontend auth shell + mock fallback until backend is stable              |
| Roles             | Simple `USER` / `ADMIN`                                                  |
| API contract      | [`api-contract.md`](api-contract.md)                                     |
| Backend handoff   | [`backend-api-checklist-for-tuan.md`](backend-api-checklist-for-tuan.md) |
| Marketplace       | Price/reference info + Zalo/Facebook/manual contact only                 |
| QR/Claim          | Future trust/context enhancement only                                    |

## MVP Thesis

DeskBoost should prove customer demand before building heavy infrastructure.

```txt
User browses contact-only marketplace
→ purchase/contact happens via Zalo/Facebook/manual conversation
→ admin records manually verified feedback with private evidence note
→ public feedback cards show believable customer validation
→ AI/care features support retention and product differentiation
```

## Active MVP Scope

User-side:

1. Landing page.
2. Auth.
3. Add Plant.
4. My Plants.
5. AI Plant Diagnosis.
6. AI Chat for plant-care context.
7. Reminders with in-app tracking + Google Calendar / `.ics` export.
8. Manually verified feedback.
9. Simple contact-only marketplace.

Admin-side lightweight MVP:

1. User management.
2. User plant management.
3. Plant/status management.
4. Marketplace plant management.
5. AI dialog/config status.
6. Manual verified feedback creation.

## Product Guardrails

- Preserve contact-only marketplace philosophy: no in-app transaction workflow.
- Preserve verified feedback first: customer validation beats ownership-code complexity for current MVP.
- Preserve AI-not-gated rule: AI Chat/Diagnosis remain usable without claimed plants.
- Preserve free-add My Plants: claimed plants may become a future trusted subset only.
- Preserve lightweight admin: no enterprise dashboard, analytics suite, finance/order admin, or permission matrix.
- Preserve backend-owned secrets: AI/API keys stay server-side only.

## Explicitly Out of Scope

- Cart, checkout, payment, orders, shipping, refunds.
- Shopee-style ecommerce UX.
- Zalo/Facebook API automation.
- QR scanner, NFC, anti-fraud platform, ownership enforcement.
- AI quota/billing/subscription/rate-limit system.
- General-purpose chatbot or complex long-term AI memory.
- Enterprise admin/governance.

## Future QR/Claim Direction

Plant Code / QR / Claim is preserved as future planning:

- It may link a real sold plant/code to My Plants.
- It may add a claimed/verified badge.
- It may improve AI context later.
- It must not replace manual Add Plant.
- It must not gate basic AI.
- It must not become payment proof or anti-fraud infrastructure.

See [`qr-claim-future-plan-vi.md`](qr-claim-future-plan-vi.md) and [`backend-qr-claim-requirements-vi.md`](backend-qr-claim-requirements-vi.md).

## Source of Truth

- Docs entry point: [`README.md`](README.md)
- Product scope/current status: this file
- API contract: [`api-contract.md`](api-contract.md)
- Backend handoff: [`backend-api-checklist-for-tuan.md`](backend-api-checklist-for-tuan.md) and [`../plans/backend-plan.md`](../plans/backend-plan.md)
- Frontend architecture: [`frontend-architecture.md`](frontend-architecture.md)
- Future QR/Claim: [`qr-claim-future-plan-vi.md`](qr-claim-future-plan-vi.md) and [`backend-qr-claim-requirements-vi.md`](backend-qr-claim-requirements-vi.md)

Archived docs under [`archive/`](archive/) are historical/reference only.

## Architecture Docs

- Frontend architecture: [`frontend-architecture.md`](frontend-architecture.md)
- API contract: [`api-contract.md`](api-contract.md)
- Backend roadmap: [`../plans/backend-plan.md`](../plans/backend-plan.md)
- Docs index: [`README.md`](README.md)

## Known Limitations

- Backend integration still requires coordination with Tuấn.
- Some frontend routes may still use mock/fallback data while backend catches up.
- Automated tests are limited; use lint/build/manual smoke checks.
- Historical archive docs may mention older priorities; active docs above override them.
