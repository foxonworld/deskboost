# Kế hoạch triển khai Backend DeskBoost MVP

## 1. Tổng quan

Kế hoạch này phác thảo các bước triển khai backend cho ứng dụng DeskBoost MVP, tập trung vào việc xây dựng các API cần thiết để hỗ trợ frontend đã được refactor. Backend sẽ được phát triển bằng NestJS, sử dụng Prisma ORM và cơ sở dữ liệu PostgreSQL, tuân thủ chặt chẽ `docs/api-contract.md`.

## 2. Kiến trúc Backend

- **Framework**: NestJS
- **ORM**: Prisma
- **Cơ sở dữ liệu**: PostgreSQL
- **Kiến trúc API**: RESTful API với đường dẫn gốc `/api/v1`
- **Xác thực**: JWT Bearer Token (chỉ access token, không refresh token cho MVP)
- **Cấu trúc Module**:
  - `AuthModule`: Đăng ký, Đăng nhập, Quên mật khẩu.
  - `UserModule`: Quản lý hồ sơ người dùng.
  - `PlantModule`: Quản lý danh mục cây và cây của người dùng.
  - `ReminderModule`: Quản lý nhắc nhở chăm sóc cây.
  - `AiModule`: Proxy cho các dịch vụ AI (chẩn đoán, trò chuyện).
  - `FeedbackModule`: Gửi phản hồi.

### Sơ đồ kiến trúc tổng quan

```mermaid
graph TD
    A[Frontend React/Vite] -->|HTTP/HTTPS| B(NestJS Backend)

    subgraph NestJS Backend
        B --> C[Auth Module]
        B --> D[User Module]
        B --> E[Plant Module]
        B --> F[Reminder Module]
        B --> G[AI Module]
        B --> H[Feedback Module]
        C --> I(Prisma ORM)
        D --> I
        E --> I
        F --> I
        G --> J(Gemini API)
        H --> I
    end

    I --> K[PostgreSQL Database]
```

## 3. Schema Prisma

Dựa trên `docs/api-contract.md`, các model Prisma ban đầu sẽ bao gồm:

```prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String
  username  String?
  avatarUrl String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  UserPlant UserPlant[]
  Reminder  Reminder[]
  Feedback  Feedback[]
}

model Plant {
  id          String      @id @default(uuid())
  name        String
  description String?
  imageUrl    String?
  careGuide   String?
  price       Float?      // For marketplace display
  category    String?
  light       String?
  water       String?
  temperature String?
  humidity    String?
  UserPlant   UserPlant[]
}

model UserPlant {
  id        String    @id @default(uuid())
  userId    String
  plantId   String
  nickname  String?
  addedDate DateTime  @default(now())
  lastCare  DateTime?
  healthStatus String? // e.g., "healthy", "needs_water", "pest_infestation"
  location  String?   // e.g., "living_room", "balcony"
  user      User      @relation(fields: [userId], references: [id])
  plant     Plant     @relation(fields: [plantId], references: [id])
  Reminder  Reminder[]

  @@unique([userId, plantId]) // A user can only have one instance of a specific plant type
}

model Reminder {
  id          String    @id @default(uuid())
  userPlantId String
  type        String    // e.g., "water", "fertilize", "repot"
  scheduledAt DateTime
  completed   Boolean   @default(false)
  notes       String?
  userPlant   UserPlant @relation(fields: [userPlantId], references: [id])
  user        User      @relation(fields: [userId], references: [id]) // Direct link to user for easier queries
  userId      String
}

model Feedback {
  id        String    @id @default(uuid())
  userId    String?   // Optional, if feedback is from a guest
  email     String?   // Optional, if feedback is from a guest
  message   String
  rating    Int?      @min(1) @max(5)
  createdAt DateTime  @default(now())
  user      User?     @relation(fields: [userId], references: [id])
}
```

## 4. Kế hoạch triển khai API

### 4.1. Auth Module (`/api/v1/auth`)

- **`POST /register`**: Đăng ký người dùng mới.
  - Input: `email`, `password`, `username` (optional).
  - Output: `accessToken`.
- **`POST /login`**: Đăng nhập người dùng.
  - Input: `email`, `password`.
  - Output: `accessToken`.
- **`POST /forgot-password`**: Yêu cầu đặt lại mật khẩu (MVP chỉ là placeholder, không gửi email thực tế).
  - Input: `email`.
  - Output: `message` xác nhận.

### 4.2. User Module (`/api/v1/user`)

- **`GET /me`**: Lấy thông tin hồ sơ người dùng hiện tại.
  - Yêu cầu xác thực JWT.
  - Output: `User` object (không bao gồm `password`).
- **`PUT /me`**: Cập nhật thông tin hồ sơ người dùng hiện tại.
  - Yêu cầu xác thực JWT.
  - Input: `username` (optional), `avatarUrl` (optional).
  - Output: `User` object đã cập nhật.

### 4.3. Plant Module (`/api/v1/plants`)

- **`GET /catalog`**: Lấy danh sách tất cả các loại cây trong danh mục.
  - Output: Mảng `Plant` objects.
- **`GET /catalog/:id`**: Lấy chi tiết một loại cây trong danh mục.
  - Output: `Plant` object.
- **`GET /my`**: Lấy danh sách cây của người dùng hiện tại.
  - Yêu cầu xác thực JWT.
  - Output: Mảng `UserPlant` objects.
- **`POST /my`**: Thêm một cây mới vào bộ sưu tập của người dùng.
  - Yêu cầu xác thực JWT.
  - Input: `plantId`, `nickname` (optional), `location` (optional).
  - Output: `UserPlant` object đã tạo.
- **`GET /my/:id`**: Lấy chi tiết một cây cụ thể của người dùng.
  - Yêu cầu xác thực JWT.
  - Output: `UserPlant` object.
- **`PUT /my/:id`**: Cập nhật thông tin một cây của người dùng.
  - Yêu cầu xác thực JWT.
  - Input: `nickname` (optional), `location` (optional), `healthStatus` (optional), `lastCare` (optional).
  - Output: `UserPlant` object đã cập nhật.
- **`DELETE /my/:id`**: Xóa một cây khỏi bộ sưu tập của người dùng.
  - Yêu cầu xác thực JWT.
  - Output: `message` xác nhận.

### 4.4. Reminder Module (`/api/v1/reminders`)

- **`GET /`**: Lấy danh sách tất cả nhắc nhở của người dùng hiện tại.
  - Yêu cầu xác thực JWT.
  - Output: Mảng `Reminder` objects.
- **`POST /`**: Tạo nhắc nhở mới.
  - Yêu cầu xác thực JWT.
  - Input: `userPlantId`, `type`, `scheduledAt`, `notes` (optional).
  - Output: `Reminder` object đã tạo.
- **`PUT /:id`**: Cập nhật nhắc nhở hiện có.
  - Yêu cầu xác thực JWT.
  - Input: `type` (optional), `scheduledAt` (optional), `completed` (optional), `notes` (optional).
  - Output: `Reminder` object đã cập nhật.
- **`DELETE /:id`**: Xóa nhắc nhở.
  - Yêu cầu xác thực JWT.
  - Output: `message` xác nhận.

### 4.5. AI Module (`/api/v1/ai`)

- **`POST /diagnose`**: Gửi hình ảnh cây để chẩn đoán.
  - Input: `image` (base64 hoặc URL), `prompt` (optional).
  - Output: `diagnosisResult` (text).
- **`POST /chat`**: Trò chuyện với AI về cây.
  - Input: `message`, `history` (optional).
  - Output: `aiResponse` (text).

### 4.6. Feedback Module (`/api/v1/feedback`)

- **`POST /`**: Gửi phản hồi.
  - Input: `message`, `rating` (optional), `email` (optional, nếu là khách).
  - Output: `message` xác nhận.

## 5. Xử lý lỗi và Xác thực

- **Xác thực (Validation)**:
  - Sử dụng `class-validator` và `class-transformer` với NestJS Pipes để xác thực dữ liệu đầu vào cho tất cả các DTO (Data Transfer Objects).
  - Đảm bảo các trường bắt buộc, định dạng email, độ dài mật khẩu, v.v.
- **Xử lý lỗi (Error Handling)**:
  - Triển khai Global Exception Filter để bắt và xử lý tất cả các ngoại lệ trong ứng dụng.
  - Trả về định dạng lỗi chuẩn theo `docs/api-contract.md` (ví dụ: `statusCode`, `message`, `error`).
  - Xử lý các lỗi HTTP tiêu chuẩn như 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error.
- **Xác thực JWT (JWT Authentication)**:
  - Sử dụng `@nestjs/passport` và `passport-jwt` để bảo vệ các endpoint yêu cầu xác thực.
  - Triển khai `JwtStrategy` để giải mã và xác thực JWT từ header `Authorization`.
  - Sử dụng `@UseGuards(AuthGuard('jwt'))` trên các controller hoặc route cần bảo vệ.

## 6. Đề xuất thiết lập môi trường ban đầu

1.  **Cài đặt NestJS CLI**:
    ```bash
    npm i -g @nestjs/cli
    ```
2.  **Tạo dự án NestJS mới**:
    ```bash
    nest new deskboost-backend --package-manager npm
    cd deskboost-backend
    ```
3.  **Cài đặt Prisma và PostgreSQL**:
    ```bash
    npm install prisma @prisma/client
    npx prisma init --datasource-provider postgresql
    ```

    - Cập nhật `schema.prisma` với các model đã định nghĩa ở trên.
    - Cấu hình `DATABASE_URL` trong file `.env`.
4.  **Tạo migration ban đầu**:
    ```bash
    npx prisma migrate dev --name init
    ```
5.  **Cài đặt các gói xác thực JWT**:
    ```bash
    npm install @nestjs/jwt passport @nestjs/passport passport-jwt bcrypt
    npm install --save-dev @types/passport-jwt @types/bcrypt
    ```
6.  **Cài đặt các gói xác thực và chuyển đổi dữ liệu**:
    ```bash
    npm install class-validator class-transformer
    ```
7.  **Cấu hình biến môi trường**:
    - Tạo file `.env` ở thư mục gốc của backend.
    - `DATABASE_URL="postgresql://user:password@host:port/database"`
    - `JWT_SECRET="your_super_secret_key"`
    - `GEMINI_API_KEY="your_gemini_api_key"`
    - `PORT=3000`
8.  **Cấu hình CORS**:
    - Trong `main.ts`, cấu hình CORS để cho phép frontend truy cập.

    ```typescript
    // main.ts
    import { NestFactory } from "@nestjs/core";
    import { AppModule } from "./app.module";
    import { ValidationPipe } from "@nestjs/common";

    async function bootstrap() {
      const app = await NestFactory.create(AppModule);
      app.setGlobalPrefix("api/v1"); // Đặt tiền tố API
      app.enableCors({
        origin: "http://localhost:5173", // Thay thế bằng URL frontend của bạn
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
      });
      app.useGlobalPipes(new ValidationPipe()); // Kích hoạt global validation pipe
      await app.listen(process.env.PORT || 3000);
    }
    bootstrap();
    ```

## 7. Các bước triển khai chi tiết (Thứ tự ưu tiên)

1.  **Khởi tạo dự án NestJS và cấu hình cơ bản**:
    - Tạo dự án, cài đặt Prisma, cấu hình PostgreSQL.
    - Tạo `schema.prisma` và chạy `prisma migrate dev`.
    - Cấu hình CORS và Global Prefix (`/api/v1`).
2.  **Triển khai Auth Module**:
    - Tạo `AuthModule`, `AuthService`, `AuthController`.
    - Triển khai `register`, `login`, `forgotPassword` (placeholder).
    - Tích hợp JWT (tạo `JwtStrategy`, `JwtModule`).
    - Sử dụng `bcrypt` để hash mật khẩu.
3.  **Triển khai User Module**:
    - Tạo `UserModule`, `UserService`, `UserController`.
    - Triển khai `getMe`, `updateMe`.
    - Bảo vệ các endpoint bằng JWT Guard.
4.  **Triển khai Plant Module**:
    - Tạo `PlantModule`, `PlantService`, `PlantController`.
    - Triển khai `getCatalogPlants`, `getCatalogPlant`, `getMyPlants`, `createMyPlant`, `getMyPlant`, `updateMyPlant`, `deleteMyPlant`.
    - Bảo vệ các endpoint `my` bằng JWT Guard.
5.  **Triển khai Reminder Module**:
    - Tạo `ReminderModule`, `ReminderService`, `ReminderController`.
    - Triển khai `getReminders`, `createReminder`, `updateReminder`, `deleteReminder`.
    - Bảo vệ các endpoint bằng JWT Guard.
6.  **Triển khai AI Module**:
    - Tạo `AiModule`, `AiService`, `AiController`.
    - Triển khai `diagnosePlant` và `chatWithAI` (gọi đến Gemini API).
    - Bảo vệ các endpoint bằng JWT Guard.
7.  **Triển khai Feedback Module**:
    - Tạo `FeedbackModule`, `FeedbackService`, `FeedbackController`.
    - Triển khai `submitFeedback`.
    - Endpoint này có thể không cần JWT Guard nếu cho phép khách gửi phản hồi.
8.  **Hoàn thiện xử lý lỗi và xác thực**:
    - Đảm bảo tất cả các endpoint đều có validation DTO.
    - Kiểm tra Global Exception Filter hoạt động đúng.
    - Viết unit/integration tests cho các module quan trọng.

## 8. Yêu cầu phê duyệt

Người dùng vui lòng xem xét kế hoạch triển khai backend này. Nếu có bất kỳ thay đổi hoặc bổ sung nào, vui lòng cho biết. Sau khi kế hoạch được phê duyệt, tôi sẽ chuyển sang chế độ `code` để bắt đầu triển khai.
