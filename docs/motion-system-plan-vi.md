# DeskBoost Motion System Plan

> Tài liệu định hướng motion system cho DeskBoost frontend React/Vite. Phạm vi: motion planning, GSAP usage guidelines, rollout strategy. Không bao gồm code implementation.

## 1. Motion philosophy

### 1.1. Motion phục vụ UX

Motion trong DeskBoost không phải decoration. Motion phải giúp user:

- Hiểu nội dung vừa xuất hiện từ đâu.
- Nhận biết trạng thái đã thay đổi.
- Cảm thấy app phản hồi nhanh và có chủ đích.
- Tin rằng AI đang xử lý ngữ cảnh, không bị treo.
- Trải nghiệm các khoảnh khắc quan trọng như onboarding, claim, AI response mượt hơn.

Nếu animation không giải thích trạng thái hoặc tăng clarity, không nên thêm.

### 1.2. Subtle > flashy

DeskBoost là premium SaaS botanical/AI product, không phải game hoặc portfolio demo. Chuyển động nên:

- Ngắn.
- Mềm.
- Có kiểm soát.
- Không lặp liên tục.
- Không làm user chờ.

Chất lượng motion đến từ timing, easing, sequencing; không đến từ số lượng hiệu ứng.

### 1.3. Animation phải có purpose

Mỗi animation cần thuộc ít nhất một purpose:

| Purpose     | Ví dụ                                            |
| ----------- | ------------------------------------------------ |
| Orientation | Page/section reveal để user hiểu thứ tự đọc      |
| Feedback    | Button press, filter active state, checkbox done |
| Continuity  | Card list thay đổi khi filter/sort               |
| Status      | AI thinking, upload analyzing, QR validating     |
| Delight     | Claim success, hero first impression             |

### 1.4. Tránh distracting motion

Không dùng:

- Loop pulse liên tục cho nhiều badge.
- Card scale mạnh trên toàn grid.
- Parallax nặng trên mobile.
- Route transition dài.
- Animation replay mỗi lần state nhỏ thay đổi.

## 2. GSAP integration architecture

### 2.1. Vì sao chọn GSAP

GSAP phù hợp DeskBoost vì dependency đã có sẵn trong frontend và xử lý tốt các animation có sequencing tinh tế:

- Hero stagger nhiều element.
- Timeline reveal có kiểm soát.
- AI dialog/message transition.
- QR/Claim success sequence.
- Cleanup tốt khi dùng đúng với React.

Tuy nhiên GSAP không nên thay thế mọi CSS transition. CSS vẫn phù hợp cho hover/focus/active đơn giản.

### 2.2. Role của `@gsap/react`

`@gsap/react` nên là integration layer chính giữa React và GSAP:

- Dùng `useGSAP` để tạo timeline trong lifecycle an toàn.
- Tự động cleanup animation khi component unmount hoặc dependencies đổi.
- Scope selectors vào container ref, tránh ảnh hưởng global DOM.
- Hỗ trợ `contextSafe` cho event handlers cần gọi GSAP sau render.

### 2.3. Pattern sử dụng `useGSAP`

Pattern khuyến nghị ở mức kiến trúc:

1. Component có một root ref làm scope.
2. `useGSAP` chỉ query selector bên trong scope đó.
3. Timeline chỉ animate element có class/data attribute dành riêng cho motion.
4. Dependencies rõ ràng; không dùng object/array unstable làm dependency nếu không cần.
5. Cleanup dựa vào GSAP context, không tự quản timeline rời rạc nếu không cần.

Quy ước đặt selector:

| Selector type       | Mục đích                   | Ví dụ tên                          |
| ------------------- | -------------------------- | ---------------------------------- |
| `data-motion`       | Element tham gia animation | `data-motion="hero-title"`         |
| `data-motion-group` | Nhóm stagger               | `data-motion-group="feature-card"` |
| local class         | Khi cần CSS + motion       | `motion-card`                      |

Tránh global selector như `.card`, `.button`, `img`.

### 2.4. Cleanup strategy

Mọi animation tạo trong React phải có cleanup rõ:

- Timeline tạo trong `useGSAP` thuộc GSAP context.
- Event-based animation dùng `contextSafe`.
- Không lưu timeline global trừ khi có motion provider được thiết kế riêng.
- Khi component unmount, animation phải bị revert/kill.
- Không tạo timeline mới ở mỗi render.

### 2.5. Scoped selectors

Scoped selector là bắt buộc cho maintainability:

- Mỗi page/section animation có ref riêng.
- Selector chỉ áp dụng trong ref đó.
- Component reusable không được animate DOM ngoài chính nó.
- Page không animate sâu vào component con trừ khi component đó expose motion hook/prop rõ.

### 2.6. Reduced-motion strategy

Motion system phải tôn trọng `prefers-reduced-motion`:

- Nếu reduced motion enabled: bỏ transform lớn, bỏ stagger dài, bỏ loop.
- Dùng opacity instant hoặc duration rất ngắn.
- QR/Claim success vẫn hiển thị state cuối rõ ràng.
- AI thinking có thể dùng text/static indicator thay vì dots động.

Policy:

| Loại animation | Reduced motion behavior            |
| -------------- | ---------------------------------- |
| Page entry     | Hiện ngay hoặc fade rất ngắn       |
| Card reveal    | Không stagger, no translate        |
| Hover          | Giữ color/border, bỏ scale         |
| Loading loop   | Static label hoặc spinner tối giản |
| QR success     | Show final badge/card ngay         |

## 3. Motion token system

Motion token giúp animation nhất quán, tránh mỗi page tự timing.

### 3.1. Duration tokens

| Token       | Giá trị | Dùng cho                                   |
| ----------- | ------- | ------------------------------------------ |
| instant     | 0ms     | reduced motion / immediate state           |
| fast        | 120ms   | hover, press, focus feedback               |
| base        | 180ms   | filter active, small UI transition         |
| comfortable | 240ms   | card reveal, panel minor move              |
| slow        | 360ms   | hero item entrance, modal open             |
| narrative   | 600ms   | hero sequence tổng, claim success sequence |

Nguyên tắc:

- Interaction trực tiếp: 120–180ms.
- Layout/section reveal: 240–360ms.
- Narrative moment: tối đa 600–800ms tổng sequence.
- Không chặn input trong khi animation chạy.

### 3.2. Easing tokens

| Token      | Đặc tính                          | Dùng cho                      |
| ---------- | --------------------------------- | ----------------------------- |
| easeOut    | nhanh đầu, mềm cuối               | entry/reveal                  |
| easeInOut  | cân bằng                          | panel/modal                   |
| emphasized | có cảm giác premium, không bounce | hero/claim                    |
| linear     | đều                               | progress/skeleton rất hạn chế |

Không dùng bounce mạnh trừ khi có reason rõ. DeskBoost cần calm premium, không toy-like.

### 3.3. Stagger tokens

| Token   | Giá trị | Dùng cho                   |
| ------- | ------- | -------------------------- |
| tight   | 30ms    | chips/small items          |
| default | 60ms    | cards/messages             |
| relaxed | 90ms    | feature cards/hero support |

Stagger tổng không nên vượt 500–700ms cho một section.

### 3.4. Fade/translate distance

| Token   | Giá trị | Dùng cho        |
| ------- | ------- | --------------- |
| fade-sm | 6px     | buttons, chips  |
| fade-md | 12px    | cards, messages |
| fade-lg | 20px    | hero/section    |

Tránh translate quá xa gây cảm giác “template reveal”.

### 3.5. Scale values

| Token       | Giá trị   | Dùng cho               |
| ----------- | --------- | ---------------------- |
| press       | 0.98–0.99 | active button/card     |
| hover-soft  | 1.01–1.02 | special CTA only       |
| image-zoom  | 1.03–1.05 | product/plant images   |
| success-pop | 1.03      | one-time success badge |

Không scale toàn card grid lên 1.05+.

## 4. Animation categories

### 4.1. Page entry

Dùng cho:

- Home hero.
- AI page header.
- QR/Claim onboarding.

Pattern:

- Container fade in nhẹ.
- Headline/subtitle/CTA stagger.
- Visual card/image vào sau text 60–120ms.
- Không replay khi route state nhỏ thay đổi.

### 4.2. Card reveal

Dùng cho:

- Feature cards.
- Marketplace cards after initial load/filter.
- Feedback cards.

Pattern:

- Opacity 0 → 1.
- TranslateY 8–12px → 0.
- Stagger 40–60ms.
- No scale nếu grid nhiều item.

### 4.3. Modal/panel

Dùng cho:

- Mobile navigation sheet.
- AI plant selector mobile.
- Contact channel panel.
- QR claim confirmation.

Pattern:

- Overlay opacity.
- Panel translateY/translateX.
- Duration 180–240ms.
- Focus/escape behavior ưu tiên hơn animation.

### 4.4. Hover interactions

Dùng CSS là chính:

- Button hover/focus/active.
- Card border/shadow/image zoom.
- Nav active/hover.
- Filter chips.

GSAP chỉ dùng hover nếu có sequence phức tạp hoặc cần orchestration đặc biệt.

### 4.5. Loading transition

Dùng cho:

- Marketplace skeleton → content.
- AI thinking → response.
- Upload analyzing → result.
- Feedback loading → cards.

Pattern:

- Trạng thái loading chiếm layout gần giống content thật.
- Content mới fade in nhanh.
- Tránh spinner đơn độc trong vùng lớn.

### 4.6. AI interaction motion

Dùng cho:

- Message append.
- Thinking indicator.
- Context chip switch.
- Error/fallback notice.

Pattern:

- User message: slide/fade từ phải rất nhẹ.
- Assistant message: slide/fade từ trái rất nhẹ.
- Thinking: dots hoặc botanical pulse rất nhẹ.
- Long response: ưu tiên chunk reveal vừa phải, không typewriter quá chậm.

## 5. Những nơi nên dùng animation

### 5.1. Home hero

Mục tiêu: first impression premium.

Nên animate:

- Eyebrow/label.
- H1.
- Subtitle.
- CTA group.
- Hero image/card.
- Floating care card.

Không nên:

- Loop hero liên tục.
- Parallax nặng.
- Text typewriter ở hero.

### 5.2. Feature reveal

Mục tiêu: giúp user scan product value theo thứ tự.

Nên animate:

- Feature cards reveal once when entering viewport.
- Icon hover rất nhẹ.

Không nên:

- Mỗi icon tự loop.
- ScrollTrigger phức tạp nếu chỉ có 3 cards.

### 5.3. Marketplace cards

Mục tiêu: filter/search phản hồi mượt.

Nên animate:

- Initial card reveal.
- Filter active pill transition.
- Results fade/slide nhẹ khi filter đổi.

Không nên:

- Animate từng card quá lâu với danh sách lớn.
- Re-run toàn grid trên mỗi keystroke search nếu gây nhiễu.

### 5.4. AI dialog open/close

Mục tiêu: AI có cảm giác responsive và có context.

Nên animate:

- Message append.
- Thinking state.
- Context chip switching.
- Mobile plant selector panel.

Không nên:

- Replay toàn message history mỗi render.
- Typewriter chậm cho câu dài.
- Loop glow quanh AI panel.

### 5.5. QR success state

Mục tiêu: tạo “moment of ownership” khi claim cây.

Nên animate:

- Scan validating state.
- Success check.
- Claimed plant card reveal.
- Claimed badge one-time shimmer.

Không nên:

- Confetti nhiều.
- Scanner effect chạy mãi.
- Animation khiến user không đọc được trạng thái.

### 5.6. Onboarding flow

Mục tiêu: hướng dẫn user từng bước.

Nên animate:

- Step progression.
- Checklist completion.
- Plant context unlocked.

Không nên:

- Transition ngang dài gây say/chậm.
- Step animation blocking form input.

## 6. Những nơi KHÔNG nên animate mạnh

| Khu vực                          | Lý do                            | Motion tối đa                    |
| -------------------------------- | -------------------------------- | -------------------------------- |
| Forms                            | User cần nhập nhanh, ít phân tâm | focus ring, validation fade      |
| Admin tables                     | Cần density, stability           | row hover, skeleton nhẹ          |
| Auth guards                      | Redirect phải nhanh, predictable | minimal loading state            |
| Loading logic                    | Logic không phụ thuộc animation  | skeleton/label rõ                |
| Dynamic lists re-render liên tục | Dễ giật/perf kém                 | animate initial/major state only |
| Error states                     | Cần đọc rõ                       | slide/fade once, no shake spam   |
| Navbar/sidebar core              | Navigation phải ổn định          | active state transition nhẹ      |

## 7. Performance strategy

### 7.1. Animate transform/opacity only

Ưu tiên:

- `opacity`
- `transform: translate/scale`
- CSS variable transform nếu cần

Tránh:

- `width`
- `height`
- `top`
- `left`
- `margin`
- `padding`
- layout-affecting properties

### 7.2. Avoid layout thrashing

Không đọc/ghi layout xen kẽ trong animation. Tránh pattern:

1. Đọc `getBoundingClientRect`.
2. Set style.
3. Đọc lại layout.
4. Lặp trong frame.

Nếu cần FLIP/list transition, thiết kế riêng, test kỹ, không thêm vào MVP sớm.

### 7.3. Avoid unnecessary ScrollTrigger

Không dùng ScrollTrigger chỉ để reveal 3 cards nếu IntersectionObserver/CSS đủ. ScrollTrigger chỉ nên dùng khi:

- Có narrative scroll section thật sự.
- Có pin/scroll progress có giá trị UX.
- Performance đã được kiểm tra.

### 7.4. Avoid re-creating timelines

Timeline phải ổn định:

- Không tạo lại trên mỗi render.
- Dependencies tối thiểu.
- Dữ liệu thay đổi thường xuyên không nên trigger timeline lớn.
- Event animation dùng contextSafe.

### 7.5. Mobile performance

- Giảm blur/backdrop-heavy overlay trên device yếu.
- Giảm shadow lớn trong list dài.
- Không animate nhiều ảnh lớn cùng lúc.
- Cẩn thận với fixed/sticky + transform parent.

## 8. React + GSAP best practices

### 8.1. `useGSAP`

Dùng `useGSAP` cho animation gắn với lifecycle component. Lợi ích:

- Cleanup tự động qua GSAP context.
- Scope selector an toàn.
- Giảm rủi ro memory leak.
- Hợp React StrictMode hơn so với tự chạy imperative trong effect không cleanup.

### 8.2. `contextSafe`

Dùng `contextSafe` cho callback/event handler có gọi GSAP sau khi component đã mount:

- Click mở panel.
- Trigger success sequence.
- Animate message append sau action.

Không gọi GSAP callback rời khỏi context nếu component có thể unmount.

### 8.3. Cleanup

Checklist cleanup:

- Timeline nằm trong context.
- Event listeners nếu có phải remove.
- Delayed calls/timeouts phải kill/clear nếu không thuộc context.
- Animation không giữ ref tới DOM đã unmount.

### 8.4. Dependency handling

- Dependencies phải phản ánh animation cần chạy lại thật sự.
- Không đưa object inline vào dependency.
- Với animation initial mount, dependency rỗng hoặc scope ổn định.
- Với list/filter, animate major state change, không animate từng keystroke nếu search live.

### 8.5. StrictMode considerations

React StrictMode có thể mount/unmount/re-run effect trong dev. Motion code phải:

- Idempotent.
- Cleanup đúng.
- Không phụ thuộc “chỉ chạy một lần” nếu không kiểm soát.
- Không tạo duplicated timelines/listeners.

### 8.6. CSS transition ownership

Mỗi property nên có một owner:

| Property/use case         | Owner khuyến nghị       |
| ------------------------- | ----------------------- |
| Button hover color/shadow | CSS                     |
| Card image zoom hover     | CSS                     |
| Hero entry sequence       | GSAP                    |
| Modal open/close          | CSS hoặc GSAP, chọn một |
| AI message append         | GSAP                    |
| Skeleton shimmer          | CSS                     |
| QR success sequence       | GSAP                    |

Không để CSS transition và GSAP cùng điều khiển `transform` trên cùng element nếu không cần.

## 9. Motion rollout plan

### Phase 1 — Motion foundation

Scope:

- Tạo motion guideline/tokens.
- Xác định reduced-motion behavior.
- Chuẩn hóa CSS hover/active/focus trước.
- Không thêm GSAP rộng.

Deliverables:

- Motion token map.
- Component interaction rules.
- Reduced-motion checklist.

### Phase 2 — Home motion MVP

Scope:

- Hero entry timeline.
- Feature/card reveal once.
- Floating care card content transition.

Success criteria:

- First impression mượt.
- Không ảnh hưởng LCP đáng kể.
- Reduced motion hoạt động.

### Phase 3 — Marketplace + Plant Detail motion

Scope:

- Filter active transition.
- Product card reveal after load/filter.
- Plant Detail image/gallery transition.
- Mobile sticky CTA entrance.

Success criteria:

- Filter không giật.
- Card grid không spam animation.
- Contact CTA rõ hơn, không che nội dung.

### Phase 4 — AI motion polish

Scope:

- AIChat message append.
- Thinking state.
- Context chip switch.
- AI Diagnosis upload/result reveal.

Success criteria:

- AI flow cảm giác alive nhưng calm.
- No replay toàn history.
- Long response vẫn readable.

### Phase 5 — QR/Claim future motion

Scope chỉ khi QR/Claim được duyệt:

- Scan validating.
- Claim success.
- Plant identity card reveal.
- Claimed badge one-time motion.

Success criteria:

- Claim moment đáng nhớ.
- Không tạo scope enterprise/anti-fraud.
- AI vẫn usable without claim.

## 10. Anti-patterns

| Anti-pattern              | Vì sao hại                        | Cách tránh                         |
| ------------------------- | --------------------------------- | ---------------------------------- |
| Global selectors          | Animate nhầm component khác       | Scoped ref + data-motion           |
| Timeline leaks            | Memory/perf issue khi route đổi   | useGSAP context cleanup            |
| Animation spam            | UI rối, kém premium               | Purpose gate cho mỗi animation     |
| Overlapping CSS/GSAP      | Transform conflict, unpredictable | Một owner/property                 |
| Replay mỗi render         | Chat/list giật, khó đọc           | Animate append/major state only    |
| Long typewriter           | User bị ép chờ                    | Chunk/fade response nhanh          |
| Infinite pulse/glow       | Cheap AI aesthetic                | Static status + one-time feedback  |
| Heavy blur/shadow mobile  | Lag, battery drain                | Giảm effect trên mobile            |
| ScrollTrigger misuse      | Complexity/perf overhead          | Chỉ dùng khi narrative scroll thật |
| Animate layout properties | Layout thrashing                  | Transform/opacity only             |

## 11. Technical validation checklist

### 11.1. Performance

- [ ] Animation chủ yếu dùng transform/opacity.
- [ ] Không animate width/height/top/left/margin/padding.
- [ ] Không tạo timeline mới mỗi render.
- [ ] Không animate quá nhiều ảnh/card cùng lúc.
- [ ] Mobile không lag khi scroll list.
- [ ] No unnecessary ScrollTrigger.
- [ ] Loading/content transition không gây layout jump lớn.

### 11.2. Cleanup

- [ ] GSAP animation nằm trong `useGSAP` context.
- [ ] Event animation dùng `contextSafe` khi cần.
- [ ] Timeline/listener/timeouts được cleanup.
- [ ] Route change không để animation chạy trên DOM unmounted.
- [ ] Dev StrictMode không tạo duplicate animation.

### 11.3. Accessibility

- [ ] Tôn trọng `prefers-reduced-motion`.
- [ ] Reduced motion vẫn hiển thị state cuối rõ.
- [ ] Animation không chặn keyboard navigation.
- [ ] Modal/panel focus behavior đúng.
- [ ] Không dùng motion làm cách duy nhất truyền trạng thái.
- [ ] Error/success state có text rõ.

### 11.4. Responsiveness

- [ ] Motion không làm content tràn màn hình nhỏ.
- [ ] Sticky/fixed CTA không bị transform parent làm sai vị trí.
- [ ] Panel/sheet mobile không che input hoặc primary CTA.
- [ ] Animation vẫn ổn khi viewport đổi kích thước.
- [ ] Touch interaction không phụ thuộc hover.

### 11.5. Consistency

- [ ] Duration/easing/stagger dùng đúng token.
- [ ] Cùng loại interaction có cùng motion behavior.
- [ ] CSS transition và GSAP không cùng animate một property trên cùng element.
- [ ] Animation có purpose rõ: orientation, feedback, continuity, status, hoặc delight.
- [ ] Motion không làm lệch product direction contact-only/plant-care only.

### 11.6. Handoff checklist trước implementation

- [ ] Xác định animation owner: CSS hay GSAP.
- [ ] Xác định scope ref và selector strategy.
- [ ] Xác định reduced-motion fallback.
- [ ] Xác định state nào trigger animation.
- [ ] Xác định animation có replay hay chỉ chạy once.
- [ ] Xác định validation command/manual smoke cần chạy.

## 12. Quy tắc quyết định nhanh

Khi phân vân có nên animate hay không, dùng rule sau:

| Câu hỏi                                                  | Nếu câu trả lời là “không” |
| -------------------------------------------------------- | -------------------------- |
| Animation có giúp user hiểu trạng thái không?            | Không animate              |
| Animation có dưới 300ms cho interaction trực tiếp không? | Rút ngắn                   |
| Reduced motion có fallback rõ không?                     | Chưa implement             |
| Có thể làm bằng CSS đơn giản không?                      | Không dùng GSAP            |
| Có nguy cơ replay khi render lại không?                  | Thiết kế lại trigger       |
| Có ảnh hưởng mobile performance không?                   | Giảm/loại bỏ effect        |

Motion system chỉ thành công khi user cảm thấy DeskBoost nhanh hơn, rõ hơn, đáng tin hơn — không phải khi họ nhận ra có nhiều animation.
