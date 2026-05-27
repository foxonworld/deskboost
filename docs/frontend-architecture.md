# DeskBoost – Frontend Architecture

> Active frontend source of truth. Keep concise; avoid duplicating product scope from [`project-overview.md`](project-overview.md).

## Stack

- React 19 + Vite 6.
- Mixed `.tsx` / `.jsx` source.
- React Router DOM v7 with `HashRouter`.
- Tailwind CDN config in [`../FE/index.html`](../FE/index.html).
- Dark mode via root `.dark` class controlled by [`../FE/components/ThemeToggle.tsx`](../FE/components/ThemeToggle.tsx).
- GSAP motion is allowed only as scoped/reduced-motion-safe polish.

## App Shell

```txt
FE/App.tsx
└── HashRouter
    └── AuthProvider
        └── CareProvider
            └── AppRouter
```

Global helpers:

- `FloatingHomeButton`
- `ThemeToggle`

## Routes

Public:

```txt
/                -> Home
/plants          -> PlantList
/plants/:plantId -> PlantDetail
/login           -> Login
/register        -> Register
/forgot-password -> ForgotPassword
```

Protected user:

```txt
/app/dashboard              -> Dashboard
/app/my-plants              -> MyPlants
/app/my-plants/:id/profile  -> PlantProfile
/app/add-plant              -> AddPlantUser
/app/profile                -> UserProfile
/app/ai-analysis            -> AIPlantAnalysis
/app/ai-chat                -> AIChat
/app/settings               -> RemindersSettings
```

Admin:

```txt
/admin             -> AdminOverview
/admin/users       -> AdminUsers
/admin/plants      -> AdminPlants
/admin/marketplace -> AdminMarketplace
/admin/ai          -> AdminAI
```

Admin routes require authentication + simple `ADMIN` role via `AdminRoute`.

## Key Folders

| Folder                                 | Role                                           |
| -------------------------------------- | ---------------------------------------------- |
| [`../FE/pages`](../FE/pages)           | Route-level UI pages                           |
| [`../FE/components`](../FE/components) | Shared layout/UI primitives                    |
| [`../FE/context`](../FE/context)       | Auth/care providers                            |
| [`../FE/routes`](../FE/routes)         | Router + guards                                |
| [`../FE/services`](../FE/services)     | API/service boundary + mock fallback           |
| [`../FE/data`](../FE/data)             | MVP fallback data                              |
| [`../FE/utils`](../FE/utils)           | Small utilities, including motion/auth helpers |

## Services Layer

| File             | Responsibility                               |
| ---------------- | -------------------------------------------- |
| `api.js`         | Base fetch, auth header, JSON/error handling |
| `authApi.js`     | register/login/forgot password               |
| `userApi.js`     | current user profile                         |
| `plantApi.js`    | public catalog + my-plants CRUD              |
| `reminderApi.js` | reminders + calendar export helpers          |
| `aiApi.js`       | AI diagnosis/chat/dialog/config helpers      |
| `feedbackApi.js` | feedback submit + public verified feedback   |
| `adminApi.js`    | lightweight admin endpoints + mock fallback  |

Rules:

- Pages should call feature services, not raw `fetch`.
- Backend API keys/secrets never enter frontend.
- Mock fallback is acceptable while backend is incomplete, but UI should show calm fallback/sample-data copy when relevant.

## UI System Direction

Active frontend redesign/design docs:

- [`ui-redesign-plan-vi.md`](ui-redesign-plan-vi.md)
- [`design-tokens-vi.md`](design-tokens-vi.md)
- [`motion-system-plan-vi.md`](motion-system-plan-vi.md)

Current shared primitives:

- `Button`
- `Card`
- `Badge` / `Chip`
- `UiState` helpers

Implementation rules:

- Reuse primitives when touching CTA/card/badge/state UI.
- Do not create abstractions without real consumers.
- Keep admin compact and utilitarian.
- Keep marketplace and plant detail contact-first.
- Keep AI calm, plant-contextual, not general-purpose.

## Motion Rules

- Use GSAP only after layout/state is stable.
- Scope animations with refs / `useGSAP`.
- Respect `prefers-reduced-motion`.
- Animate only `opacity` and `transform`.
- Avoid ScrollTrigger, global selectors, layout-property animation, infinite glow/pulse, or replaying full chat history.

## Product Guardrails Affecting FE

- Marketplace remains contact-only; no cart/checkout/payment/order/shipping UX.
- Verified feedback is manual/trust-first; no fake ecommerce review ecosystem.
- AI is not gated by QR/Claim or ownership code.
- My Plants remains free-add; claimed plants are future optional subset.
- QR/Claim UI remains future until backend/API approval.
- Admin remains lightweight.

## Verification

Smallest useful checks after FE changes:

1. `cd FE && npm run lint`
2. `cd FE && npm run build`
3. Manual smoke affected routes, including light/dark and mobile where UI changed.
