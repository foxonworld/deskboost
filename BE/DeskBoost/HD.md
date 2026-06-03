**2.**

Mình cần BE hỗ trợ thêm rule AI quota + diagnosis -> chat cho DeskBoost.



Business rule:

\- Chỉ user đã đăng nhập mới dùng AI.

\- Guest/chưa đăng nhập không được dùng AI.

\- “Có cây” = user có ít nhất 1 cây claim/verified từ DeskBoost, không tính cây tự thêm thủ công.

\- User chưa có cây claim/verified:

&#x20; - AI Chat: tối đa 5 câu/ngày.

&#x20; - AI Diagnosis: tối đa 2 lần/ngày.

\- User có cây claim/verified:

&#x20; - AI Chat: tối đa 30 câu/ngày.

&#x20; - AI Diagnosis: tối đa 5 lần/ngày.

\- Quota reset hằng ngày theo timezone VN hoặc server config thống nhất.



BE cần làm:



1\. Thêm endpoint lấy quota hiện tại

GET /api/ai/quota



Response mong muốn:

{

&#x20; "hasVerifiedPlant": false,

&#x20; "chat": {

&#x20;   "limit": 5,

&#x20;   "used": 2,

&#x20;   "remaining": 3,

&#x20;   "resetAt": "2026-06-03T00:00:00+07:00"

&#x20; },

&#x20; "diagnosis": {

&#x20;   "limit": 2,

&#x20;   "used": 1,

&#x20;   "remaining": 1,

&#x20;   "resetAt": "2026-06-03T00:00:00+07:00"

&#x20; }

}



2\. BE enforce quota trong:

POST /api/ai/chat

POST /api/ai/diagnose



Không chỉ trả quota cho FE hiển thị, mà BE phải chặn thật ở API.



Khi hết quota, trả status phù hợp, ví dụ 429, kèm body:

{

&#x20; "message": "Bạn nên chăm sóc 1 cây của DeskBoost để sử dụng đầy đủ AI.",

&#x20; "feature": "chat",

&#x20; "limit": 5,

&#x20; "used": 5,

&#x20; "remaining": 0,

&#x20; "hasVerifiedPlant": false

}



3\. Thêm tracking usage AI theo ngày



Có thể thêm bảng kiểu:

AiUsage

\- Id

\- UserId

\- Feature: "chat" | "diagnosis"

\- PlantId nullable

\- DiagnosisResultId nullable

\- UsedAt



Mỗi lần chat/diagnosis thành công thì ghi 1 usage.

Quota tính theo UserId + Feature + ngày.



4\. Xác định hasVerifiedPlant ở BE



hasVerifiedPlant = user có ít nhất 1 cây claim/verified từ DeskBoost.

Không tính cây user tự add thủ công.



BE tự chọn source đúng theo model hiện tại:

\- PlantClaimCode

\- ClaimedPlantId

\- OwnershipStatus

\- hoặc field verified/claimed hiện có



Nhưng cần đảm bảo FE không tự quyết quota bằng plantContext.



5\. Cho AI Chat không cần chọn cây



POST /api/ai/chat phải support:

{

&#x20; "message": "Cây để bàn nên tưới thế nào?",

&#x20; "plantId": null,

&#x20; "plantContext": null

}



Nếu không có plantId thì AI trả lời plant-care chung, vẫn giới hạn theo quota user.

Nếu có plantId thì validate cây thuộc user như hiện tại.



6\. Diagnosis response cần trả diagnosisId



POST /api/ai/diagnose response cần có id của DiagnosisResult đã lưu, ví dụ:

{

&#x20; "diagnosisId": "...",

&#x20; "plantId": "...",

&#x20; "summary": "...",

&#x20; "recommendations": \[...]

}



7\. Hỗ trợ Diagnosis -> Chat



POST /api/ai/chat nhận thêm diagnosisResultId optional:

{

&#x20; "message": "Tư vấn thêm cho tôi cách xử lý",

&#x20; "plantId": "... optional",

"diagnosisResultId": "... optional",

&#x20; "history": \[]

}



Nếu có diagnosisResultId:

\- BE validate diagnosisResult thuộc user hiện tại hoặc thuộc plant của user.

\- BE lấy kết quả diagnosis từ DB.

\- BE đưa diagnosis context vào system prompt để AI hiểu ảnh vừa phân tích gì.

\- Sau đó trả lời tư vấn tiếp trong cùng flow chat.



8\. Admin/debug không cần làm phức tạp



Trước mắt chỉ cần quota cho user thường + diagnosis/chat integration.

Không cần guest quota.

Không cần chat upload ảnh ở phase này.

Không cần billing/subscription.



Mục tiêu để FE làm được:

\- Hiển thị số lượt AI còn lại.

\- User chưa có cây claim/verified vẫn chat được 5 câu/ngày.

\- User chưa có cây claim/verified vẫn diagnosis được 2 lần/ngày.

\- User có cây claim/verified được 30 chat + 5 diagnosis/ngày.

\- Sau khi diagnosis ảnh xong, FE có nút “Hỏi AI thêm”, chuyển sang AI Chat và AI hiểu kết quả diagnosis vừa rồi.

**3.Tuấn ơi, cần bổ sung thêm chức năng Notification (thông báo admin → user) vào backend:**



1\. Entity mới:



Notification: Id, Title, Body, Type (string: promo/care\_tip/announcement), TargetType (string: all/specific), TargetUserIds (lưu JSON array Guid hoặc null nếu all), CreatedByAdminId (Guid?), CreatedAt, IsActive (bool, để soft-delete)

NotificationRead: Id, NotificationId, UserId, ReadAt — để track user nào đã đọc cái nào

2\. Endpoints cần thêm vào AdminController (\[Authorize(Roles = "ADMIN")]):



POST /api/admin/notifications — tạo/gửi thông báo, body: { title, body, type, targetType, targetUserIds? }

GET /api/admin/notifications — lấy danh sách thông báo đã gửi

DELETE /api/admin/notifications/{id} — soft delete (IsActive = false)

3\. Endpoints mới cho User (authenticated):



GET /api/notifications — lấy danh sách thông báo của user hiện tại (lọc: TargetType = "all" hoặc userId có trong TargetUserIds, IsActive = true), response kèm field isRead: bool

PATCH /api/notifications/{id}/read — đánh dấu đã đọc 1 thông báo

PATCH /api/notifications/read-all — đánh dấu tất cả thông báo của user đó là đã đọc

Response shape gợi ý cho GET /api/notifications:



json

{

&#x20; "items": \[

&#x20;   {

&#x20;     "id": "...",

&#x20;     "title": "Khuyến mãi tháng 6",

&#x20;     "body": "...",

&#x20;     "type": "promo",

&#x20;     "createdAt": "2026-06-03T...",

&#x20;     "isRead": false

&#x20;   }

&#x20; ]

}

Không cần realtime/SignalR, REST polling là đủ. Cảm ơn Tuấn!

