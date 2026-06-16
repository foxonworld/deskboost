# DeskBoost Email Notification Audit

## 1. Hien trang backend notification/email

- Backend da co notification in-app qua `Notification` va `NotificationRead`.
- User doc notification bang `GET /api/notifications`, danh dau da doc bang `PATCH /api/notifications/{id}/read` va `PATCH /api/notifications/read-all`.
- Admin da co flow tao notification trong `AdminController` thong qua `CreateNotificationCommand`.
- Chua co `IEmailService`, `EmailService`, SMTP config, Brevo config, email template, email log, retry, queue, hay worker gui email.
- Chua thay hardcode SMTP/email credential/API key trong backend. `appsettings.json` hien chi co placeholder/local config cho DB, JWT, Google, Cloudinary, Gemini, PlantId.
- Chua co `.env.example`. Config external service hien dang nam trong `appsettings.json` template va Render env.

## 2. Use case nen ho tro truoc

- Phase 1 nen chi them email infrastructure va endpoint/test noi bo cho admin/dev neu can, khong gan vao business flow hien tai.
- Phase 2 nen uu tien forgot password/reset password vi backend da co token va expiry.
- Phase 3 nen them reminder email cho watering/care reminders sau khi co worker chay dinh ky va co co che chong gui trung.
- Phase 4 nen mo rong admin notification: gui in-app truoc, tuy chon gui email cho mot user hoac nhom user sau khi co log/rate limit.
- Email verify account, marketplace/order, AI/plant care recommendation nen de sau vi can preference va rule san pham ro hon.

## 3. Module/file can them hoac sua

- Them `BE/DeskBoost/DeskBoost.Application/Common/Interfaces/IEmailService.cs`.
- Them model request noi bo nhu `EmailMessage`, `EmailRecipient`, `EmailSendResult` trong Application neu can.
- Them `BE/DeskBoost/DeskBoost.Infrastructure/ExternalServices/Email/SmtpEmailService.cs`.
- Them options class `EmailOptions` hoac `SmtpOptions`, bind tu config `Email`/`Smtp`.
- Dang ky service trong `BE/DeskBoost/DeskBoost.Infrastructure/DependencyInjection.cs`.
- Sua `ForgotPasswordCommandHandler` de goi email service va khong tra reset token trong production.
- Them `NotificationService`/`INotificationService` lam layer dieu phoi in-app notification va email, tranh gui email truc tiep tu controller.
- Neu dung Hangfire, cau hinh trong `Program.cs` va Infrastructure; hien package `Hangfire.AspNetCore` da co nhung chua thay duoc wire up.

## 4. De xuat database changes

- Khong can migration cho Phase 1 neu chi gui test email noi bo.
- Auth email co the dung lai `Users.PasswordResetToken` va `Users.PasswordResetTokenExpiresAt`, nhung nen can nhac hash token truoc khi luu DB trong phase hardening.
- Them `Users.EmailVerifiedAt` hoac `Users.IsEmailVerified` khi lam email verify account.
- Them notification preference, vi du `UserNotificationPreferences` gom `UserId`, `EmailEnabled`, `ReminderEmailEnabled`, `MarketingEmailEnabled`, `AdminEmailEnabled`, `CreatedAt`, `UpdatedAt`.
- Them email outbox/log neu can audit va retry: `EmailMessages` gom recipient, subject, template/type, status, provider, error, retry count, sent at, related entity id.
- Reminder email can them truong chong gui trung tot hon `IsSent`, vi reminder lap lai can theo tung occurrence. De xuat `ReminderEmailDeliveries` voi `ReminderId`, `DueAt`, `SentAt`, unique `(ReminderId, DueAt)`.

## 5. Cron/queue cho reminder tuoi cay

- Hien reminder luu trong `Reminders` voi `DueAt`, `RepeatRule`, `Status`, `LastDoneAt`, `IsSent`.
- `MarkReminderDoneCommand` tinh `DueAt` tiep theo cho reminder co lap lai.
- Chua co cron/background worker/queue processor dang chay.
- `IsSent` hien khong du cho reminder lap lai vi sau khi doi `DueAt` can reset trang thai gui theo occurrence.
- Phase 3 nen dung worker dinh ky moi 1-5 phut, quet reminders `Pending`, `IsActive`, `DueAt <= now`, user da bat email reminder, va chua co delivery record cho `ReminderId + DueAt`.
- Neu muon don gian ban dau, dung ASP.NET Core `BackgroundService`; neu can dashboard/retry/persistence, dung Hangfire vi package da co san trong project.

## 6. Env/config can them

De xuat dung namespace config theo .NET style tren Render:

```env
Smtp__Host=smtp-relay.brevo.com
Smtp__Port=587
Smtp__User=
Smtp__Pass=
Email__FromName=DeskBoost
Email__FromAddress=noreply@example.com
Email__AppBaseUrl=https://www.deskboost.io.vn
Email__ResetPasswordPath=/reset-password
Email__Enabled=true
```

- Khong hardcode sender domain/email production trong code.
- Khong commit credential SMTP vao repo.
- Nen tao `.env.example` hoac doc env sample chi gom placeholder.

## 7. Rui ro can chu y

- Forgot password hien co comment production nen gui email, nhung handler van tra reset token; can doi truoc khi production that su dung email.
- Reset token dang luu plain text trong DB; nen hash token neu muon harden.
- Khong duoc leak user ton tai hay khong trong forgot password; flow hien da tra success khi email khong ton tai, can giu hanh vi nay.
- Gui email truc tiep trong request co the lam API cham/loi theo SMTP; nen uu tien outbox/queue cho reminder/admin bulk.
- Admin gui hang loat can rate limit, log, permission check, preview recipient count, va unsubscribe/preference cho email khong bat buoc.
- Brevo free tier phu hop MVP nhung co quota/ngay; can log loi quota va retry co gioi han.
- Reminder theo thoi gian can lam ro timezone. Hien `DueAt` la `DateTime`; nen quy uoc UTC va UI convert local.
- Can tranh gui lap khi worker restart hoac Render scale; unique delivery record la co che an toan nhat.

## 8. Implementation phases nho, an toan

### Phase 1: Email infrastructure

- Them `IEmailService` va `SmtpEmailService` dung Brevo SMTP qua env.
- Bind `Smtp`/`Email` options va validate config khi `Email__Enabled=true`.
- Them test email internal cho admin/dev hoac command/script smoke rieng.
- Khong thay doi forgot password, reminder, notification business flow trong phase nay.

### Phase 2: Auth email

- Sua `ForgotPasswordCommandHandler` de gui reset link qua email.
- Khong tra token trong response production.
- Giu response chung chung de tranh email enumeration.
- Can nhac hash reset token trong DB va giu expiry hien co.

### Phase 3: Plant reminder email

- Chon `BackgroundService` don gian hoac Hangfire neu muon retry/dashboard.
- Them delivery table de chong gui trung theo `ReminderId + DueAt`.
- Worker quet reminder den han, gui email, ghi log/delivery.
- Khi mark done va tinh lich lap lai, delivery cua occurrence moi duoc tao rieng, khong dua vao `IsSent` global.

### Phase 4: Admin email notification

- Mo rong admin notification de co tuy chon `sendEmail`.
- Ho tro gui cho 1 user hoac danh sach user/segment nho.
- Them validation recipient count, rate limit, log status, va error reporting.
- Chua bat bulk marketing neu chua co preference/unsubscribe ro rang.
