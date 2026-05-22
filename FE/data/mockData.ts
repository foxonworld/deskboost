// DeskBoost MVP fallback data only. Runtime data should come from FE/services/*.

export const formatVND = (amount: number): string =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount,
  );

export interface Product {
  id: string;
  name: string;
  species: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  tags: string[];
  light: string;
  water: string;
  difficulty: string;
  status: "Active" | "Hidden" | "Out of Stock";
  isBestseller?: boolean;
  isNew?: boolean;
  rating?: number;
  reviewCount?: number;
  contactUrl?: string;
}

export interface VerifiedFeedback {
  id: string;
  customerAlias: string;
  rating: number;
  comment: string;
  catalogPlantId?: string;
  purchaseChannel: "zalo" | "facebook" | "manual" | "other";
  createdAt: string;
}

export type PlantHealthStatus =
  | "thriving"
  | "needs-water"
  | "recovering"
  | "critical";

export interface UserPlant {
  id: string;
  productId?: string;
  nickname: string;
  name: string;
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

const img1 =
  "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800&auto=format&fit=crop";
const img2 =
  "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?q=80&w=800&auto=format&fit=crop";
const img3 =
  "https://images.unsplash.com/photo-1521334884684-d80222895322?q=80&w=800&auto=format&fit=crop";

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Cây Trầu Bà Lá Xẻ",
    species: "Monstera Deliciosa",
    category: "Trong nhà",
    price: 450000,
    originalPrice: 600000,
    image: img1,
    description: "Cây nội thất dễ chăm, phù hợp bàn làm việc.",
    tags: ["Dễ chăm", "Ánh sáng vừa"],
    light: "Ánh sáng gián tiếp",
    water: "Mỗi 1–2 tuần",
    difficulty: "Sơ cấp",
    status: "Active",
    isBestseller: true,
    rating: 4.8,
    reviewCount: 124,
    contactUrl: "https://zalo.me/YOUR_ZALO_NUMBER",
  },
  {
    id: "2",
    name: "Cây Lưỡi Hổ",
    species: "Sansevieria Trifasciata",
    category: "Trong nhà",
    price: 280000,
    originalPrice: 400000,
    image: img2,
    description: "Chịu hạn tốt, lọc không khí, hợp người mới bắt đầu.",
    tags: ["Ánh sáng thấp", "Lọc không khí"],
    light: "Ánh sáng thấp",
    water: "Mỗi 3–4 tuần",
    difficulty: "Sơ cấp",
    status: "Active",
    rating: 4.6,
    reviewCount: 89,
    contactUrl: "https://zalo.me/YOUR_ZALO_NUMBER",
  },
  {
    id: "3",
    name: "Cây Trầu Bà Vàng",
    species: "Epipremnum Aureum",
    category: "Trong nhà",
    price: 150000,
    originalPrice: 200000,
    image: img3,
    description: "Cây leo rủ đẹp mắt, phát triển nhanh.",
    tags: ["Dễ chăm", "Mọc nhanh"],
    light: "Bóng mát một phần",
    water: "Hàng tuần",
    difficulty: "Sơ cấp",
    status: "Active",
    isNew: true,
    rating: 4.5,
    reviewCount: 67,
    contactUrl: "https://zalo.me/YOUR_ZALO_NUMBER",
  },
  {
    id: "p1",
    name: "Chậu Gốm Ceramic Minimalist",
    species: "N/A",
    category: "Pot",
    price: 120000,
    image: img1,
    description: "Chậu gốm tối giản cho cây nội thất.",
    tags: ["Gốm", "Minimalist"],
    light: "N/A",
    water: "N/A",
    difficulty: "N/A",
    status: "Active",
    rating: 4.9,
    reviewCount: 45,
    contactUrl: "https://zalo.me/YOUR_ZALO_NUMBER",
  },
  {
    id: "s1",
    name: "Đất Trồng Sen Đá Premium",
    species: "N/A",
    category: "Soil",
    price: 45000,
    image: img2,
    description: "Hỗn hợp đất thoát nước tốt.",
    tags: ["Thoát nước tốt", "Dinh dưỡng"],
    light: "N/A",
    water: "N/A",
    difficulty: "N/A",
    status: "Active",
    rating: 4.7,
    reviewCount: 120,
    contactUrl: "https://zalo.me/YOUR_ZALO_NUMBER",
  },
];

export const getProductById = (id: string): Product | undefined =>
  PRODUCTS.find((p) => p.id === id);

export const VERIFIED_FEEDBACK: VerifiedFeedback[] = [
  {
    id: "fb_mock_001",
    customerAlias: "Customer from HCMC",
    rating: 5,
    comment: "Cây Lưỡi Hổ nhận qua Zalo, cây khỏe và dễ đặt trên bàn làm việc.",
    catalogPlantId: "2",
    purchaseChannel: "zalo",
    createdAt: "2026-05-10T09:30:00.000Z",
  },
  {
    id: "fb_mock_002",
    customerAlias: "Customer from HCMC",
    rating: 4,
    comment:
      "DeskBoost tư vấn chăm Monstera khá rõ, cây về nhìn đúng như hình.",
    catalogPlantId: "1",
    purchaseChannel: "facebook",
    createdAt: "2026-05-12T14:10:00.000Z",
  },
  {
    id: "fb_mock_003",
    customerAlias: "Customer from HCMC",
    rating: 5,
    comment:
      "Mua Trầu Bà Vàng cho góc học tập, team nhắn hướng dẫn tưới nước rất nhanh.",
    catalogPlantId: "3",
    purchaseChannel: "zalo",
    createdAt: "2026-05-14T08:45:00.000Z",
  },
];

export const MY_PLANTS: UserPlant[] = [
  {
    id: "user-1",
    productId: "2",
    nickname: "Spikey",
    name: "Snake Plant",
    species: "Sansevieria Trifasciata",
    image: img2,
    status: "thriving",
    acquiredDate: "2024-01-15",
    lastWatered: "2026-03-15",
    nextWatering: "2026-04-05",
    light: "Ánh sáng thấp",
    water: "Mỗi 3–4 tuần",
    difficulty: "Sơ cấp",
    notes: "Cây khỏe mạnh.",
  },
  {
    id: "user-2",
    productId: "1",
    nickname: "Monstera Mike",
    name: "Swiss Cheese Plant",
    species: "Monstera Deliciosa",
    image: img1,
    status: "needs-water",
    acquiredDate: "2024-03-01",
    lastWatered: "2026-03-05",
    nextWatering: "2026-03-18",
    light: "Ánh sáng gián tiếp",
    water: "Mỗi 1–2 tuần",
    difficulty: "Sơ cấp",
    notes: "Cần tưới sớm.",
  },
  {
    id: "user-3",
    productId: "3",
    nickname: "Penny",
    name: "Golden Pothos",
    species: "Epipremnum Aureum",
    image: img3,
    status: "recovering",
    acquiredDate: "2024-06-20",
    lastWatered: "2026-03-12",
    nextWatering: "2026-03-19",
    light: "Bóng mát một phần",
    water: "Hàng tuần",
    difficulty: "Sơ cấp",
    notes: "Đang phục hồi.",
  },
];

export const PLANTS = PRODUCTS;
