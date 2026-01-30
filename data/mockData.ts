
export interface Plant {
  id: string;
  name: string;
  species: string;
  price: number;
  image: string;
  tags: string[];
  description: string;
  light: string;
  water: string;
  difficulty: string;
  status?: 'thriving' | 'needs-water' | 'recovering';
}

export const PLANTS: Plant[] = [
  {
    id: '1',
    name: 'Swiss Cheese Plant',
    species: 'Monstera Deliciosa',
    price: 25.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV4BTbCdovhgDuLSgdLhyj3ewlaeeCZAtEalxEIHggJ_dy5rCrGeYjPt5ak3zcYOBfcLRlf21jfZp_-6_9CgLPUqmB98jjnuxJg4i0szBActNx3_dZ5FBs-W13hfKMcFNTrWp4yxMPOyv1iaippcPArloP3LBCTqk-xZU4KZFhsYppcgnXzV9Sb5gLLL2jHQii1XQdY-2oYrezxKRIJ6tE_bMTQ2K2ku5XB7m8e7VqW_9urJhmVAcl919nlOTqzfpeAy6NudrI_Yo',
    tags: ['Easy', 'Bright'],
    description: 'The Monstera Deliciosa is famous for its natural leaf holes. Thrives in indirect light.',
    light: 'Bright Indirect',
    water: 'Every 1-2 wks',
    difficulty: 'Beginner',
    status: 'needs-water'
  },
  {
    id: '2',
    name: 'Snake Plant',
    species: 'Sansevieria Trifasciata',
    price: 18.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_44EFDoTEDx8JOEwSXsIyQQlfrftIg-J-Z58gxB2cQbrAFO5tD0MJrHpKNiwfdWnhHArqYGgeGdPgSkmUPLx-Xv9651cbfNudCovVOX1fh_G0gUuPI5eCzzeA_pJbcyDkr93wa-awONab2w5DAlD_INO-CNfc4BKCz8A1-llxKcr9rVFwBK4mFxE_3SAD51tY1vLKEhPOIe0Hx5Xp1Vx5wbiIBPatLfZKUZ-m4jC3E0_qXB6-hzO2hYDMpPlJTxLmg5jbz89CuCQ',
    tags: ['Low Light', 'Purifying'],
    description: 'Ideally suited for beginners and low light corners. Extremely hardy.',
    light: 'Low Indirect',
    water: 'Every 3-4 wks',
    difficulty: 'Beginner',
    status: 'thriving'
  },
  {
    id: '3',
    name: 'Golden Pothos',
    species: 'Epipremnum Aureum',
    price: 15.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCC072Q1kXaNsbfiFSPd_mCBuXA-Y7iW52_b9_J7H-QTwG7pnaxbdoK8u9s5CHFtRQI1wZSnbng_DPLygkUjAlDt-ZxkBOiiTVPNLZ0IcAmtxhdJov2OuxJxqi1uemUMLblzLd8F8NtR8Ao8hvOroEH7d6JmXn_rHFRopuhsuEi2iKkLseUMd98E4KYkTLHJBqqlLQmOngAtHe0xq-nP2sIm78TpgRIsalK0P2fvzAhdT24iMkiHJD5VpTcDKIfkgW8zfExwvWKvU',
    tags: ['Beginner', 'Fast Growing'],
    description: 'A trailing beauty that grows quickly and forgives neglect.',
    light: 'Partial Shade',
    water: 'Weekly',
    difficulty: 'Beginner',
    status: 'recovering'
  },
  {
    id: '4',
    name: 'ZZ Plant',
    species: 'Zamioculcas Zamiifolia',
    price: 32.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6mD7oGWQWddFtUWq5-EEBL-PhanSoOTZnUW3W6quGDl3LZDwY95l3wkmWKbYusBZFKdv1VK3TfVhQRQlGdSrc61ETrTTO6zpuzgV37m5yJCnR3cvwI4WGZ3txxKzpiMB_3sA5OiTdoMDnnpVkdtACHzXejHJ9QbmZumbH0cjWFmu93kLMsQbxf6PJX1Gk5lIkxu4E-wGTkDl5TAeRe-G020oGUO-wiSXbFPjN3eVXulNAMtYCM8Egom_8GrX1Ir7jUa1oGsng1IE',
    tags: ['Tough', 'Low Light'],
    description: 'Almost indestructible with glossy, dark green leaves.',
    light: 'Low Light',
    water: 'Monthly',
    difficulty: 'Beginner'
  }
];

export const MY_PLANTS = [
  { ...PLANTS[1], id: 'user-1', status: 'thriving', nickname: 'Spikey' },
  { ...PLANTS[0], id: 'user-2', status: 'needs-water', nickname: 'Monstera Mike' },
  { ...PLANTS[2], id: 'user-3', status: 'recovering', nickname: 'Penny' },
];
