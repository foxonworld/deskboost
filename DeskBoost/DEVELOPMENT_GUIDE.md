# DeskBoost — Development Guide

## Thông tin dự án

| Mục | Giá trị |
|-----|---------|
| Tên | DeskBoost |
| Stack | ASP.NET Core 8, Clean Architecture, PostgreSQL, Redis, Claude API |
| Mục tiêu | MVP ứng dụng chăm sóc cây cảnh để bàn |
| AI Model | claude-sonnet-4-20250514 |

---

## Các loài cây hỗ trợ

Lưu trong bảng `PlantSpecies` (database), Admin có thể thêm mới mà không cần deploy lại:

1. Monstera
2. Dương xỉ khổng tước
3. Anthurium clarinervis
4. Enleo
5. Tổ quạ xước treo

---

## Cấu trúc solution

```
DeskBoost.sln
└── src/
    ├── DeskBoost.Domain/
    │   ├── Entities/
    │   └── Enums/                      # Trống - dùng entity thay enum
    │
    ├── DeskBoost.Application/
    │   ├── Common/Interfaces/
    │   └── Features/
    │
    ├── DeskBoost.Infrastructure/
    │   ├── Persistence/
    │   ├── ExternalServices/
    │   │   ├── Ai/
    │   │   └── Storage/
    │   ├── Identity/
    │   │   └── JwtTokenService.cs
    │   └── DependencyInjection.cs
    │
    └── DeskBoost.API/
        ├── Controllers/
        ├── Middleware/
        ├── appsettings.json
        └── Program.cs
```

### Quy tắc dependency (Clean Architecture)

```
API → Application ← Infrastructure
Domain không depend vào ai cả
```

---

## Entities

### BaseEntity
```csharp
Id: Guid
CreatedAt: DateTime
UpdatedAt: DateTime
```

### PlantSpecies
```csharp
Name: string                  // tên tiếng Anh
VietnameseName: string
Description: string
CareInstructions: string      // inject vào AI system prompt
CommonDiseases: string (JSON) // truyền vào DiagnoseAsync
ImageUrl: string
IsActive: bool
```

### Plant
```csharp
UserId: Guid
PlantSpeciesId: Guid
Name: string
ImageUrl: string
Location: string
WateringCycleDays: int
LastCondition: string
Notes: string
```

### DiagnosisResult
```csharp
PlantId: Guid
PlantSpeciesId: Guid
ImageUrl: string
Condition: string
DiseasesJson: string
CausesJson: string
TreatmentsJson: string
Confidence: double
```

### ChatHistory
```csharp
PlantId: Guid
UserId: Guid
Role: string    // "user" | "assistant"
Content: string
```

---

## Interfaces

---

## AI Integration

### Diagnosis
- Input: `imageUrl`, `speciesName`, `commonDiseases` (JSON string từ PlantSpecies)
- Gửi ảnh + tên loài + bệnh thường gặp tới Claude API
- Output JSON:
  ```json
  {
    "condition": "...",
    "diseases": ["..."],
    "causes": ["..."],
    "treatments": ["..."],
    "confidence": 0.85
  }
  ```

### Chat
- System prompt inject: tên cây, loài, vị trí, chu kỳ tưới, `CareInstructions`, chuẩn đoán gần nhất
- Giữ tối đa **10 tin nhắn** gần nhất trong context (giảm token cost)
- AI chỉ trả lời về cây cảnh — từ chối chủ đề khác (ghi rõ trong system prompt)

---

## Packages

| Project | Package |
|---------|---------|
| Application | MediatR, FluentValidation, AutoMapper |
| Infrastructure | Npgsql.EFCore.PostgreSQL 8.0.10, EFCore.Tools 8.0.10 |
| Infrastructure | StackExchange.Redis, CloudinaryDotNet |
| Infrastructure | FirebaseAdmin, Hangfire, BCrypt.Net-Next |
| API | Microsoft.AspNetCore.Authentication.JwtBearer 8.0.10 |
| API | Swashbuckle.AspNetCore, Serilog.AspNetCore |

---

## Tính năng MVP — theo thứ tự ưu tiên

### Ưu tiên 1 — Core AI (đang build)

- [X] **AI Diagnosis**: upload ảnh cây → Claude API phân tích → trả về tình trạng, bệnh, nguyên nhân, cách xử lý
- [X] **AI Chat**: chọn cây → chat với AI dựa trên thông tin cây + lịch sử chuẩn đoán

### Ưu tiên 2 — Plant Management

- [ ] Thêm / sửa / xóa cây cá nhân
<!-- - [ ] Upload ảnh cây lên Cloudinary -->
- [ ] Xem danh sách cây và trạng thái

### Ưu tiên 3 — Supporting Features

- [ ] Auth: đăng ký, đăng nhập, JWT, phân quyền USER / ADMIN
- [ ] Reminder: nhắc lịch tưới cây, push notification qua Firebase FCM
- [ ] Feedback: thu thập phản hồi người dùng

### Ưu tiên 4 — Admin Dashboard

- [ ] Quản lý user
- [ ] Quản lý cây của user
- [ ] Quản lý PlantSpecies (thêm / sửa / xóa loài cây)
- [ ] Xem lịch sử AI chat và diagnosis
- [ ] Quản lý Marketplace

---

## Checklist triển khai (theo thứ tự)

- [ ] **1. Infrastructure**: `AppDbContext` + EF Configurations cho từng entity
- [ ] **2. Infrastructure**: `ClaudeAiDiagnosisService` — gọi Claude API với ảnh + context loài cây
- [ ] **3. Infrastructure**: `ClaudeAiChatService` — quản lý history, inject system prompt
<!-- - [ ] **5. Infrastructure**: `DependencyInjection.cs` — đăng ký tất cả services -->
- [ ] **6. API**: `appsettings.json` — ConnectionString, JWT, Claude API key, Cloudinary
- [ ] **7. API**: `Program.cs` — middleware pipeline, DI, Swagger, Serilog
- [ ] **8. API**: `AiDiagnosisController`
- [ ] **9. API**: `AiChatController`
- [ ] **10. Migration**: tạo database lần đầu (`dotnet ef migrations add Init`)
- [ ] **11. Seed data**: thêm 5 loài cây mặc định
- [ ] **12. Test**: kiểm tra tất cả endpoints qua Swagger

---

## Ghi chú kỹ thuật quan trọng

### Security
- **Không commit API keys** — lưu trong `appsettings.json` (gitignore) hoặc User Secrets khi dev
- Claude API key, Cloudinary credentials, JWT secret đều phải là environment variable trên production

### EF Core
- Dùng **Fluent API** trong `IEntityTypeConfiguration<T>`, không dùng Data Annotations trên entity
- `CommonDiseases`, `DiseasesJson`, `CausesJson`, `TreatmentsJson` lưu dạng JSON string — serialize/deserialize ở Application layer
- Migration chạy tự động khi startup chỉ trên môi trường Development

### Claude API
- Model ID: `claude-sonnet-4-20250514`
- Diagnosis: sử dụng **vision** (truyền `image_url` trong message content)
- Chat history: chỉ lấy 10 bản ghi mới nhất từ DB trước mỗi lần gọi API để tránh vượt token limit
- System prompt chat phải có dòng: _"Bạn chỉ được phép tư vấn về cây cảnh. Từ chối lịch sự nếu người dùng hỏi chủ đề khác."_
- Parse JSON response từ Claude bằng `JsonSerializer.Deserialize` — wrap trong try/catch vì AI có thể trả về text thay vì JSON

### PlantSpecies là Entity, không phải Enum
- Lý do: Admin có thể thêm loài cây mới mà không cần deploy lại backend
- `CommonDiseases` (JSON array) trong PlantSpecies là input cho AI Diagnosis
- `CareInstructions` trong PlantSpecies được inject vào system prompt của AI Chat

### Clean Architecture — dependency rule
- `Domain` không import gì cả
- `Application` chỉ import `Domain`
- `Infrastructure` import `Application` + `Domain`
- `API` import `Application` + `Infrastructure` (chỉ để đăng ký DI)
- Không được để `Application` biết về EF Core, Claude SDK, hay Cloudinary SDK

### Performance
- Redis cache cho `PlantSpecies` (ít thay đổi, đọc nhiều)
- Hangfire cho background jobs: reminder notification, cleanup old chat history
- Không cache AI responses (mỗi chuẩn đoán là unique)

### Mỗi phase phải pass trước khi sang phase tiếp theo
- Sau bước 5: `dotnet build` toàn solution không có lỗi
- Sau bước 9: Swagger hiển thị đủ endpoints
- Sau bước 11: seed data chạy được, query PlantSpecies trả về 5 loài
- Sau bước 12: AI Diagnosis và AI Chat hoạt động end-to-end
