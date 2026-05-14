# DeskBoost – Project Overview

> **EXE201 Startup MVP** · React 19 + Vite · No backend yet

---

## 1. Ý tưởng sản phẩm

**DeskBoost** là ứng dụng AI hỗ trợ chăm sóc cây cảnh bàn làm việc. Người dùng có thể:
- Theo dõi danh sách cây của mình
- Nhận nhắc nhở chăm sóc (tưới nước, bón phân, phun sương)
- Chẩn đoán bệnh cây bằng AI (upload ảnh / chat)
- Mua cây qua marketplace đơn giản (liên hệ Zalo/Facebook)

---

## 2. Tech Stack hiện tại

| Layer | Công nghệ | Ghi chú |
|---|---|---|
| Frontend | React 19 + Vite 6 | `npm run dev` |
| Routing | React Router DOM v7 | SPA, client-side |
| Styling | Tailwind CSS (CDN inline class) | Không có file CSS riêng |
| State | React Context (CartContext, CareContext) | Local state |
| Storage | localStorage | Không có DB |
| AI | **Mock only** – `setTimeout` + hardcoded responses | Chưa gọi API thật |
| Backend | **Chưa có** | Chỉ có `commerceApi.js` định nghĩa sẵn |
| Deploy | `gh-pages` (cấu hình sẵn) | `npm run deploy` |

---

## 3. Cấu trúc thư mục

```
FE/
├── pages/          # 32 pages (nhiều trang chưa dùng cho MVP)
├── components/     # 7 shared components
├── context/        # CareContext, CartContext
├── data/           # mockData.ts (~86KB – toàn bộ dữ liệu hardcode)
├── services/       # commerceApi.js (Cart/Payment/Order API stubs)
├── routes/         # AppRouter.tsx
└── App.tsx
```

---

## 4. Tình trạng thực tế

| Hạng mục | Tình trạng |
|---|---|
| Landing Page | ✅ Có (`Home.jsx`) |
| Login / Register / ForgotPassword | ✅ Có UI (chưa nối backend) |
| My Plants | ✅ Có UI + mock data |
| Add Plant | ✅ Có (`AddPlantUser.jsx`) |
| AI Diagnosis | ⚠️ Mock – `setTimeout` + hardcoded answers |
| Care Reminders | ⚠️ Mock – hardcoded tasks trong `CareContext` |
| Marketplace (display) | ✅ `PlantList.jsx` + `PlantDetail.jsx` |
| Shopping Cart / Checkout | ❌ Không cần cho MVP |
| Payment / Orders | ❌ Không cần cho MVP |
| Admin Dashboard | ❌ Không cần cho MVP |
| Backend | ❌ Chưa có |
| Database | ❌ Chưa có |
| Auth thật | ❌ Chưa có |

---

## 5. Rủi ro kỹ thuật lớn nhất

1. **`mockData.ts` 86KB** – toàn bộ dữ liệu hardcode, sẽ phải xóa/thay thế khi có API
2. **Không có auth guard** – mọi route đều public, không bảo vệ trang `/app/*`
3. **`CartContext` + `commerceApi.js`** – code thương mại điện tử không cần thiết cho MVP
4. **Hai page AI trùng nhau** – `PlantAnalyze.jsx` và `AIPlantAnalysis.jsx` đều là mock diagnosis
5. **`CareContext` hardcode tasks** – sẽ hỏng ngay khi có user thật vì tasks không liên kết với user/plant thật
