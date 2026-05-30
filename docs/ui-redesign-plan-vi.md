# DeskBoost UI Redesign Plan

> Tài liệu định hướng redesign giao diện cho DeskBoost MVP. Phạm vi: frontend React/Vite hiện tại, contact-only marketplace, AI plant care, lightweight admin. Không bao gồm code implementation.

## 1. Tổng quan redesign

### 1.1. Mục tiêu redesign

DeskBoost cần chuyển từ cảm giác “plant marketplace MVP” sang “premium SaaS hỗ trợ chăm sóc cây bàn làm việc bằng AI”. Redesign tập trung vào:

- Tăng độ tin cậy khi mentor/user nhìn vào sản phẩm.
- Làm rõ định vị: AI-assisted desk plant care, không phải sàn thương mại điện tử.
- Tạo hệ UI nhất quán để team mở rộng Home, Marketplace, Plant Detail, AI, Admin lâu dài.
- Cải thiện perceived performance bằng loading/empty/error states có chủ đích.
- Chuẩn hóa responsive, accessibility, spacing, typography, component behavior.

### 1.2. Các vấn đề UI hiện tại

| Khu vực          | Vấn đề chính                                         | Tác động                            |
| ---------------- | ---------------------------------------------------- | ----------------------------------- |
| Visual hierarchy | Nhiều section cùng độ nhấn, CTA chưa luôn rõ         | User khó biết hành động chính       |
| Spacing          | Radius, padding, gap, shadow chưa có rule thống nhất | UI thiếu cảm giác hệ thống          |
| Typography       | Trộn tiếng Việt/Anh; nhiều all-caps nhỏ              | Cảm giác chưa mature                |
| Card design      | Home, Marketplace, My Plants dùng card khác nhau     | Khó maintain, thiếu consistency     |
| Plant Detail     | Sale/combo/mua kèm giống ecommerce                   | Lệch product direction contact-only |
| Dashboard        | Có dữ liệu/mockcopy kiểu template                    | Giảm trust                          |
| AI UI            | Functional nhưng chưa có premium AI assistant feel   | AI chưa là điểm khác biệt cảm xúc   |
| Mobile           | Nav/CTA có nguy cơ chồng nhau                        | Tăng friction trên màn hình nhỏ     |

### 1.3. Vì sao cần redesign

DeskBoost là startup MVP cần chứng minh ba điều cùng lúc:

1. Sản phẩm có định vị rõ.
2. UI đủ tin cậy để khách hàng/mentor tin vào chất lượng execution.
3. Kiến trúc frontend đủ dễ mở rộng khi backend, AI, QR/Claim được triển khai sau.

Nếu không redesign có hệ thống, dự án dễ rơi vào tình trạng mỗi page có phong cách riêng, animation rời rạc, card/button lặp lại, khó review chất lượng sau mỗi phase.

### 1.4. Tác động mong muốn tới UX

- User hiểu nhanh: DeskBoost giúp chọn cây, chăm cây, hỏi AI, nhắc lịch.
- Marketplace rõ là “xem giá + liên hệ”, không kỳ vọng cart/checkout.
- AI Chat tạo cảm giác có ngữ cảnh cây thật, không phải chatbot chung chung.
- Plant Detail hỗ trợ ra quyết định bằng care info + verified feedback + contact CTA.
- Mobile flow ít scroll thừa hơn, CTA quan trọng luôn dễ thấy.
- Admin giữ cảm giác lightweight, không flashy.

## 2. Định hướng visual

### 2.1. Phong cách mục tiêu

DeskBoost nên theo hướng:

- Premium SaaS: sạch, có hệ thống, ít noise.
- Modern botanical: xanh thực vật nhưng không “eco-template”.
- Subtle AI-powered: AI hiện diện qua context, insight, guidance; không dùng quá nhiều glow/pulse.
- Startup aesthetic: nhanh, rõ, sắc, có cảm giác shipping-ready.
- Calm productivity: hợp bàn làm việc, không quá vui nhộn.

### 2.2. Benchmark cảm hứng

| Nguồn       | Học gì                                             | Áp dụng cho DeskBoost               |
| ----------- | -------------------------------------------------- | ----------------------------------- |
| Linear      | Typography sắc, hierarchy rõ, density có kiểm soát | Dashboard, AI Chat, Admin           |
| Vercel      | Minimal, contrast tốt, CTA rõ                      | Navbar, Home hero, layout rhythm    |
| Stripe      | Narrative landing, gradient rất tiết chế           | Home, product story, trust sections |
| Supabase    | Green tech identity, developer-grade clarity       | Color system, AI/backend trust cues |
| Arc Browser | Warmth, playful premium, micro-interactions mềm    | Home, onboarding, QR/Claim future   |
| Raycast     | Speed, command-like interactions, crisp panels     | AI dialog, filters, quick actions   |

### 2.3. Visual direction đề xuất

Tên concept nội bộ: **Calm Intelligence for Desk Plants**.

Đặc điểm:

- Nền off-white/soft botanical dark.
- Green dùng làm signal, không phủ toàn bộ UI.
- Card trắng/dark surface với border mảnh, shadow nhẹ.
- Typography ít cấp nhưng rõ: display headline, body readable, metadata nhỏ.
- Imagery cây giữ vai trò cảm xúc chính.
- Motion nhẹ, nhanh, có mục đích.

## 3. Design philosophy

### 3.1. Readability first

- Text phải dễ scan trong 3 giây.
- Mỗi section chỉ có một primary message.
- Metadata nhỏ nhưng không quá nhạt.
- Tránh all-caps dài; chỉ dùng cho label ngắn.

### 3.2. Perceived performance

- Skeleton/loading state nên giống layout thật.
- Trạng thái AI “thinking” cần trấn an user.
- Filter/search nên phản hồi nhanh, không giật layout.
- Page entry animation chỉ hỗ trợ cảm giác mượt, không chặn tương tác.

### 3.3. Minimal nhưng không nhàm chán

Minimal không có nghĩa là trắng trơn. DeskBoost cần:

- Hình ảnh cây chất lượng.
- Border, shadow, gradient nền rất nhẹ.
- Microcopy có tính product.
- Card composition có chiều sâu.

### 3.4. Motion hỗ trợ UX

Motion chỉ nên dùng khi:

- Giải thích thay đổi trạng thái.
- Tạo cảm giác phản hồi cho tương tác.
- Làm rõ thứ tự xuất hiện nội dung.
- Tăng cảm xúc ở khoảnh khắc quan trọng.

Không dùng motion chỉ vì “trông xịn”.

### 3.5. Consistency > flashy animation

Một hệ thống button/card/input nhất quán có giá trị hơn nhiều animation đẹp nhưng rời rạc. Redesign phải ưu tiên component grammar trước khi thêm GSAP.

## 4. Đánh giá UI hiện tại

### 4.1. Visual hierarchy

Hiện tại Home đã có hero rõ nhưng thông điệp còn thiên về bán cây. App pages dùng nhiều tiêu đề lớn, card lớn, badge lớn cùng lúc nên hierarchy bị phẳng. Plant Detail có nhiều block quan trọng cạnh tranh: image, price, rating, combo, feedback, contact.

Cần cải thiện:

- Xác định primary action từng page.
- Tách content theo tầng: headline → support text → primary CTA → secondary metadata.
- Giảm badge/label lặp lại.

### 4.2. Spacing

Spacing hiện có nhiều biến thể: card padding 4/5/6/8, radius 12/16/24/28/32, gap 3/4/5/6/8/10. Điều này tạo cảm giác mỗi page được thiết kế riêng.

Cần cải thiện:

- Dùng spacing scale: 4, 8, 12, 16, 24, 32, 48, 64.
- Card standard: compact, default, feature, hero.
- Section rhythm: mobile 48–64px, desktop 72–96px.

### 4.3. Typography

Manrope phù hợp SaaS nhưng cần discipline hơn:

- H1: ít dùng quá nhiều font-black nếu toàn page đều đậm.
- Body: tăng line-height, giảm uppercase dài.
- Metadata: nhất quán size/weight.
- Ngôn ngữ: chọn tiếng Việt là chính cho user-facing MVP; English chỉ dùng khi là thuật ngữ kỹ thuật hoặc admin nội bộ.

### 4.4. Card design

Card hiện là component quan trọng nhất nhưng chưa có hệ:

- Marketplace card: ảnh, giá, description, contact-only note, tags, CTA.
- Home favorite card: ảnh cao, giá inline.
- MyPlants card: lớn, radius cao, hover scale mạnh.
- Dashboard card: stat cards kiểu template.

Cần một card system chung:

| Card type                | Dùng cho            | Đặc điểm                                     |
| ------------------------ | ------------------- | -------------------------------------------- |
| ProductCard              | Marketplace/Home    | image, title, price, care badge, contact CTA |
| PlantCareCard            | My Plants/Dashboard | nickname, species, status, next care action  |
| InsightCard              | AI/Dashboard        | recommendation, confidence/context, action   |
| FeedbackCard             | Plant Detail/Home   | quote, rating, verified label                |
| AdminRecordCard/TableRow | Admin mobile/table  | compact, no motion mạnh                      |

### 4.5. Navbar/sidebar

Navbar public ổn nhưng app shell có nguy cơ duplicate navigation trên mobile. UserSidebar bottom button tiện nhưng có thể che CTA hoặc input.

Cần cải thiện:

- Public nav: minimal, clear.
- App nav desktop: sidebar ổn, cần active state gọn hơn.
- App nav mobile: một navigation pattern duy nhất. Ưu tiên bottom sheet hoặc compact bottom nav, không đồng thời nhiều menu.

### 4.6. Mobile responsiveness

Các grid responsive cơ bản đã có nhưng trải nghiệm mobile cần design riêng:

- Plant Detail cần sticky contact CTA.
- AI Chat cần selected plant compact selector thay vì aside dài.
- Marketplace filter bar cần ít chiếm height.
- Footer form cần stack rõ, không 2-column trên màn nhỏ.
- Bottom mobile nav phải tránh overlay nội dung cuối page.

### 4.7. Interaction consistency

Hiện có nhiều hover pattern: shadow, scale, border, underline, color, pulse. Nên chuẩn hóa:

- Button: hover shadow nhẹ, active press.
- Card: hover border + image zoom, không scale toàn card mặc định.
- Filters: active indicator rõ, transition nhanh.
- Form: focus ring thống nhất.

### 4.8. Loading states

Có LoadingState/Spinner nhưng nhiều copy còn generic. Premium SaaS cần loading theo ngữ cảnh:

- Marketplace: skeleton product grid.
- AI Chat: thinking bubble.
- Plant Detail feedback: feedback skeleton.
- Dashboard: care summary skeleton.

### 4.9. Empty states

EmptyState hiện hữu nhưng wording “No data found” quá generic. Nên đổi theo ngữ cảnh:

- “Chưa có cây nào trong bộ sưu tập.”
- “Chưa có phản hồi xác minh cho cây này.”
- “Không tìm thấy sản phẩm phù hợp bộ lọc.”
- “Chọn một cây để AI trả lời đúng ngữ cảnh.”

### 4.10. CTA clarity

CTA cần phản ánh đúng scope:

- Marketplace: “Xem chi tiết”, “Liên hệ tư vấn”.
- Plant Detail: “Nhắn Zalo”, “Nhắn Messenger”, kèm note “không thanh toán trong app”.
- AI: “Gửi câu hỏi”, “Chọn cây”.
- Dashboard: “Xem lịch chăm sóc”, “Chẩn đoán cây”.

## 5. Các khu vực cần redesign ưu tiên

### 5.1. Home

| Mục             | Nội dung                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| Vấn đề hiện tại | Hero đẹp nhưng còn generic; chưa nhấn AI/care OS; feature cards khá template                            |
| Mục tiêu        | Định vị DeskBoost là AI-assisted plant care SaaS cho bàn làm việc                                       |
| Hướng cải thiện | Hero narrative mới, visual proof, AI/care workflow, verified feedback, marketplace preview contact-only |

Ưu tiên:

- Headline rõ hơn: “Chăm cây bàn làm việc bằng AI, không cần phức tạp.”
- Floating care card giữ nhưng polish hơn.
- Section rhythm giống SaaS landing: problem → solution → workflow → proof → CTA.
- Giảm cảm giác shop, tăng cảm giác product system.

### 5.2. Marketplace

| Mục             | Nội dung                                                            |
| --------------- | ------------------------------------------------------------------- |
| Vấn đề hiện tại | Filter/card khá dày; note contact-only lặp; card chưa premium       |
| Mục tiêu        | Browse nhanh, hiểu rõ contact-only, không kỳ vọng checkout          |
| Hướng cải thiện | Filter compact, card thống nhất, badge ít, skeleton grid, clear CTA |

Ưu tiên:

- Card gồm: ảnh, category/care tag, tên, giá, short care fit, CTA.
- Contact-only thông báo ở header hoặc banner, không lặp quá nhiều trong từng card.
- Sort/filter motion nhẹ, không reflow giật.

### 5.3. Plant Detail

| Mục             | Nội dung                                                                                                 |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| Vấn đề hiện tại | Sale/combo/mua kèm tạo ecommerce feel; nhiều block cạnh tranh                                            |
| Mục tiêu        | Detail page giúp quyết định liên hệ dựa trên care fit + trust                                            |
| Hướng cải thiện | Contact-first panel, care metrics rõ, feedback trust, recommended care kit nếu cần nhưng không cart-like |

Ưu tiên:

- Bỏ “Frequently Bought Together” kiểu ecommerce; đổi thành “Gợi ý bộ chăm sóc”.
- CTA sticky mobile.
- Feedback section trust-first.
- Gallery có thumbnail thực sự hoặc giảm fake thumbnails.

### 5.4. Dashboard

| Mục             | Nội dung                                                             |
| --------------- | -------------------------------------------------------------------- |
| Vấn đề hiện tại | Mock name/data/template wording; action cards flashy                 |
| Mục tiêu        | Care command center gọn, đáng tin, cá nhân hóa vừa đủ                |
| Hướng cải thiện | Next care task, plant health overview, AI insight, reminder shortcut |

Ưu tiên:

- Không dùng fake “Sarah”.
- Dùng dữ liệu fallback có label MVP/mock rõ nếu cần.
- Stat cards chuyển thành actionable cards.
- Giảm uppercase/scale hover.

### 5.5. AI dialog

| Mục             | Nội dung                                                                               |
| --------------- | -------------------------------------------------------------------------------------- |
| Vấn đề hiện tại | Functional, layout ổn desktop, mobile chưa tối ưu; assistant chưa có brand feel        |
| Mục tiêu        | AI có cảm giác plant-context, calm, trustworthy                                        |
| Hướng cải thiện | Context chip, selected plant compact, message states, thinking motion, safety note mềm |

Ưu tiên:

- Mobile: selected plant dropdown/sheet.
- Assistant bubble có avatar/label “DeskBoost AI”.
- Loading “Đang đọc ngữ cảnh cây…” thay vì “Loading...”.
- Empty prompt suggestions.

### 5.6. QR/Claim flow

QR/Claim là future Phase 3, chưa thuộc MVP hiện tại. Tuy vậy cần chuẩn bị design direction.

| Mục             | Nội dung                                                                    |
| --------------- | --------------------------------------------------------------------------- |
| Vấn đề hiện tại | Chưa implement; có rủi ro scope creep                                       |
| Mục tiêu        | Claim flow tạo khoảnh khắc ownership premium nhưng không khóa AI            |
| Hướng cải thiện | Claim by code/QR, claimed badge, plant identity card, success state tinh tế |

Nguyên tắc:

- Không biến My Plants thành claimed-only.
- Không tạo anti-fraud/enterprise QR system.
- Không chặn AI với user chưa claim.

### 5.7. Admin pages

| Mục             | Nội dung                                                           |
| --------------- | ------------------------------------------------------------------ |
| Vấn đề hiện tại | Lightweight admin cần giữ utilitarian; tránh dashboard enterprise  |
| Mục tiêu        | Quản trị MVP rõ, nhanh, ít motion                                  |
| Hướng cải thiện | Table/card mobile, filters, status chips, empty/error states chuẩn |

Ưu tiên:

- Compact density.
- Motion tối thiểu.
- Clear role/status labels.
- Không thêm analytics phức tạp.

## 6. Component strategy

### 6.1. Reusable component philosophy

- Component sinh ra từ pattern lặp lại thật, không abstraction sớm.
- Ưu tiên props dễ hiểu, ít mode phức tạp.
- UI shared nên phục vụ consistency: card, button, input, badge, state, panel.
- Page vẫn giữ quyền composition.

### 6.2. Card system

Card nên có 4 cấp:

| Level   | Dùng cho                 | Style                                     |
| ------- | ------------------------ | ----------------------------------------- |
| Compact | list/admin/mobile        | padding nhỏ, border mảnh, no heavy shadow |
| Default | product/plant            | image + content, shadow-sm, radius 20–24  |
| Feature | Home/Dashboard insight   | spacing rộng, visual accent nhẹ           |
| Hero    | landing/detail highlight | image lớn, elevated depth, radius 28–32   |

Card interaction:

- Hover: border tint, shadow tăng nhẹ, image zoom 1.03–1.05.
- Active: shadow giảm, translateY(1px).
- Không scale toàn card mặc định.

### 6.3. Button system

| Type        | Dùng cho        | Behavior                                   |
| ----------- | --------------- | ------------------------------------------ |
| Primary     | hành động chính | green bg, white text, clear focus          |
| Secondary   | hành động phụ   | surface bg, border, text strong            |
| Ghost       | nav/filter phụ  | transparent, hover surface                 |
| Destructive | logout/delete   | red text/bg nhẹ                            |
| Channel CTA | Zalo/Messenger  | brand color nhưng layout theo hệ DeskBoost |

Button cần có:

- Disabled state rõ.
- Loading state inline.
- Focus ring accessible.
- Height scale: sm 36, md 44, lg 52.

### 6.4. Modal/panel system

Dùng cho:

- Mobile plant selector trong AI Chat.
- Contact info panel.
- QR/Claim future.
- Admin detail mobile.

Nguyên tắc:

- Focus trap khi có modal thật.
- Escape/close rõ.
- Overlay nhẹ, không blur quá nặng trên mobile yếu.
- Motion open/close ngắn, transform/opacity.

### 6.5. Spacing/token consistency

Token đề xuất:

| Token    | Giá trị gợi ý | Dùng cho              |
| -------- | ------------- | --------------------- |
| space-1  | 4px           | icon gap nhỏ          |
| space-2  | 8px           | compact gap           |
| space-3  | 12px          | chip/button inner     |
| space-4  | 16px          | card compact padding  |
| space-6  | 24px          | card default padding  |
| space-8  | 32px          | section inner         |
| space-12 | 48px          | section mobile        |
| space-16 | 64px          | section desktop       |
| space-24 | 96px          | landing major section |

### 6.6. Responsive strategy

- Mobile-first layout; desktop enhancement.
- Mobile sticky CTA cho Plant Detail.
- AI Chat mobile: context selector compact.
- Marketplace filter: horizontal chips + collapsible advanced controls.
- Admin: cards on mobile, tables on desktop.
- Avoid fixed `h-screen` traps khi có keyboard mobile; dùng min-height linh hoạt khi cần.

## 7. Responsive & accessibility

### 7.1. Mobile-first considerations

- CTA chính nằm trong vùng ngón cái.
- Bottom nav/sheet không che form input/CTA.
- Card grid 1-column phải có density vừa phải.
- Filter/search không chiếm quá 40% viewport height.
- Contact buttons trong Plant Detail cần xuất hiện sớm.

### 7.2. Reduced motion

- Tôn trọng `prefers-reduced-motion`.
- Motion giảm còn opacity hoặc bỏ hẳn transform.
- Không loop animation nếu user chọn reduced motion.
- QR/Claim success vẫn phải hiểu được nếu animation bị tắt.

### 7.3. Keyboard navigation

- Tất cả button/link/input focus rõ.
- Mobile sheet/modal đóng bằng Escape khi desktop keyboard.
- Filter pills dùng button thật.
- AI Chat submit không mất focus bất ngờ.
- Product cards: link/CTA không nested sai semantics.

### 7.4. Contrast/readability

- Green text trên green bg nhạt phải đạt contrast.
- Metadata không dùng slate quá nhạt trên nền light.
- Dark mode cần surface/border/text đủ phân tầng.
- Không truyền thông tin chỉ bằng màu; status cần text/icon.

## 8. Rollout phases

### Phase 1 — Foundation + Home

Mục tiêu: đặt nền hệ thống visual, cải thiện first impression.

Scope:

- Chuẩn hóa design tokens: color, radius, shadow, spacing, typography.
- Chuẩn hóa button/card/input base patterns.
- Redesign Home hero + section rhythm.
- Cải thiện loading/empty copy dùng chung.

Success criteria:

- Home thể hiện rõ AI plant care SaaS.
- Component style có rule rõ.
- Không làm thay đổi route/API architecture.

### Phase 2 — Marketplace + Plant Detail

Mục tiêu: sửa lệch ecommerce, tăng trust/contact clarity.

Scope:

- Marketplace card/filter redesign.
- Plant Detail contact-first layout.
- Mobile sticky contact CTA.
- Feedback trust section polish.
- Loại bỏ pattern sale/combo gây hiểu nhầm hoặc đổi ngôn ngữ sang care kit.

Success criteria:

- User hiểu không có cart/payment.
- CTA liên hệ rõ hơn.
- Mobile detail flow ngắn hơn.

### Phase 3 — AI/QR experience polish

Mục tiêu: biến AI thành điểm khác biệt cảm xúc.

Scope:

- AI Chat layout polish.
- Context selector mobile.
- Thinking/message states.
- AI Diagnosis upload/result reveal.
- QR/Claim design prototype/documentation nếu scope được duyệt.

Success criteria:

- AI flow có ngữ cảnh rõ.
- Motion hỗ trợ cảm giác thông minh, không gây nhiễu.
- QR/Claim không scope creep.

### Phase 4 — Full consistency cleanup

Mục tiêu: hệ UI mature toàn app.

Scope:

- Dashboard cleanup.
- My Plants card alignment.
- Admin lightweight consistency.
- Dark mode pass.
- Accessibility pass.
- Responsive polish toàn route.

Success criteria:

- Các page giống cùng một sản phẩm.
- Không còn spacing/radius/button style tuỳ ý.
- Review checklist đạt trước merge.

## 9. Risks & anti-patterns

| Risk                 | Biểu hiện                                     | Cách tránh                                        |
| -------------------- | --------------------------------------------- | ------------------------------------------------- |
| Over-animation       | Page nào cũng stagger, hover nào cũng scale   | Chỉ animate khoảnh khắc có purpose                |
| Inconsistent spacing | Mỗi component tự padding/radius               | Dùng token + component rules                      |
| Too many colors      | Green, blue, amber, red, gradient quá nhiều   | Green primary + neutrals; semantic colors hạn chế |
| Flashy dashboard     | Glow, pulse, fake metrics                     | Dashboard = command center, không demo toy        |
| CSS/GSAP conflict    | CSS transition và GSAP cùng animate transform | Chọn owner animation theo component               |
| Layout thrashing     | Animate width/height/top/left                 | Chỉ transform/opacity                             |
| Ecommerce drift      | Combo, sale, cart-like copy                   | Contact-only, care support, verified feedback     |
| Scope creep QR       | Anti-fraud, scanner, ownership system         | QR/Claim chỉ Phase 3 future, minimal              |
| Generic SaaS look    | Quá giống template trắng-xanh                 | Botanical imagery + care context + refined copy   |

## 10. Validation checklist

### 10.1. UI review checklist sau mỗi phase

- [ ] Primary CTA của page rõ trong 3 giây.
- [ ] Page không tạo kỳ vọng ngoài MVP scope.
- [ ] Spacing/radius/shadow tuân theo token.
- [ ] Button/card/input dùng pattern thống nhất.
- [ ] Typography có hierarchy rõ, không lạm dụng all-caps.
- [ ] Loading state đúng ngữ cảnh, không chỉ spinner nếu layout phức tạp.
- [ ] Empty state có copy hữu ích và action phù hợp.
- [ ] Error state rõ, không đổ lỗi kỹ thuật cho user.
- [ ] Mobile không bị CTA/nav che nội dung.
- [ ] Keyboard focus nhìn thấy.
- [ ] Contrast đủ ở light/dark mode.
- [ ] Motion nếu có không chặn tương tác.
- [ ] Reduced motion vẫn dùng được.
- [ ] Không thêm dependency khi chưa có approval.
- [ ] Không thay đổi architecture/router/auth nếu chỉ redesign visual.

### 10.2. Product-fit checklist

- [ ] Marketplace vẫn là contact-only.
- [ ] Không có cart/checkout/payment/order/shipping UX.
- [ ] AI vẫn plant-care only.
- [ ] AI không bị khóa cứng bởi claim/QR.
- [ ] My Plants vẫn cho free-add.
- [ ] Admin vẫn lightweight.
- [ ] Verified feedback giữ tone thủ công, đáng tin.

### 10.3. Handoff checklist cho implementation

- [ ] Chọn page/phase cụ thể trước khi code.
- [ ] Xác định component nào tái dùng, component nào page-local.
- [ ] Xác định animation owner: CSS hay GSAP.
- [ ] Xác định mobile behavior trước desktop polish.
- [ ] Chạy check nhỏ nhất sau thay đổi: lint/build/manual smoke.
- [ ] Ghi lại trade-off nếu bỏ qua test/visual smoke.
