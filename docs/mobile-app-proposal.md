# Đề xuất hướng làm Mobile App cho DeskBoost EXE201

## Kết luận ngắn

Nên chọn **Capacitor bọc web React/Vite hiện tại thành Android app** làm hướng chính.

Lý do: DeskBoost đã có React/Vite SPA, service layer gọi REST API, auth JWT qua `localStorage`, upload ảnh bằng `FormData`, AI diagnose/chat qua backend, marketplace contact-only và user flows đã có UI. Với mục tiêu EXE201 là **APK demo ổn, ít rủi ro, ra nhanh**, Capacitor cho phép tái sử dụng gần như toàn bộ FE hiện tại, chỉ cần tối ưu mobile viewport, env API URL, routing fallback, camera/gallery, storage/auth và build Android.

Hướng dự phòng: **PWA**. Nếu Android build/Gradle/Capacitor gặp blocker sát deadline, PWA vẫn demo được nhanh qua browser/install prompt, không cần APK. Tuy nhiên PWA yếu hơn yêu cầu chính vì không tạo file APK thật.

Không nên chọn React Native/Expo hoặc Flutter cho MVP APK EXE201 hiện tại vì phải viết lại phần lớn UI/navigation/auth/upload/API binding. Hai hướng đó phù hợp hơn nếu sau này DeskBoost cần mobile app native dài hạn với UX riêng.

## Assumptions

- Mục tiêu ưu tiên là **Android APK cài demo**, không bắt buộc App Store/iOS.
- Backend Render đã hoặc sẽ public HTTPS API ổn định.
- Mobile MVP không cần admin, cart, checkout, payment, shipping, order.
- Mobile app có thể dùng chung API hiện tại, không cần backend riêng cho mobile.
- Login email/password là luồng chính; Google login để sau vì OAuth trong WebView/APK dễ phát sinh cấu hình client/redirect.

## So sánh các hướng

| Hướng | Dễ với project hiện tại | Tạo APK nhanh | Demo EXE201 | Mở rộng sau này | Chi phí | Rủi ro deadline | Nhận định |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Capacitor bọc React/Vite | Rất cao | Cao | Cao | Trung bình-khá | Thấp/miễn phí | Thấp-trung bình | Hợp nhất cho mục tiêu APK nhanh |
| PWA | Rất cao | Không tạo APK thật | Trung bình-khá | Trung bình | Rất thấp | Thấp | Dự phòng tốt, nhưng lệch yêu cầu APK |
| React Native / Expo | Trung bình-thấp | Trung bình | Cao nếu làm xong | Cao | Thấp nếu EAS free đủ, có thể phát sinh | Trung bình-cao | Tốt dài hạn, không tối ưu deadline |
| Flutter | Thấp | Trung bình | Cao nếu làm xong | Cao | Thấp | Cao | Mạnh nhưng viết lại nhiều nhất |

### React Native / Expo

Ưu điểm:

- Native mobile UX tốt hơn web wrap.
- Có Expo ImagePicker, Camera, Notifications, SecureStore, EAS build.
- Mở rộng lâu dài tốt nếu DeskBoost muốn mobile app độc lập.

Nhược điểm với DeskBoost hiện tại:

- Phải viết lại UI route `/app/*`, marketplace, plant detail, AI chat, AI diagnose.
- React Router web, Tailwind CDN, DOM APIs, GSAP, Material Symbols không tái sử dụng trực tiếp.
- Phải làm lại navigation stack, auth persistence, form/upload, image compression.
- Deadline rủi ro hơn Capacitor.

Kết luận: chọn khi có thời gian làm app mobile riêng. Không phải hướng MVP APK nhanh nhất.

### Flutter

Ưu điểm:

- APK ổn định, hiệu năng tốt, UI nhất quán.
- Mở rộng lâu dài tốt, đặc biệt nếu muốn app native nghiêm túc.

Nhược điểm với DeskBoost hiện tại:

- Gần như viết lại từ đầu bằng Dart.
- Không tận dụng FE React/Vite hiện tại.
- Cần dựng lại state, routing, forms, upload, AI chat UI, marketplace UI.
- Chi phí học/build/debug cao hơn trong deadline EXE201.

Kết luận: không phù hợp cho mục tiêu demo nhanh với codebase hiện tại.

### Capacitor bọc web React hiện tại

Ưu điểm:

- Tái sử dụng gần như toàn bộ `FE/`.
- Build được APK bằng Android Studio/Gradle.
- Vẫn dùng `VITE_API_URL`, service layer hiện tại, JWT bearer, `FormData` upload.
- Camera/gallery có thể dùng `<input type="file" accept="image/*" capture>` trước, sau đó thêm Capacitor Camera nếu cần.
- Có thể giữ deploy web Vercel và thêm Android build riêng.

Nhược điểm:

- UX là WebView, không native hoàn toàn.
- Cần kiểm tra routing với `BrowserRouter` trong Android WebView.
- Google login trong WebView có thể khó hơn email/password.
- Cần xử lý external links như Zalo/Facebook/Google Calendar/ICS.
- Notification native cần plugin và backend strategy riêng, nên để sau MVP.

Kết luận: **hướng chính nên chọn**.

### PWA

Ưu điểm:

- Nhanh nhất để có bản install-like trên Android browser.
- Chi phí thấp, không cần Android Studio nếu chỉ demo install web.
- Có thể reuse toàn bộ FE, thêm manifest/service worker nếu cần.

Nhược điểm:

- Không tạo APK thật.
- Push notification/PWA permission trên Android/browser không ổn định bằng native.
- Demo với giảng viên/khách hàng có thể kém thuyết phục hơn file APK.

Kết luận: hướng dự phòng khi APK build gặp blocker.

## Kiểm tra codebase hiện tại

### FE có phù hợp để bọc Capacitor/PWA không?

Phù hợp, nhưng cần chỉnh có kiểm soát.

Điểm phù hợp:

- FE là React 19 + Vite 6 trong `FE/`.
- API boundary đã tập trung ở `FE/services/api.js`.
- Auth token dùng `localStorage` qua `accessToken`, phù hợp WebView MVP.
- Upload ảnh dùng `FormData` trong `FE/services/uploadApi.js`.
- AI diagnose dùng multipart `FormData` trong `FE/services/aiApi.js`.
- User routes đã có: dashboard, my plants, add plant, plant profile, AI chat, AI analysis, reminders, profile.
- Marketplace contact-only không cần cart/payment native phức tạp.
- Responsive web đã được quan tâm trong nhiều page, có thể smoke mobile nhanh.

Điểm cần kiểm tra/chỉnh trước APK:

- `FE/App.tsx` đang dùng `BrowserRouter`, trong khi docs cũ ghi `HashRouter`. Capacitor có thể chạy `BrowserRouter`, nhưng cần test deep link/refresh/fallback trong WebView. Nếu lỗi route khi mở lại app, cân nhắc đổi sang `HashRouter` hoặc cấu hình fallback rõ.
- `FE/index.html` dùng Tailwind CDN, Google Fonts, Material Symbols qua network. APK demo offline sẽ mất style/icon nếu không có mạng. Với demo online thì được; nếu muốn ổn hơn, nên đóng gói Tailwind build/local fonts sau MVP hoặc kiểm tra cache/PWA.
- `localStorage` đủ cho MVP, nhưng dài hạn nên dùng Capacitor Preferences/Secure Storage nếu có token nhạy cảm.
- Google OAuth provider có trong `FE/App.tsx`; mobile MVP nên ẩn/không ưu tiên Google login để tránh WebView OAuth issue.
- External links Zalo/Facebook/Google Calendar cần mở bằng browser/system app, không kẹt trong WebView.
- Các nút nổi `FloatingHomeButton`, `ThemeToggle`, `LanguageToggle` cần kiểm tra không che mobile bottom CTA/input.

### API hiện tại đã đủ cho mobile chưa?

Đủ cho mobile MVP user-focused nếu backend deploy ổn định.

Backend thực tế có các nhóm route chính:

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, forgot/reset password, Google login.
- User: `GET/PUT /api/users/me`.
- Marketplace: `GET /api/marketplace-items`, `GET /api/marketplace-items/{id}`.
- My plants: `GET/POST/PUT/DELETE /api/my-plants`, care profile, claim preview/claim.
- Reminders: list/create/update/done/calendar/delete.
- Upload: `POST /api/upload/image` with `IFormFile file`.
- AI: quota, chat, diagnose, dialogs, diagnosis history.
- Notifications: user/admin notification APIs.
- Admin: summary/users/user-plants/marketplace/AI/notifications.

Rủi ro API cần ghi rõ:

- Docs `api-contract.md` dùng base path `/api/v1`, nhưng backend implementation hiện là `/api/...`. FE default cũng là `/api`. Mobile env phải trỏ đúng, ví dụ `VITE_API_URL=https://<render-host>/api`, không phải `/api/v1` nếu BE chưa đổi.
- Docs cũ có `/plants`, FE thực tế dùng `/marketplace-items` cho marketplace. Mobile dùng service hiện tại thì ổn.
- Auth bootstrap FE gọi `GET /auth/me`, backend có `GET /api/auth/me` và `GET /api/users/me`; đang khớp nếu `VITE_API_URL` kết thúc bằng `/api`.
- CORS cần cho web/Vercel; APK WebView gọi API cross-origin vẫn cần backend accept request. Nếu request từ `capacitor://localhost` hoặc `http://localhost` bị chặn, thêm allowed origin tương ứng.
- AI quota có thể chặn demo nếu user chưa có verified plant hoặc hết lượt. Cần seed demo account/data hoặc có mock/demo mode rõ.

## Mobile MVP nên đưa vào

Ưu tiên các feature user thấy giá trị ngay:

1. Login/register email/password.
2. Home ngắn hoặc chuyển thẳng user dashboard sau login.
3. Marketplace list/detail contact-only.
4. My Plants list/add/edit/detail.
5. Upload ảnh cây.
6. AI plant diagnosis bằng ảnh.
7. AI chat theo context cây.
8. Reminder list/create/mark done + Google Calendar/ICS export nếu link hoạt động tốt.
9. Profile/logout.
10. Basic notification bell/list nếu API ổn; không bắt native push trong MVP.

## Nên giữ ở web/admin, không đưa vào mobile MVP

- Admin dashboard, users, plant inventory, marketplace CRUD, feedback verification, AI admin dialogs/config.
- Notification admin send/delete.
- QR/claim nâng cao nếu chưa cần demo.
- Cart/checkout/payment/order/shipping: vẫn out-of-scope.
- Raw AI config/API key UI: không đưa vào FE/mobile.
- Complex analytics/enterprise admin.
- Native push notification/reminder scheduler: để Phase sau nếu cần.
- Google OAuth mobile: để sau MVP APK, trừ khi có thời gian cấu hình/test kỹ.

## Hướng chính

Chọn **Capacitor + Android APK từ `FE/` hiện tại**.

Chiến lược:

- Giữ web app hiện tại là source chính.
- Thêm Capacitor ở `FE/` hoặc wrapper workspace riêng trỏ vào `FE/dist`.
- Build web bằng `npm run build`, sau đó `npx cap sync android`.
- Android app dùng API Render qua `VITE_API_URL=https://<render-api-host>/api`.
- Demo account/data được seed sẵn để AI/reminder/my-plants chạy ổn.
- Tối ưu tối thiểu UI mobile cho các route user MVP, không redesign toàn app.

## Hướng dự phòng

Chọn **PWA installable trên domain `deskboost.io.vn` hoặc Vercel URL**.

Chiến lược dự phòng:

- Thêm manifest, icons, theme color, basic service worker nếu cần.
- Deploy FE Vercel với API Render ổn định.
- Demo bằng Chrome Android: Add to Home Screen.
- Nếu vẫn cần APK nhưng Capacitor lỗi, có thể dùng Trusted Web Activity/Bubblewrap sau, nhưng đó là nhánh riêng và vẫn cần Android signing.

## Rủi ro chính

| Rủi ro | Mức | Cách giảm |
| --- | --- | --- |
| Backend route/base path lệch `/api` vs `/api/v1` | Cao | Chốt `VITE_API_URL` theo backend thực tế, smoke login/API trước build APK |
| `BrowserRouter` lỗi route trong WebView | Trung bình | Test APK route refresh/back; nếu lỗi, đổi sang `HashRouter` hoặc cấu hình fallback |
| Tailwind CDN/fonts/icons cần internet | Trung bình | Demo online; dài hạn build Tailwind/local assets |
| Google login WebView/OAuth | Trung bình-cao | MVP dùng email/password |
| CORS với `capacitor://localhost` | Trung bình | Thêm origin vào `Cors:AllowedOrigins`, test API từ APK |
| Upload/camera trong WebView | Trung bình | Test file picker Android; nếu yếu, dùng Capacitor Camera plugin |
| AI quota/demo account hết lượt | Trung bình | Seed account demo, reset quota, chuẩn bị fallback script/data |
| External links mở trong WebView | Thấp-trung bình | Dùng Capacitor Browser/App Launcher cho Zalo/Facebook/Calendar nếu cần |
| Native push/reminder kỳ vọng quá cao | Trung bình | MVP dùng in-app + Google Calendar/ICS, không hứa push |

## Roadmap theo phase

### Phase 0: Kiểm tra điều kiện

Mục tiêu: chứng minh web app + backend chạy được qua mobile-like environment trước khi thêm native wrapper.

Việc cần làm:

- Chốt API production URL Render: `https://<render-host>/api` hoặc `/api/v1` nếu backend đổi.
- Kiểm tra CORS cho Vercel domain, `capacitor://localhost`, `http://localhost`.
- Build FE: `cd FE && npm run build`.
- Smoke web mobile viewport: login, dashboard, marketplace, my plants, upload, AI chat, AI diagnose, reminders.
- Chuẩn bị demo account USER, ít nhất 1 cây, 1 reminder, AI quota còn lượt.
- Quyết định Google login: tạm ẩn/không dùng trong mobile MVP.

Verify:

- `npm run lint` pass.
- `npm run build` pass.
- Login bằng API production thành công.
- Ảnh upload/AI diagnose thành công trên browser mobile viewport.

### Phase 1: Mobile MVP

Mục tiêu: app web hiện tại chạy gọn trên màn hình Android, chỉ tập trung user flows.

Việc cần làm:

- Tạo cấu hình mobile env, ví dụ `.env.mobile` hoặc mode build mobile.
- Đặt `VITE_API_URL` đúng backend Render.
- Giữ mock flags `false` cho API thật; chỉ bật mock nếu demo backend chưa ổn.
- Tối ưu route user: login/register, marketplace, plant detail, dashboard, my plants, add/edit, AI chat, AI analysis, reminders, profile.
- Ẩn hoặc không expose admin routes trong mobile navigation.
- Kiểm tra layout mobile: floating buttons, bottom CTA, chat input, image picker, long text, dark mode.
- Đảm bảo logout/401 clear token ổn.

Verify:

- Smoke từng route user trên 360x800 và 390x844.
- Upload image từ file picker hoạt động.
- AI chat/diagnose trả response thật hoặc fallback demo có chủ đích.
- Back button Android không làm kẹt app.

### Phase 2: Build APK

Mục tiêu: tạo được APK debug/release để cài Android demo.

Việc cần làm:

- Thêm Capacitor dependencies và config.
- App id đề xuất: `vn.deskboost.app` hoặc `io.deskboost.app`.
- App name: `DeskBoost`.
- Android project trong `FE/android` nếu Capacitor đặt trong FE.
- Build FE production mobile.
- Sync Capacitor Android.
- Build APK debug trước, release sau nếu cần ký.
- Test cài APK trên ít nhất 1 máy Android thật.

Verify:

- APK cài được.
- App mở vào đúng màn hình.
- Login gọi được API Render.
- Upload ảnh hoạt động.
- AI diagnose/chat hoạt động.
- External contact links mở được.

### Phase 3: Polish/demo

Mục tiêu: demo mượt, giảm lỗi gây mất niềm tin.

Việc cần làm:

- Thêm app icon/splash screen cơ bản.
- Tối ưu loading/error tiếng Việt cho mobile.
- Chuẩn bị demo script 5-7 phút.
- Seed dữ liệu đẹp: marketplace items, my plants, reminders, AI history.
- Kiểm tra mạng yếu: app báo lỗi dễ hiểu, không crash.
- Cân nhắc Capacitor Camera plugin nếu file picker không đủ tốt.
- Nếu cần reminder demo, dùng Google Calendar/ICS thay vì native push.

Verify:

- Demo script chạy liên tục không cần reset app.
- Logout/login lại ổn.
- Reopen app vẫn giữ session hoặc yêu cầu login rõ ràng.
- Không có trang admin/lỗi route lộ ra trong mobile flow chính.

## Cấu trúc thư mục đề xuất

Hướng ít xáo trộn nhất: đặt Capacitor trong `FE/`.

```text
deskboost/
  FE/
    android/                    # generated by Capacitor, không sửa tay nhiều
    dist/                       # Vite build output
    capacitor.config.ts         # Capacitor app config
    package.json                # thêm script mobile/android
    .env.mobile                 # API URL + mock flags cho mobile build nếu dùng
    src/current structure...     # hiện project đang ở root FE, giữ nguyên nếu chưa refactor
  BE/
    DeskBoost/
      DeskBoost.API/
      DeskBoost.Application/
      DeskBoost.Infrastructure/
      DeskBoost.Domain/
  docs/
    mobile-app-proposal.md
```

Scripts gợi ý sau khi implement:

```json
{
  "build:mobile": "vite build --mode mobile",
  "cap:sync": "cap sync android",
  "android:open": "cap open android"
}
```

Nếu muốn tách sạch hơn về sau:

```text
deskboost/
  apps/
    web/        # migrate từ FE, chỉ làm nếu có thời gian
    mobile/     # React Native/Expo hoặc Capacitor wrapper riêng sau này
  BE/
  docs/
```

Không khuyến nghị migrate monorepo trong MVP vì tăng rủi ro deadline.

## Checklist kỹ thuật

### Env API URL

- [ ] Chốt backend production HTTPS URL.
- [ ] Mobile build dùng `VITE_API_URL=https://<render-host>/api` theo backend hiện tại.
- [ ] Không để API key AI trong frontend env.
- [ ] Mock flags rõ ràng: `VITE_USE_MOCK_AI=false`, `VITE_USE_MOCK_ADMIN=true/false` tùy demo.
- [ ] CORS backend allow Vercel/domain và Capacitor origin nếu cần.

### Auth token

- [ ] Email/password login là primary mobile flow.
- [ ] `accessToken` lưu/đọc ổn trong `localStorage` WebView.
- [ ] 401 clear auth và redirect login.
- [ ] Demo account có role `USER`.
- [ ] Không phụ thuộc Google login trong APK MVP.
- [ ] Dài hạn: cân nhắc Capacitor Preferences/Secure Storage.

### Routing

- [ ] Test `BrowserRouter` trong APK: direct route, back, reload/reopen.
- [ ] Nếu lỗi, đổi sang `HashRouter` hoặc cấu hình fallback.
- [ ] Mobile nav chỉ expose user routes cần demo.
- [ ] Admin routes giữ web/admin, không đưa vào mobile menu.
- [ ] Android hardware back không phá flow login/chat/form.

### Image upload

- [ ] Test `<input type="file">` trên Android WebView.
- [ ] Kiểm tra camera/gallery permission.
- [ ] `uploadApi.js` compress ảnh không crash với ảnh lớn.
- [ ] `POST /api/upload/image` trả `url/imageUrl` ổn.
- [ ] Nếu file picker yếu, dùng `@capacitor/camera` ở Phase 3.

### AI analyze

- [ ] `POST /api/ai/diagnose` nhận multipart field `Image` như FE đang gửi.
- [ ] AI quota còn lượt cho demo account.
- [ ] Diagnose có loading/error rõ.
- [ ] Chat gửi `plantId`, `history`, `plantContext` ổn.
- [ ] Không gọi Gemini/OpenAI trực tiếp từ FE/mobile.
- [ ] Chuẩn bị fallback/demo note nếu backend AI tạm lỗi.

### Notification/reminder

- [ ] MVP dùng in-app reminders + Google Calendar/ICS.
- [ ] `GET/POST/PUT/DELETE /api/reminders` hoạt động.
- [ ] `PUT /api/reminders/{id}/done` hoạt động.
- [ ] Calendar export link mở external browser/calendar.
- [ ] Không build native push trong MVP trừ khi có thời gian riêng.
- [ ] Nếu dùng notification list, test `/api/notifications` nhưng không coi là blocker chính.

### Build APK

- [ ] Cài Android Studio/JDK/Gradle phù hợp.
- [ ] Add Capacitor Android.
- [ ] App id/name đúng.
- [ ] `npm run build:mobile` pass.
- [ ] `npx cap sync android` pass.
- [ ] Build debug APK pass.
- [ ] Cài APK trên Android thật.
- [ ] Test full demo flow bằng API production.
- [ ] Nếu cần release APK, tạo keystore và lưu riêng, không commit secret.

## Roadmap ngắn gọn

1. **Ngày 1:** Phase 0, chốt API URL/CORS, smoke mobile web, demo account/data.
2. **Ngày 2:** Phase 1, tối ưu mobile MVP routes, tắt/ẩn phần rủi ro như Google/admin nav.
3. **Ngày 3:** Phase 2, thêm Capacitor, build APK debug, test máy thật.
4. **Ngày 4:** Phase 3, icon/splash, polish lỗi mobile, chuẩn bị script demo.

## Prompt implement gợi ý sau tài liệu này

```text
Đọc docs/mobile-app-proposal.md. Triển khai Phase 0 + Phase 1 cho mobile MVP theo hướng Capacitor, nhưng trước khi thêm dependency hãy kiểm tra FE build/API/routing/mobile smoke. Giữ diff nhỏ, không đụng admin/backend nếu không cần. Sau đó báo checklist còn lại để build APK.
```

