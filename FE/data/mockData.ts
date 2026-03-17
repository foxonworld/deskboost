// ============================================================
//  DeskBoost – SINGLE SOURCE OF TRUTH
//  All entities, schemas, and mock data are defined here.
//  Every page MUST import from this file only.
//  Currency: VND (Vietnamese Dong)
// ============================================================

// ── Formatters ───────────────────────────────────────────────
export const formatVND = (amount: number): string =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const SHIPPING_FEE = 30000; // 30,000 VNĐ flat rate
export const FREE_SHIPPING_THRESHOLD = 500000; // free over 500k VNĐ

// ── Entity: Product (Shop Plant) ─────────────────────────────
export interface Product {
  id: string;
  name: string;
  species: string;           // scientific name
  category: string;          // Indoor | Outdoor | Succulent | Tropical | Flowering | Tree
  price: number;             // VNĐ
  stock: number;
  image: string;
  description: string;
  tags: string[];            // filter tags e.g. ['Easy', 'Low Light']
  light: string;             // care info
  water: string;             // care info
  difficulty: string;        // Beginner | Intermediate | Expert
  status: 'Active' | 'Hidden' | 'Out of Stock';
  isBestseller?: boolean;
  isNew?: boolean;
  rating?: number;
  reviewCount?: number;
}

// ── Entity: Cart Item ─────────────────────────────────────────
export interface CartItem {
  id: string;       // same as Product.id
  name: string;
  image: string;
  price: number;    // VNĐ — price AT TIME OF ADDING to cart
  quantity: number;
}

// ── Entity: Order Item (inside an Order) ─────────────────────
export interface OrderItem {
  productId: string;
  name: string;
  image?: string;
  quantity: number;
  unitPrice: number;  // VNĐ
  note?: string;
}

// ── Entity: Order ─────────────────────────────────────────────
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipping' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderTimeline {
  status: OrderStatus;
  date: string;
  note: string;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  note?: string;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;    // VNĐ
  shippingFee: number; // VNĐ
  total: number;       // VNĐ = subtotal + shippingFee
  paymentMethod: string;
  timeline?: OrderTimeline[];
}

// ── Entity: User Plant (plant in user's personal collection) ─
export type PlantHealthStatus = 'thriving' | 'needs-water' | 'recovering' | 'critical';

export interface UserPlant {
  id: string;
  productId?: string;        // reference to shop Product if purchased
  nickname: string;
  name: string;              // common name
  species: string;
  image: string;
  status: PlantHealthStatus;
  acquiredDate: string;
  lastWatered?: string;
  nextWatering?: string;
  light: string;
  water: string;
  difficulty: string;
  notes?: string;
}

// ── Entity: AppUser ──────────────────────────────────────────
export type UserRole = 'user' | 'admin';

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  plan: 'Free' | 'Pro';
  joinedDate: string;
  status: 'Active' | 'Suspended';
  plantCount?: number;
  orderCount?: number;
}

// ── ORDER STATUS CONFIG (shared UI config) ────────────────────
export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  pending:    { label: 'Chờ xử lý',  color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20', icon: 'schedule' },
  paid:       { label: 'Đã thanh toán', color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20', icon: 'payments' },
  processing: { label: 'Đang xử lý', color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20', icon: 'autorenew' },
  shipping:   { label: 'Đang giao',  color: 'text-sky-600 bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20', icon: 'local_shipping' },
  delivered:  { label: 'Đã giao',    color: 'text-green-600 bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20', icon: 'check_circle' },
  cancelled:  { label: 'Đã hủy',     color: 'text-red-600 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20', icon: 'cancel' },
  refunded:   { label: 'Hoàn tiền',  color: 'text-gray-600 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700', icon: 'currency_exchange' },
};

export const ORDER_STATUS_STEPS: OrderStatus[] = ['pending', 'paid', 'processing', 'shipping', 'delivered'];

// ============================================================
//  MOCK DATA — Shop Products (PLANTS for sale)
// ============================================================
export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Swiss Cheese Plant',
    species: 'Monstera Deliciosa',
    category: 'Indoor',
    price: 450000,
    stock: 24,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV4BTbCdovhgDuLSgdLhyj3ewlaeeCZAtEalxEIHggJ_dy5rCrGeYjPt5ak3zcYOBfcLRlf21jfZp_-6_9CgLPUqmB98jjnuxJg4i0szBActNx3_dZ5FBs-W13hfKMcFNTrWp4yxMPOyv1iaippcPArloP3LBCTqk-xZU4KZFhsYppcgnXzV9Sb5gLLL2jHQii1XQdY-2oYrezxKRIJ6tE_bMTQ2K2ku5XB7m8e7VqW_9urJhmVAcl919nlOTqzfpeAy6NudrI_Yo',
    description: 'Nổi tiếng với lỗ lá tự nhiên độc đáo. Phát triển tốt trong ánh sáng gián tiếp, dễ chăm sóc cho người mới bắt đầu.',
    tags: ['Dễ chăm', 'Ánh sáng vừa'],
    light: 'Ánh sáng gián tiếp',
    water: 'Mỗi 1–2 tuần',
    difficulty: 'Beginner',
    status: 'Active',
    isBestseller: true,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: '2',
    name: 'Snake Plant',
    species: 'Sansevieria Trifasciata',
    category: 'Indoor',
    price: 280000,
    stock: 42,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_44EFDoTEDx8JOEwSXsIyQQlfrftIg-J-Z58gxB2cQbrAFO5tD0MJrHpKNiwfdWnhHArqYGgeGdPgSkmUPLx-Xv9651cbfNudCovVOX1fh_G0gUuPI5eCzzeA_pJbcyDkr93wa-awONab2w5DAlD_INO-CNfc4BKCz8A1-llxKcr9rVFwBK4mFxE_3SAD51tY1vLKEhPOIe0Hx5Xp1Vx5wbiIBPatLfZKUZ-m4jC3E0_qXB6-hzO2hYDMpPlJTxLmg5jbz89CuCQ',
    description: 'Phù hợp cho người mới bắt đầu, chịu bóng tối xuất sắc. Lọc không khí tốt, cực kỳ bền bỉ.',
    tags: ['Ánh sáng thấp', 'Lọc không khí'],
    light: 'Ánh sáng thấp',
    water: 'Mỗi 3–4 tuần',
    difficulty: 'Beginner',
    status: 'Active',
    isBestseller: false,
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: '3',
    name: 'Golden Pothos',
    species: 'Epipremnum Aureum',
    category: 'Indoor',
    price: 150000,
    stock: 68,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCC072Q1kXaNsbfiFSPd_mCBuXA-Y7iW52_b9_J7H-QTwG7pnaxbdoK8u9s5CHFtRQI1wZSnbng_DPLygkUjAlDt-ZxkBOiiTVPNLZ0IcAmtxhdJov2OuxJxqi1uemUMLblzLd8F8NtR8Ao8hvOroEH7d6JmXn_rHFRopuhsuEi2iKkLseUMd98E4KYkTLHJBqqlLQmOngAtHe0xq-nP2sIm78TpgRIsalK0P2fvzAhdT24iMkiHJD5VpTcDKIfkgW8zfExwvWKvU',
    description: 'Cây trầu bà vàng leo rủ đẹp mắt, mọc nhanh và bỏ bê cũng không chết.',
    tags: ['Dễ chăm', 'Mọc nhanh'],
    light: 'Bóng mát một phần',
    water: 'Hàng tuần',
    difficulty: 'Beginner',
    status: 'Active',
    isNew: true,
    rating: 4.5,
    reviewCount: 67,
  },
  {
    id: '4',
    name: 'ZZ Plant',
    species: 'Zamioculcas Zamiifolia',
    category: 'Indoor',
    price: 320000,
    stock: 15,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6mD7oGWQWddFtUWq5-EEBL-PhanSoOTZnUW3W6quGDl3LZDwY95l3wkmWKbYusBZFKdv1VK3TfVhQRQlGdSrc61ETrTTO6zpuzgV37m5yJCnR3cvwI4WGZ3txxKzpiMB_3sA5OiTdoMDnnpVkdtACHzXejHJ9QbmZumbH0cjWFmu93kLMsQbxf6PJX1Gk5lIkxu4E-wGTkDl5TAeRe-G020oGUO-wiSXbFPjN3eVXulNAMtYCM8Egom_8GrX1Ir7jUa1oGsng1IE',
    description: 'Gần như không thể giết chết với lá bóng xanh đậm. Chịu khô hạn cực tốt.',
    tags: ['Cứng cỏi', 'Ánh sáng thấp'],
    light: 'Ánh sáng thấp',
    water: 'Hàng tháng',
    difficulty: 'Beginner',
    status: 'Active',
    rating: 4.7,
    reviewCount: 102,
  },
  {
    id: '5',
    name: 'Bird of Paradise',
    species: 'Strelitzia Reginae',
    category: 'Tropical',
    price: 890000,
    stock: 5,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV4BTbCdovhgDuLSgdLhyj3ewlaeeCZAtEalxEIHggJ_dy5rCrGeYjPt5ak3zcYOBfcLRlf21jfZp_-6_9CgLPUqmB98jjnuxJg4i0szBActNx3_dZ5FBs-W13hfKMcFNTrWp4yxMPOyv1iaippcPArloP3LBCTqk-xZU4KZFhsYppcgnXzV9Sb5gLLL2jHQii1XQdY-2oYrezxKRIJ6tE_bMTQ2K2ku5XB7m8e7VqW_9urJhmVAcl919nlOTqzfpeAy6NudrI_Yo',
    description: 'Phượng vĩ thiên đường — cây trang trí ấn tượng nhất cho không gian nội thất cao cấp.',
    tags: ['Nhiệt đới', 'Trang trí'],
    light: 'Ánh sáng trực tiếp',
    water: 'Mỗi 1–2 tuần',
    difficulty: 'Intermediate',
    status: 'Active',
    isBestseller: true,
    rating: 4.9,
    reviewCount: 43,
  },
  {
    id: '6',
    name: 'Fiddle Leaf Fig',
    species: 'Ficus Lyrata',
    category: 'Tree',
    price: 720000,
    stock: 8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5UtIT4zAbJXsJSg4fCceVRDiOzTB1Upekt9ZNC4QsKHJRmRSAtsKi1C6WYZgj3_8BwgbdazgDGygYIILcVU2wVLBwncGx63Ecc72ci7ny6HMAMMV1a-1WY-iJUiWH4LOPU7EwIoZoWTIIJnxtWvQMdKx2FK52PHPn_OrI8Vm6DoJeiM_9DbiKyTkXkPX5lZHnp9oYSDh-k7odTspkCkE2V1JiZuUKNrmf6AlBBjk4_7_WpQoVQXAWHXnaU52lYFFgB5562zEko_I',
    description: 'Cây đàn cầm — biểu tượng nội thất cao cấp với lá rộng ấn tượng.',
    tags: ['Cây cao', 'Trang trí'],
    light: 'Ánh sáng gián tiếp sáng',
    water: 'Mỗi 1–2 tuần',
    difficulty: 'Intermediate',
    status: 'Active',
    rating: 4.3,
    reviewCount: 56,
  },
  {
    id: '7',
    name: 'Peace Lily',
    species: 'Spathiphyllum Wallisii',
    category: 'Flowering',
    price: 210000,
    stock: 0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCC072Q1kXaNsbfiFSPd_mCBuXA-Y7iW52_b9_J7H-QTwG7pnaxbdoK8u9s5CHFtRQI1wZSnbng_DPLygkUjAlDt-ZxkBOiiTVPNLZ0IcAmtxhdJov2OuxJxqi1uemUMLblzLd8F8NtR8Ao8hvOroEH7d6JmXn_rHFRopuhsuEi2iKkLseUMd98E4KYkTLHJBqqlLQmOngAtHe0xq-nP2sIm78TpgRIsalK0P2fvzAhdT24iMkiHJD5VpTcDKIfkgW8zfExwvWKvU',
    description: 'Huệ bình yên — hoa trắng tinh khôi, lọc không khí tốt và dễ chăm sóc.',
    tags: ['Ra hoa', 'Lọc không khí'],
    light: 'Ánh sáng thấp đến vừa',
    water: 'Hàng tuần',
    difficulty: 'Beginner',
    status: 'Out of Stock',
    rating: 4.4,
    reviewCount: 78,
  },
  {
    id: '8',
    name: 'Cactus Mix',
    species: 'Cactaceae Spp.',
    category: 'Succulent',
    price: 95000,
    stock: 120,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_44EFDoTEDx8JOEwSXsIyQQlfrftIg-J-Z58gxB2cQbrAFO5tD0MJrHpKNiwfdWnhHArqYGgeGdPgSkmUPLx-Xv9651cbfNudCovVOX1fh_G0gUuPI5eCzzeA_pJbcyDkr93wa-awONab2w5DAlD_INO-CNfc4BKCz8A1-llxKcr9rVFwBK4mFxE_3SAD51tY1vLKEhPOIe0Hx5Xp1Vx5wbiIBPatLfZKUZ-m4jC3E0_qXB6-hzO2hYDMpPlJTxLmg5jbz89CuCQ',
    description: 'Bộ xương rồng mix đa dạng, ít cần nước, phù hợp mọi không gian nhỏ.',
    tags: ['Mọng nước', 'Ít tưới'],
    light: 'Ánh sáng trực tiếp',
    water: 'Mỗi 2–4 tuần',
    difficulty: 'Beginner',
    status: 'Active',
    isNew: true,
    rating: 4.2,
    reviewCount: 31,
  },
];

// Helper: get product by id
export const getProductById = (id: string): Product | undefined =>
  PRODUCTS.find(p => p.id === id);

// ============================================================
//  MOCK DATA — User's Personal Plant Collection
// ============================================================
export const MY_PLANTS: UserPlant[] = [
  {
    id: 'user-1',
    productId: '2',
    nickname: 'Spikey',
    name: 'Snake Plant',
    species: 'Sansevieria Trifasciata',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_44EFDoTEDx8JOEwSXsIyQQlfrftIg-J-Z58gxB2cQbrAFO5tD0MJrHpKNiwfdWnhHArqYGgeGdPgSkmUPLx-Xv9651cbfNudCovVOX1fh_G0gUuPI5eCzzeA_pJbcyDkr93wa-awONab2w5DAlD_INO-CNfc4BKCz8A1-llxKcr9rVFwBK4mFxE_3SAD51tY1vLKEhPOIe0Hx5Xp1Vx5wbiIBPatLfZKUZ-m4jC3E0_qXB6-hzO2hYDMpPlJTxLmg5jbz89CuCQ',
    status: 'thriving',
    acquiredDate: '2024-01-15',
    lastWatered: '2026-03-15',
    nextWatering: '2026-04-05',
    light: 'Ánh sáng thấp',
    water: 'Mỗi 3–4 tuần',
    difficulty: 'Beginner',
    notes: 'Cây rất khỏe mạnh, không cần chăm nhiều.',
  },
  {
    id: 'user-2',
    productId: '1',
    nickname: 'Monstera Mike',
    name: 'Swiss Cheese Plant',
    species: 'Monstera Deliciosa',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV4BTbCdovhgDuLSgdLhyj3ewlaeeCZAtEalxEIHggJ_dy5rCrGeYjPt5ak3zcYOBfcLRlf21jfZp_-6_9CgLPUqmB98jjnuxJg4i0szBActNx3_dZ5FBs-W13hfKMcFNTrWp4yxMPOyv1iaippcPArloP3LBCTqk-xZU4KZFhsYppcgnXzV9Sb5gLLL2jHQii1XQdY-2oYrezxKRIJ6tE_bMTQ2K2ku5XB7m8e7VqW_9urJhmVAcl919nlOTqzfpeAy6NudrI_Yo',
    status: 'needs-water',
    acquiredDate: '2024-03-01',
    lastWatered: '2026-03-05',
    nextWatering: '2026-03-18',
    light: 'Ánh sáng gián tiếp',
    water: 'Mỗi 1–2 tuần',
    difficulty: 'Beginner',
    notes: 'Cần tưới sớm, đất đang khô.',
  },
  {
    id: 'user-3',
    productId: '3',
    nickname: 'Penny',
    name: 'Golden Pothos',
    species: 'Epipremnum Aureum',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCC072Q1kXaNsbfiFSPd_mCBuXA-Y7iW52_b9_J7H-QTwG7pnaxbdoK8u9s5CHFtRQI1wZSnbng_DPLygkUjAlDt-ZxkBOiiTVPNLZ0IcAmtxhdJov2OuxJxqi1uemUMLblzLd8F8NtR8Ao8hvOroEH7d6JmXn_rHFRopuhsuEi2iKkLseUMd98E4KYkTLHJBqqlLQmOngAtHe0xq-nP2sIm78TpgRIsalK0P2fvzAhdT24iMkiHJD5VpTcDKIfkgW8zfExwvWKvU',
    status: 'recovering',
    acquiredDate: '2024-06-20',
    lastWatered: '2026-03-12',
    nextWatering: '2026-03-19',
    light: 'Bóng mát một phần',
    water: 'Hàng tuần',
    difficulty: 'Beginner',
    notes: 'Đang phục hồi sau khi bị ngập nước.',
  },
];

// ============================================================
//  MOCK DATA — Orders
// ============================================================
export const MOCK_ORDERS: Order[] = [
  {
    id: 'DB-849201',
    date: '2026-03-10',
    status: 'delivered',
    items: [
      { productId: '6', name: 'Fiddle Leaf Fig', quantity: 1, unitPrice: 720000, note: 'Chậu gốm đi kèm' },
      { productId: '1', name: 'Swiss Cheese Plant', quantity: 2, unitPrice: 450000, note: 'Size lớn' },
    ],
    shippingInfo: {
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'nguyenvana@email.com',
      address: '123 Nguyễn Trãi, Quận 1',
      city: 'TP. Hồ Chí Minh',
    },
    subtotal: 1620000,
    shippingFee: 30000,
    total: 1650000,
    paymentMethod: 'PayOS - Chuyển khoản ngân hàng',
    timeline: [
      { status: 'pending',    date: '2026-03-10 09:00', note: 'Đơn hàng đã đặt' },
      { status: 'paid',       date: '2026-03-10 09:05', note: 'Thanh toán thành công qua PayOS' },
      { status: 'processing', date: '2026-03-11 11:00', note: 'Đang chuẩn bị cây' },
      { status: 'shipping',   date: '2026-03-12 08:00', note: 'Đang vận chuyển' },
      { status: 'delivered',  date: '2026-03-13 14:30', note: 'Giao hàng thành công' },
    ],
  },
  {
    id: 'DB-842155',
    date: '2026-02-20',
    status: 'delivered',
    items: [
      { productId: '2', name: 'Snake Plant', quantity: 1, unitPrice: 280000, note: 'Chậu nhựa tiêu chuẩn' },
    ],
    shippingInfo: {
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'nguyenvana@email.com',
      address: '123 Nguyễn Trãi, Quận 1',
      city: 'TP. Hồ Chí Minh',
    },
    subtotal: 280000,
    shippingFee: 30000,
    total: 310000,
    paymentMethod: 'PayOS - Chuyển khoản ngân hàng',
    timeline: [
      { status: 'pending',   date: '2026-02-20 10:00', note: 'Đơn hàng đã đặt' },
      { status: 'paid',      date: '2026-02-20 10:02', note: 'Thanh toán thành công' },
      { status: 'delivered', date: '2026-02-22 15:00', note: 'Giao hàng thành công' },
    ],
  },
  {
    id: 'DB-839100',
    date: '2026-01-15',
    status: 'cancelled',
    items: [
      { productId: '5', name: 'Bird of Paradise', quantity: 1, unitPrice: 890000 },
    ],
    shippingInfo: {
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'nguyenvana@email.com',
      address: '123 Nguyễn Trãi, Quận 1',
      city: 'TP. Hồ Chí Minh',
    },
    subtotal: 890000,
    shippingFee: 30000,
    total: 920000,
    paymentMethod: 'PayOS - Chuyển khoản ngân hàng',
    timeline: [
      { status: 'pending',   date: '2026-01-15 08:00', note: 'Đơn hàng đã đặt' },
      { status: 'cancelled', date: '2026-01-15 09:00', note: 'Người dùng hủy đơn' },
    ],
  },
];

// ============================================================
//  MOCK DATA — Admin Users
// ============================================================
export const MOCK_USERS: AppUser[] = [
  { id: 'u1', fullName: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0901234567', role: 'user', plan: 'Pro', joinedDate: '2024-01-10', status: 'Active', plantCount: 5, orderCount: 3 },
  { id: 'u2', fullName: 'Trần Thị B', email: 'tranthib@email.com', phone: '0912345678', role: 'user', plan: 'Free', joinedDate: '2024-03-22', status: 'Active', plantCount: 2, orderCount: 1 },
  { id: 'u3', fullName: 'Lê Văn C', email: 'levanc@email.com', phone: '0923456789', role: 'user', plan: 'Free', joinedDate: '2024-06-05', status: 'Suspended', plantCount: 0, orderCount: 0 },
  { id: 'u4', fullName: 'Admin System', email: 'admin@deskboost.com', role: 'admin', plan: 'Pro', joinedDate: '2023-12-01', status: 'Active', plantCount: 0, orderCount: 0 },
];

// ── Backward-compatibility alias (PlantList.jsx uses PLANTS) ──
// Keep this so PlantList.jsx import doesn't break before migration
export const PLANTS = PRODUCTS;

// ============================================================
//  Entity: FinancialRecord
// ============================================================
export type FinancialType = 'income' | 'expense';

export type FinancialCategory =
  | 'sales'          // income from orders
  | 'retail'         // selling individual pots/plants
  | 'marketing'      // ads, promotions
  | 'operations'     // utilities, office
  | 'import'         // cost to import plants
  | 'maintenance'    // website, tools
  | 'salary'         // staff
  | 'logistics'      // shipping cost
  | 'other';

export interface FinancialRecord {
  id: string;
  type: FinancialType;
  amount: number;       // VNĐ, always positive
  currency: 'VND';
  category: FinancialCategory;
  description: string;
  date: string;         // ISO date string YYYY-MM-DD
  orderId?: string;     // linked order (for auto-income entries)
  createdBy?: string;   // admin user id or name
}

// ── Category config for UI ───────────────────────────────────
export const FINANCIAL_CATEGORY_CONFIG: Record<FinancialCategory, { label: string; icon: string; color: string }> = {
  sales:       { label: 'Doanh thu đơn hàng', icon: 'shopping_bag',       color: 'text-[#4CAF50] bg-[#4CAF50]/10' },
  retail:      { label: 'Bán lẻ chậu cây',     icon: 'potted_plant',       color: 'text-teal-500 bg-teal-50 dark:bg-teal-500/10' },
  marketing:   { label: 'Marketing',           icon: 'campaign',           color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10' },
  operations:  { label: 'Vận hành',            icon: 'business_center',    color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
  import:      { label: 'Nhập hàng',           icon: 'local_florist',      color: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10' },
  maintenance: { label: 'Bảo trì hệ thống',   icon: 'build',              color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
  salary:      { label: 'Nhân sự',             icon: 'group',              color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' },
  logistics:   { label: 'Vận chuyển',          icon: 'local_shipping',     color: 'text-sky-500 bg-sky-50 dark:bg-sky-500/10' },
  other:       { label: 'Khác',                icon: 'more_horiz',         color: 'text-slate-500 bg-slate-100 dark:bg-slate-800' },
};

// ── Auto-derive income from MOCK_ORDERS + manual expenses ────
export const MOCK_FINANCIALS: FinancialRecord[] = [
  // ── Auto income from delivered orders ──────────────────────
  {
    id: 'fin-ord-1',
    type: 'income',
    amount: 1650000,
    currency: 'VND',
    category: 'sales',
    description: 'Doanh thu đơn hàng #DB-849201',
    date: '2026-03-10',
    orderId: 'DB-849201',
    createdBy: 'system',
  },
  {
    id: 'fin-ord-2',
    type: 'income',
    amount: 310000,
    currency: 'VND',
    category: 'sales',
    description: 'Doanh thu đơn hàng #DB-842155',
    date: '2026-02-20',
    orderId: 'DB-842155',
    createdBy: 'system',
  },
  // ── Manual income ────────────────────────────────────────────
  {
    id: 'fin-inc-1',
    type: 'income',
    amount: 2500000,
    currency: 'VND',
    category: 'sales',
    description: 'Doanh thu tháng 1 (tổng hợp)',
    date: '2026-01-31',
    createdBy: 'admin',
  },
  {
    id: 'fin-inc-2',
    type: 'income',
    amount: 800000,
    currency: 'VND',
    category: 'marketing',
    description: 'Hoa hồng affiliate tháng 2',
    date: '2026-02-28',
    createdBy: 'admin',
  },
  // ── Manual expenses ─────────────────────────────────────────
  {
    id: 'fin-exp-1',
    type: 'expense',
    amount: 3200000,
    currency: 'VND',
    category: 'import',
    description: 'Nhập cây tháng 3: Monstera, ZZ, Pothos (50 cây)',
    date: '2026-03-02',
    createdBy: 'admin',
  },
  {
    id: 'fin-exp-2',
    type: 'expense',
    amount: 1500000,
    currency: 'VND',
    category: 'salary',
    description: 'Lương nhân viên chăm sóc cây (tháng 3)',
    date: '2026-03-05',
    createdBy: 'admin',
  },
  {
    id: 'fin-exp-3',
    type: 'expense',
    amount: 650000,
    currency: 'VND',
    category: 'logistics',
    description: 'Chi phí giao hàng tháng 3',
    date: '2026-03-08',
    createdBy: 'admin',
  },
  {
    id: 'fin-exp-4',
    type: 'expense',
    amount: 290000,
    currency: 'VND',
    category: 'marketing',
    description: 'Chạy quảng cáo Facebook tháng 3',
    date: '2026-03-10',
    createdBy: 'admin',
  },
  {
    id: 'fin-exp-5',
    type: 'expense',
    amount: 200000,
    currency: 'VND',
    category: 'maintenance',
    description: 'Chi phí domain & hosting tháng 3',
    date: '2026-03-01',
    createdBy: 'admin',
  },
  {
    id: 'fin-exp-6',
    type: 'expense',
    amount: 450000,
    currency: 'VND',
    category: 'operations',
    description: 'Tiền điện, nước kho (tháng 3)',
    date: '2026-03-07',
    createdBy: 'admin',
  },
  {
    id: 'fin-exp-7',
    type: 'expense',
    amount: 2800000,
    currency: 'VND',
    category: 'import',
    description: 'Nhập cây tháng 2: Cactus, Peace Lily, Snake Plant',
    date: '2026-02-05',
    createdBy: 'admin',
  },
  {
    id: 'fin-exp-8',
    type: 'expense',
    amount: 980000,
    currency: 'VND',
    category: 'salary',
    description: 'Thưởng doanh số nhân viên tháng 2',
    date: '2026-02-28',
    createdBy: 'admin',
  },
  {
    id: 'fin-inc-3',
    type: 'income',
    amount: 3100000,
    currency: 'VND',
    category: 'sales',
    description: 'Doanh thu tháng 2 (tổng hợp)',
    date: '2026-02-29',
    createdBy: 'admin',
  },
  {
    id: 'fin-ret-1',
    type: 'income',
    amount: 150000,
    currency: 'VND',
    category: 'retail',
    description: 'Bán lẻ: 1x Chậu Monstera Mini (khách vãng lai)',
    date: '2026-03-16',
    createdBy: 'admin',
  },
  {
    id: 'fin-ret-2',
    type: 'income',
    amount: 450000,
    currency: 'VND',
    category: 'retail',
    description: 'Bán lẻ: 3x Chậu Sen Đá Mix (khách trực tiếp)',
    date: '2026-03-17',
    createdBy: 'admin',
  },
  {
    id: 'fin-exp-9',
    type: 'expense',
    amount: 120000,
    currency: 'VND',
    category: 'other',
    description: 'Mua đất trồng và chậu bổ sung',
    date: '2026-03-15',
    createdBy: 'admin',
  },
];

// ============================================================
//  MOCK DATA — All User Plants (Admin View)
// ============================================================
export interface AdminUserPlant extends UserPlant {
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
}

export const MOCK_ALL_USER_PLANTS: AdminUserPlant[] = [
  {
    id: 'up-1',
    ownerId: 'u1',
    ownerName: 'Nguyễn Văn A',
    ownerEmail: 'nguyenvana@email.com',
    ownerPhone: '0901234567',
    nickname: 'Bé Monstera',
    name: 'Swiss Cheese Plant',
    species: 'Monstera Deliciosa',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV4BTbCdovhgDuLSgdLhyj3ewlaeeCZAtEalxEIHggJ_dy5rCrGeYjPt5ak3zcYOBfcLRlf21jfZp_-6_9CgLPUqmB98jjnuxJg4i0szBActNx3_dZ5FBs-W13hfKMcFNTrWp4yxMPOyv1iaippcPArloP3LBCTqk-xZU4KZFhsYppcgnXzV9Sb5gLLL2jHQii1XQdY-2oYrezxKRIJ6tE_bMTQ2K2ku5XB7m8e7VqW_9urJhmVAcl919nlOTqzfpeAy6NudrI_Yo',
    status: 'thriving',
    acquiredDate: '2024-01-15',
    lastWatered: '2026-03-16',
    nextWatering: '2026-03-23',
    light: 'Gián tiếp',
    water: 'Mỗi tuần',
    difficulty: 'Beginner',
  },
  {
    id: 'up-2',
    ownerId: 'u2',
    ownerName: 'Trần Thị B',
    ownerEmail: 'tranthib@email.com',
    ownerPhone: '0912345678',
    nickname: 'Lưỡi Hổ 1',
    name: 'Snake Plant',
    species: 'Sansevieria Trifasciata',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_44EFDoTEDx8JOEwSXsIyQQlfrftIg-J-Z58gxB2cQbrAFO5tD0MJrHpKNiwfdWnhHArqYGgeGdPgSkmUPLx-Xv9651cbfNudCovVOX1fh_G0gUuPI5eCzzeA_pJbcyDkr93wa-awONab2w5DAlD_INO-CNfc4BKCz8A1-llxKcr9rVFwBK4mFxE_3SAD51tY1vLKEhPOIe0Hx5Xp1Vx5wbiIBPatLfZKUZ-m4jC3E0_qXB6-hzO2hYDMpPlJTxLmg5jbz89CuCQ',
    status: 'critical',
    acquiredDate: '2024-02-10',
    lastWatered: '2026-02-15', // Over a month ago!
    nextWatering: '2026-03-01',
    light: 'Thấp',
    water: 'Mỗi 3 tuần',
    difficulty: 'Beginner',
  },
  {
    id: 'up-3',
    ownerId: 'u1',
    ownerName: 'Nguyễn Văn A',
    ownerEmail: 'nguyenvana@email.com',
    ownerPhone: '0901234567',
    nickname: 'Trầu Bà Vàng',
    name: 'Golden Pothos',
    species: 'Epipremnum Aureum',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCC072Q1kXaNsbfiFSPd_mCBuXA-Y7iW52_b9_J7H-QTwG7pnaxbdoK8u9s5CHFtRQI1wZSnbng_DPLygkUjAlDt-ZxkBOiiTVPNLZ0IcAmtxhdJov2OuxJxqi1uemUMLblzLd8F8NtR8Ao8hvOroEH7d6JmXn_rHFRopuhsuEi2iKkLseUMd98E4KYkTLHJBqqlLQmOngAtHe0xq-nP2sIm78TpgRIsalK0P2fvzAhdT24iMkiHJD5VpTcDKIfkgW8zfExwvWKvU',
    status: 'recovering',
    acquiredDate: '2024-03-05',
    lastWatered: '2026-03-14',
    nextWatering: '2026-03-21',
    light: 'Vừa',
    water: 'Hàng tuần',
    difficulty: 'Beginner',
  },
  {
    id: 'up-4',
    ownerId: 'u4',
    ownerName: 'Admin System',
    ownerEmail: 'admin@deskboost.com',
    ownerPhone: '0123456789',
    nickname: 'Xương Rồng Bàn',
    name: 'Cactus Mix',
    species: 'Cactaceae Spp.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_44EFDoTEDx8JOEwSXsIyQQlfrftIg-J-Z58gxB2cQbrAFO5tD0MJrHpKNiwfdWnhHArqYGgeGdPgSkmUPLx-Xv9651cbfNudCovVOX1fh_G0gUuPI5eCzzeA_pJbcyDkr93wa-awONab2w5DAlD_INO-CNfc4BKCz8A1-llxKcr9rVFwBK4mFxE_3SAD51tY1vLKEhPOIe0Hx5Xp1Vx5wbiIBPatLfZKUZ-m4jC3E0_qXB6-hzO2hYDMpPlJTxLmg5jbz89CuCQ',
    status: 'needs-water',
    acquiredDate: '2024-01-20',
    lastWatered: '2026-03-01',
    nextWatering: '2026-03-15',
    light: 'Trực tiếp',
    water: 'Mỗi tháng',
    difficulty: 'Beginner',
  },
];

// ============================================================
//  Entity: Message (Mail / Notification)
// ============================================================
export type MessageType = 'promotional' | 'update' | 'care-tip' | 'custom';
export type MessageStatus = 'sent' | 'pending' | 'failed';
export type MessageChannel = 'email' | 'notification' | 'both';

export interface Message {
  id: string;
  subject: string;
  content: string;
  type: MessageType;
  recipients: string[]; // array of user ids
  recipientNames: string; // for display convenience
  channel: MessageChannel;
  status: MessageStatus;
  createdAt: string;
}

export const MESSAGE_TYPE_CONFIG: Record<MessageType, { label: string; icon: string; color: string }> = {
  promotional: { label: 'Khuyến mãi', icon: 'sell', color: 'text-pink-600 bg-pink-50 dark:bg-pink-500/10' },
  update:      { label: 'Cập nhật hệ thống', icon: 'system_update', color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' },
  'care-tip':  { label: 'Mẹo chăm sóc', icon: 'tips_and_updates', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' },
  custom:      { label: 'Tin nhắn tùy chỉnh', icon: 'chat', color: 'text-slate-600 bg-slate-50 dark:bg-slate-800' },
};

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    subject: 'Ưu đãi 20% các loại cây mọng nước vào cuối tuần này',
    content: 'Chào các bạn, DeskBoost đang có chương trình khuyến mãi 20% cho toàn bộ bộ sưu tập Sen đá và Xương rồng...',
    type: 'promotional',
    recipients: ['all'],
    recipientNames: 'Tất cả người dùng',
    channel: 'both',
    status: 'sent',
    createdAt: '2026-03-15 10:00',
  },
  {
    id: 'msg-2',
    subject: 'Tính năng "AI Health Monitor" đã ra mắt',
    content: 'Chúng tôi vừa cập nhật tính năng theo dõi sức khỏe cây cộng đồng cho quản trị viên...',
    type: 'update',
    recipients: ['u1', 'u2'],
    recipientNames: 'Nguyễn Văn A, Trần Thị B',
    channel: 'notification',
    status: 'sent',
    createdAt: '2026-03-16 14:30',
  },
  {
    id: 'msg-3',
    subject: 'Cách chăm sóc Monstera vào mùa hanh khô',
    content: 'Vào mùa này, bạn nên tăng độ ẩm cho lá bằng cách phun sương thường xuyên hơn...',
    type: 'care-tip',
    recipients: ['u1'],
    recipientNames: 'Nguyễn Văn A',
    channel: 'email',
    status: 'pending',
    createdAt: '2026-03-17 09:00',
  },
];


