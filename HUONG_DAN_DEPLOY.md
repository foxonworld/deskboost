# Hướng dẫn Deploy DeskBoost

**Stack:** React (Vite + HashRouter) → Vercel | ASP.NET Core 8 → Render | Supabase PostgreSQL

**Domain mục tiêu:**
- FE : `https://deskboost.io.vn`
- API: `https://api.deskboost.io.vn`

---

## TRẠNG THÁI TỔNG QUAN

| # | Việc | Trạng thái |
|---|------|-----------|
| 1 | Code BE sẵn sàng cho production | ✅ Xong |
| 2 | Code FE sẵn sàng cho Vercel | ✅ Xong |
| 3 | Secret không bị commit lên GitHub | ✅ Xong |
| 4 | Tạo Supabase project + lấy connection string | ⏳ Cần làm |
| 5 | Chạy EF migration lên Supabase | ⏳ Cần làm |
| 6 | Push code lên GitHub | ⏳ Cần làm |
| 7 | Deploy BE lên Render + set env vars | ⏳ Cần làm |
| 8 | Deploy FE lên Vercel + set env vars | ⏳ Cần làm |
| 9 | Thêm DNS record cho api.deskboost.io.vn | ⏳ Cần làm |
| 10 | Thêm DNS record cho deskboost.io.vn | ⏳ Cần làm |
| 11 | Test toàn bộ luồng | ⏳ Cần làm |

---

## PHẦN A — ĐÃ LÀM XONG (không cần chạm vào)

### A1. BE — Program.cs đã fix 3 điều

**File:** `BE/DeskBoost/DeskBoost.API/Program.cs`

```
✅ Swagger luôn bật (cả Production) → test được sau deploy
✅ UseHttpsRedirection chỉ bật ở Development → tránh redirect loop trên Render
✅ CORS đọc từ Cors:AllowedOrigins config → restrict domain production, fallback AllowAnyOrigin khi không set
```

CORS sẽ hoạt động như sau:
- Development (không set env var): `AllowAnyOrigin` → thoải mái dev
- Production (set `Cors__AllowedOrigins` trên Render): chỉ cho phép đúng domain FE

### A2. FE — vite.config.ts đã fix

**File:** `FE/vite.config.ts`

```
✅ base: "/" (từ "/deskboost/") → Vercel serve từ root domain, không phải subfolder
✅ HashRouter đã dùng → refresh trang không bị 404
✅ api.js đã dùng VITE_API_URL → gọi đúng BE theo môi trường
```

### A3. Secret không bị commit

**File:** `BE/DeskBoost/.gitignore` (root)

```
✅ **/appsettings.Development.json → bị exclude, không commit secret thật lên GitHub
✅ appsettings.json chỉ có placeholder → an toàn để public
```

> **Lưu ý:** `appsettings.Development.json` hiện có DB password, PlantId key, Gemini key, Cloudinary secret thật.
> Sau khi deploy production, nên rotate (đổi mới) các key này vì chúng đang được dùng trên dev DB Render cũ.

---

## PHẦN B — CẦN LÀM NGAY (theo thứ tự)

### Bước 1 — Tạo Supabase + lấy connection string

1. Vào [supabase.com](https://supabase.com) → **New project**
2. Đặt tên `deskboost-prod`, chọn region gần nhất (Singapore)
3. Đặt **Database Password** mạnh — lưu lại ngay
4. Vào **Settings → Database → Connection string → URI**
5. Copy string dạng:

```
Host=db.xxxxxxxxxxxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=YOUR_PASSWORD;SSL Mode=Require;Trust Server Certificate=true
```

> Đây là `ConnectionStrings__DefaultConnection` sẽ dùng ở mọi bước tiếp theo.

---

### Bước 2 — Chạy EF migration lên Supabase

Mở PowerShell, chạy trong thư mục dự án:

```powershell
cd d:\DOWLOAD\SU26\EXE201\BE\DeskBoost

# Dán connection string Supabase vào đây
$env:ConnectionStrings__DefaultConnection = "Host=db.hylytnvaaveiimavxeqo.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=YOUR_PW;SSL Mode=Require;Trust Server Certificate=true"

# Cài dotnet-ef nếu chưa có
dotnet tool install --global dotnet-ef

# Chạy migration
dotnet ef database update `
  --project DeskBoost.Infrastructure `
  --startup-project DeskBoost.API
```

**Kết quả mong đợi:** dòng `Done.` — kiểm tra Supabase → Table Editor phải thấy các bảng:
`Users`, `Plants`, `PlantSpecies`, `Reminders`, `DiagnosisResults`, `MarketplaceItems`, `Notifications`, `ChatHistories`, v.v.

---

### Bước 3 — Push code lên GitHub

```powershell
cd d:\DOWLOAD\SU26\EXE201

git add .
git commit -m "chore: prepare for production deploy"
git push origin main
```

> Đảm bảo repo trên GitHub là **private** nếu còn bất kỳ file nào có thể chứa secret.

---

### Bước 4 — Deploy BE lên Render

#### 4a. Tạo Web Service

1. [render.com](https://render.com) → **New → Web Service**
2. Connect GitHub repo → chọn đúng repo
3. Điền cấu hình:

| Trường | Giá trị |
|--------|---------|
| **Root Directory** | `BE/DeskBoost` |
| **Build Command** | `dotnet publish DeskBoost.API/DeskBoost.API.csproj -c Release -o out` |
| **Start Command** | `dotnet out/DeskBoost.API.dll` |
| **Plan** | Free |

> Nếu Render không tự nhận .NET → xem **Phụ lục A** (Dockerfile).

#### 4b. Set Environment Variables

Vào tab **Environment** trên Render, thêm từng biến:

```
ASPNETCORE_ENVIRONMENT          = Production
ASPNETCORE_URLS                 = http://+:10000

ConnectionStrings__DefaultConnection = Host=db.xxx.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=YOUR_PW;SSL Mode=Require;Trust Server Certificate=true

Cors__AllowedOrigins            = https://deskboost.io.vn,https://www.deskboost.io.vn,https://YOUR-VERCEL-APP.vercel.app

Jwt__Key                        = (tạo bên dưới)
Jwt__Issuer                     = DeskBoost
Jwt__Audience                   = DeskBoostApp
Jwt__AccessTokenExpiryMinutes   = 15
Jwt__RefreshTokenExpiryDays     = 7

Google__ClientId                = (Google OAuth Client ID)

PlantId__ApiKey                 = (PlantId key)
PlantId__BaseUrl                = https://api.plant.id/v3

Gemini__ApiKey                  = (Gemini API key)
Gemini__Model                   = gemini-2.5-flash
Gemini__BaseUrl                 = https://generativelanguage.googleapis.com/v1beta

Cloudinary__CloudName           = (cloud name)
Cloudinary__ApiKey              = (api key)
Cloudinary__ApiSecret           = (api secret)

Diagnosis__ConfidenceThreshold  = 0.2
```

> **Tạo Jwt__Key mạnh (PowerShell):**
> ```powershell
> -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 48 | ForEach-Object {[char]$_})
> ```

#### 4c. Kiểm tra deploy thành công

- Chờ 3–5 phút, xem tab **Logs** không có lỗi đỏ
- Mở: `https://<tên-service>.onrender.com/swagger` → phải thấy Swagger UI

---

### Bước 5 — Deploy FE lên Vercel

#### 5a. Tạo project

1. [vercel.com](https://vercel.com) → **Add New → Project**
2. Import GitHub repo
3. Cấu hình:

| Trường | Giá trị |
|--------|---------|
| **Root Directory** | `FE` |
| **Framework Preset** | `Vite` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

#### 5b. Set Environment Variables

Vào **Settings → Environment Variables**:

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_API_URL` | `https://api.deskboost.io.vn/api` | Production |

> Sau khi thêm env var → nhấn **Redeploy**.

#### 5c. Lấy Vercel URL

Sau khi deploy xong, Vercel cấp URL dạng:
```
https://deskboost-xxxx.vercel.app
```
**Quay lại Render, cập nhật** `Cors__AllowedOrigins` để thêm URL này vào:
```
https://deskboost.io.vn,https://www.deskboost.io.vn,https://deskboost-xxxx.vercel.app
```

---

### Bước 6 — Thêm DNS Record

#### 6a. DNS cho API (api.deskboost.io.vn → Render)

1. Render → **Settings → Custom Domains → Add Custom Domain** → nhập `api.deskboost.io.vn`
2. Render hiện record cần thêm, thường là:
   ```
   Type  : CNAME
   Name  : api
   Value : deskboost-api.onrender.com
   ```
3. Vào nơi quản lý domain → thêm CNAME record đó
4. Chờ 5–30 phút → test `https://api.deskboost.io.vn/swagger`

#### 6b. DNS cho FE (deskboost.io.vn → Vercel)

1. Vercel → **Settings → Domains → Add** → thêm `deskboost.io.vn` và `www.deskboost.io.vn`
2. Vercel hiện record cần thêm, thường là:
   ```
   Type  : A
   Name  : @
   Value : 76.76.21.21

   Type  : CNAME
   Name  : www
   Value : cname.vercel-dns.com
   ```
3. Thêm vào nơi quản lý domain
4. Chờ propagate → test `https://deskboost.io.vn`

#### 6c. Cập nhật Google OAuth redirect URI

Sau khi có domain thật, vào [Google Cloud Console](https://console.cloud.google.com):
- **APIs & Services → Credentials → OAuth 2.0 Client ID**
- Thêm vào **Authorized redirect URIs**:
  ```
  https://deskboost.io.vn
  https://www.deskboost.io.vn
  ```

---

### Bước 7 — Chống cold start (Render Free)

Render Free ngủ sau 15 phút không có request → request đầu tiên mất 30–60 giây.

Dùng [UptimeRobot](https://uptimerobot.com) (free):
1. Tạo monitor loại **HTTP(s)**
2. URL: `https://api.deskboost.io.vn/swagger/index.html`
3. Interval: **14 minutes**
4. → Service luôn thức, FE không bị chậm lần đầu

---

### Bước 8 — Test sau khi deploy

#### Smoke test API (PowerShell)

```powershell
$BASE = "https://api.deskboost.io.vn/api"

# Đăng ký
$body = '{"email":"smoketest@test.com","password":"Test1234!","fullName":"Smoke Test"}'
Invoke-WebRequest -Uri "$BASE/auth/register" -Method POST `
  -ContentType "application/json" -Body $body -UseBasicParsing

# Đăng nhập
$body = '{"email":"smoketest@test.com","password":"Test1234!"}'
$res = Invoke-WebRequest -Uri "$BASE/auth/login" -Method POST `
  -ContentType "application/json" -Body $body -UseBasicParsing
$token = ($res.Content | ConvertFrom-Json).accessToken
Write-Host "Token: $token"

# Gọi endpoint có auth
Invoke-WebRequest -Uri "$BASE/plants" -Method GET `
  -Headers @{Authorization = "Bearer $token"} -UseBasicParsing
```

#### Checklist luồng FE

```
[ ] Swagger mở được tại https://api.deskboost.io.vn/swagger
[ ] Đăng ký tài khoản mới
[ ] Đăng nhập / đăng xuất
[ ] Google OAuth login
[ ] Xem marketplace
[ ] Thêm cây vào My Plants
[ ] Đặt nhắc nhở (reminder)
[ ] Upload ảnh + chẩn đoán cây (AI)
[ ] Chat AI
[ ] Xem thông báo
[ ] Refresh trang không bị 404
```

---

## PHẦN C — Xử lý sự cố thường gặp

### BE không start — lỗi `Failed to bind to address`

**Fix:** `ASPNETCORE_URLS=http://+:10000` phải có trong Render env vars.
Nếu vẫn lỗi, xem log Render để biết port chính xác Render đang giao cho service.

### Migration fail — `SSL connection is required`

**Fix:** Thêm vào cuối connection string:
```
;SSL Mode=Require;Trust Server Certificate=true
```

### FE gọi API bị CORS error

**Nguyên nhân thường gặp:**
1. `Cors__AllowedOrigins` chưa có domain FE trong danh sách → thêm vào Render env var
2. `VITE_API_URL` sai hoặc bị trailing slash → kiểm tra Vercel env var
3. Quên Redeploy FE sau khi đổi env var

### FE build fail trên Vercel — TypeScript error

```powershell
cd FE && npm install && npm run build
```
Sửa hết lỗi local rồi mới push.

---

## Phụ lục A — Dockerfile (nếu Render không nhận .NET auto-detect)

Tạo file `BE/DeskBoost/Dockerfile`:

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish DeskBoost.API/DeskBoost.API.csproj -c Release -o /app/out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000
ENTRYPOINT ["dotnet", "DeskBoost.API.dll"]
```

Sau đó trên Render: đổi **Runtime = Docker** (không cần Build/Start command nữa).

---

## Phụ lục B — Tất cả Render Environment Variables

| Biến | Giá trị |
|------|---------|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ASPNETCORE_URLS` | `http://+:10000` |
| `ConnectionStrings__DefaultConnection` | `Host=db.xxx.supabase.co;...` |
| `Cors__AllowedOrigins` | `https://deskboost.io.vn,https://www.deskboost.io.vn,https://xxx.vercel.app` |
| `Jwt__Key` | random 48 chars |
| `Jwt__Issuer` | `DeskBoost` |
| `Jwt__Audience` | `DeskBoostApp` |
| `Jwt__AccessTokenExpiryMinutes` | `15` |
| `Jwt__RefreshTokenExpiryDays` | `7` |
| `Google__ClientId` | từ Google Cloud Console |
| `PlantId__ApiKey` | key thật |
| `PlantId__BaseUrl` | `https://api.plant.id/v3` |
| `Gemini__ApiKey` | key thật |
| `Gemini__Model` | `gemini-2.5-flash` |
| `Gemini__BaseUrl` | `https://generativelanguage.googleapis.com/v1beta` |
| `Cloudinary__CloudName` | cloud name |
| `Cloudinary__ApiKey` | api key |
| `Cloudinary__ApiSecret` | api secret |
| `Diagnosis__ConfidenceThreshold` | `0.2` |
