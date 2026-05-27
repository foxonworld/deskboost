# DeskBoost Design Tokens & UI Consistency Guideline

> Tài liệu token system chính thức cho DeskBoost. Mục tiêu: giúp team duy trì giao diện nhất quán, dễ mở rộng, phù hợp React + Tailwind utility workflow, dark mode, responsive layout và motion/GSAP trong tương lai. Không bao gồm code implementation.

## 1. Giới thiệu Design Token System

### 1.1. Design token là gì

Design token là tên gọi có ý nghĩa cho các giá trị thiết kế được dùng lặp lại trong UI:

- Màu sắc.
- Typography.
- Spacing.
- Radius.
- Shadow/elevation.
- Border.
- Interaction states.
- Motion summary.

Thay vì mỗi component tự chọn màu, padding, radius hoặc shadow, team dùng token chung để tạo cảm giác DeskBoost là một sản phẩm thống nhất.

### 1.2. Vai trò trong DeskBoost

Token system là lớp nền giữa product direction và UI implementation:

| Lớp                 | Vai trò                                                    |
| ------------------- | ---------------------------------------------------------- |
| Product direction   | Contact-only marketplace, AI plant care, lightweight admin |
| UI redesign plan    | Định hướng premium SaaS, botanical modern, trust-oriented  |
| Design token system | Chuẩn hóa visual language dùng lâu dài                     |
| Component system    | Button, card, form, panel, chat bubble, state components   |
| Motion system       | Timing/feedback nhất quán, subtle over flashy              |

### 1.3. Vì sao token system quan trọng cho scalability

DeskBoost hiện dùng React + Vite + Tailwind utility workflow với mixed `.jsx`/`.tsx`. Nếu không có token system:

- Hardcoded color/radius/shadow tăng nhanh.
- Mỗi page có spacing khác nhau.
- Dark mode dễ lệch contrast.
- Component khó tái dùng.
- GSAP/CSS interaction dễ conflict.
- Redesign từng phần dễ làm sản phẩm mất consistency.

Token system giúp team:

- Review UI nhanh hơn.
- Giảm tranh luận subjective.
- Tạo foundation trước khi xây shared component library.
- Dễ migrate từ Tailwind CDN sang Tailwind config thật.
- Dễ thêm motion preset mà không phá visual consistency.

### 1.4. Relationship với các plan hiện có

| Tài liệu           | Trách nhiệm                                              | Tài liệu này bổ sung gì                        |
| ------------------ | -------------------------------------------------------- | ---------------------------------------------- |
| UI Redesign Plan   | Page strategy, UX issues, rollout phases                 | Token hóa visual system để implement nhất quán |
| Motion System Plan | GSAP strategy, motion rules, performance                 | Tóm tắt motion token ở mức UI consistency      |
| Design Tokens      | Foundation cho màu, chữ, spacing, radius, shadow, border | Là source of truth cho style decisions         |

Tài liệu này không thay thế UI/motion plan. Nó là guideline để mọi phase redesign dùng cùng một ngôn ngữ thị giác.

## 2. Design Philosophy

DeskBoost theo hướng **Calm Intelligence for Desk Plants**:

- **Calm UI**: giao diện yên tĩnh, ít noise, dễ đọc.
- **Premium subtle motion**: chuyển động hỗ trợ cảm giác nhanh, không phô diễn.
- **Consistency > decoration**: hệ thống nhất quán quan trọng hơn hiệu ứng lạ.
- **Accessibility-first**: contrast, keyboard, focus, touch target phải rõ.
- **Readability-first**: người dùng hiểu nội dung chính trong vài giây.
- **Trust-oriented UI**: tránh fake dashboard, tránh ecommerce drift, tránh AI gimmick.
- **AI-assisted but human-friendly**: AI nên có ngữ cảnh, mềm, có trách nhiệm.
- **Plant-inspired modern SaaS**: botanical warmth nhưng vẫn sắc, sạch, product-grade.

Benchmark tinh thần:

| Nguồn       | Tinh thần áp dụng                         |
| ----------- | ----------------------------------------- |
| Linear      | Clarity, hierarchy, density có kiểm soát  |
| Stripe      | Polish, narrative, gradient tinh tế       |
| Supabase    | Green identity, technical trust           |
| Arc Browser | Warmth, friendliness, premium playfulness |
| Raycast     | Responsiveness, command-like crispness    |

## 3. Semantic Color System

### 3.1. Nguyên tắc semantic color

Không đặt token theo màu vật lý trước như “green-500” cho mọi thứ. Đặt theo vai trò UI:

- `background`: nền app/page.
- `surface`: panel/card nền chính.
- `text-primary`: chữ quan trọng.
- `interactive`: hành động click chính.
- `success`: trạng thái thành công.

Khi cần đổi theme, semantic token giúp đổi có kiểm soát mà không sửa từng component.

### 3.2. Token màu đề xuất

| Token                    | Vai trò                 | Light mode direction                 | Dark mode direction                |
| ------------------------ | ----------------------- | ------------------------------------ | ---------------------------------- |
| `color-background`       | Nền page/app            | off-white botanical, không trắng gắt | deep botanical charcoal            |
| `color-surface`          | Card/panel chính        | white/soft white                     | dark green-tinted surface          |
| `color-surface-elevated` | Popover/modal/card nổi  | white có depth                       | dark surface sáng hơn background   |
| `color-card`             | Product/plant/info card | surface + border subtle              | surface dark + border low-contrast |
| `color-border`           | Border mặc định         | neutral green-gray nhẹ               | white/green opacity thấp           |
| `color-divider`          | Divider nội dung        | nhạt hơn border                      | nhạt, không gây line noise         |
| `color-text-primary`     | Heading/body chính      | near-black green-tinted              | off-white                          |
| `color-text-secondary`   | Body phụ                | muted botanical gray                 | muted gray-green                   |
| `color-text-muted`       | Metadata/caption        | gray-green nhẹ nhưng readable        | slate/green muted có contrast      |
| `color-success`          | Thành công/healthy      | green semantic                       | green sáng hơn trên dark           |
| `color-warning`          | Cảnh báo/care due       | amber semantic                       | amber rõ trên dark                 |
| `color-danger`           | Lỗi/delete/overdue      | red semantic                         | red mềm, không neon                |
| `color-accent`           | Accent phụ              | blue/teal rất hạn chế                | blue/teal muted                    |
| `color-interactive`      | CTA chính               | DeskBoost green                      | DeskBoost green tuned for contrast |
| `color-hover`            | Hover bg/border         | surface tint                         | white/green opacity thấp           |
| `color-active`           | Active/selected         | green tint + strong border           | green tint dark + visible border   |
| `color-disabled`         | Disabled bg/text        | neutral low contrast nhưng readable  | dark neutral + muted text          |

### 3.3. Light mode strategy

Light mode nên tạo cảm giác:

- Sạch.
- Ấm nhẹ.
- Botanical nhưng không “eco-template”.
- Nhiều white space.
- Border/shadow tinh tế thay vì background màu đậm.

Khuyến nghị:

- Page background: off-white, không pure white toàn app.
- Surface/card: white hoặc gần white.
- Primary green: dùng cho CTA, active state, health/status, không dùng phủ nền lớn quá nhiều.
- Text: gần đen, hơi green-tinted để giữ brand warmth.

### 3.4. Dark mode strategy

Dark mode nên tạo cảm giác premium botanical workspace:

- Background sâu, không đen tuyệt đối.
- Surface có phân tầng rõ.
- Border đủ thấy nhưng không sáng quá.
- Green accent sáng hơn light mode một chút để đạt contrast.
- Không lạm dụng glow xanh.

Khuyến nghị:

- Dark background: deep green/charcoal.
- Surface: dark botanical panel.
- Elevated surface: sáng hơn surface 4–8% về perceived luminance.
- Text primary: gần white, không pure white quá chói nếu body dài.

### 3.5. Green usage philosophy

DeskBoost green là signal, không phải wallpaper.

Dùng green cho:

- Primary CTA.
- Active nav/filter.
- Healthy/success/care-positive state.
- AI/context accent nhẹ.
- Focus ring với opacity phù hợp.

Tránh green cho:

- Mọi icon cùng màu.
- Mọi heading highlight.
- Background section lớn liên tục.
- Shadow/glow nặng.
- Text nhỏ trên green nhạt nếu contrast yếu.

### 3.6. Atmospheric background strategy

Background có thể dùng gradient/mesh rất nhẹ cho premium feel, nhưng phải tiết chế:

- Chỉ dùng ở Home hero, AI hero/panel, QR/Claim success future.
- Gradient opacity thấp, không cạnh tranh content.
- Không dùng nhiều màu neon.
- Không dùng animated gradient loop mặc định.
- Tránh “purple-blue AI SaaS cliché”.

### 3.7. Contrast rules

- Text chính phải đạt contrast rõ trên light/dark.
- Metadata không được quá nhạt nếu chứa thông tin quan trọng.
- Status không chỉ dựa vào màu; cần text/icon.
- CTA primary phải nổi rõ trên cả light/dark.
- Focus ring phải thấy trên nền surface và background.

### 3.8. Color anti-patterns

- Hardcoded random green ở từng component.
- Dùng nhiều sắc xanh lá không có vai trò rõ.
- Glow xanh lớn quanh card/button.
- Gradient phủ nhiều section liên tiếp.
- Dùng màu brand cho warning/error.
- Text green trên green tint quá nhạt.
- Dark mode chỉ invert màu mà không kiểm tra contrast.

## 4. Typography System

### 4.1. Font strategy

Manrope hiện phù hợp với DeskBoost vì:

- Dễ đọc.
- Có cảm giác modern SaaS.
- Hợp dashboard, marketplace, AI chat.
- Đủ weight cho heading và label.

Tương lai nếu đổi font, cần giữ nguyên hierarchy token trước, đổi font sau.

### 4.2. Heading hierarchy

| Token           | Vai trò                   | Desktop        | Mobile               | Ghi chú                  |
| --------------- | ------------------------- | -------------- | -------------------- | ------------------------ |
| `text-display`  | Home hero/major landing   | rất lớn, tight | lớn nhưng không tràn | dùng ít                  |
| `text-h1`       | Page title                | lớn, rõ        | giảm 1 cấp           | mỗi page 1 H1            |
| `text-h2`       | Section title             | trung-lớn      | vừa                  | dùng cho block chính     |
| `text-h3`       | Card/panel title          | vừa            | vừa/nhỏ              | không quá đậm mọi nơi    |
| `text-subtitle` | Support text dưới heading | body lớn       | body vừa             | readable, không quá nhạt |

Guideline:

- H1/H2 không cần luôn `font-black`.
- Dùng weight mạnh cho hierarchy, không dùng size khổng lồ ở mọi page.
- Heading dài cần line-height thoáng hơn.
- Không dùng nhiều heading cùng cấp cạnh nhau nếu visual hierarchy mờ.

### 4.3. Body hierarchy

| Token              | Dùng cho                      | Style direction            |
| ------------------ | ----------------------------- | -------------------------- |
| `text-body-lg`     | Landing/support paragraph     | readable, line-height rộng |
| `text-body`        | Nội dung thường               | 14–16px tùy context        |
| `text-body-sm`     | Card description, helper text | không quá nhạt             |
| `text-body-strong` | Emphasis trong body           | semibold/bold hạn chế      |

Guideline:

- Body dài cần line-height 1.5–1.7.
- Card description nên 2–3 dòng tối đa.
- Admin table copy cần compact nhưng không dưới readable threshold.

### 4.4. Label/caption hierarchy

| Token           | Dùng cho               | Rule                         |
| --------------- | ---------------------- | ---------------------------- |
| `text-label`    | Form label, chip label | semibold/bold, rõ            |
| `text-caption`  | Metadata, helper text  | nhỏ nhưng readable           |
| `text-overline` | Short section label    | uppercase ngắn, tracking vừa |
| `text-badge`    | Badge/status           | rất ngắn, không lạm dụng     |

All-caps chỉ dùng khi:

- Label rất ngắn.
- Có ý nghĩa metadata/status.
- Không phải paragraph.
- Tracking không quá rộng gây khó đọc.

### 4.5. Line-height rules

| Text type        | Line-height direction                |
| ---------------- | ------------------------------------ |
| Display/hero     | tight nhưng không cắt dấu tiếng Việt |
| Heading          | 1.1–1.25 tùy size                    |
| Body             | 1.5–1.7                              |
| Caption/metadata | 1.3–1.5                              |
| Button/chip      | fixed height alignment               |

Tiếng Việt có dấu, cần tránh line-height quá chặt ở heading lớn.

### 4.6. Responsive typography philosophy

- Mobile giảm size headline, không giảm quá mạnh body.
- Mobile ưu tiên line length ngắn và spacing đủ.
- Desktop tăng whitespace hơn là tăng mọi font size.
- Dashboard/admin không cần display typography.

### 4.7. Spacing giữa text groups

| Pattern                | Spacing direction |
| ---------------------- | ----------------- |
| Eyebrow → Heading      | nhỏ, 8–12px       |
| Heading → Subtitle     | 12–16px           |
| Subtitle → CTA         | 24–32px           |
| Card title → metadata  | 4–8px             |
| Card title → body      | 8–12px            |
| Section heading → grid | 32–48px           |

### 4.8. Typography anti-patterns

- Quá nhiều `font-black` trong một viewport.
- All-caps paragraph hoặc label dài.
- Body text quá nhạt.
- Heading quá lớn trên mobile.
- Trộn tiếng Việt/Anh không có chủ đích.
- Button text quá dài làm CTA mất rõ.

## 5. Spacing System

### 5.1. Spacing scale

Token spacing nên map được sang Tailwind utilities hiện có, nhưng dùng theo vai trò semantic.

| Token           | Giá trị gợi ý | Tailwind gần đúng | Dùng cho                     |
| --------------- | ------------- | ----------------- | ---------------------------- |
| `space-xs`      | 4px           | `1`               | icon gap, micro spacing      |
| `space-sm`      | 8px           | `2`               | compact gap, title metadata  |
| `space-md`      | 12–16px       | `3`/`4`           | form fields, chip groups     |
| `space-lg`      | 20–24px       | `5`/`6`           | card padding, panel gap      |
| `space-xl`      | 32px          | `8`               | major group spacing          |
| `space-2xl`     | 48px          | `12`              | section inner/mobile section |
| `space-section` | 72–96px       | `18`/`24` approx  | desktop landing sections     |

### 5.2. Card padding

| Card type | Mobile  | Desktop | Ghi chú                  |
| --------- | ------- | ------- | ------------------------ |
| Compact   | 12–16px | 16px    | admin/list/state card    |
| Default   | 16–20px | 20–24px | product/plant card       |
| Feature   | 20–24px | 24–32px | Home/Dashboard insight   |
| Hero      | 24px    | 32–48px | landing/detail highlight |

### 5.3. Section rhythm

- Home/landing: section spacing lớn, tạo premium breathing room.
- Marketplace: spacing vừa, ưu tiên scan nhanh.
- Dashboard/app pages: spacing compact hơn landing.
- Admin: compact nhất nhưng vẫn có row rhythm rõ.

| Page type     | Mobile section | Desktop section |
| ------------- | -------------- | --------------- |
| Landing/Home  | 48–64px        | 72–96px         |
| Marketplace   | 32–48px        | 48–64px         |
| App dashboard | 24–32px        | 32–48px         |
| Admin         | 16–24px        | 24–32px         |

### 5.4. Grid spacing

| Grid                   | Gap direction                   |
| ---------------------- | ------------------------------- |
| Product grid           | 20–24px desktop, 16px mobile    |
| Feature grid           | 24–32px desktop, 16–20px mobile |
| Dashboard cards        | 16–24px                         |
| Admin cards/table rows | 8–16px                          |
| AI layout columns      | 20–24px                         |

### 5.5. Mobile spacing

Mobile không chỉ là desktop thu nhỏ:

- Giảm section spacing nhưng giữ card padding đủ chạm/đọc.
- Sticky CTA cần bottom safe area.
- Bottom sheet/nav cần chừa padding cuối page.
- Text group cần spacing rõ để tránh cảm giác dày.

### 5.6. Perceived quality từ spacing

Spacing tạo cảm giác chất lượng nhanh hơn màu/shadow. Premium SaaS thường:

- Ít element cạnh nhau.
- Content có nhịp thở.
- Grid alignment nhất quán.
- Card padding không ngẫu nhiên.
- Section không bị dính vào navbar/footer.

## 6. Radius System

### 6.1. Semantic radius

| Token           | Giá trị gợi ý | Dùng cho                             |
| --------------- | ------------- | ------------------------------------ |
| `radius-small`  | 8–10px        | checkbox, small badge, tiny controls |
| `radius-medium` | 12–14px       | button, input, chip                  |
| `radius-large`  | 20–24px       | card, panel, dropdown                |
| `radius-hero`   | 28–32px       | hero image, major panel, modal       |
| `radius-pill`   | 9999px        | pill badge, avatar, round CTA        |

### 6.2. Component radius rules

| Component             | Radius token                                                 |
| --------------------- | ------------------------------------------------------------ |
| Button                | `radius-medium`, channel CTA có thể `radius-large`           |
| Input/select/textarea | `radius-medium` hoặc `radius-large` nếu form premium         |
| Product/plant card    | `radius-large`                                               |
| Dashboard card        | `radius-large`                                               |
| Modal/panel/sheet     | `radius-hero` desktop, `radius-large` mobile nếu cần density |
| Chip/filter pill      | `radius-pill` hoặc `radius-medium` tùy style                 |
| Badge                 | `radius-small` hoặc `radius-pill`                            |
| AI bubble             | `radius-large` với asymmetry nhẹ nếu cần                     |
| Upload area           | `radius-hero`                                                |

### 6.3. Consistency rules

- Không dùng arbitrary radius nếu token đủ đáp ứng.
- Không trộn `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-[28px]` trong cùng component family.
- Card cùng loại phải cùng radius.
- Image bên trong card phải follow card radius hoặc clip nhất quán.
- Radius lớn phải đi kèm padding đủ; nếu không sẽ trông “toy-like”.

## 7. Shadow & Elevation System

### 7.1. Depth philosophy

DeskBoost dùng depth để phân tầng, không dùng để gây chú ý quá mức.

Ưu tiên:

- Border + subtle shadow.
- Shadow mềm, opacity thấp.
- Elevation rõ ở modal/dropdown/sticky CTA.
- Dark mode dùng border/surface contrast nhiều hơn shadow.

### 7.2. Shadow tokens

| Token             | Vai trò                    | Light mode                     | Dark mode                        |
| ----------------- | -------------------------- | ------------------------------ | -------------------------------- |
| `shadow-subtle`   | Card rất nhẹ               | shadow mỏng, gần như invisible | thường bỏ hoặc rất nhẹ           |
| `shadow-card`     | Product/card hover/rest    | mềm, low blur                  | dùng border/surface thay thế     |
| `shadow-elevated` | Modal/dropdown/sticky CTA  | rõ hơn nhưng không nặng        | shadow tối nhẹ + border sáng nhẹ |
| `shadow-overlay`  | Mobile sheet/overlay panel | sâu hơn để tách lớp            | sâu nhưng tránh glow             |

### 7.3. Light mode behavior

- Resting card: border + shadow rất nhẹ.
- Hover card: tăng shadow nhẹ hoặc border tint, không cả hai quá mạnh.
- Primary CTA: shadow màu green chỉ dùng nhẹ, không neon.
- Overlay/modal: shadow rõ hơn card.

### 7.4. Dark mode behavior

- Shadow thường ít hiệu quả trên nền tối.
- Dùng surface brightness, border opacity, subtle outline.
- Tránh glow xanh quanh card/panel.
- Modal cần backdrop + border + surface contrast.

### 7.5. Premium SaaS depth strategy

- Depth phải giúp hierarchy: background → surface → elevated → overlay.
- Không dùng shadow lớn cho mọi card.
- Dashboard/admin cần ít shadow hơn Home/marketing.
- AI panel có thể có depth nhẹ nhưng không sci-fi glow.

### 7.6. Shadow anti-patterns

- Giant glow.
- Blurry neon effects.
- Shadow màu xanh trên mọi hover.
- Card hover scale + giant shadow cùng lúc.
- Dark mode shadow không thấy nhưng vẫn làm CSS phức tạp.

## 8. Border System

### 8.1. Border tokens

| Token            | Vai trò            | Dùng cho                                    |
| ---------------- | ------------------ | ------------------------------------------- |
| `border-subtle`  | Border mặc định    | card, input rest, section edge              |
| `border-strong`  | Border nhấn        | selected card, active filter, warning panel |
| `border-divider` | Chia nhóm nội dung | nav divider, table row, panel section       |
| `border-focus`   | Focus visible      | input, button, interactive card             |

### 8.2. Opacity rules

- Light mode: border đủ thấy trên off-white, không quá đậm.
- Dark mode: border dùng opacity white/green thấp nhưng phải phân tầng.
- Divider phải nhẹ hơn card border.
- Focus border/ring phải rõ hơn hover border.

### 8.3. Hover border strategy

- Card hover: border tint green nhẹ.
- Filter hover: border interactive, background vẫn calm.
- Input hover: border tăng nhẹ; focus mới dùng ring.
- Admin rows: hover background nhẹ hơn border nếu density cao.

### 8.4. Border anti-patterns

- Border quá nhạt khiến card chìm.
- Border quá đậm làm UI thô.
- Dùng green border cho mọi thứ.
- Focus state chỉ đổi border nhưng không đủ visibility.
- Dark mode divider quá sáng gây line noise.

## 9. Component Consistency Rules

### 9.1. Buttons

Button phải có hierarchy rõ:

| Type        | Mục đích                | Visual rule                                     |
| ----------- | ----------------------- | ----------------------------------------------- |
| Primary     | hành động chính         | green fill, contrast cao                        |
| Secondary   | hành động phụ           | surface + border                                |
| Ghost       | nav/filter/low priority | transparent/surface hover                       |
| Destructive | delete/logout           | danger semantic, không quá aggressive           |
| Channel CTA | Zalo/Messenger          | brand color nhưng size/radius theo hệ DeskBoost |

Rules:

- Một section chỉ nên có một primary CTA.
- Button text ngắn, action-oriented.
- Loading state inline, không làm layout nhảy.
- Disabled state rõ, không clickable-looking.
- Touch target tối thiểu 44px cho mobile.

### 9.2. Cards

Card là đơn vị layout chính của DeskBoost.

Rules:

- Card cùng family dùng cùng radius/padding/border.
- Product card không chứa quá nhiều badge.
- Plant care card ưu tiên next action/status.
- Insight card ưu tiên recommendation + reason + CTA.
- Admin card/table row compact, ít shadow.
- Hover card: border/shadow/image zoom nhẹ, không scale toàn card mặc định.

### 9.3. Forms

Rules:

- Label rõ, helper/error gần field.
- Input height nhất quán.
- Focus ring visible.
- Error state có text, không chỉ màu đỏ.
- Mobile keyboard không bị fixed layout che field.
- Không animate mạnh form validation.

### 9.4. Dropdowns/selectors

Dùng cho filter, plant selector, sort, admin status.

Rules:

- Trigger cho biết state hiện tại.
- Option spacing đủ chạm.
- Selected state rõ bằng text/icon/border.
- Mobile có thể dùng bottom sheet nếu list dài.
- Không dùng hover-only interaction.

### 9.5. Sidebars

Rules:

- Sidebar desktop ổn định, active item rõ.
- Mobile chỉ một navigation pattern chính; tránh top menu + bottom sheet cạnh tranh.
- Active state dùng background tint + text/icon color, không cần shadow.
- Sidebar không dùng animation mạnh.

### 9.6. Navbars

Rules:

- Public nav: minimal, brand rõ, CTA rõ.
- App nav: ưu tiên session/profile/navigation state.
- Sticky navbar cần backdrop/border tinh tế.
- Không animate navbar theo scroll nếu chưa có lý do UX rõ.

### 9.7. Chips

Dùng cho filter, context, tags.

Rules:

- Chip text ngắn.
- Active chip khác rõ với inactive.
- Chip group có horizontal scroll mobile.
- Không dùng quá nhiều chip trong card; tối đa 2–4 tag có giá trị.

### 9.8. Badges

Dùng cho status/trust, không dùng để trang trí.

Rules:

- Badge phải có ý nghĩa: verified, active, context, due, fallback.
- Không dùng nhiều badge cạnh nhau nếu không cần.
- Badge màu semantic, không random.
- All-caps badge chỉ dùng text rất ngắn.

### 9.9. AI chat bubbles

Rules:

- User bubble và assistant bubble khác nhau nhưng cùng hệ radius/spacing.
- Assistant nên có context identity: DeskBoost AI, plant context.
- Long message cần readable width và line-height tốt.
- Thinking state rõ nhưng calm.
- Error/fallback trong chat cần tone hỗ trợ, không panic.

### 9.10. Upload areas

Rules:

- Upload area cần large drop target.
- Drag state rõ bằng border/background tint.
- Preview image có action remove rõ.
- Result state tách khỏi upload state.
- Loading/analyzing không chỉ spinner; cần copy theo ngữ cảnh.

### 9.11. Empty states

Rules:

- Không dùng generic “No data found” nếu có thể viết theo ngữ cảnh.
- Có title, description, action nếu phù hợp.
- Empty state phải hướng user sang bước tiếp theo.
- Visual nhẹ, không chiếm quá nhiều attention.

### 9.12. Loading states

Rules:

- Skeleton nếu layout có card/list.
- Spinner chỉ dùng cho inline/small action.
- Loading copy theo ngữ cảnh.
- Không làm layout jump khi content loaded.
- AI loading nên thể hiện đang đọc ngữ cảnh cây.

## 10. Motion Token Summary

Chi tiết motion nằm trong Motion System Plan. Tài liệu này chỉ giữ summary để đảm bảo visual consistency.

| Token group    | Direction                                                                          |
| -------------- | ---------------------------------------------------------------------------------- |
| Duration       | 120–180ms cho interaction, 240–360ms cho reveal, 600ms tối đa cho narrative moment |
| Easing         | ease-out/ease-in-out mềm, không bounce mạnh                                        |
| Stagger        | 30–90ms, tổng sequence ngắn                                                        |
| Transform      | ưu tiên opacity/translate/scale nhỏ                                                |
| Reduced motion | bỏ transform lớn, bỏ loop, state cuối vẫn rõ                                       |

Rules:

- CSS cho hover/focus/active đơn giản.
- GSAP cho sequence có orchestration: Home hero, AI message append, QR success future.
- Không để CSS và GSAP cùng animate `transform` trên cùng element.
- Motion không được làm lệch contact-only/AI plant-care product direction.

## 11. Responsive Design Rules

### 11.1. Desktop

Desktop dùng để tăng clarity, không nhồi thêm noise:

- Max-width rõ cho content.
- Grid 3–4 cột cho marketplace nếu card đủ thở.
- Sidebar app ổn định.
- Plant Detail có image + contact/info panel cân bằng.
- AI Chat có context panel bên trái, chat chính bên phải.

### 11.2. Tablet

Tablet cần tránh layout “nửa desktop nửa mobile” khó dùng:

- Grid 2 cột nếu content đủ rộng.
- Sidebar có thể collapse hoặc chuyển thành top/bottom navigation.
- Sticky CTA cân nhắc nếu detail page dài.
- Filter controls có thể wrap, không ép một hàng quá chật.

### 11.3. Mobile

Mobile là primary UX cho nhiều user:

- Single column mặc định.
- CTA chính dễ chạm.
- Product/detail CTA không bị chôn dưới quá nhiều content.
- AI plant selector nên compact/dropdown/sheet.
- Bottom nav/sheet không che input/CTA.
- Chừa safe-area/padding cuối nếu có fixed control.

### 11.4. Touch target sizing

- Button/link chính tối thiểu 44px height.
- Icon-only button cần label aria trong implementation.
- Chip/filter đủ padding ngang.
- Close/remove action không quá nhỏ.
- Card click target rõ, tránh nested click phức tạp.

### 11.5. Sticky CTA philosophy

Sticky CTA chỉ dùng khi:

- Page dài.
- Hành động quan trọng.
- User cần contact/submit nhanh.

Dùng cho:

- Plant Detail mobile contact CTA.
- QR/Claim future confirmation nếu flow dài.

Không lạm dụng cho:

- Admin pages.
- Dashboard có nhiều actions.
- Form dài nếu che input.

## 12. Accessibility Rules

### 12.1. Contrast

- Text/body đạt contrast tốt ở light/dark.
- Green trên green tint phải kiểm tra kỹ.
- Disabled state vẫn nhận diện được là disabled.
- Warning/danger không chỉ khác bằng màu.

### 12.2. Keyboard navigation

- Tất cả interactive element dùng semantics đúng.
- Focus state visible.
- Modal/sheet cần focus management khi implement.
- Filter chips/dropdowns dùng button/control thật.
- Không dùng div clickable nếu button/link phù hợp.

### 12.3. Focus visibility

Focus ring:

- Không bị outline-none nếu không có replacement.
- Có contrast với background.
- Không bị box-shadow/overflow che mất.
- Nhất quán giữa button/input/card interactive.

### 12.4. Reduced motion

- Tôn trọng `prefers-reduced-motion`.
- Bỏ loop/large transform.
- Giữ state cuối rõ ràng.
- Không dùng animation làm cách duy nhất báo thành công/lỗi.

### 12.5. Readability

- Body không quá nhỏ.
- Line-height đủ cho tiếng Việt.
- Không dùng all-caps dài.
- Không đặt text quan trọng trên ảnh nếu contrast không ổn.
- Metadata quan trọng không quá nhạt.

### 12.6. Touch accessibility

- Control đủ lớn.
- Spacing giữa controls tránh bấm nhầm.
- Fixed bottom controls không che nội dung.
- Mobile sheet có close dễ thấy.

## 13. Anti-Patterns

| Anti-pattern           | Vì sao hại                           | Cách tránh                        |
| ---------------------- | ------------------------------------ | --------------------------------- |
| Random spacing         | UI thiếu rhythm                      | Dùng spacing scale                |
| Inconsistent radius    | Component như từ nhiều app khác nhau | Dùng semantic radius              |
| Over-animation         | Mất premium, gây phân tâm            | Motion có purpose                 |
| Hardcoded colors       | Khó dark mode, khó rebrand           | Dùng semantic color token         |
| Giant shadows          | Toy/gaming feel                      | Border + subtle elevation         |
| Flashy gradients       | Generic AI SaaS cliché               | Atmospheric gradient rất tiết chế |
| Dashboard gaming/web3  | Giảm trust                           | Calm command center               |
| Too many badges        | Noise, hierarchy yếu                 | Badge chỉ cho status/trust thật   |
| Too many CTA styles    | User không biết action chính         | Chuẩn hóa button types            |
| All-caps abuse         | Khó đọc, cảm giác template           | Chỉ dùng label ngắn               |
| Green everywhere       | Brand mất tinh tế                    | Green là signal                   |
| Dark mode afterthought | Contrast lỗi, surface phẳng          | Token light/dark song song        |
| CSS/GSAP conflict      | Animation unpredictable              | Một owner/property                |
| Ecommerce visual drift | Lệch MVP contact-only                | Copy/layout contact-first         |

## 14. Future Improvements

### 14.1. Migrate Tailwind CDN → proper Tailwind config

Hiện Tailwind config nằm trong HTML. Về dài hạn nên chuyển sang config chuẩn để:

- Centralize tokens.
- Type/review dễ hơn.
- Tái dùng theme ở nhiều file.
- Giảm hardcoded utility tuỳ ý.

### 14.2. Centralized token config

Tương lai nên có một source of truth cho:

- Colors.
- Spacing.
- Radius.
- Shadow.
- Typography.
- Motion summary.

Có thể bắt đầu bằng Tailwind config trước, sau đó nếu cần mới mở rộng sang CSS variables/theme abstraction.

### 14.3. Shared component library

Không cần over-engineer sớm. Khi pattern lặp đủ nhiều, tạo shared components:

- Button.
- Card.
- Input.
- Badge/Chip.
- Panel/Modal.
- EmptyState/LoadingState variants.
- ProductCard/PlantCareCard/AIMessageBubble.

### 14.4. Theme abstraction

Khi dark mode phức tạp hơn:

- Dùng semantic CSS variables.
- Map Tailwind utilities sang semantic variables.
- Tách brand color khỏi semantic status.
- Cho phép future theme tuning mà không rewrite components.

### 14.5. Motion preset system

Sau khi motion usage ổn định:

- Preset cho page entry.
- Preset cho card reveal.
- Preset cho panel open/close.
- Preset cho AI message append.
- Preset reduced-motion fallback.

Không tạo motion abstraction trước khi có implementation pattern thật.

### 14.6. Design linting consistency

Tương lai có thể review/lint convention:

- Cảnh báo hardcoded color không thuộc token.
- Cảnh báo arbitrary radius quá nhiều.
- Cảnh báo shadow/glow không chuẩn.
- Cảnh báo focus outline bị remove.
- Cảnh báo repeated component style nên extract.

## 15. Validation Checklist

### 15.1. Visual consistency

- [ ] Page dùng đúng semantic color role.
- [ ] Không có random green/hardcoded color không cần thiết.
- [ ] Card/button/input cùng family nhất quán.
- [ ] Badge/chip không bị lạm dụng.
- [ ] UI tạo cảm giác premium SaaS, không template/ecommerce/gaming.

### 15.2. Spacing consistency

- [ ] Padding/gap theo spacing scale.
- [ ] Section rhythm phù hợp page type.
- [ ] Card grid có breathing room.
- [ ] Mobile spacing không quá chật hoặc quá loãng.
- [ ] Sticky/fixed elements có safe spacing.

### 15.3. Typography consistency

- [ ] Mỗi page có hierarchy rõ.
- [ ] Không lạm dụng `font-black`/all-caps.
- [ ] Body text readable.
- [ ] Metadata đủ contrast.
- [ ] Ngôn ngữ user-facing nhất quán.

### 15.4. Dark mode quality

- [ ] Background/surface/elevated phân tầng rõ.
- [ ] Border không quá sáng hoặc quá mờ.
- [ ] Text contrast đủ.
- [ ] Green accent không neon.
- [ ] Shadow/glow không bị lạm dụng.

### 15.5. Accessibility

- [ ] Focus visible cho mọi interactive element.
- [ ] Không truyền thông tin chỉ bằng màu.
- [ ] Touch target đủ lớn.
- [ ] Form errors có text rõ.
- [ ] Reduced motion có fallback.

### 15.6. Responsiveness

- [ ] Desktop layout tận dụng width nhưng không nhồi noise.
- [ ] Tablet không bị layout chật/lỡ cỡ.
- [ ] Mobile CTA/navigation không che content.
- [ ] AI/Plant Detail có mobile-specific pattern.
- [ ] Horizontal scroll nếu có phải rõ và không trap user.

### 15.7. Motion harmony

- [ ] Motion dùng token duration/easing summary.
- [ ] Interaction feedback nhanh.
- [ ] Không animate layout properties.
- [ ] Không replay animation không cần thiết.
- [ ] CSS và GSAP không conflict ownership.

### 15.8. Premium SaaS feel

- [ ] UI calm, clean, trust-oriented.
- [ ] Green dùng như signal, không phủ mọi nơi.
- [ ] Botanical warmth hiện qua imagery/copy/context, không qua decoration quá mức.
- [ ] AI cảm giác hữu ích, có ngữ cảnh, không gimmick.
- [ ] Marketplace vẫn rõ contact-only, không giống checkout flow.
