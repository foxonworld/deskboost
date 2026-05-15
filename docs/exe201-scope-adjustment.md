# Điều chỉnh phạm vi dự án DeskBoost từ EXE101 sang EXE201

## 1. Tổng quan

Tài liệu này trình bày việc điều chỉnh phạm vi dự án DeskBoost khi chuyển từ giai đoạn EXE101 sang EXE201.

Trong quá trình phát triển ở EXE101, nhóm đã xây dựng nhiều ý tưởng và chức năng mở rộng như:

- thương mại điện tử
- thanh toán
- quản lý đơn hàng
- AI chat mở rộng
- dashboard quản trị lớn
- QR/NFC
- workspace scanner
- analytics nâng cao

Tuy nhiên sau khi review lại toàn bộ codebase và tiến độ hiện tại, nhóm nhận thấy phần lớn các chức năng này mới chỉ dừng ở mức frontend prototype hoặc mock flow, chưa có backend hoàn chỉnh và chưa có luồng vận hành thực tế.

Ngoài ra, nếu tiếp tục giữ toàn bộ scope cũ:

- backend sẽ quá lớn
- complexity tăng cao
- technical debt tăng mạnh
- khó deploy ổn định
- khó hoàn thiện trong phạm vi EXE201

Vì vậy nhóm quyết định điều chỉnh lại hướng phát triển của DeskBoost theo mô hình:

> MVP-first – tập trung vào core value và khả năng triển khai thực tế.

DeskBoost hiện được định hướng là:

> “AI-powered desk plant assistant”

Một trợ lý AI hỗ trợ chăm sóc cây để bàn với trọng tâm là:

- AI Diagnosis
- AI Chat hỗ trợ chăm cây
- quản lý cây cá nhân
- trải nghiệm người dùng
- khả năng deploy và test thực tế

---

# 2. Định hướng mới của DeskBoost trong EXE201

Mục tiêu của phiên bản EXE201 không còn là xây dựng một hệ thống quá lớn với nhiều chức năng phụ, mà tập trung vào:

- hoàn thiện MVP thực tế
- có thể deploy
- có thể test với người dùng thật
- có kiến trúc dễ maintain
- dễ mở rộng backend sau này

Nhóm ưu tiên:

- frontend-first workflow
- incremental backend integration
- giảm scope không cần thiết
- tập trung vào AI feature cốt lõi

---

# 3. Các chức năng được giữ lại trong MVP

## 3.1 Landing Page

- giới thiệu sản phẩm
- giới thiệu tính năng
- onboarding người dùng

---

## 3.2 Authentication

- đăng ký
- đăng nhập
- phân quyền cơ bản:
  - USER
  - ADMIN

Auth vẫn được triển khai theo hướng chuẩn backend security nhưng không phải trọng tâm chính của MVP.

---

## 3.3 Add Plant

Người dùng có thể:

- thêm cây đang chăm sóc
- upload ảnh cây
- lưu thông tin cơ bản

---

## 3.4 My Plants

- quản lý danh sách cây cá nhân
- xem trạng thái cây
- theo dõi thông tin cây

---

# 3.5 AI Plant Diagnosis

Đây là core feature chính của toàn bộ hệ thống.

Người dùng:

- upload ảnh cây
- AI phân tích tình trạng cây
- nhận gợi ý xử lý cơ bản

Chức năng này là điểm khác biệt chính của DeskBoost so với ứng dụng quản lý cây thông thường.

---

# 3.6 AI Chat hỗ trợ chăm cây

AI Chat vẫn được giữ lại nhưng được tối ưu lại phạm vi để phù hợp với MVP.

Flow hoạt động:

- người dùng mở AI Chat
- hệ thống hiển thị danh sách cây người dùng đang có
- người dùng chọn cây
- AI trả lời dựa trên thông tin của cây đó
- lưu lịch sử hội thoại cơ bản

AI Chat:

- sử dụng chung context với AI Diagnosis
- tập trung vào hỗ trợ chăm cây
- không phải chatbot tổng quát

Việc giới hạn AI Chat theo từng cây giúp:

- giảm complexity
- giảm token cost
- tăng tính thực tế
- giúp AI phản hồi đúng ngữ cảnh hơn

---

# 3.7 Reminder

- nhắc lịch chăm sóc cây
- watering/reminder flow cơ bản

---

# 3.8 Feedback

- thu thập phản hồi người dùng
- hỗ trợ user testing và cải thiện sản phẩm

---

# 3.9 Simple Marketplace

Marketplace được giữ ở mức đơn giản:

- hiển thị cây/sản phẩm
- hiển thị giá tham khảo
- liên hệ qua Zalo/Facebook

Hệ thống KHÔNG triển khai:

- cart
- checkout
- payment
- orders
- shipping

Mục tiêu của marketplace hiện tại chỉ là:

- giới thiệu sản phẩm
- tạo trải nghiệm marketplace cơ bản
- tránh complexity của full e-commerce system

---

# 4. Admin Dashboard MVP

Admin Dashboard vẫn được giữ lại nhưng scope được giảm mạnh so với EXE101.

Dashboard hiện tại chỉ đóng vai trò:

> lightweight management dashboard

---

## Các chức năng admin được giữ lại

### 4.1 User Management

- xem danh sách user
- quản lý tài khoản cơ bản

---

### 4.2 User Plant Management

- xem cây của user
- xem trạng thái cây
- quản lý dữ liệu cây cơ bản

---

### 4.3 Marketplace Plant Management

- thêm/sửa/xóa cây marketplace
- quản lý danh sách sản phẩm hiển thị

---

### 4.4 AI Dialog History

- xem lịch sử AI chat/AI diagnosis cơ bản

---

### 4.5 AI Config Status

Admin chỉ:

- xem trạng thái AI config
- xem trạng thái kết nối AI

API key AI sẽ được lưu trong backend `.env` thay vì nhập trực tiếp từ dashboard để:

- giảm rủi ro bảo mật
- giảm complexity backend
- phù hợp hơn với MVP

---

# 5. Các chức năng bị loại bỏ hoặc tạm hoãn

Các chức năng sau được đưa ra khỏi phạm vi EXE201:

- payment
- cart
- checkout
- orders
- shipping
- refund
- advanced analytics
- QR/NFC
- workspace scanner
- enterprise admin system

---

# 6. Lý do điều chỉnh scope

## 6.1 Tập trung vào core value

Nhóm nhận thấy giá trị lớn nhất của DeskBoost nằm ở:

- AI Diagnosis
- AI Chat theo ngữ cảnh cây
- trải nghiệm chăm sóc cây

Không nằm ở full e-commerce platform.

---

## 6.2 Phù hợp nguồn lực hiện tại

Hiện tại:

- frontend chủ yếu do một thành viên phụ trách
- backend đang trong giai đoạn chuẩn bị triển khai

Việc giảm scope giúp:

- tăng khả năng hoàn thiện
- giảm rủi ro trễ tiến độ
- giảm technical debt

---

## 6.3 Giảm complexity backend

Nếu giữ full e-commerce:

- cần payment flow
- order lifecycle
- transaction handling
- shipping logic
- inventory management
- security phức tạp hơn

Điều này vượt quá phạm vi MVP hiện tại.

---

## 6.4 Giảm rủi ro pháp lý

Nếu triển khai hệ thống mua bán/thanh toán thật:

- có thể phát sinh yêu cầu pháp lý
- liên quan giao dịch thương mại điện tử
- liên quan xử lý thanh toán

Do đó nhóm giữ marketplace ở mức giới thiệu sản phẩm và liên hệ thủ công.

---

## 6.5 Dễ deploy và user testing hơn

Scope mới giúp:

- dễ deploy hơn
- dễ demo hơn
- dễ kiểm thử với người dùng thật hơn
- dễ nhận feedback để cải thiện sản phẩm

---

# 7. Kiến trúc hiện tại sau khi tối ưu

Frontend hiện sử dụng:

- React 19
- Vite
- React Router DOM v7

Kiến trúc frontend hiện có:

- centralized API client
- services layer
- frontend auth shell
- ProtectedRoute
- AuthContext
- localStorage persistence

Mock data đã được giảm mạnh và chỉ còn phục vụ fallback MVP.

---

# 8. Hướng backend hiện tại

Backend sẽ được triển khai theo hướng:

- ASP.NET Core Web API
- PostgreSQL

Backend sẽ đảm nhiệm:

- authentication
- quản lý database
- AI proxy requests
- quản lý lịch sử AI
- quản lý dữ liệu marketplace
- quản lý dữ liệu người dùng và cây

Backend sẽ được triển khai sau bởi thành viên backend của nhóm.

---

# 9. Trạng thái hiện tại của dự án

Các milestone đã hoàn thành:

- frontend MVP cleanup
- auth shell frontend
- protected routes
- centralized API client
- services layer
- API contract
- synchronized project documentation

Hiện tại nhóm đang tập trung:

- hoàn thiện UX/UI
- hoàn thiện AI flow
- chuẩn bị backend integration
- hướng tới deployable MVP

---

# 10. Kết luận

Việc điều chỉnh phạm vi DeskBoost từ EXE101 sang EXE201 giúp dự án:

- thực tế hơn
- khả thi hơn
- dễ maintain hơn
- dễ hoàn thiện hơn

Thay vì cố gắng phát triển quá nhiều chức năng cùng lúc, nhóm lựa chọn tập trung vào:

- AI Plant Diagnosis
- AI Chat hỗ trợ chăm cây
- trải nghiệm người dùng
- MVP có thể hoạt động thật

Hướng đi mới giúp DeskBoost phù hợp hơn với mục tiêu của EXE201:
xây dựng một MVP thực tế, có thể deploy, có thể kiểm thử với người dùng thật và có khả năng mở rộng sau khi core feature đã được chứng minh.
