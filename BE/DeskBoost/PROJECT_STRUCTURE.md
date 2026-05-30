# Cấu trúc thư mục DeskBoost

Dự án theo kiến trúc **Clean Architecture** với 4 layer chính.

---

## Tổng quan

```
DeskBoost/
├── DeskBoost.sln
├── DeskBoost.API/
├── DeskBoost.Application/
├── DeskBoost.Domain/
└── DeskBoost.Infrastructure/
```

Luồng phụ thuộc: `API → Application → Domain ← Infrastructure`

---

## DeskBoost.API

**Vai trò**: Entry point — nhận và trả HTTP request.

```
DeskBoost.API/
├── Controllers/        # Định nghĩa các API endpoint (GET, POST, PUT, DELETE)
├── Middleware/         # Xử lý cross-cutting concerns: logging, exception handling, auth guard
├── Properties/
│   └── launchSettings.json   # Cấu hình chạy local (port, env variables)
├── Program.cs          # Khởi động app, đăng ký DI, cấu hình pipeline
├── appsettings.json    # Cấu hình runtime (logging, connection strings)
└── appsettings.Development.json  # Override cấu hình cho môi trường dev
```

---

## DeskBoost.Application

**Vai trò**: Business logic — điều phối use case, không chứa framework code.

Dùng pattern **CQRS** (Command/Query Responsibility Segregation) với MediatR.

```
DeskBoost.Application/
├── Common/
│   ├── Behaviors/      # MediatR pipeline behaviors: validation, logging, caching
│   └── Interfaces/     # Interface trừu tượng cho Infrastructure (IRepository, IEmailService...)
└── Features/           # Mỗi folder = 1 tính năng nghiệp vụ
    ├── Auth/           # Đăng ký, đăng nhập, refresh token
    ├── Plants/
    │   ├── Commands/   # Tạo/sửa/xóa cây (thay đổi state)
    │   └── Queries/    # Truy vấn danh sách, chi tiết cây (chỉ đọc)
    ├── Reminders/      # Quản lý nhắc nhở chăm sóc cây
    ├── AiChat/         # Use case chat AI tư vấn cây
    ├── AiDiagnosis/
    │   └── Commands/   # Use case chẩn đoán bệnh cây qua ảnh
    └── Marketplace/    # Logic mua bán, duyệt sản phẩm
```

---

## DeskBoost.Domain

**Vai trò**: Lõi nghiệp vụ thuần — không phụ thuộc vào bất kỳ framework hay thư viện nào.

```
DeskBoost.Domain/
├── Entities/           # Các đối tượng có identity: Plant, User, Reminder, Order...
├── Enums/              # Hằng số kiểu enum: PlantStatus, ReminderType, OrderStatus...
├── ValueObjects/       # Đối tượng không có identity: Address, Money, PlantHealthScore...
└── Exceptions/         # Domain exception riêng: PlantNotFoundException, InvalidReminderException...
```

---

## DeskBoost.Infrastructure

**Vai trò**: Implement các interface từ Application layer — kết nối với thế giới bên ngoài.

```
DeskBoost.Infrastructure/
├── Persistence/
│   ├── Configurations/  # Cấu hình mapping Entity → Database table (EF Core Fluent API)
│   ├── Migrations/      # Lịch sử thay đổi schema database (auto-generated bởi EF Core)
│   └── Repositories/    # Implement IRepository: truy vấn SQL thực tế
├── ExternalServices/
│   ├── Ai/              # Tích hợp AI API (OpenAI, Gemini...) cho chat & chẩn đoán
│   ├── Push/            # Gửi push notification (Firebase FCM...)
│   └── Storage/         # Upload/download ảnh (Azure Blob, Cloudinary...)
├── Identity/            # Cấu hình JWT, refresh token, role management
└── BackgroundJobs/      # Các job chạy nền: gửi nhắc nhở định kỳ, sync dữ liệu...
```

---

## Quy tắc phụ thuộc

| Layer | Được phép import |
|-------|-----------------|
| `Domain` | Không import layer nào |
| `Application` | Chỉ import `Domain` |
| `Infrastructure` | Import `Application` + `Domain` |
| `API` | Import `Application` + `Infrastructure` |

> **Lý do**: `Domain` và `Application` phải độc lập với database, framework, và dịch vụ bên ngoài để dễ test và thay thế.
