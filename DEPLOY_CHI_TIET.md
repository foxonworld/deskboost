# Hướng dẫn Deploy DeskBoost — Chi tiết từng bước

> Dành cho lần deploy đầu tiên. Đọc hết một bước trước khi làm.

---

## TRƯỚC KHI BẮT ĐẦU — Chuẩn bị tài khoản

Cần có 4 tài khoản (tất cả đều free):

| Dịch vụ | Link đăng ký | Dùng cho |
|---------|-------------|---------|
| GitHub | https://github.com | Lưu code, Render/Vercel kéo từ đây |
| Supabase | https://supabase.com | Database PostgreSQL |
| Render | https://render.com | Chạy Backend .NET |
| Vercel | https://vercel.com | Chạy Frontend React |

> Đăng nhập tất cả trước khi bắt đầu để tránh gián đoạn.

---

## BƯỚC 1 — Kiểm tra máy tính

Mở PowerShell, chạy lần lượt:

```powershell
git --version
```
Phải thấy: `git version 2.x.x` — nếu không có, tải tại https://git-scm.com

```powershell
dotnet --version
```
Phải thấy: `8.x.x` — nếu không có, tải .NET 8 SDK tại https://dotnet.microsoft.com

```powershell
dotnet ef --version
```
Nếu thấy lỗi "command not found", chạy:
```powershell
dotnet tool install --global dotnet-ef
```
Rồi kiểm tra lại: `dotnet ef --version` → phải thấy `Entity Framework Core .NET Command-line Tools 8.x.x`

---

## BƯỚC 2 — Đẩy code lên GitHub

### 2.1 Tạo repo trên GitHub

1. Vào https://github.com → nhấn nút **"New"** (màu xanh, góc trên bên trái)
2. Điền:
   - **Repository name:** `deskboost`
   - **Visibility:** `Private` ← quan trọng, giữ secret an toàn
3. **KHÔNG** tick vào "Add a README file"
4. Nhấn **"Create repository"**
5. GitHub hiện trang mới với URL dạng: `https://github.com/YOUR_USERNAME/deskboost`
   → Copy URL này lại

### 2.2 Push code từ máy lên GitHub

Mở PowerShell tại thư mục gốc dự án:

```powershell
cd d:\DOWLOAD\SU26\EXE201
```

Kiểm tra trạng thái git hiện tại:
```powershell
git status
```

Nếu thấy "not a git repository", khởi tạo:
```powershell
git init
git branch -M main
```

Thêm tất cả file và commit:
```powershell
git add .
git commit -m "chore: initial commit for production deploy"
```

Kết nối với GitHub repo vừa tạo (thay YOUR_USERNAME):
```powershell
git remote add origin https://github.com/YOUR_USERNAME/deskboost.git
git push -u origin main
```

GitHub sẽ hỏi username/password → nhập thông tin GitHub.

> Nếu bị lỗi authentication, dùng Personal Access Token:
> GitHub → Settings → Developer settings → Personal access tokens → Generate new token (classic) → tick "repo" → copy token → dùng token thay cho password.

**Kiểm tra:** Vào `https://github.com/YOUR_USERNAME/deskboost` phải thấy code đã lên.

---

## BƯỚC 3 — Tạo Database trên Supabase

### 3.1 Tạo project

1. Vào https://supabase.com → nhấn **"Start your project"**
2. Đăng nhập bằng GitHub (nhanh nhất)
3. Nhấn **"New project"**
4. Điền:
   - **Name:** `deskboost-prod`
   - **Database Password:** đặt mật khẩu mạnh, ví dụ `DeskBoost@2024!Prod`
     → **COPY LẠI NGAY**, sẽ cần ở bước sau
   - **Region:** `Southeast Asia (Singapore)`
   - **Plan:** Free
5. Nhấn **"Create new project"**
6. Chờ 1–2 phút để Supabase khởi tạo (thấy loading spinner)

### 3.2 Lấy connection string

Sau khi project sẵn sàng:

1. Nhìn menu bên trái → click **"Settings"** (biểu tượng bánh răng)
2. Click **"Database"**
3. Kéo xuống phần **"Connection string"**
4. Chọn tab **"URI"** → **đổi sang tab "Parameters"** để lấy từng phần
   
   Hoặc click tab **"URI"**, copy string, nó có dạng:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```

5. **Chuyển sang format cho .NET** (format khác với URI trên):
   ```
   Host=db.xxxxxxxxxxxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=DeskBoost@2024!Prod;SSL Mode=Require;Trust Server Certificate=true
   ```
   
   Thay:
   - `xxxxxxxxxxxx` = chuỗi random trong URL Supabase của bạn
   - `DeskBoost@2024!Prod` = password bạn đã đặt ở bước 3.1

> Lưu string này vào Notepad — sẽ dùng ở bước 4 và bước 5.

---

## BƯỚC 4 — Chạy Migration để tạo bảng trong Supabase

Mở PowerShell, đi đến thư mục BE:

```powershell
cd d:\DOWLOAD\SU26\EXE201\BE\DeskBoost
```

Set connection string (thay bằng string thật của bạn từ bước 3.2):

```powershell
$env:ConnectionStrings__DefaultConnection = "Host=db.xxxxxxxxxxxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=DeskBoost@2024!Prod;SSL Mode=Require;Trust Server Certificate=true"
```

Chạy migration:

```powershell
dotnet ef database update `
  --project DeskBoost.Infrastructure `
  --startup-project DeskBoost.API
```

Quá trình này mất 30–60 giây. Xem output:
- Các dòng `Applying migration '...'` → đang tạo bảng
- Dòng `Done.` ở cuối → thành công

**Kiểm tra trên Supabase:**
1. Supabase → menu trái → **"Table Editor"**
2. Phải thấy danh sách bảng: `Users`, `Plants`, `PlantSpecies`, `Reminders`, `DiagnosisResults`, `MarketplaceItems`, `Notifications`, v.v.
3. Nếu thấy bảng → migration thành công ✅

> **Nếu lỗi SSL:** Đảm bảo có `;SSL Mode=Require;Trust Server Certificate=true` ở cuối connection string.
> **Nếu lỗi timeout:** Kiểm tra lại host name trong connection string (phần `db.xxxx.supabase.co`).

---

## BƯỚC 5 — Deploy Backend lên Render

### 5.1 Tạo tài khoản và kết nối GitHub

1. Vào https://render.com → nhấn **"Get Started"**
2. Chọn **"Sign in with GitHub"** (nhanh nhất, tự kết nối repo)
3. Authorize Render truy cập GitHub

### 5.2 Tạo Web Service

1. Dashboard Render → nhấn nút **"New +"** (góc trên bên phải)
2. Chọn **"Web Service"**
3. Phần **"Source Code"** → chọn **"Build and deploy from a Git repository"** → nhấn **"Next"**
4. Thấy danh sách repo GitHub → tìm và chọn **"deskboost"**
   - Nếu không thấy: nhấn **"Configure account"** → cho phép Render đọc repo
5. Nhấn **"Connect"**

### 5.3 Điền cấu hình Web Service

Màn hình sẽ hiện form cấu hình:

**Phần Name & Region:**
- **Name:** `deskboost-api`
- **Region:** `Singapore` (gần Supabase nhất)
- **Branch:** `main`

**Phần Runtime:**
- **Runtime:** chọn **"Docker"**
- Sau khi chọn Docker, Render tự tìm Dockerfile trong repo
- **Dockerfile Path:** `./BE/DeskBoost/Dockerfile` ← điền đúng đường dẫn này
- **Docker Context:** `./BE/DeskBoost`

> Nếu không thấy option Docker: kéo xuống phần "Advanced" → tìm "Dockerfile path"

**Phần Plan:**
- Chọn **"Free"**

Nhấn **"Create Web Service"** — Render bắt đầu deploy lần đầu (sẽ fail vì chưa có env vars, không sao).

### 5.4 Set Environment Variables

Sau khi tạo xong Web Service, bạn ở trang dashboard của service:

1. Menu bên trái → click **"Environment"**
2. Thấy bảng "Environment Variables" → nhấn **"Add Environment Variable"**
3. Thêm từng biến (Key = Value), nhấn Add sau mỗi biến:

---

**Tạo Jwt__Key trước** (cần 1 giá trị random mạnh):

Mở PowerShell và chạy:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 48 | ForEach-Object {[char]$_})
```
Copy kết quả (48 ký tự ngẫu nhiên) → dùng làm giá trị cho `Jwt__Key`.

---

Thêm lần lượt 19 biến sau:

| Key | Value |
|-----|-------|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ASPNETCORE_URLS` | `http://+:10000` |
| `ConnectionStrings__DefaultConnection` | `Host=db.xxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=YOUR_PW;SSL Mode=Require;Trust Server Certificate=true` |
| `Cors__AllowedOrigins` | `https://deskboost.io.vn,https://www.deskboost.io.vn` |
| `Jwt__Key` | (48 ký tự random vừa tạo) |
| `Jwt__Issuer` | `DeskBoost` |
| `Jwt__Audience` | `DeskBoostApp` |
| `Jwt__AccessTokenExpiryMinutes` | `15` |
| `Jwt__RefreshTokenExpiryDays` | `7` |
| `Google__ClientId` | (Client ID từ Google Cloud Console) |
| `PlantId__ApiKey` | (API key PlantId) |
| `PlantId__BaseUrl` | `https://api.plant.id/v3` |
| `Gemini__ApiKey` | (API key Gemini) |
| `Gemini__Model` | `gemini-2.5-flash` |
| `Gemini__BaseUrl` | `https://generativelanguage.googleapis.com/v1beta` |
| `Cloudinary__CloudName` | (cloud name) |
| `Cloudinary__ApiKey` | (api key) |
| `Cloudinary__ApiSecret` | (api secret) |
| `Diagnosis__ConfidenceThreshold` | `0.2` |

Sau khi thêm xong tất cả → nhấn **"Save Changes"**.

### 5.5 Trigger deploy lại

1. Menu trái → **"Events"** hoặc **"Deploys"**
2. Nhấn **"Manual Deploy"** → **"Deploy latest commit"**
3. Chờ 3–8 phút (Render build Docker image)

**Theo dõi log:**
1. Menu trái → **"Logs"**
2. Xem log chạy realtime
3. Dấu hiệu thành công:
   ```
   Now listening on: http://[::]:10000
   Application started. Press Ctrl+C to shut down.
   ```
4. Dấu hiệu lỗi: dòng đỏ có chữ `Error` hoặc `Exception`

### 5.6 Kiểm tra BE hoạt động

Copy URL của service (dạng `https://deskboost-api.onrender.com`) → mở tab mới trên trình duyệt:

```
https://deskboost-api.onrender.com/swagger
```

Phải thấy trang Swagger UI với danh sách các endpoint → **BE deploy thành công** ✅

> Nếu thấy "Service Unavailable" hoặc lỗi 502: chờ thêm 1–2 phút (Render đang khởi động), rồi refresh.

---

## BƯỚC 6 — Deploy Frontend lên Vercel

### 6.1 Tạo tài khoản và import project

1. Vào https://vercel.com → nhấn **"Sign Up"**
2. Chọn **"Continue with GitHub"**
3. Authorize Vercel
4. Dashboard Vercel → nhấn **"Add New..."** → **"Project"**
5. Thấy danh sách repo → tìm **"deskboost"** → nhấn **"Import"**

### 6.2 Cấu hình project

Màn hình **"Configure Project"**:

- **Project Name:** `deskboost` (hoặc để mặc định)
- **Framework Preset:** Vercel tự detect là `Vite` ← đúng rồi
- **Root Directory:** nhấn **"Edit"** → nhập `FE` → nhấn **"Continue"**
- **Build Command:** `npm run build` (để mặc định)
- **Output Directory:** `dist` (để mặc định)

### 6.3 Thêm Environment Variables

Vẫn trên màn hình Configure Project, kéo xuống phần **"Environment Variables"**:

- Nhấn **"Add"**
- **Name:** `VITE_API_URL`
- **Value:** `https://api.deskboost.io.vn/api`
  
  > Nếu chưa setup custom domain, tạm thời dùng:
  > `https://deskboost-api.onrender.com/api`
  > (đổi lại sau khi có custom domain)

- Nhấn **"Add"** để xác nhận

### 6.4 Deploy

Nhấn **"Deploy"** → Vercel build và deploy (1–3 phút).

Màn hình loading → khi thành công thấy confetti 🎉 và URL dạng:
```
https://deskboost-xxxx.vercel.app
```

Nhấn **"Continue to Dashboard"** → nhấn URL preview → thấy trang FE → **FE deploy thành công** ✅

### 6.5 Cập nhật CORS trên Render

Bây giờ bạn biết URL Vercel thật. Quay lại Render:

1. Render → service `deskboost-api` → **"Environment"**
2. Tìm biến `Cors__AllowedOrigins`
3. Nhấn icon bút chì (Edit) → cập nhật value:
   ```
   https://deskboost.io.vn,https://www.deskboost.io.vn,https://deskboost-xxxx.vercel.app
   ```
4. **"Save Changes"** → Render tự động redeploy

---

## BƯỚC 7 — Gắn Custom Domain

### 7.1 Custom Domain cho API (api.deskboost.io.vn → Render)

**Trên Render:**
1. Service `deskboost-api` → menu trái → **"Settings"**
2. Kéo xuống phần **"Custom Domains"**
3. Nhấn **"Add Custom Domain"**
4. Nhập: `api.deskboost.io.vn` → nhấn **"Save"**
5. Render hiện thông tin DNS record cần thêm, ghi lại:
   ```
   Type : CNAME
   Name : api
   Value: deskboost-api.onrender.com
   ```

**Tại nơi quản lý domain (thường là nơi bạn mua domain):**
1. Đăng nhập vào trang quản lý domain
2. Tìm phần **"DNS Management"** hoặc **"DNS Records"** hoặc **"Zone Editor"**
3. Nhấn **"Add Record"**
4. Điền:
   - **Type:** `CNAME`
   - **Name/Host:** `api`
   - **Value/Points to:** `deskboost-api.onrender.com`
   - **TTL:** để mặc định (thường 3600)
5. Lưu lại

Chờ 5–30 phút để DNS lan truyền. Kiểm tra:
```
https://api.deskboost.io.vn/swagger
```

### 7.2 Custom Domain cho FE (deskboost.io.vn → Vercel)

**Trên Vercel:**
1. Project `deskboost` → **"Settings"** → **"Domains"**
2. Nhập `deskboost.io.vn` → nhấn **"Add"**
3. Nhập `www.deskboost.io.vn` → nhấn **"Add"**
4. Vercel hiện DNS records cần thêm:
   ```
   Type : A
   Name : @
   Value: 76.76.21.21

   Type : CNAME
   Name : www
   Value: cname.vercel-dns.com
   ```

**Tại nơi quản lý domain:**
1. Thêm record A:
   - **Type:** `A`
   - **Name/Host:** `@` (hoặc để trống, tùy provider)
   - **Value:** `76.76.21.21`
2. Thêm record CNAME:
   - **Type:** `CNAME`
   - **Name/Host:** `www`
   - **Value:** `cname.vercel-dns.com`
3. Lưu lại

Chờ 5–30 phút → kiểm tra `https://deskboost.io.vn`.

### 7.3 Cập nhật VITE_API_URL trên Vercel

Sau khi `api.deskboost.io.vn` hoạt động:

1. Vercel → project → **"Settings"** → **"Environment Variables"**
2. Tìm `VITE_API_URL` → nhấn **"Edit"**
3. Đổi value thành: `https://api.deskboost.io.vn/api`
4. Nhấn **"Save"**
5. Vào **"Deployments"** → nhấn **"..."** trên deploy mới nhất → **"Redeploy"**

### 7.4 Cập nhật Google OAuth (nếu dùng đăng nhập Google)

1. Vào https://console.cloud.google.com
2. Chọn đúng project → **"APIs & Services"** → **"Credentials"**
3. Click vào OAuth 2.0 Client ID đang dùng
4. Phần **"Authorized JavaScript origins"** → thêm:
   ```
   https://deskboost.io.vn
   https://www.deskboost.io.vn
   ```
5. Nhấn **"Save"**

---

## BƯỚC 8 — Chống cold start (Quan trọng!)

Render Free ngủ sau 15 phút không có request → người dùng đầu tiên phải chờ 30–60 giây.

Dùng UptimeRobot để ping định kỳ (free):

1. Vào https://uptimerobot.com → tạo tài khoản free
2. **"Add New Monitor"**
3. Điền:
   - **Monitor Type:** `HTTP(s)`
   - **Friendly Name:** `DeskBoost API Keep-Alive`
   - **URL:** `https://api.deskboost.io.vn/swagger/index.html`
   - **Monitoring Interval:** `14 minutes`
4. Nhấn **"Create Monitor"**

→ UptimeRobot ping API mỗi 14 phút, service luôn thức ✅

---

## BƯỚC 9 — Kiểm tra toàn bộ sau deploy

### 9.1 Test nhanh bằng PowerShell

```powershell
$BASE = "https://api.deskboost.io.vn/api"

# Test 1: Đăng ký
$body = '{"email":"test@deskboost.com","password":"Test1234!","fullName":"Test User"}'
$res = Invoke-WebRequest -Uri "$BASE/auth/register" -Method POST `
  -ContentType "application/json" -Body $body -UseBasicParsing
Write-Host "Register:" $res.StatusCode

# Test 2: Đăng nhập
$body = '{"email":"test@deskboost.com","password":"Test1234!"}'
$res = Invoke-WebRequest -Uri "$BASE/auth/login" -Method POST `
  -ContentType "application/json" -Body $body -UseBasicParsing
$token = ($res.Content | ConvertFrom-Json).accessToken
Write-Host "Login OK, token bắt đầu bằng:" $token.Substring(0,20)

# Test 3: Endpoint có auth
$res = Invoke-WebRequest -Uri "$BASE/plants" -Method GET `
  -Headers @{Authorization = "Bearer $token"} -UseBasicParsing
Write-Host "Plants endpoint:" $res.StatusCode
```

Kết quả mong đợi: StatusCode `200` cho cả 3 test.

### 9.2 Checklist thủ công trên trình duyệt

Mở `https://deskboost.io.vn` và kiểm tra:

```
[ ] Trang chủ load được, không bị trắng trang
[ ] Mở DevTools (F12) → Console → không có lỗi đỏ
[ ] Đăng ký tài khoản mới thành công
[ ] Đăng nhập thành công, vào được dashboard
[ ] Đăng nhập bằng Google hoạt động
[ ] Refresh trang (F5) → không bị 404
[ ] Xem marketplace → có dữ liệu hoặc trang trống (không lỗi)
[ ] Vào My Plants → thêm cây thử
[ ] Upload ảnh → AI chẩn đoán trả về kết quả
[ ] Chat AI → gửi tin nhắn → nhận được trả lời
[ ] Đặt reminder → lưu thành công
[ ] Xem thông báo
```

---

## XỬ LÝ SỰ CỐ THƯỜNG GẶP

### Render build fail — "Dockerfile not found"

Nguyên nhân: Dockerfile path sai trong cấu hình Render.

Fix:
- Render → service → **Settings** → **Build & Deploy**
- **Dockerfile Path:** `./BE/DeskBoost/Dockerfile`
- **Docker Build Context Directory:** `./BE/DeskBoost`
- Nhấn Save → Manual Deploy

### Render build fail — lỗi trong quá trình build

Nguyên nhân: lỗi compile .NET.

Fix: Xem log chi tiết phần "Build logs" trên Render → copy thông báo lỗi → debug.

Test build local trước:
```powershell
cd d:\DOWLOAD\SU26\EXE201\BE\DeskBoost
dotnet build DeskBoost.sln -c Release
```
Sửa hết lỗi local → push lại → Render tự động deploy.

### Render deploy xong nhưng app crash — lỗi DB connection

Nguyên nhân: `ConnectionStrings__DefaultConnection` sai.

Kiểm tra trong Render Logs, tìm dòng:
```
Failed to connect to database
```
hoặc
```
SSL connection is required
```

Fix: Vào Environment → sửa lại connection string → đảm bảo có `;SSL Mode=Require;Trust Server Certificate=true` ở cuối.

### Vercel build fail — "Cannot find module" hoặc TypeScript error

Fix:
```powershell
cd d:\DOWLOAD\SU26\EXE201\FE
npm install
npm run build
```
Xem lỗi → sửa → push lại.

### FE load được nhưng gọi API bị lỗi CORS

Kiểm tra:
1. `Cors__AllowedOrigins` trên Render có chứa domain FE không?
2. Sau khi sửa `Cors__AllowedOrigins`, Render có redeploy không?
3. `VITE_API_URL` trên Vercel có đúng không? (không có trailing slash, đúng https)

Kiểm tra nhanh trong DevTools (F12) → tab **Network** → click vào request lỗi → xem response headers có `Access-Control-Allow-Origin` không.

### DNS chưa hoạt động sau 30 phút

DNS có thể mất đến 24 giờ (hiếm). Kiểm tra tại https://dnschecker.org:
- Nhập `api.deskboost.io.vn` → chọn "CNAME" → nhấn Search
- Phải thấy value trỏ về `deskboost-api.onrender.com`

---

## TỔNG KẾT CÁC URL SAU KHI XONG

| Thứ | URL | Mục đích |
|-----|-----|---------|
| FE | `https://deskboost.io.vn` | Người dùng truy cập |
| FE (www) | `https://www.deskboost.io.vn` | Redirect về trên |
| API | `https://api.deskboost.io.vn/api` | FE gọi BE |
| Swagger | `https://api.deskboost.io.vn/swagger` | Test API thủ công |
| DB | Supabase Dashboard | Xem/quản lý data |
