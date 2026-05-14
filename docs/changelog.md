# Changelog

## [MVP Refactor] – 2026-05-14

### Removed – E-commerce (không cần cho MVP)
- `pages/ShoppingCart.jsx`
- `pages/Checkout.jsx`
- `pages/PaymentSuccess.jsx`
- `pages/PaymentCancelled.jsx`
- `pages/MyOrders.jsx`
- `pages/OrderDetail.jsx`
- `services/commerceApi.js`
- `context/CartContext.jsx`

### Removed – Admin pages (defer to post-MVP)
- `pages/AdminDashboard.jsx`
- `pages/AdminFinancials.jsx`
- `pages/AdminMailManagement.jsx`
- `pages/AdminManageUserPlants.jsx`
- `pages/AdminOrderManagement.jsx`
- `pages/AdminSystemSettings.jsx`
- `pages/AdminUserList.jsx`
- `pages/AdminUserDetail.jsx`
- `pages/AdminPlantList.jsx`
- `pages/AdminAddPlant.jsx`
- `pages/AdminEditPlant.jsx`

### Removed – Duplicate/orphan pages
- `pages/PlantAnalyze.jsx` – duplicate của `AIPlantAnalysis.jsx`
- `pages/DiagnosisResult.jsx` – mock orphan, không còn route nào trỏ đến

### Changed – Routing
- `routes/AppRouter.tsx`: giảm từ **27 routes → 13 routes**
- Xóa toàn bộ commerce routes (`/cart`, `/checkout`, `/orders/*`, `/payment-*`)
- Xóa toàn bộ admin routes (`/app/admin/*`)
- Xóa route `/app/my-plants/:id/analyze` (trỏ về `PlantAnalyze.jsx` đã xóa)

### Changed – Components
- `components/Navbar.jsx`: xóa cart button, xóa `useCart` import, xóa admin link
- `components/UserSidebar.jsx`: xóa "My Orders" menu item

### Changed – App.tsx
- Xóa `CartProvider` wrapper (CartContext đã bị xóa)

### Changed – PlantProfile.jsx
- "Bio Scan" button giờ trỏ đến `/app/ai-analysis` thay vì route đã xóa

### Added – Services layer
- `services/api.js` – base fetch utility (GET/POST/PUT/DELETE + auth headers)
- `services/authApi.js` – stubs: register, login, forgot-password
- `services/plantApi.js` – stubs: catalog + my-plants CRUD
- `services/reminderApi.js` – stubs: reminder CRUD
- `services/aiApi.js` – stubs: image diagnosis + chat (proxy to Gemini qua backend)

### Notes
- `data/mockData.ts` (86KB) vẫn còn – sẽ xóa dần theo từng feature khi backend sẵn sàng
- `CareContext.jsx` vẫn dùng hardcoded tasks – sẽ refactor khi có reminder API
