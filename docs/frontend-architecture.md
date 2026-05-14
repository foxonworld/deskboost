# DeskBoost – Frontend Architecture

> React 19 + Vite 6 · SPA · MVP-first

---

## 1. Cấu trúc sau cleanup

```
FE/
├── pages/
│   ├── Home.jsx                  # Landing
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ForgotPassword.jsx
│   ├── PlantList.jsx             # Marketplace (display only)
│   ├── PlantDetail.jsx
│   ├── Dashboard.jsx
│   ├── MyPlants.jsx
│   ├── PlantProfile.jsx
│   ├── AddPlantUser.jsx
│   ├── AIPlantAnalysis.jsx       # ← AI thật (Gemini)
│   ├── RemindersSettings.jsx
│   └── UserProfile.jsx
│
├── components/
│   ├── UserLayout.jsx            # Wrapper layout cho /app/*
│   ├── UserSidebar.jsx
│   ├── Navbar.jsx
│   ├── CareNotificationBell.jsx
│   ├── ChatbotWidget.jsx
│   ├── FloatingHomeButton.jsx
│   └── ThemeToggle.tsx
│
├── context/
│   └── CareContext.jsx           # Giữ, refactor để nhận API data
│   # CartContext.jsx → XÓA
│
├── services/
│   ├── api.js                    # ← TẠO MỚI: base fetch wrapper
│   ├── authApi.js                # ← TẠO MỚI
│   ├── plantApi.js               # ← TẠO MỚI
│   ├── reminderApi.js            # ← TẠO MỚI
│   └── aiApi.js                  # ← TẠO MỚI
│   # commerceApi.js → XÓA
│
├── routes/
│   └── AppRouter.tsx             # Cleanup routes
│
├── data/
│   └── mockData.ts               # Dần dần xóa khi có API thật
│
├── App.tsx
└── index.tsx
```

---

## 2. Vấn đề cần fix ngay (ưu tiên cao)

### 2.1 Hai trang AI trùng nhau
Hiện tại có **2 trang diagnosis**:
- `PlantAnalyze.jsx` → route `/app/my-plants/:id/analyze` (mock đơn giản)
- `AIPlantAnalysis.jsx` → route `/app/ai-analysis` (mock phức tạp hơn, có chat)

**Quyết định:** Giữ `AIPlantAnalysis.jsx`, xóa `PlantAnalyze.jsx`. Sửa link trong `PlantProfile.jsx` trỏ về `/app/ai-analysis`.

### 2.2 CareContext hardcode tasks
`CareContext.jsx` có `DEFAULT_TASKS` với tên cây Monstera, Xương rồng... hardcode. Khi có user thật, tasks này vô nghĩa.

**Fix:** Thêm `fetchTasks(userId)` từ API, fallback về `[]` thay vì `DEFAULT_TASKS`.

### 2.3 Dashboard dùng tên "Sarah"
`Dashboard.jsx` line 13: `Good morning, Sarah! 🌱` – hardcode tên.

**Fix:** Thay bằng `{user?.name || 'there'}` từ auth context.

### 2.4 `data/mockData.ts` 86KB
File này là nguồn dữ liệu của toàn bộ app hiện tại. Cần xóa dần theo từng feature khi backend sẵn sàng.

---

## 3. Auth Guard (chưa có – cần thêm)

Hiện tại `/app/*` routes không có bảo vệ. User chưa login vẫn vào được.

**Thêm `ProtectedRoute` đơn giản:**

```jsx
// routes/ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};
```

Wrap tất cả `/app/*` routes trong `AppRouter.tsx` với `<ProtectedRoute>`.

---

## 4. Services layer (cần tạo mới)

Tạo `services/api.js` làm base, các file còn lại import từ đó:

```js
// services/api.js
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(localStorage.getItem('token')
    ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
    : {}),
});

const handle = async (res) => {
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || res.statusText);
  return res.json();
};

export const get  = (path) => fetch(`${BASE}${path}`, { headers: getHeaders() }).then(handle);
export const post = (path, body) => fetch(`${BASE}${path}`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handle);
export const put  = (path, body) => fetch(`${BASE}${path}`, { method: 'PUT',  headers: getHeaders(), body: JSON.stringify(body) }).then(handle);
export const del  = (path) => fetch(`${BASE}${path}`, { method: 'DELETE', headers: getHeaders() }).then(handle);
```

---

## 5. AI Integration – thay mock bằng Gemini thật

**Trong `AIPlantAnalysis.jsx`, thay `getMockAIResponse()` bằng:**

```js
// services/aiApi.js
import { post } from './api';

export const diagnoseImage = (base64Image) =>
  post('/ai/diagnose', { image: base64Image });

export const chatWithAI = (message, history) =>
  post('/ai/chat', { message, history });
```

Backend nhận request → proxy sang `gemini-1.5-flash` (Vision cho ảnh, Chat cho text).

---

## 6. Reusable components cần tạo

| Component | Dùng ở đâu | Mô tả |
|---|---|---|
| `LoadingSpinner` | Toàn app | Replace hardcode spinners |
| `EmptyState` | MyPlants, Reminders | Trạng thái rỗng nhất quán |
| `PlantCard` | MyPlants, PlantList | Card cây tái sử dụng |
| `ConfirmDialog` | Xóa cây, xóa reminder | Modal xác nhận |

---

## 7. Deployment Strategy

### Hiện tại
- `npm run deploy` → build + push `dist/` lên `gh-pages` branch
- Frontend deploy được **ngay hôm nay** (GitHub Pages miễn phí)

### Backend (khi có)
Gợi ý stack đơn giản nhất cho EXE201:

| Option | Pros | Cons |
|---|---|---|
| **Railway** (Node/Express) | Free tier, deploy từ GitHub | Hết giờ sau 500h/tháng |
| **Render** (Node/Express) | Free tier, sleep sau 15 phút | Cold start chậm |
| **Supabase** | PostgreSQL + Auth có sẵn | Cần học Supabase API |

**Khuyến nghị:** Supabase cho Auth + DB, Railway cho Express backend.

### Biến môi trường cần có

```env
# FE/.env.local
VITE_API_URL=http://localhost:8080/api
VITE_GEMINI_API_KEY=   # KHÔNG để ở FE, để backend giữ
```

---

## 8. Technical Debt Risks

| Risk | Mức độ | Cách xử lý |
|---|---|---|
| `mockData.ts` 86KB không có migration plan | 🔴 Cao | Xóa theo từng feature khi nối API |
| Không có error boundary | 🟡 Trung bình | Thêm `<ErrorBoundary>` ở `App.tsx` |
| Không có loading states nhất quán | 🟡 Trung bình | Tạo `LoadingSpinner` component |
| Tailwind classes inline lẫn lộn với custom CSS | 🟡 Trung bình | Không fix ngay – chỉ document |
| `dangerouslySetInnerHTML` trong `AIPlantAnalysis.jsx` | 🟡 Trung bình | Thay bằng markdown renderer khi có time |
| Không có TypeScript cho pages (đều là `.jsx`) | 🟢 Thấp | Defer – không urgent cho MVP |
