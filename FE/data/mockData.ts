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
  price: number;             // Current selling price (VNĐ)
  originalPrice?: number;    // Original price before discount (VNĐ)
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
  relatedProductIds?: string[]; // IDs of products to suggest as "Buy Together"
  comboDiscount?: number;       // Percentage discount if bought as a combo
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
    originalPrice: 600000,
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
    originalPrice: 400000,
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
    originalPrice: 200000,
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
    originalPrice: 380000,
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
    originalPrice: 1100000,
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
    originalPrice: 850000,
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
    originalPrice: 280000,
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
    originalPrice: 130000,
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
    relatedProductIds: ['p1', 's1'],
  },
  // ── New Categories: Pots, Soil, Fertilizer, Accessories ──
  {
    id: 'p1',
    name: 'Chậu Gốm Ceramic Minimalist',
    species: 'N/A',
    category: 'Pot',
    price: 120000,
    originalPrice: 160000,
    stock: 50,
    image: 'data:image/jpeg;base64,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',
    description: 'Thiết kế tối giản, phù hợp với mọi loại cây nội thất.',
    tags: ['Gốm', 'Minimalist'],
    light: 'N/A',
    water: 'N/A',
    difficulty: 'N/A',
    status: 'Active',
    rating: 4.9,
    reviewCount: 45,
  },
  {
    id: 's1',
    name: 'Đất Trồng Sen Đá Premium',
    species: 'N/A',
    category: 'Soil',
    price: 45000,
    originalPrice: 65000,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=400&auto=format&fit=crop',
    description: 'Hỗn hợp đất chuyên dụng, thoát nước tốt cho sen đá và xương rồng.',
    tags: ['Thoát nước tốt', 'Dinh dưỡng'],
    light: 'N/A',
    water: 'N/A',
    difficulty: 'N/A',
    status: 'Active',
    rating: 4.7,
    reviewCount: 120,
  },
  {
    id: 'f1',
    name: 'Phân Bón Hữu Cơ Đa Năng',
    species: 'N/A',
    category: 'Fertilizer',
    price: 85000,
    originalPrice: 110000,
    stock: 60,
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXFyAbGBgYGR0dGBggGh0bHRgeGB4fHyggGx4lHRcdITEiJikrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0mICUvLy0tLy0tLS0vLS0tLS0tLS4vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAQMAwgMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAFBgMEAAIHAQj/xABFEAACAQIEAwYDBQYDBwMFAAABAhEAAwQSITEFQVEGEyJhcYEykaFCUrHB0RQjYnLh8BUz8QcWQ4KSstJTc6IkNGOT8v/EABoBAAMBAQEBAAAAAAAAAAAAAAECAwAEBQb/xAAtEQACAgICAQMCBgEFAAAAAAAAAQIRAyESMUEEUWETIgVxgZGhsfAyM0JSwf/aAAwDAQACEQMRAD8AcuN2/wB/dD+FS0k/eC6wSNYETp0qtwnjxW3et2il1QMtkqxIBEAq5iBGaRqSRy0oPxjGYlMTiSxuZDfPdZxNsZG0ggN4T4VK6SZ6NAzB4HGX7rXHtXMviyNqMp1DNlBk7QDlj1rwpxayOSZzXTtBnG4e7dtND92yz48kZYIJC+Ry7yeW9LTY+4rB3IOcEhhzKwNV6+YG51mo8Hxm7aKq6ul1CAyOWy3kMhjlaAlxZmY1jy1qX3OKe7dtWLi20YBY1yMRr8OwJAJ6AUv0HVPok3bIeLcRN6+ltERmWT4VILE7yYBBEbimLAXyVzNcXMgCi6CAArNDgyBqoLRy8akTE0k8RW7bxTZ8neKw1SDbneRMhgfPeaaMfiWxeHUHIbzqobJCZh457wCZK5W2EkMIGgqmXEqS/kyDXaJf2K/hGsIrItwFiVXMFykuWcmQMsxAA8JB3AOcFuh71y+twEXEcO43twPABpoBB189Zmqpx5w3dpcBcFbaiAxhGErmYz9ltpMDck1eTAZLt0W1K2yCMvwyp0giY1Gmlc/06VPxr89mcvYqYO+uLVrllWLK5XxHQaTmPNp0MDeaLvh8WpCvLWSoL3WVWykCf8vdQSP4zJ5A6LCYC4l0g3Xs2lGRVRWAtjeWCkliSAcxHntRLsh2qvy9u8c6gEqbjAMQOhOrHf8AUc6TjFbpNfyGLQz4F1xWEbuLkXlUnTRS4GhZQYhtNtIbypOtcaxJQBLqZu7zuoX/ACxIAnMIiTtvrTNwW7YR7t2yfC4GdSGUKd1IkRuxBg6z6UmviO6a4cxFxyUjTKAHzSpjSdoMzyoR4S1RRytBC/2gxC27bOtvP8RzIswNNcoGWeVacb4kwW3eB71nEi0oOUAAg5hvpPOgK4O5iXORDIjMik6GPptvRzheBvKucXVtXEBSHUQFMZvU6aVRQVqydspdm+JFkcXrSm4xLC7m8X8oHIR50dwnCg91L1q61vSCitJPPxT50oY7gbWw2Uvq3hcHw+/SgPC7uIS+O7dgxJGh3oy9K8j5QkkMnZ2Hi9/JLZv3hGg1MxuI20pBt43PdD3CwzEgRyPIGm/s7h1UC3fuZrh8YB+yW319ZoHj+EgftFzMrkSAILCTsyR9rlUZJJrl+VhkrAHFMKUYnTrrqP8AWtjjbd5mLWwrMYzW/CgnTbYbVXOAvmyLr227uYzNsJ/vpUlrEmyDbt5GVllhc1AMRmB5N0q8YPjT7Jok4pi1um4qoFygZcs5RAA1J5mDQbDMAlw7t9lv1PKvLWJKq8nRt/OOc1DdZbngsrc8TiAxGWI1nzza+lWhj7Xg1FkY9spbMVeAsKMqssbabx0NWMDxtbeHdChNxrhaddQQu/oVPzrS92UvJbW4zW1RvhGY526lR08/PnUT4SBtoPLSml9J6YXQNuOCSYU6766+euteVbOHXy+tZT80Mdr47gS73hazvmuNmRSUQHOToSQxedSV16V6vHMRakKylFgBSuYpAAAJzBjAG+s86CY3HYu3ib1wqLdvv2B7xWysC7BYzfDmXbYGZG9WsXxS6tzLbS1cCtDyQCAT4VzncqsE5hJJI5SeDLqTV0Omz3jPHXPd3Llq3cDzbFwI2VWIYC258R8YIEQd2FJS8RtjEZe7bDXQwV1VzkLfdZNBE6e49nq5xi41xsP3AhllXZVazdXnmA1idJkwY01FJ/aTsbduObtu2Lenit5iTOskOfizHr13NPhhH/l/Yk3YWvuzBVuYLDmCPEbbTAOwfNmGuv5VUw1pMNdu3v2gLcvOYthSSimc0wuh1KyORPM6QdhuK4lUuqmHv4gBoObVLe2hLEHMI+AdZ5RTThOzyXbjX7gtsxC5raElEuLJJIbVviHhYaEE6yAFyXB03SFUGUxdVrebGtnBBy2yoYZF+FlVVlSB4Sx9KscN7UWpyFHC6BALZLCdiSDsRBgidd+gjtF2VLuLoxLKGkXGu6gk8tIAGURER4R7L+JW3hsq23DvmligBWBsdRLemg3pVihON8nbDdHR+Ot+5F63c7uD4rgUtnTmIGsqdfLxdaUsJ2huusd3nI1MeAKoJGbNMz5QPrQGxxTEW8zBym2iwQ4OgBOo0HWmbDFUC4trxtK0KtpkUMygA+MjeY33iKz9PGMbmk2BPyWbXDMPcwuZrt0O5zMJKqxHkdo686WuL5bkItkhkWcy3FYFF67Qdq37S8ctXrw7li6EeNWkAbc+dLaYqCwgBQZA5jp5mrYsM2+Uv0Cxj4LcxOH/AHlvXvRlKn7R3A8j0o1ipv3FRUJumC1o7ajr5RSle4tcY2WiACCNdD5+VOQ7Xi2z3oC3WAULGYALtroddTVJQa7CkmU79pkzoNSrZSsyq+vzogmAweEti7cIZzpI/KpeCcQ4dcQ95cZ7r+JgdADznlv1pN7U5S7OD4c0IoMgCpxxKf2vyGqVk2I4mbl0OuHbKBJ0MMBsfStsVx5LlpVX924PLSZOgUVRxPH3ypas3Gcxl+ETryGmtCsXw/Eq3722yMdswgH0O01X6EP9PQLGx+IWbNuwAbjXA4dluNmtN5FZgD2oFxy8Ll5jAUMxOVNhPTyoMty6ZJBIGhPMVaxYDAMBlAGpBkn1plFx0xXbIsXaiZaQP70rzB31tOGKllgysxMgj+taScuYgFSYmdR7VtbwBZ5c3LaH4Xa2SD00008xNVVVTNXuF7fHbC21BBz6yAIXcka+kcqF4zjd5iQjZAdwp3/mnf5CqpwMXAjELLQX+zqdCD051FxfAtYfKWDAiQQIn+sihDDiUtLY8YqyE4l/v/WsqHXoa8q9Iejv3FO2F8Oyj9nYZyARq4ytHiB0Eeh57Vz7tIrYm8e4N7Xx3UFpj44EtbyAyNgQYggxM008TwmEtlL+Ful7gut3quYS4r5jC6bqzab7mTpNS2+2YtXh3WGeXeALajxmSArFjAkyYHTprXAnU/f/AMA1b+5izwHieLsZTetXe4Rh4iJa1HxEK0NB1kHQb8temYTiFvEW3yMp0gaEMDPMbgEbT/oL7U8T79VurZFvwjvO9XK4GoygjSSxAGpB16zSLw/iLq9xVYoMx0UnUbgfl5TU5x5Rco+/gm3ToZP8RS07Wrdy7nv6glj3TMZXwAnLqwiQNSPigagMbihbsjFK7TdcyQcrsVYDTmDmUgsAR4INH+K8PWVtXLge5o9qdMs3BppqC2onaYPWBPHQXKrcVF7qQAywhZiXuMoJAMs0faEq3uFxS+4Djq2ScO7Qti7b275tgjVGuFRB8USUywRlPKCJB5ArXC3uAwbQLSNWLTljRYEZZmZ8hU142mdnzWgUliWYAvrsAB4m8l86H8U45cvA5WuKCIcC4crakjw+kCNdq6ceJPUVr+hdvoZ+C4cPbtKbTuRdcNbDoLbFdswOpMERJqlxu6bxZX8Ny2IJc5Y6KABGm3XShScYUW1XKyQoUlIGcDm2mpHU1W4jiXc+IkzBk/ERGkn0p1hlyHrQZ4Nw7BsB3l/u7u4JYKvlGkfOgt11tYhw6rdCsZ8Uhvcb1YHBWYKUttBG+mp5xXtq7atXAt1GUoZjLrI5Hyowxq5fc3f8fsBNMgt46GbwIq6kKRMTyqBccY3JNE8FxLDteud4ikXJgt8K9IFeYLhuDNgub5W6HgryIJ0iqJJPaHoEYQ2sy5mZJPiYchU2KKhmCOXWdCedU8ZbUOyqZE6GstLC1dR3Zj3BYxrVxbi/EpkeRq/xftXicSf31yRMgAAAUOwNtHuBbj5F1k/hUmE4O903O7gi2Jk6SNY+cVOcYXcgluwqzbYklGPj9OdXuMXLKvmsZspG0aCq1vAvZwpvHJqwABPi1jWPeoMGzNbe4VzKDBMjT2qLim+SYHd6Kl3FDMREE8xpW9+SM7vnY6QSWYR1mqwwxZ/D9owPejmPxmIso+EyWlCrDGJZtjIM761RrqhqsBXcbcJ1dvmY+VWsbjrbW7YFss4AzM+gB55QsaVWu2CqhiIDbHrG9V0ejwWjUFV47dj4P7/6ayohxM8kEctayo/TX/QXfsNl3i13Mqm3ZRdYi3khmnVmA5ka6a6idZobe4c8veuMyi1lCZTozaE5GnZYkxJEjrRe9xVrTTh7ItW2BZhAbQaKFDAnTfWTLGqvFEF2xZHcMj2zmXuxK3LbwTqF0YESCAwIYmSdx52jPZWucbxF+M97MLeoR2AVuUldM5+ZrZOMpp4coGjXEGnkNiWPvUGG4XnxNuyfArvlFxyQh+7LAaAnQweZ2qfjVq2MoFuzaUORNtiTc1nQsSYGgymI3g1pRg/tBQcwIN6yb5m4IAViQD4SFysSZ0lepEjcUrY7BkMFJzS3iiY3IABI6Hp84kz4G+GFy2bmQBSQqhiAANc0CANRLE8zVKzdzDI9xi85QMxbTXYbaEdRuInWFxYnCTo0vgIvw22ZVdC0IojNEZcxUTrII1POeoqpx/hwssCqlVYtCEgsoGwbKSJg8iduVHeF8Tt2rTJdgtmCh1MFVmWz6EgwMo9fSr4w9vEWLWUW0NxizzJa2o2BcgAaCeUnrTrJKL+7oVdCXhcA11TEwpCppoWMeGeXWmYcN7m2Di7RJEW7R07ska+Np16e1U8SptqVspcuWgZLBGCnzHtzqlxXjxvYezYlgtvUgxBPWdzvV95Ouh4NPszj/HO8bLaTuUU/CrSMw5qeQoLic7nMxJY6yTJNaNXiO0wup6VaMFHozLmA4PdvBggHhEmTGlCi0mrV0XEBBbLPKdfpVezZZjCqWPQCT9KZJ+TI3Wpx8NXMLwDEuYWxcnzUj8at3uy+LA/yWPoQfwNEZi0zwa3t451nKSJEGDEjoaJf7sYtjph7n/T+tR3+zmLQScPcjyUn8KVxT7DSBt7EM5EkmNq8F1tpIHMTofWvHQqfECvqI/Gvc43oUkEmQkgmZrfLmHimeprW0mk1o5IMCpsR76PXTQLJMbVo4qVrhI2qAnrWQ0bL1rhBZQ3eJqAd+vvWVQNeUvGXv/AaHPDcbK3oCXGtlmdbS3DCtvMkEuYmT4Z38qJLxO0VzOXGgCNm/wArkJVRrlkE7cqF8GwD5C8EEZgsoXVmDCQSvwwVnqdOWhrYwlhcLAsS4GYAxAG/PZQNd/GOtRlGE/0FTVD7xXBXLTpfUi4RBVxqBpup1gGSRUFrtGU8bqGf7TfEzmPihhv4YgHTSNqCdjeL4oMlkOO4n7dvOFHQahoJO06TPWmniOE8YKWrZXPm0Gq9ZYHxdRprpPOuXHyxT4p/l/nuLBMA8Z7TvnBw8FV0uDKpDgxMaTOuuu4HQy48L7NIytcdAQd2KiZjQhdlHoJ89qFcP4bh0VkyksVORn5EA6Zgd48gek0Z4St20pF1mu5QWzA/FPLWdvwqmbNviuw012D7+EtElIQXAPhDSR5kAwIkanXURW9jhiAy0MSIII0M7n10j3r1MUbpLxAJ09NoPUggipVU/wBxXTixRklJrY1J7LSvB0An0odc7OYW4SWsW5Op3X30NWrdsyK3dtxBiuhRS6Q1IGf7nYLYWNTzDvp5iT+IpT4n2b7q61qw0xEu2rCROsbsPYV0jCNoZ9BS7M4jFCBKusf/AKrZ/Gae2gUAOEdkLCmbrd438Wg+XP3JptwmAt2li2FUc4gfQVUW2sTH9+9e4ZwdQNJ3kUrbYySQVdFCFpBPQVXt3JIn5862tBeh+hrdynn8v6VkgsjxEL5j+96iFydqkF1J3PnIr24FA0cQdpn9awDS7aDKO8VWB1AYT+Rqs/DLDAzh7J037pf0qcqPvr8zVvDuQsCPmKWWgpWL+I7M4Uw37MseTOoP1ivH7N4I7YdR1h2P50x27jDkNP761v8AtTDZAf79ak2ynCIrnsxhDtZA9yRWN2UwYgmwPef1pobiLEQyj0jSqeKNthJtwf4SV/KK3Nm4IXW7FYE/YP8A1N/5VlH2wtr7zDyhT9edZRti8Tl3CMIbtzuu+CZhPiMTEHSYGYwI9Oe1P/Y3AWX7205Fy4H8anVNRoR5SzfOOUALd7HWntWymIZs/jhbUgjZQXmFI1BBO5Og2oZw7iL4RybbEsJtsQJPhYxlJO+YRPQmuWS5vTOX5Y2cd4Jh8LdUWiwDBs8tOoK5ACecE6dIoVird61cZHTKV1loAIG5BJg6a6GoXv37ihTYvPBLS4CwzavAGaRoNSc3ptVC7w3F50uXMxy+FSzEkAzAWSYUVVclHehuhhs2rrE93JjfcZZ1WddDB9aMcPw9+MmeBB8OcjlyM6e1bcAViGLMWLZQ2p+wCJ19abOC4G2ksQJbadf7n8qeCU8actjwVsWbPDroAUBWA8yfwq7heB3SPFlX2b8xTg14RopPzqpBYwV0PIgVZcUqRRQSAv8Ag5VfjWTzAO3zqpewapu7eyD/AMqM4zgtxjpIH839apns+/2nb/rins3FGiYjDhAct3TnmHX5VlsYOWuJZlnMtLmSQIGkRsI0rYcMtjQsD6sTUbcMWZDj0yk/lQv5DXwYbliI/ZljzLEH6Vst22ogYa3HQL/TWob/AAckTbuMP5S0fI7VRZLtsw91vQpP1it93gP2+UFDbsEf/bR/KsflWlrh+HEt3T69WOnp51Qt8SurtDR5FT7zUtnjdwbqvsf60rlNBSgy5dtWjAFgwP4m1+teYfDWYKtafy8bafWon4ySNvpXtnixkafjSvLJBWOJXfA2idBcXr4jPtIofxS13RGW4xVtpAJ03BgUz/t4DARv/fSvMbhrN5c1zQgeECZJ9uVCEnOVM04KKtCcuNb7w90j8q9Y3D0+UfiaMf4HZ6MP+Y/nNSJwK395/mP0rp+iQ+oDcLg3b4rkeSj9a1uuO97rOTlHiJ6nYVf4qow9l2V/EFMEideVJmF4klpXu3CSAJPViNvcmkeNWbm6HEcP8xWVw3FdoMS7s5v3AWYkgMYEmYHlWVqNTGXhPEGwwdRIDiJEAsB8S5o0kaGP0qzh2tXMQrfuwr+MKCxWdSwJALHxCCRO+3IUeN3rMhbLG5qS8qQuoXRSYPLXQe8SbuH4WuVRAGoYdVO5gzt1Gx6jeuKGPz7k68DpwpcPiVzo4Vl+y7AETyIHIxIaT0MQRW2L4QyFcj+AyCMvhJg6b6a8/pUHDMBmus1oAASHJ0kDUP566f8ANTDjruZP4U1LsyjcSfQeXKjH0yluTY1a2DuyOJth3F58uo0fQzqCIiBsN99xIp6ZATof7+VcUxvGEN3MlwPOmgIjKTG4EyDyn4d6e+FcZvNh7ZDHVRtuf7FDHyUnjfS6Y+J+B2XDiJJP/wAqha8gOgmOsafNqX+H8Eu4kFzdygGIMzsDP1o1heyyKIYgnrB/Wungy3I0bjK8ivzT/wAqgfiw/h+n6GpP90oPhuwP5T/5V7/uj/8AmP8A0/1ofT+Tcihd4r5D2/8A5rUccOxn6/0okOywH/FP/T/WsHZ20DBu69NJ+U0eCNyYKv4q421xh6D9TVK5hGf4mb++opkXhVhXCd+A5+xmQMT6bmrw4Pb5lvmP0opJA7OeX+EONVk/82n4VCGKiGHsf9K6X/glsAkZvmNfpQnC8A7xGNxMrR4Qd58/Kqk3FiT3dttwZ6An8a3HDd2ViscgQfmTtTJiOEW7SoGQ52BJJY6a7RtVDHYdFEgdZ1OvSn+nFqxOTTorW8Q4CtGf311HLT9KvWr+YTBHkd60wZVQC22nvppQn/H5e4TaIQBmQhgSyq4tgkRoWJ0E8qGOEV9xsmR1TGGwwkZpjnG9WuKDu4MZcwkLMketBcVxRLbOGDRbXNcYAZUEEjNrOw5A8utLvGO1ouEqM4YaHOCCNJ+iwfcVSToSLT0QdseKyuWfiP0Gv4xSXx++VS2n3iT7AfqfpWrYg3rpcnQbfl+tBuJY3vbxb7IGVfQfqdfep+B+2aHCisqQXB/f+lZSmthjFYRmKmJB09P6VbJvC2ptltnkONoBgk69NJq1gGlR5UdwVkC27zqCqgQDOaSZnlCke4qCVdAcbYvcIt47EOf2dX2kss7QATm6ErMUT4+2W3ds3kAxAuLNwEEsQE0TXRYk/jECqvFuP4qyzqlxgbikEiJyeXNd4ncaxQPgOBe5dzKsxJLHaeWpkTMedar7A6DGH7PXGKZlYKytJzAlTmbJm8QBMZZgH23pq4NxR8KBbuqSnwiIJAXQMPUQYouOzN57YuW7gANsNkOhzZhzj4Sg+ZpZv4B10fkT1O5J5+UaVXjF6MuUGPuC473QBQ5kbUjptTFw7tDbuQJg1yjs696+2WymikgoNTljfqdeY5x1oziMHdX4rLjzgj8qEYtHRyTOrKwO1e1zrh/GMVbytDZB8edT9P1p6s8StMUHeKGuCVUsMzDnA50QWi3QG5gFXE3C+GF1bzIwuBUbIQqIQ4YhgBkDAidzsRqfoVxrDsQznEmwgQSdAFhpLSSAJHhMj0I1nAkgHwWy9zD4RVsEaWrt2+SkMwh7kQS7OzyCSAPExnYFpAoZgcGLn71MVddS4YQ3ghNIXqpIM7g1cxfEbSOttrgDtsvXf5bHfoaDBCorsuA15cbKCSdAJNaW8QhiHUztBGuk6ddNar8TZXR7QdA5WYLAEDQyRuB50VtjNi1xbiJuuNIUbdfel7tFi2VbQUSXuBfmD+lNWE4VaeR3quwAkIQQoMxPrB+VKnHSq5C2oS777MPwJrpco8aRCndlnF4eEDE7Ak/l9BVW7ew5yk2pyAn4QSmUjwwNzmER1Wr13EZlLLsq6TtOwn3obi7l5xCpbB6kz8tOtKtIWabZX4v3F0M41NxShIZgrDVdVBhokwfSlLiGB7qxdfMS7ACTqTLKCJPqabrfCtBJ5cth6UodssWq3LdlZyzLHkTMAD01n2pX8jJIUuIYjIvdjc/Eek8vlQy1vVnijTduH+I1XsDWlY6LQPkKytcorKFGGHhOOBIDN4zvI39TzJ67mnDCwUiNZmZ5AbfX6CucWWyliCJWNI3nf5fnTBwbjxmG1AHv7x+VRAF7/Z9bju7uxDbKNIA1166mfl0q3hcOiju1S4FB88o389tZ+U1asXldVYfaE1bwlrM6pI8TAfM/1qiQo98Lsr3aKUfW2s5pjYSDrvqZ5aUrdpcFN5oGVSoJHMeET9Zp3FxeRGnn0pU7Vv8AvDHO3+tJFbLyVITOxt9reNzo3JvlE/lXWrHHjGtcO7G4rLjgpghs3/advrXVbQkaVStATAWFwl+2lmG/eO4a6IlLWW3c3Gfxku4BIIGi6aVW4UmOt3MK5tErh1tq4LeK5nLd6QNQ+UMDqRBUxM0ylaqftV8NcCpKgHJoI+G3lMzr4i8jovLmGc8sMYryFexlvEI1kXQxQWnksZKsWXwtrJ+EsD0eKhxnB8S9m7bCXYIMhnkOwvK1s2xnlYtgzqvKocJxPFKyfuwVZVDeTQ2Y7/CYHpI3nQzheOXe5LFSbgPwkAZhpMdNzH8u5GtCwLHFqtlbFcGvtawAtBrZs3DnkLKIbdxDKl2B1K6Zm3nlQq12axOQWmRSty3YV8zjwGxdZmJAnNmQjY+tHnx983F0cqGIkZQCO7SCRzGcuNROlQ2MTimtOGYLczIEaFPhi3nMbT8cg85jSKFh4Rfh/wCIrDgd4YxGVbYsJiWvhgxzDNYNruwmWBrrMxFWMRwa6TiFAs5brF1uknvATkIRhl+CUic23Ko7QxBOZmysUA8JBCHvSzR1/d5RqNY5ayYwNx8g72M8mY1GrGIPpFZDRgpaaYDttes96wW2bt25nKWwSiAKF38JAAWSY3aI3pd7cYJktWAWlnvFmMRtLR7THtT3ib6Lv/fSlbtjNxbJKEBXJE8wwimjdjrEoopW47koRIY6+Y6Vqmm2grTi+Pt2UDXGCqB+PIDcnTYUtHtxanwWXZRuxKrt86srYkmkNly4cp6xpSL2qsL3aaeJWif5hr9QKY+D8fs4oEISGAko3xR1HIj0pe7WjVR/FQbDVCPxizDz1/EVUw+9E+OjRfU/lQ2xzpZKgro3IrK9gVlAJbtWQzeHVjymIkwBJEeXuKt8NwrDEKGGUyQQdMp5g5qg4TYDu6Hmh+YIIo12eFy3cyONYJXNJB0jSOhj2JqbFaGC3hxnJVeUBQFiNAIEwCQfxphwGAFu/bGdQQJbwpCEjUanfl615wQEW847ouxhZnl8J1HUT7V46BsQtsKmXSWDA6giSdBzJ1pl7DUPltUQBVQADzE66n3kmTS32rfxAiPgI0M7En86Icf46lr92hXvCPLwg/nQZ8GGsLdLElyxJ3gcp+ppYqtlJO9HMuBjJj7Q6Mf+xhXYME3hFclNrLxG2OXeKJ9RrXUMJjkAyscpEzO2n4e/l1FU8CR7CptA61VGEuBiRc06ZR1J69NPbavbfELQJBuIADBlgD9fWiCJOo2pR+wWSyz3mItgx0ACkqNpM6fF6GtJZYnELowBlQJ2JE6+Ir+PoaLPwy2TLW1YnQkieUfgSPepf8Kt6yidTIGukTHoInyoA4ghluAmb5jcgoABIKj0119vM1umGIGa5iWKlZBAA21JkCDoy/1o22HtGSQpPmAdjI+pPzNY/dwPApjQSBoPLoNB8qxqKeG4eQpJvOQdjoIiAQNOoP8AXmQwmHYIFBZx1Op2Aj6T7mopmprBKnQ6VqGSNMSqYcC5cWSWid/fWhnapxca1l1AEz6xFFeK2u+tZZ1Bkeo/1pexeMGFtN3gDMvwrO8/CPdjH+lPFKrEm2rvo5D/ALRcQ1zFFBJFsZQOQMAtp1k7+QpbS04U66bkTTFxJ2uXy5tqRcJLsCY11aNdAI0POoMwMSFCjRdtfNuprojwoTHKD2mV+y/eDF2CqkDNBOuoOhn2pn7YD94nv+VScO4S9te/IyOo8AjXURmIPI7D1oTxHHtfys4AdZDAbSI116ipSlFukGb2LvHm1QeR+p/pQy1zohxi2S/sKpKpG9LLsEejbLWVlZQCG8AmTGlDyd1+U/pTXhbIgfkAfLdTvHlSXicZlxJvRPizR1ka/jTHw/tPhn0ctbOnxKGUe4BNKCzovZxfAM06TlBzerHUf3rVuzaXDm5eYycuni33n7O8x8vKoOEpaa2rWriuBzRtPeDW3F2BUW5bqfEfahRTwLttnuuBml7jfe5zyOXqdvIU4cTxif5C6i2MpM7nYgD236yOVQ9lOFyxukscnwyT8UfUAf8AdQ820AlSSTuSxJ+u2/18zWc/vSOfJNwcV7iKt5Tj0VpGW4COWbTWfMbj3rodpWlhrB0I8LLBMGee1c3xtucYvVb9s+xZQfy+tdGwDqQVZrZ2HiAzCSCAdQTPKnZaJ5fsuVKsszzNudOhg1dt4u6NnACjQd2Y0iPXcVv+ywQQqcgT4gTGgj5CtVw52I00gC40CJOmmnIUo5c/xRomVE/wt+nUGt1a4wnMkGIIB1Gh9qr9w5BhTMAD94dvlpsPmfeRcM+k5oGk94dpknTc1gkjWrnUDXoffnUw3mq62WI1Xl/6jHnz22BpX7e8UvWLHd2oDufE2b4QZgLOssVI0/OslYs5cVYex3abDWcwa4My7hfEROwMbE9K3TtLYJCBwrESA2k9PL61xXgnHWt3SYkkRB5kaiR1B1n/AFq9dx4uBnuMcxnzPkNT4V/vnXTHDFq7HwR+pcpyUUl+tnVuGcQYBs06SaBdtGIuW5AMW5adhBk/IE1v2QxRu4O3Op7w255kLEE+xA9qtdr7U4gAD/gn6ggfhUZURa5Ras5yoVVdQTB2MaR8jpy0rfg3GbdlixEeGAMuuh0j6j8684ZhcUzAJaua6GZCgGOZ0ERRrHdhSoDgd6Y1QEDU777j9Kjs4seFpgnGdrVuCANecjptvQfBsXGc/aLb+X9RV29wM2fFiWWwv3ZDO3kqiZ9TUeCvi8ZVciA5UXeBHPqSSSfM02ONMuopSsB8QTx+wqjcovx6yUuR/CPzoPcOtUfZVdEde1lZQCFeNWPFIG4oS1hlCllIDagkGD6HnR/GXFdRHT8aqYDHhc47x7TZcoZdRoywQBBDZJXfUcxzUVlbB4p7ZDIxVuRUkH5imjhnbDELGeLo/i+L5j85qhjOLi45KqrgBQC6IWbKoDMwmZZpbc7ivbeDLHMVKCNMtoxy5A1uiVV0dg7MdssIbaqWNsjcNtPPUVtxbh6m4b9m6jWiPEgYEqT92PsknblXFe9OYAMQOZgg+mvn0q/2Q4lcOLtJmJVmI36qwpOFtMRyyulJJ7/ULcWt5cQH6un0uKadrCKWOZUPTMhMaTuOWh/ClPtUcqq45N4vfb6imzCsM3KTp8TKTI67VVnUi2+Gs+GQm5PxssGfFHUSv0962W2rZhBBywYvaiMum+k5QJ8zUty7IiSZ550PMiBO+k71VcGSNY22tmdTrHlAHsKUcJYJGQg5rreH4WuKQSY899+g0NEDiTAOQ+eqwPeaG4IAkqQJjQ91uPDpv5HTTcdKIWsCRAjfn3Wm/PXT16GsEsWiSfhjzkUldv8AB5rqlx4MgaZiNcp/v0o7xviptnurZyhdGYDXTdV6ET8/Slq9YTEi4C5DfZJ1JJ56nXbr1psOdY8qdHLL12KGRRl0uwNawK22cSEI+EmSWEjY/LppPShmOwALQwAEZiCQqwIHIfny3q6MI6Pl7kuLY3DKYC7khogCfMCmrhPY5rzC7iTowBABl25gGCQBtsflXqz9dips6Yevw5ajFP56LvYqzbs4ewHHdlmLj7pLAAakkgmJ1jerHHMHcuYh8iMxVANBtoTvy3otjcLZEd4quRsn2V5QfbkKX+0HErt8NYtv4mUwB8K8szAchXgS9VbtrfsdWL0c5pt6QscIwvEmbuxisKtwCTbe+ruo6sLYcj3opjeE8VZcoxmEU+TOD8+50olwXhdnCJksoq/eIABYjmetZjcXrPSll6l3pD4/wyLj9zf7nP8AHf7PeIsxY5LvVkud43y+P6UN4VhzaK22BVwTmBBBGvMHUe9NvFu0ygjxQ3LUCfbfcb1a7IYm7ilNzHFbttv8pHA7y2OqXR4xPQkjyqmP1HmSJT/D1H/bdnPO14m8IP2B+JoCV610Ht92UdC2JsnvMOAMx/4lr/3B93+MadY5oF7eujkpO0cji46kRxWV7XlGjFi3cI05VsbKtrzo5wzgGc+IkAHxQJI899qlxvZ4tdjD92VmB+8AB6CHaQfc+1BCgexauKCFyso1IKq3ruJq7h2Z1ylcOmsybPi3nccuXpU9/g920/dss3AfEFObLsRJGnOnjgvZO5kDjI8888Aeukj5UHSQErYlXOGBVALIcyyCAFEmRy6DQTV3spwEW8XZuEsMtxY6GTHy1o3xfsBjL93vDdsoNAAGcxHXwCaMcN7G30Az37RI5qrT9SKm5pFVjvwB+17m3dW2w8Ls0g9APlzFS4DtbbVwt1XQg/EhlTH3huPrRvtvwfvba3IlrRJ23UiGB/H2rlPE0IvHziPYDb503Pk7EknFHbuG43C34NvEo38LZQduhAIM1YxfDl3yj5DWuD4a6ytTHw7j1+3/AJd1h/CTK/I6UxxS9dLHKpx/Y6SlhVI8O3rpTDgMpA0JgyNT+tc4wHbg7XrQ/mT8wf6U4cC45YvR3dxZ+6dG+R39qDOrF6rFk6f7gVoyG4sd4dSxJ3OrDyEk6edQXL4IU+K84EOF1jTxGBqNx7RV7tLwx0YkEiw8kuN7e5M79IGlIn7ezIi3l1VSGKgAOuyEGZBGY8oO+lce+jx8npZcmmHbyXMym0rWwSCQ4OUQAJQSNCDvMiNpin/hpazZVWP7wrz3VeQP8Ub9NqUexuFu3gl/EWmFqxqhaQbjDRBl5gczsYo7xniqgBZGe4YWTuTr9NT7Uk5OK+T3fwf8PpuclrwAe1DYi4627BMncDkOrHkP6Vvwm3bsLlzZnOrsd2P5Ach+dGksW8OudnGZjq8xmPp0E6DlS72zW03dOkZ2fxEGQyhT00nNl1qKR9I5qqL2I4guskD3pG7V8eOtu1LQPEQCYHnFbceXJbtOBmm4oYTHhaZJgcvetMXdKLCJl05ADlIzE85BGvMRVYpdnNPNqoihwHxX0Dz8YGvrqD0Ndnx2D7veAo+FunrXG8DjA+K74LC51cxPIrJ8jPruetOPavtgSbKBSqlpcHYxIgGIMHcfy1TNByaRD02RY4tsdeHY+5cYLbIUKRmciVIMSsHRsy8tgDryB5//ALSuya4ZxiMOP/prpgr/AOi++T+QiSvoRyFN/ZXi6N+7bnqumnmJ2/s0ZxeHtXluYW4T3WIXIeZVj8DL5q0N7Glw5HCVPof1GJZoWuz5/rKlx2GuWbj2riNntuUaASMykhoPMSK9r0LPHpjVa47iLJYK0EmW2Op6xpQzE3G32kyY2rsj4K00f/T2/XIp/GquM7IYe8utsIeqaR7bUqyLyK8T8bOaYPi15lyFpAECYkdNYmPerXDe0WKw4PdsVncQCNPIg/Si+P7CXrRLJ+8Ua6aGPNf0rfh+GtBQWCg/dYEn+lNyi0LxkmUrfa7iFwwrSfJF+pjSiuE4hjnHixOXrlVfzAAqK9jVSY26KABQ3H8cXSBJ6GldPpBV+500eKwpJklBJ66a/PWuYcStZcUbBbLb7xSVM5biutsNsDldcnhbTdtRAnoXZTGi7g7TnowP/KzD8qB9o+z6Xzmkq4EBhzAkwRsd/WprTKy+5aFFsLayK1+0LbljC23AkAKSYdyBzHLXkSDVpsBYytkXETByybREyAkwfhk6nzEVQxPBXtMSRmHMqoM7bqd9tprfD3LOYKWsAHRibVwZcokSF6zBidqezgzwVbREuFujXISpMesGDHXWpP2K4PEFdT5gj8qlu2bJBAuWJ0UMO9XePFqOXMxyNRPigpIADTzt3Gj5nz1M0bOCWFB3hva7FWhlFwsANm1H1kR7URwvbJQ2Z8LYLdRbE/OR+FKWIuBQCE8oLEx0I2+tenHgwVtqIPKST5GSZH60lJmeLPjVqWvzf9HXrHFzicIl0rlBdtB0Tw6785+VD8F2YtsrHEKHZmJU87YmVCnkRpJ61c7NXC2Bw7EBSVYwBA/zH5URtDQjzriy/wCtn2foZSXpoq91s452yx2IsYhkLK1tPgZSNR1YbhuR5aUv4jjQvOEY+HIRA0BJjQmNNp6U9f7UuDLbFvE20WM2S4I08XwmJjfQ+orm3+F92rXQ4DI0gLDADrPXn7fKuNR4ieobU9F3BYW/dsG0CbaqRlDA85mJ29QNaI4rE3rYshwHkQXGwI3320WTp8poVc7QkrCx6SZP5VG+MZ8OxuOuUNItT435ddFnfTWD6FuLb2iSkktMJY/DW7qd7ZZFuD4lzBQ+WDHLxbHz57aXbVlcXhyDu2q6ao3I6bdPQ1pw3EWsRY7pwuXYDpvEHkRyoRb4feF0Ya0xYi7l0OxbYsPIZp9DoKHx7Bf9k3ZniTWnFsyHDZY3gjTQczOnWu68K4cEGc/GR65fIfrQfsx2Ts4VQzKHvHV7pHin+H7o8hTLdIABFSnJSlo6sUXCNNhEYXDt4mtIWOrGNydz86yhX7TWVX67Iv0sSsLUHarJujbL9fwoR+zXhs01HjOLNZXVZPPSqNJnnptMNF51EiKFcV4Baua5YJ5qYPv19TQJu1dwkBVieX60w8PxjMAWJmmjGhZSsS+K9l8QZyQ6jaYB+vOlLGYJ0MMpBHIiDXbHcHl9aqYrh9u4IYBvIjb0O49qqp+5FwfgV+wuOUYU2yfEjmRzhtQfSSflV7EYsE71Bi+x9uZtu1tvnHvofrQe7wLGIfCVujyaG+RitSYVJrQSvAOI51Qfhgcbajedz89K2sZwQHRkbowI+U7+1El38Qn8fnSP4KR32LP+Db+CB5j86L8J4JbVfgBbqRNGhh0IHxemkflUmHswdzHSP60tsPCIMx9mEjLEcxXnC8FrP40axzKqbATzYz+Ola4XbRR+VAekH+EtOHUfdZl+fiH4n5UvdtuPNhlRUbIXnx6SIiAJ016+VH+CZ5ZG2YeHlDDbyEgkfKg/bvg4v4Vz9u2Cy6SdBqPeoZY1I9D00rx0c6xnF1bMMS0g6GSZIIAbnSWcT3NxsktanwlhyOsa8/xjamHg2GtqTnGZ1GhbU69AdF9dCddTRIAXptALBEGYgdNOftRTUWTknLYpLY/eo+GDOxzHIoOnIxGsa7eUbUwtw63lPepbzkAsFECAfDGgO1VLN5Uc24Nvuz4gukbQQRuDoZ38hFFzLlRbAZm0C6ENPl7a8onyozk9AhA94X2QXFXxbssbPhJuQD8OgGh26ec0w9heyn7LeuvcOa4HZVPIBSRPqf6dabuxnBv2WzDa3HMufwA8h+ZqfiyZLiuNmJn1qUpuqOvFiintbL4NDeJ34Uld+S9fSsxGKyqTOkVrwbAm5cD3JEa5furzJ/iO3lPrQStgy5FBWGsFwBjbQswDFQSNdCQJ+tZV4MzayROsetZXTxj7HnfWn7gBLnka9FoNugPrVxfMe9bDWai2jKwf/hyckE1MuGI0gAVYDVsR4a3Jm46K3c8vwrBgetT26kvE8qe2hKTKhwwivO4Ef61YTzNYU6UeQOJUfDKRBUEHrUF3g9snYr6E/nI+lFrdsc6r3X102rP4MtFEcJAEB/8A4z+BFTWuGD7/AMlH5zVhW0r0sRS8mPSI7mEtxqinzaGY+s8vLao7WBtkwEA6RoPaK3a4Sanw6c6AT21hlWDEkbEmSPSamxiZ1JXciGHQnn6GtSxOgrzvCrCDEfXrQSvTHjk4O0c9t/7PLrt+8uwoPLc+elL13g37NiL1hXOjDJOpIZdT7GDHn5V2y3cDyAMp6HY/yn8jXNO3XZ7FvinfDrLEL8WgG80HFrR2LJHIm0hV4rgrwuqcocFYJRY1lt950jTXltTj/s+4GLea5cX96DChh4kG8Geu/pFMfZThj2bSreIa4dWIGgJ5L5Cr/E8IQ3eoNQPEPvD9RStuhoKKfyTToetVsQouIUO/L1r3D4kMJFV3w1x2HdjSYYnRQOpP5UKbHc1HbBnCbDXIZgYBhR1IJ/Aj5+lNAt5FyDc/GR5bKPT8aq4C0LCKuYM4kG5sNSTCAn2nf0rdrqjdgPcVRLjo87JNzlYfw1nwL/KPwrKnwbTbQjYqPwFe11qJAWHOoraaysrk8lDQDWp229q9rKz7D4K9rep7x0r2spn2IuiO2K2JiKysreQ+Dy5UbqK8rKZCkY3Pr+dSuNKyspGGJHZGtWGOhrKysEy2K0ubisrKKA+jHqXh2IYuEYyvQ6/Kdq9rKpEUuY2wqnQRUQr2sqc1TO7G24m+H4baUO4QZt+ZHyOn0qndulgJPtyHoNqysqrSS0ceSTctsFcXOnuPwNLZ1kmsrK55DxOrcM/ybX/tr/2isrKyu1dEmf/Z',
    description: 'Cung cấp đầy đủ dưỡng chất cho cây phát triển xanh tốt.',
    tags: ['Hữu cơ', 'An toàn'],
    light: 'N/A',
    water: 'N/A',
    difficulty: 'N/A',
    status: 'Active',
    rating: 4.8,
    reviewCount: 88,
  },
  {
    id: 'a1',
    name: 'Bộ Dụng Cụ Mini (3 món)',
    species: 'N/A',
    category: 'Accessory',
    price: 65000,
    originalPrice: 95000,
    stock: 40,
    image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMWFhUXGRgbFxgXFx8dGhkgGhsbFxoXGRgbHSggGx4lHRgdIjEhJSorLi4uGB8zODMtNygtLisBCgoKDg0OGxAQGi0lICUtLS0tLS0tLS0tMi8tLy8tLS0tLS0tLS0tLy0tLy0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAFAAMEBgcCAQj/xABOEAABAwEFBAUHCAcGBgEFAAABAgMRAAQFEiExBkFRYRMicYGRBzJCobHR8BQjJFJyssHhQ1NigpKi0hYzY7PC8RU0RFSDkzUlc3Sj0//EABkBAAIDAQAAAAAAAAAAAAAAAAACAQMEBf/EACwRAAIBBAEDBAEDBQEAAAAAAAABAgMREiExE0FRBCIykYFSYXEUQqGxwTP/2gAMAwEAAhEDEQA/ANM2hvx1l0IRhjCDmJ1nnyoQdq7RB8zL9nlPGu9slfSP3U+01XC6I3ZxqQIyjMk5VmlJ35NUIxxV0H/7WWjFHU0J83hHOm3dr7SCnzM1AHq7ioDjQZtJK8hJCTiAzIBAgmJ1pm1IMCQRChE6+ePVSuUkSoxZYn9rbQFKHUyiOrxB58qZRtjasSgejgJJ83fKefOq5aXZUvnkO4GT664TaAFE6kjd2pP4VGcvI2EfBZ1bY2nEB83qPR5xxr0bYWnE4Pm+rMdX7PPnVdSRiB5+816zqvmP6fdUdSXkOnHwGjtras/7vL9jt58q5/tvao/R6n0Oznzquu7+7/VXA0HbH3ajOXkOnHwWNe3NqEf3egPmcRP1qTm3FqBj5vX6h/qqruK9g9grxZzNTnLyGEfBZv7dWv8Aw/4Dy/aqRdW21pW82hXRlKlJBhJB6ykp1n9qqdnyqbcv/Ms/bb/zG6FOV+SHCNuC2Xtto+1eRs3UDQUlE4TilSEkEmfrK4Uynaa8HAstdESlwpwqQRKdygrFBqqeUH/5C0GYOJEHgejRBq23SklHSSPnAggD0UhIgdskk1VKpPJ7fLKKSUtM4u3au3qe6N1KEgAk9QjTgcUHM1YEX29GeHw/Oq90JLpUSc+qBuA3mN5PHs5ySUYyquFSp3kzSqMYq3JP/wCNu/s+H5009tA8D6P8P51Cxb+2oloV8dmcVMq07cjqlHwFE7Qv78H8P516raF7ij+H86ENa06octKVVajXyZLpw8E53aV8aYP4fzqI7tbaBpg/h/OoD6jmagESfjfVcq9S9smWRowtwHE7XWnT5uY+ry7aGO7dWtLqWyUHqhRIakr3FKRi6pnPM6HfFMWZqZPaPX+VRLTYcZBBgynEYmUJViKI3zn41Kr1L7kyudCLWkWj+17+nUmJwlPWjsmpNzbTvOvtoVgwqJCgE56EiDORms6tNpZRBbSsh1QkdZIkAkDHqBPoaZ0Y2KtZctjJUkoUFqkTyMZKANPGrUyXufKKp4RTTSubBSrylXXMJQNt7RFpjEkdROvaedVl1aS0tEpMpUNdZB8daE+Wa3LRewSmILDeumrk+yq0m0PB1AWkgK0jFGhGpAnumqJU23c0KosbFx2Qs/QrS+F9VSCkpGsecmOJB7Ks7tpWpM9OmdRiRAM8QN2UVmyunabKUuJKDGIDGIAy1SRAnXiaif2xXm3gnUJzVAOkypcxlx0p1lGKSX+TO8r6NcsgZWlIeSwXIGPCMieKZANU3aN5LNpWhAAAIIA5gGq/de1aEr68jPMiVBUb/OOpnPnUPbW/kv2oraBjAkKxZEETlB5AUTlmrWsyylJp7LpYnsQB1M59lOHImPj4zrL0W9xPpwdYmpaLe9hxYicpgGT6pqnos0dZF+WD8fHOuJMxuz+PVVBbv57ifEVIbvx7MkEgcRlPcRUdKQdWJclDPQ0lH48aoaL9XxJp4X8vmO6o6TJ6iLqRUu5v+ZZy9Nsf/sb91UBW0LvE+Aons1fzirXZgTkX2Ae9xIqVTaZDqItnlBZPy98jOSjLsbR+FGtkrTisoE5tlSD7R6iPCoe1Tv8A9QtIjRSM/wDxINe7POJS4pIy6QbtCUyR4gnwrPNWm/yZ6MrTLC2jMfHKnFZnsrvST4fHaa5SPfUWNtxsmojqqmLFQ3B8e2qZlsT1vSuyMu2p9gswSkOuaAdUHf8AtHlQV2+umeKQkkR527v4DganDGN2LleVkc2pWg+OFRhrPOfD/epLo63ZUeNKo7l3YfZQADXDYoqptFnYKnQMRzz9Abh20GaexJJb6/YaapHG1xIyunYjW6ztzBKRPowBMVM2UssWpk4YhZzIzPVVTLpkjEDnOQmRzOWY7eVE9n7Un5W0kEE4jlvHVOoopbqL+V/srnG6bfg0alSpV3jmlFvhCFXi5LaSsIs5CiATB6cR3QfGsovxYbdSQci8MOXoypJHAwVHLdnWzX6ibV/6fauqNd90tuItxcQFkPJwFQnCTJJTwOmfIUuVrk24LbZbmYUhaEBLSiHOrEJVOStdNdBxrFtr9irRY1qWrAW1KJQUqzwk5AiBBzAyra0W4pXZ0nQurmTuONCRHDMHuoX5RLKHrMtSpEMuqHa2pJHsqcnZBbZj+z9nT8oQ2G+kBcCVKO5MwrCDoYOvLKKs193S0wHXEoIUHktgKJORQhWit8qJk1A8nJSm8sKpzUlSeRBxewmrX5UEhBR0ZzW7jMnelGGM/sCofkkrbN2sOu4rSAlvonBjEAoUghSVA+lllBnztKM2XYyzgNdE84Q4yXCpQTonCQQkREkjfQHZS7flrzjDji0t4VLOCMWUQMwREx4VobLARCRo3YygfvYY+5UuWrCpdzNdmbjZtjtoC5CW21LSUgAmFYetIIOvqFGFXOplKbPhbX0qArzdARkArdGedH7PcLFksK3GkEOOWIlw4icRWArQmBmd1Ats3FptRKcujbSlJ4EiPGJpMnfQ1tEa5dirO+7aA4paOhaQvqFMYlTIJIOmHdxqw3JclkaPRrQlwpGHrJCiCd5kfE1J2Lu5wWZ+1OLBVacKAkA9XApSNZzmZquPWxwWp0JwmXsICsiTOUKAy/HSmyeWhX8Qpf2y9kWw6vAULS8lOIHzQUoVASMo6xgRVf2R2eaUpm1dIslFsaQkJSkDJ1JBVpu1j8qvNsYU5Y3sagCtTclI0PVQcu6mrpulux9EwgqUk2psjHGRPAjUSJqXL3E20D9tXcN42gj6zc/+tGnHWh93LKyzg/WCO4z7K925cWi9bVmVIUW+rw+abGVSNjBD4ThhJClAHMg6n8fGuPW3Usn3Jprey9zvrwV2AYrgjw31oaNiGHVe2nrBYsR6RzzAch9Y6eFOWSyYziUYbT/NyFBtor7Li/k7PYY+4PxNLiorKX4Gu28YjF93oq0uBlrzZzI0Mf6R66k2WxpaGEZnVROpru6bAGkneqMz+A5V24rM1VK79z5HSS0iG4vM/HGp92WQIT07ugzbB5emeXDx4V1ddgCpcX/dg5D6x4dlBdp73U850TeYmMtCRu+yKIRxWcvwE3k8V+SLfFrXaVwNN09sYjU+6rvS0nLMk5njTtmsgaQBGeWI8aeZBgDUzkBv4euqXdy2WKyjZHgYK1BCdTv3Abyak3TYkN21vDBM6hMbjlTlstCbK0Sc3Fa/0jlxNA9kkrXbm3VKMYvHqmExwFXKMYyinzdFV3KLa4szV6VKlXYOaBrzskulzggf6gPbVasTADS4Hn2kA880++rfbhOP7P51V7In5tsfWtCj4FJ/CkmhosdvFsLVZAfOTiWD9hUD20SvAAFkEZHph4ifwqt3nfiGXUqgLKGsIE5Aqg5mpd5WhbtmsqyrCvpEFRGUzgWoZbiCU0SkmhlB8sBpYSLYpwoSSMEKjPVSTn8a0K8qDBKrPBjGFEccgATnyNGbWodO4AesElUcgpMHxmvdq2kuiyqGgTakz2JCo8EH11XS7omp2ZU/Jo2UuvqIiUdU8etBg8JT6quN+2jo7PaVpyUlCAD2YveKqWxDYQt2MpQgetRmrPtSmbI8n65j2D8DUt3YttBK8WJY6Pd0TCPHKqZto0C6tWcFSQY7t/YavdpB83XrsjwM/HZVZvJCnn1NCMl5FAEiQnrKUBMpjf3VMNyJlpFrRdyWLKy0mcOMETzXirImGEvW9CSohLlpCSZgjCsKyJy3esCtmtoKQ0g5wcjyCTFY+hl5VqaVgOBt9JkDJIK954krFOrZO4r4RoNpbCWbW2P0eFQnXWa7dZxWlkaw+0rsjEZ9VerTKraB9Q+OEx7a96T6Uyqf0jZ8QofjSf3IbsVXb5QReNoVvOEjtDbYHronsrd7ifnnRhKh1U70gnMnnlpRS9LqAvC0WhcKUooDY+okNpBP2iqe6KfS5kJz/PKue4JVG/3ZdTp6TZMDg1p+yICwSckDU8eQqvXxfKGEgrBUVGEoT5ytJOegHGurw2qbWwk2fQyEj6pBKSVd476uWlk+B3ziuR7aW/oIZayUcsvRH9RqNcN2dGCpXnmO6d3sqPcd2lJ6ZycZzAOoneeZmjJXAqhtzeUi1JRVkdKPVPM15d1jLpzMIHnH8B20244mUpWtKAYGJRAGfbv5U5f97Is7Ybb19EceKlcqdRXylwK5P4rki7UXyEgNNZaCB6I4dpFDrosOCCrzjryHCol12dSj0zmcmRO8/Wo2hYnt+D7Kpcs3dlijirI7tSxlU5hIZb6ReSoyB9Hu417Y7MBDq9B5ief1j+HjVevi2qtDgSkyndz59lOlgs3z2Eby9q/JGdUq0O4leaD8DtNHdm0j5Q2BuOXck1CbZCEhI3R/uanbPp+ktnmfYapjd1Iv90WStg/4NBpUqVdw5QJvS82WysOOJSQiTJjKfXWc3rtQ1gQhtUYSo4gcyVcOAg60z5Vx9Nn/AAke1VUJy8IiBPdVE53djXSopLJlrudlp9xPSuYUHzQDBWcQSGxwkmZ4T3aBtktJsqeiiEGE4TMYYyyrF2LV0hwmEDeo6AaVodkaSiwOMtpUA1BxH0ytMlYG4BSSN+lTH4PRFX5LZ6sD/iCwT1lNLAG6JCpnuoZedsizQD1kPqAHJxpaDUy8lYbxsy/rEoP7yDHrNBrxsxm1p+qttY1+qqaiC39lc3r6ONjl/OLn6rY9vvqybQPfNN83Rl+8YHsqq3O6puzvOoA6vRlROgCOtn2yBG8xXt3bQLtRsoUkCXEnKfrlOh7DTKLtcVvZpLwlz/yfdRP4UAupY+Uq/bUoeMmfVVd2j2utLNvWy3hUhJUYUjMdQTCgQdDNcWW9FBYc0+caOfA4QqOWZoxa2RkahezkqQdwSo90RPrqk3ZCmVEaqSlX8Khn29X2UIc27f8AlTjBbQpCQtCSJSoAuBIJ1ByjcKn7JuDoEzqUODnkQfwNEk73BPVizWG0IFrtEq6qkJmT2g++hV4ql6yRp01kPdP5gd9UryioPylTe5SCR2hKwPGY8KJ3vaVC1XQAclfJZHY41n/N66bHgi/JZfKZfpsr6FScPSddIAJUno84mMwSk6ihqdubL0biziBbJAb1WtMdVSU7hnnOhHZVj25u4vl9tJAKgIxJBHmp3HQ890zWH3ncr7SjKSYkaZiNwOhrI8cnc1K+KsH2rxctpLsFIUYneEgwEI58Tz41e7huMNoSViIHVR9Xmee+qR5N70SX+icBkiGglICUESpUgDKQTnx7a0xTm/s+PbS1m8rPjsNT41z3HlrBy+Pjd3VAXejOJaA4mW/7wSJSImTUK+r16NuR55ySOZ1PYn8QKzm8WEQS4vU4oMw4RJAWQCdTPPPlT0qOauxalXF2QWvy8VWt3EPMT/dJOgGnTKG/TqjeROgknLssxdKcRUUoSlMqMkxkBPtoXsgwLSgqzGFXzhIgrPLgIy5RFXIICeqBAGgqj1Em3j2RdRSSv3Y5igRu+B+FSrmseI9IrzE5D9o8PfQC+71FnbLigSo+YnepR0A9tM3FtS+tlTboRjRACkCEiZlOuak5ZjKTyqIU9Zy4RE57wjyGdqb4KiWka6KjdPojt31zYbNgRiPnGO7l66gXVYcw4sTJET44j40ccVlBquUnNtsdRUVZEV01N2bE2ludx/A1AWqTUzZw/SGvtfgaWn/6L+Rp/BmiV7XlKu2ckx3yrK+nR/hI9qqoSm845mrz5WP+f/8AE37VVT8NY5v3M6VNexHV33epakJThlWLNSgAkJIkmd3WGnKtDNpYsbD1keWQejSpKiDmoBIWEJjISW1ROrhrPlMyRAk7omQZBEAfGdO3xcto6Jsvk43XVpQHHOsoFuVYlKMJyQCJOqIrTRs1YyeounyHdqrcUWiymBqhck/VgEeCj6qk38ro3rRA85sE9gCgVd2tQtsbuLqmIOaEmYzByTnkRvHHfRXaRkqOIKACmHUKmIhaRnn2eulg9r8iSfP4M5vPaYFpdjQlWAqCpxZmIgHLOIFM3Zb3GMLiU+aoKSpWSBBJGu6TQ64bqW/aejGpBOZjSCRO47qIXrcjxSlBKT0eQSkaZmRrrvp8kuSts8VeSrVbOkUoAqV11JGQBGEwJzHvqftDe6GytkCSDAKTKSBlIJzg6ioWy+zr7rym0kIhorOIHOFJThGYgmZnPSu782ecxAiFgAA4QZy1j2UOSvsi41d16k2jpVpgLJBjtxgzvzArQdm3EIbWVKJCXCE7jC0lIGenWMVn1mu18IIKDiKkqAAOWBJVw10q57ChTxe6UYkpQIBGclSjOepBxD1VPy4GvZXBu3aEuKLriiVBKQkDQ5JxAjgSTnrlQq7L0ecvCyoccxhq0sIRkMh0yAQCBnoKvN/XFiwKwCAQYSIIiMjA+Iqi3Nd6UW2zL3m2WeM9fnkZx40sW+6IyuzdL5Pz6+0fdGXroHb7tSsqJGu7dI0NWS9B88vtHsFC1o38T6viay1I7Zrg9IrTd2izudK2lMqBBEDPQxOo0kVOddxCRp/vE85qc8MiDpAkUPU3rG8+/OsrWzQuCoX1asTqlZkJOEd2vrn1UHs91rtToTuJz+OXH8as1quHCJcWVKUeqhI86c8zrFG7kusMtqMDGqAeQGiRW6VdJYwMqpNvKQ26EWRkIbAgZAcSd59vYKBIvZTWJa1YkwSsKMDtB3VN2hdJWkbsM+Jj2J9dVa+7xS0mCApStEnSOJ5U1KjFwvLuRUqSUtdhy0POWhwOrlPVlA/VoPpfbVnB3DPgKtVw3aAkEiEJAwjjzPj31mNnvq0F8LEKUYHRx1CPq4fx1rZrOsqQkqThJAxJ1gwMp5Vm9TFppLjsW0JJ3fckSZAjj6opp9WleJVCt+Q/OvHgZ+O2ssuDShkHPL4zonswn59s/tH7pFDDoewUV2a/vWuJUcu5WdRRXvRFR+xmgUqVKu2coxryrx8v/wDE37VVSHbwaSSlTiEmJ6xPcMga0zyk7OrftXSJD0FtIltrGMireDIOdUJ/yfrEnoHTO/5OSe8TNZnFZO5rVR4JI7sd+NJbQttScaB84IIxKyIEmQRloOIqs7W7ZP29SUlIQhJlKEkqJO4qO85mIG81ZLJsk62laegegjKLM6IOhMRwphGxNpGA9G8FNyQQwsa/uVeqitYzuDbuwRcd+WsuMgulaCoI+cSMI+qnGBi0g1er4BUWwhaB1SIxDDOsmc/9qrP9i7UP0D5EzAQuJ46VJY2eticvkz8Z/ol79+VRnG1gwY5s7Yg1aSuRorSYzI0PZRu12VqMSkrcM7gJ7d2WXOaqKNmrwTozax2Ic91PG57xiOitn/qX7cNTnC1miHTZZ9lHGy6+UJWlOFKZUkCZKicJB3RnT1/KYZAWpp50EGVNpSrABE4gVCQZ4HzTVLVs/biZLVunkh4ewVydnrb+pt5/de8NKOpC1rEdEtFnttnKFugLAZGKFtFCs40JyMCeOtD7s2xs1mecJSoB0JgjQYAciN0kjTLPdQtNyW7CR0Nug6goeIPIgiD2Vy9szanCFLsloUQIksLGQ/dpVNJ+0lUyRtBtjZn1JWlD4UIzQ8ACJPVUmd+sxOmdQ7mtTbtusWFDicL1mH1hk8kiSTMc/bUlOzT6P+itHcws/wCmiOz9yWn5XZvob6QH2SSplYACXEqUSopAEAE0Oq32G6a8ms3u5Foc7vWlMVEcUJieA8a6vtp75S4Q2spJTBCSRASN4HGaaQ07qWl7/QV7udUS5ZdHhEd3Xt/L30yAQM8/j8zU12yuGPm17/QVzjdzrg2J2f7tcfYPurO4O5cpKxGUBOKM4AnlwHCu1nqjPiafdsbn6pf8B91JdjcGjS9B6B91CTC6KXtNKFYsJIwxly0ntn1VR0XNaLS4VYTJ3nQDlyrYnrvcVMsrI1gtndpuplF3ujIMuDLc2qPZVnXnGOKQjowk7tla2Z2TbYIWqFOceHIVZF+v351IRYXf1Tmn1Fe6k7YXT+ic/gVz5VTLKW2WxxjpDKd8a1w6rX40qVZ7E6BPROfwK49lciwu/qnP4Fe6kcWMpIglWZ7qn7OA/KWZ0Cj7DTC7C7n8y5/Ar3UR2fsLotDctrABmSkgDLiRzopRea13IqSWLL9SpUq7BzAJtHfZYhCACtQnPRI0mN5J9hqtnae0gzjBGRjCM+ImKnbXp+fT9gfeVVbe0FZak3c104Rx4L5ZrzU4kKSrIiRkPCq/tfettZaLjLsYdQUJPfmKhbO3lgXgUeqrTkdPXp4VY71eaCcC+spYIDYEqVxhPDidBSZu3JLhFPgzVnyhXinNxYI4htPuqTZfKRaVqw9IBwJQnP1UPvO6iy4W1AgHNMmcjuJGpGh7KZXdCXBkcJ7KplUl5Zc6SkvakFbz21vNAxIcSR/9tPuoKfKdee55H/qR7qINpLSYdEp+tuqsW6zJUrE1v9HfVca9RabMfqKEorKJZro27vV9YQhxJJ/wkQOZyrSrBb7QEJDjgWrecIHqAql7DpaZa1T0h84SMQ5Ea1ZHLyQNSBV1OpJ7bJpUWldq5Tby29t7S3kdOJSrqAtJmASCFdUSYjMeunLF5RbUT846PNEAIRrx0nf6qr+2oQ5bOkCk4QgeaQcRkp63BUdtArUkBQzyIkjUkdm8ZaU6m3Lk3OnDp3xRo1r24tjrcsPpbcQQFhTaVAg5hYyneJHOiGwu3FpW+mz21TK+kJDbrQwnEBOFSdIMGCIzgZzIyW1XuppSVNZKRBj6w0PLSO8UZ2cxLvGxPpPUW+3iSR5pyIHfVsZTTVzJVhGzcUaZtNtDam7U4htzChOEABKd6QTqCdTQs7U2z9eofuo/prva4/THu1O+PQTQkc59o8RVxnCQ2ntm60nvQgevDXX9qLaNXSeYSg+rDQvCD8fhVT2z2j6D5llXzpHWUPQB3faPqFCuBoI2rtWnTkHgUpH+muhtNa9z5/hR/TWG3DfrlmcxglSFH5xJM4uJ+1zrV2HELSlaYKVAEEaEHMZVLVgDf9p7Z+uP8KP6a5O1Nq/XqH7iPZhoVh5kdtBtq7wLFmcUCMRGFJB0Ksp7hJ7qAIt/eVa3C0Bti0whCgFqwIOLPrASnIDSau6tobb/ANwe5KP6K+ekDI9lbYynIQozAqWgRPdv28N1rcHYhv8A/nUR2+7y3W94f+Ng+roqjWFDyEw4rGZOfLdNSC/xBFKSRV39eu68l97DPt6Oimx19Xqq3MJftgdZUohaS22JGFUQUoBBBg61EKkq4HtolsrZwLYwQPSOn2TRcNGsUqVKnEKXtc59JA/wkn+ZdVu0L1ovtg5/9RSn/AQf53aH2izDmawVZpSaN9FXigJbLThHEkwO/jyq17BPtHpSSVP/AKRxZzUndhJ0SOHZyoQq60HMg+NN2u6UONqbUOqoQcqqz3ceVO435QtrrIFsoRDkuKQt5JHRtkAYklQ1OaSRoBJrxpCUiVKAA1JMAd5rLHrCbK65Y7QYZciFxIQof3b47JIVHoqUNQKjvWx9SuhtBVjZ6mEnTDluyJ/aznLOtFSimlKJnj6iUE00bLZbU04IbKXgcoT1k95GQ76gWu4GCCVNONGT1m+sNd4TPspvYBv6GhQ9JSye0KKfYkUetNtS3AWsAqkJBOaiBMJGpMcKydzTTlKUVLyVMWK0mUtqatTY0CsJUOUKzB76irDjearAkk6koUfEyacv6+0uLhDLpVOSow/zRIHaYoRbb+ebOFT5VPopWVdwMe+nSb4Roel7mv8ApEVLq+qoIKiBBggwTAGLmeOddJu1xRzUD9XLOBvEZp7qhqcbWW1A4ImSoaKJIEwIzE5gGiibRhUkAZcpntA4aVoS0Z5yvrsRbTdq8GRS4YOAaExrCoy4wSJotsO8+m12NC7O4j55EqUhWEgkEZ4YkEZGo7bS0OQD1CDhBzwqJG/Xnv1q6bO4flTGeFRWgxJzGLtidfXQnjpbK400r7t/kmbXq+mPa6p7PMTu1oSn43Uc2rR9Le7U7v2E99COj5eFaTEQ71toZZcdUJwJJgwZOgE8yQKxt9xS1FSjKlEkniTWjeUN3DZkp+u4B3JBV2agVn9mZxKSnPMgZZnMxkN5zp4ohkUprSfJrbithbRz6JWWUwleY9YVWeqRVy8mM47Rpo3r2rqWQi+ECs88pVrlxtkHJIxq7TkPUD41ojijv9/qrFb5tvTPuO7lKMdgyT6gKhEsjMkAgnSRNavbL+ZbsyLQpJKVhOFIyUSoTGsZAGc91ZMNDyzqfbL8K7MzZ4yaUo4p1mcIjdAUR4VLBGl3rfjbDCXziKV4cIAEnEMXGBlTl5322w0l1ycK4wwJJkYtOysyve/OmYs7MEdCkhUmcRgJBHCAPXUm1Xt8sVZGACAkNtkH0lEpSo9kAR30tguah1VAGNc+GvKiuybcWxmCYxHL901CKSMqJbLpHytnL0j900pJqVe0qVOKZttp/wDKI/8Ax2/8x2uJprbx0i9UR/2zf+Y7SLprmVvmzo+m+A8XKQXUYPcq6LwqoucQLtrcKbWzkIdRJQePFJ7fbWVWgKcRjI+es4CXOK2/NSrmUZJJ4FB3GtvKk8YrOturp6Jz5UxhOEfOoy0VKDKN6DMHhirX6apvBmX1FNWyDexV6JZu9BMlRW5gQMyetw4cTVZ2ntLz6ylQVigKhQKQkblSqABlryp3yb28WW8Gklwlq0tltBJ0xnqpUJgKDiSkjiqdDNaF5RdnEu2YupSS4ylREakRmYkThyPYDVv9Mk8rkU/U4wwS/YxPp3sJ+cJjIg5/zHhUVbZEnFmRlIzz3D30Yds4BVhzSkCTEaxBM75NC7S0SrqxkJzOeW7PfyqxFMkT7jbUVE5KaSIPhkE5RNWeyWluBiWBA35EfGVAWH0oQgBOUyRizOL9qPwotdj6cTRDaEoWqFZSobhCjJ1iq5F1PQeNpLqMDCMZ1KiYbEGfOPHQgcaNbMOfSWAZKy62VnhGQSP2ZPHeardvtDqS4E5rbUoYVbwPNz5gDxrnyf3yXbdZwoQelRl38+YNKojykrM0DatP0x7tTv8A2E7qFiePiPxoptWPpb3an7id9C8xWgwke32Fp5OF1sKAM66HjOtUzbK7mLL8ncYbCVByYzzCIVmJzExV+Sap+3LnziE8LPalHvbKBUoGQ9jdmWn2i67KiomBJAHHQ1cLpuJqzhQaR50ScRJMdudCvJ4j6GnXU1aQn4PvqQIdpZlJA14EVjF5MJSpaET56hA0y3DjnI7hW32x/o21rVkEpUozpkCTWU7DtdJbmidQFrPbB/FVSgZI2P2feX0iilbXUAQpSCM8aV5A5kQnUca8vix2yzEurVKJ85KpSJyHVMEeFasW+fj+VANtAE2N4kej29lFwKI+7aGAEKGJboxpGTiwNxgE4NZgwaJ7OtWlbiApspQlQUpa2xiMZwFETrTXk+QpVpWVZlLKIk7iQR6q0EpPx76GwSOZPI+qiWzP/NM5R1j908KGz2+2iWzB+lNZ+kfYd1ISabSr2lTCmY7aIBvhEifozf8AmPVJXZE8xXm1jRN7IVH/AEzf+Y7UpauVc6vbNm7091AHrsY3GmHLEdxFEy4K6QidAT2CqbGjJoCKsyxqPCsy2rRaGLWXHM8U4CRKFJIKS2UnIiCQRvnw2ZTY5iq/tvdqXLE8SJLaekHHq+dB3dWfCrqE8JFVZdSNjONlDYW7U0+4lacCsQSpYUgKBGFU4QYGsEnQSTv35pwKE5EH118wvIKTBmN0iJHYdDyrXfJVtR0zfyV1XzrYlBPpoG7tTp2RzrpowIp+2ez3yO1KSkfMuSts5wAYlBgeidOUcTVRXZwoKUSISB1Qc8shInx79K3/AG2uMWuz4Y66DjRGpjzkfvJkdscKwttrGkpAAQTEnzjB0EZjccxVbVmWXurA75SSmj13Kx2YCMwSRlzOkUAW1IBwnd3b/wAaLXfacMpIBGUTmQAABlp4jhpSyWiYPey1XjaCUMvTGJJS4oJnCUZad48K42WY6G9bMkjznGiM+JTCgd6SkeJ7RTF32ofJXBvQUnPQYj0eXLrDwolsc0pVssjbkYmX0lpU+jilbR4jMKTzkb6qjpl89ove1Q+lvZ708D6CaFp+Iy9tFdqkza3dDmnkfMTv0oXhI4jt99aDEdz8Ee6mHtl2bSXHHC5JZU0AkiACZKgMPnerlUlsd/Z+VELGvC2rvpZOwFc2Qu7oWlNBWIJWoAnIkcxR7Cd894qHcvmKOsrc+8aJoUOY9dMgAW1lkedsrjVnQVrcASEpIGRIxecQNJ31V9hrgeYtbnyhlTZS2AnEMjJ1SRkdN1ajdaQXJG4e3/aotsGJ5Z4QPxP4UX7ARi1wyqoeUx4pskSOspI8M/wq6qbP+1Q02NDlobC0hQQCoYhMGQAeE6+NF7AUTYJqLTah9VLKNPqgpPrTV5AG71GnH7A2h5xaEJSpeHGUjziJgkbzmc68Uns76L32AypPZU/ZtP0prL0j7DUFQqfs4T8qa+1+BoJNKpV5XtSKUzaCzTbwqP0CB/O5SRZ8RgKgbyZ9m+id92cl4KEyUpHgVH8ai2u70uASSFJ81aTCh38+GhrnVV72b6XwSJQusIzgK/aOf+1euGBmch6qgs3o6xk8MaP1iR99O7tGXZTV/wBuQsJS0QUkYlEHI8AI8fCmhBTdokSlKHy+yGNo0G0tMCIcxATqSlKlyBw6u+ilosCFbokEEbiDkQRuyrIbuvQP39Z0oMpaU4mdxIbXiPZOVbPTV4KLSQUZN7Pn+/tnVMPu2deInEVNECcQI6kZ56QfsngKB3eHWHA6CUONkFMZwQYM7gNQeIrf9rNnkWtsZ4HW+s059XiDHoka1kO0thW2odMkLdGasRKVqiEypYyUkwMOftqynWb0LOkuSwPeUO0kEYG0kiQUiSOwFRz7Ru0qkWu2gpWEpwlRCp1IMkzOUqOenHjXlqbASlJbIMkyQPq4sjqdU65iRzlpbmRSUDMTMSeUHOBnoMqdu/ItrcHTdsCUiUJwGRAECSAMyctw0130xaFpgqHDLmACM+JyAmeOVNOIylSiRmRB6o10yO6OBinEBWEpBCEqgrCv2RiEEBSszwjM5wJphB35aW0KBGMYR2ZxpIB30W8ntrWi8bGkwUuOt7z1Z0jnQdpwQJTJz86c9yY5c880+BjyfrT/AMSsYIkdOgAjIAzl6qiy8DO/k1valf0t3Len7iaHIUOJHxy/Gp+1SPpbue9P3E8M6FpSRu8KsM5KCJ4H45VNDPzRPb7aGIVRhZizE/smlkSDbib+ZTzk5HiSdKJAc/GoVzEdA3l6KfZNEgRuV7qYgk3WmMau7wFC2VklRnVR9WX4UUSrCwpXaahMMdQaHLOcqVAeA/Gh91NXeJtCuSU+0mpAa7faKZur+9ePMDwSPfUy4JRxahK1VHUjn4068rrE8z7qbV31K4AYWCN3hU7ZxX0pr7R9hqGo1N2dV9Ka+0eW40AaRSpUqkUG3get+7+MVCqVeBHSpB0IHtNItcM6xT3Jmym7RRDdUACToBJqjbTXgLNZ3XYAICiAMhiVoP4iKt1+vhICSYBkknIQmDE+vurFdu7+TaiplIISgBwKCgQoSE9YDzTKgcJzGUxV/p4WWRXWnd2HPIZZkG3uOuqHUbIE71uGNeOFK63tyzb0mR66zLyOXSlN3rWtIPTuKOY9FHUT6wo99XJovWfNslxv6hPWH2VHXsPjWetNObTLKUHjdMLFqcjvqi3nZm32yy+CUnIKSYWmDIg7xI0OVXNF7NONLWDCkAkpOSgdwKdczVNdNZ6jtZpm30yyyUkZ7euw9pbXLSg80Z64iUgj9IkgkQBlE91VQrjrzoOOm6Bz1rZQ6UmQSDyqLb7HZrQQbQwhZBBxCUqy4lMTVkPVfqQVPRd4MyJskNARAMawDllPr+Nz1rbSkjr4sEDqSUr0mCYiJOcZ8qvdv2KbWPmrUpGZVhdQFZmPTTB3AZzQO17BWyMKFtOJ5ORrloocqvVaD7mWXpqkewAsbiCrCFFsDGZJJzSCpAAG8GADO/dVh2BOG8bMmUkdO3Bj9rcdw6p9XGoz+yF4ggps6ioACcbe4YfrcO+jGw2yltRbrK46yUhDyCTiSTEySesZidB/vbGqk9SQjpzSen9F/wBrD9Ley3p+4mhiHufj76nbXq+mPdqfuJoR0nfVpkJ4e4ifjxqdfdow2NX2PwoGFDmPjhTm1z8WYp44U+JCaWQBKxEhCRwA9lSun7qAItGERmKfs9slSUzv/OmAst5ugMpRxgeOVcJeoHfl4jG0kneT4D3kV41bQdFVEQD4XUa6VyXVcVq9WX4VCTbT217cNoHRE8So+JJqJkolKiNTv7KjqT2H1GvEvZCvFOA06IG3E9veKm7Nz8qa+0dOw1DJ4H49lTdnR9Kay9I59xqANJpV5XtSQBb4PXGXoj2mhJffQoqbwrTvQTChxKToRyMVZrZZsUEaioJsCvq+sVhqQnm2jZTqRxSZV9qr9Zcsjra0Q4sBtKFp9JwhAVG8JxYiQdEms72X2N/4v8qtrjziEreUlsJgSlOEyZ/dEcUmtP2r2QVbW0pxqaUkqKSmDmpCm5IkHILMQRnUbZvZC1WKztstOpUEyVBQgEqJUSCJKczvmrIuSh3uI1Bz50SLqsCbMy3Z0FWFpISJ1MbzzOvfU9tM61KFjdKeugE8lf6jB9VRl3e9EdHl9oe2aocJeH9F6qRta6B14dFJgDERhKo74nhI9VArS3FWX/gz36s/xJ99QLVs9aSeq3I+0n31VKnN/wBr+jRSqxjrJfZW3DTJo07stbDo1/Oj+qmhsrbP1P8AOj+qq+lPw/o1qvT/AFL7QKE08iiSdl7YP0P86P6q7/szbP1P86P6qOlPw/on+op/qX2iCg0TuU/PtfbT7a5Rsza/1X86P6qO7O7OOIcDj0DD5qQZM8SRlTU6M3JaK63qaSg/cnryVnbAD5Y9nvT9xNBSirTtTs/aHLU44hpSkqwwQRuSkceIoSNmrYP0CvFPvrrnABSdQOYrnbNXVaTxcR6ji/CjTOztrxJmzqiRnKffUfaPZe2OONYLOpSUqJJlOXVIGp4mlfIAXpudO3WuXJ4A/HCpjmydtP8A06/FP9VSLq2WtiMZUwoExGaf6qlgVu+LUTaNfNT94/lXLb54eFTXdj7wLi1fJV5nLrJ0AA+tXadjrf8A9qvxT/VQiRpNuISc9Bvohctp+jJ44R7KjP7I3hgUBZVkwYzRw44qLWTZi2JZCfk65CQIlPD7VRIEMIeTGRpzpD204nZm2f8AbqPen312nZq1/qFjvT76cgjF7lRPZdf0tn7R+6aZGz1s/UKPen30S2cuK0ItLS1sqSlJJJJEDI8DUEmiUqVKpFFXlKlQAqVKlQAqVKlQAqVKlQAqVKlQAqVKlQB4a9FKlQAjXtKlQB5XtKlQB5SpUqAPaVKlQB4aVe0qAFSpUqAPKVKlQB7SpUqAP//Z',
    description: 'Xẻng, cào mini hỗ trợ thay chậu và chăm sóc cây nhỏ tại bàn.',
    tags: ['Inox', 'Bền bỉ'],
    light: 'N/A',
    water: 'N/A',
    difficulty: 'N/A',
    status: 'Active',
    rating: 4.5,
    reviewCount: 30,
  },
  {
    id: 'p2',
    name: 'Chậu Tự Tưới Thông Minh',
    species: 'N/A',
    category: 'Pot',
    price: 185000,
    originalPrice: 240000,
    stock: 25,
    image: 'data:image/jpeg;base64,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',
    description: 'Tự động cung cấp nước cho cây lên đến 2 tuần.',
    tags: ['Thông minh', 'Tiện lợi'],
    light: 'N/A',
    water: 'N/A',
    difficulty: 'N/A',
    status: 'Active',
    rating: 4.8,
    reviewCount: 56,
  },
];

// Add related products to existing plants for combos
PRODUCTS[0].relatedProductIds = ['p1', 'f1']; // Monstera + Pot + Fertilizer
PRODUCTS[0].comboDiscount = 10;
PRODUCTS[1].relatedProductIds = ['p1', 's1']; // Snake Plant + Pot + Soil
PRODUCTS[1].comboDiscount = 15;

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


