# DeskBoost – MVP Scope

> Mục tiêu: **Deployable MVP** phục vụ EXE201. Ưu tiên deploy nhanh + test thật với user.

---

## Phân loại tính năng

### ✅ KEEP – Giữ lại, hoàn thiện

| Page / Feature | File | Việc cần làm |
|---|---|---|
| Landing Page | `Home.jsx` | Thêm CTA thật, link Zalo/FB |
| Login | `Login.jsx` | Nối backend auth |
| Register | `Register.jsx` | Nối backend auth |
| Forgot Password | `ForgotPassword.jsx` | Email reset (có thể defer) |
| My Plants | `MyPlants.jsx` | Nối API thật thay mock |
| Add Plant | `AddPlantUser.jsx` | Nối API thật |
| Plant Profile | `PlantProfile.jsx` | Nối API thật |
| AI Plant Analysis | `AIPlantAnalysis.jsx` | **Thay mock bằng Gemini API** |
| Care Reminders | `RemindersSettings.jsx` | Nối backend, bỏ hardcode |
| Care Notification Bell | `CareNotificationBell.jsx` | Giữ UI, feed data từ API |
| Plant List (Marketplace) | `PlantList.jsx` | Thêm nút liên hệ Zalo/FB |
| Plant Detail | `PlantDetail.jsx` | Thêm nút liên hệ Zalo/FB |
| User Profile | `UserProfile.jsx` | Nối backend |
| Dashboard | `Dashboard.jsx` | Thay hardcode bằng data thật |
| UserLayout / Navbar / Sidebar | components | Giữ nguyên |
| ThemeToggle | `ThemeToggle.tsx` | Giữ nguyên |
| CareContext | `CareContext.jsx` | Refactor để nhận data từ API |

---

### ❌ REMOVE – Xóa hoàn toàn khỏi MVP

> **Lý do:** Gây confusion, làm nặng codebase, không nằm trong MVP scope.

| File | Lý do xóa |
|---|---|
| `ShoppingCart.jsx` | E-commerce không cần cho MVP |
| `Checkout.jsx` | E-commerce không cần cho MVP |
| `PaymentSuccess.jsx` | E-commerce không cần cho MVP |
| `PaymentCancelled.jsx` | E-commerce không cần cho MVP |
| `MyOrders.jsx` | E-commerce không cần cho MVP |
| `OrderDetail.jsx` | E-commerce không cần cho MVP |
| `PlantAnalyze.jsx` | **Trùng** với `AIPlantAnalysis.jsx` – giữ cái kia |
| `DiagnosisResult.jsx` | Kết quả mock – merge vào `AIPlantAnalysis.jsx` |
| `services/commerceApi.js` | Toàn bộ Cart/Payment/Order API |
| `context/CartContext.jsx` | Không cần cart |
| Routes commerce trong `AppRouter.tsx` | `/cart`, `/checkout`, `/orders/*`, `/payment-*` |

**Admin pages – xóa toàn bộ hoặc ẩn:**

| File | Lý do |
|---|---|
| `AdminDashboard.jsx` | Không cần cho MVP user-facing |
| `AdminFinancials.jsx` | Không có doanh thu thật |
| `AdminMailManagement.jsx` | Phức tạp không cần |
| `AdminManageUserPlants.jsx` | Quản lý manual – không cần |
| `AdminOrderManagement.jsx` | Liên quan e-commerce |
| `AdminSystemSettings.jsx` | Không cần |
| `AdminUserList.jsx` / `AdminUserDetail.jsx` | Defer |
| `AdminPlantList.jsx` / `AdminAddPlant.jsx` / `AdminEditPlant.jsx` | Có thể giữ nếu cần seed data |

---

### 🔜 FUTURE – Để sau EXE201

| Feature | Lý do defer |
|---|---|
| Thanh toán VNPay/Momo | Cần merchant account |
| Cart & Orders | Cần warehouse/fulfillment |
| Admin full dashboard | Cần thêm time |
| QR/NFC plant tag | Hardware dependency |
| Workspace scanner | Hardware dependency |
| Analytics nâng cao | Cần đủ user data |
| Notifications push | Cần FCM setup |
| Multi-language | Defer |

---

## MVP Routes sau khi cleanup

```
/                           → Home (Landing)
/plants                     → PlantList (Marketplace - hiển thị)
/plants/:plantId            → PlantDetail (+ nút liên hệ)
/login                      → Login
/register                   → Register
/forgot-password            → ForgotPassword

/app/dashboard              → Dashboard
/app/my-plants              → MyPlants
/app/my-plants/:id/profile  → PlantProfile
/app/add-plant              → AddPlantUser
/app/ai-analysis            → AIPlantAnalysis (Gemini thật)
/app/settings               → RemindersSettings
/app/profile                → UserProfile
```

**Tổng: 13 routes** (giảm từ 27 routes hiện tại)

---

## MVP Backend cần có

Chỉ cần **5 nhóm API** cho MVP:

```
POST   /auth/register
POST   /auth/login
POST   /auth/forgot-password

GET    /users/me
PUT    /users/me

GET    /plants                  # catalog (marketplace)
GET    /plants/:id

GET    /my-plants               # cây của user
POST   /my-plants
GET    /my-plants/:id
PUT    /my-plants/:id
DELETE /my-plants/:id

GET    /reminders               # reminder của user
POST   /reminders
PUT    /reminders/:id
DELETE /reminders/:id

POST   /ai/diagnose             # proxy Gemini Vision API
POST   /ai/chat                 # proxy Gemini Chat API
```

> **Lưu ý:** `/ai/*` chỉ là proxy đơn giản để giấu API key, không cần logic phức tạp.
