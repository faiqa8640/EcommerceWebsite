
// ── Central product data — imported by Shop, CategoryPage, ProductDetail ──────

export type Product = {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  category: string;
  // img: string;
  images: string[];
  badge?: string;
  shortDesc: string;
  description: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  size: string;
  longevity: string;
  sillage: string;
  season: string[];

  // REVIEWS ADDED
  reviews?: {
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
};

export type Category = {
  slug: string;
  label: string;
  desc: string;
  img: string;
  bannerImg: string;
};

// ── Categories ────────────────────────────────────────────────────────────────
export const categories: Category[] = [
  {
    slug: "all",
    label: "All Perfumes",
    desc: "Explore our complete fragrance collection.",
    img: "/categories/all.jpg",
    bannerImg: "/banners/all-banner.jpg",
  },
  {
    slug: "men",
    label: "Perfumes for Men",
    desc: "Bold, strong and luxury masculine scents.",
    img: "/categories/men.jpg",
    bannerImg: "/banners/men-banner.jpg",
  },
  {
    slug: "women",
    label: "Perfumes for Women",
    desc: "Soft floral and elegant long-lasting fragrances.",
    img: "/categories/women.jpg",
    bannerImg: "/banners/women-banner.jpg",
  },
  {
    slug: "unisex",
    label: "Unisex Perfumes",
    desc: "Balanced fragrances perfect for everyone.",
    img: "/categories/unisex.jpg",
    bannerImg: "/banners/unisex-banner.jpg",
  },
  {
    slug: "luxury",
    label: "Luxury Exclusive",
    desc: "Premium rare perfumes for special occasions.",
    img: "/categories/luxury.jpg",
    bannerImg: "/banners/luxury-banner.jpg",
  },
];

// ── Products ──────────────────────────────────────────────────────────────────
export const products: Product[] = [

  // ───────── MEN ─────────

  {
    id: "allure",
    name: "Allure Homme",
    price: "PKR 8,500",
    priceNum: 8500,
    category: "men",
    // img: "/perfumes/p1.jpg",
    images: [
      "/perfumes/p1-1.jpg",
      "/perfumes/p1-2.jfif",
      "/perfumes/p1-3.jfif"],
    badge: "Best Seller",
    shortDesc: "A timeless masculine with warm woods and fresh citrus.",
    description:
      "Allure Homme is a signature masculine fragrance that opens with a burst of fresh bergamot and mandarin, evolving into a heart of spicy cardamom and cool vetiver. The base settles into warm sandalwood and musk — leaving a trail that commands attention without demanding it.",
    notes: {
      top: ["Bergamot", "Mandarin", "Lemon"],
      heart: ["Cardamom", "Vetiver", "Geranium"],
      base: ["Sandalwood", "White Musk", "Amber"],
    },
    size: "100ml",
    longevity: "8–10 hours",
    sillage: "Moderate–Heavy",
    season: ["Spring", "Autumn"],

    reviews: [
      {
        user: "Ali",
        rating: 5,
        comment: "Luxury smell, very long lasting.",
        date: "2026-06-01",
      },
      {
        user: "Sara",
        rating: 4,
        comment: "Very premium feel, loved it.",
        date: "2026-06-03",
      },
      {
        user: "Sarim",
        rating: 4,
        comment: "Very premium feel, loved it.",
        date: "2026-06-03",
      },
      {
        user: "zara",
        rating: 4,
        comment: "Very premium feel, loved it.",
        date: "2026-06-03",
      },
      {
        user: "zain",
        rating: 4,
        comment: "Very premium feel, loved it.",
        date: "2026-06-03",
      },
    ],
  },

  {
    id: "Irresistible",
    name: "Irresistible",
    price: "PKR 9,200",
    priceNum: 9200,
    category: "women",
    // img: "/perfumes/p2.jpg",
    images: [
      "/perfumes/p2-1.jpg",
      "/perfumes/p2-2.jfif",
      "/perfumes/p2-3.jfif",
    ],
    badge: "New",
    shortDesc: "Deep, smoky oud with a velvety leather finish.",
    description:
      "Velvet Oud is an olfactive journey into the heart of the Middle East. A rich opening of saffron and rose gives way to a smoky oud heart layered with leather. The dry-down reveals a deep amber and patchouli base that lingers on the skin for hours.",
    notes: {
      top: ["Saffron", "Rose", "Pink Pepper"],
      heart: ["Oud Wood", "Leather", "Incense"],
      base: ["Amber", "Patchouli", "Vanilla"],
    },
    size: "100ml",
    longevity: "10–12 hours",
    sillage: "Heavy",
    season: ["Autumn", "Winter"],

    reviews: [
      {
        user: "Hassan",
        rating: 5,
        comment: "Perfect winter fragrance, very strong.",
        date: "2026-06-02",
      },
      {
        user: "Ali",
        rating: 5,
        comment: "Luxury smell, very long lasting.",
        date: "2026-06-01",
      },
    ],
  },

  {
    id: "noir-sport",
    name: "Noir Sport",
    price: "PKR 7,800",
    priceNum: 7800,
    category: "men",
    // img: "/perfumes/p3.jpg",
    images: [
      "/perfumes/p3.jpg",],
    shortDesc: "Fresh aquatic sport scent with a dark woody heart.",
    description:
      "Noir Sport bridges the gap between sport freshness and dark sophistication. Sea salt and grapefruit open the fragrance, leading into a cool lavender and tonka bean heart. The base is a subtle cedar and vetiver blend.",
    notes: {
      top: ["Sea Salt", "Grapefruit", "Mint"],
      heart: ["Lavender", "Tonka Bean", "Iris"],
      base: ["Cedar", "Vetiver", "Musk"],
    },
    size: "100ml",
    longevity: "6–8 hours",
    sillage: "Moderate",
    season: ["Spring", "Summer"],

    reviews: [
      {
        user: "Ahmed",
        rating: 4,
        comment: "Good everyday perfume.",
        date: "2026-06-04",
      },
      {
        user: "Ali",
        rating: 5,
        comment: "Luxury smell, very long lasting.",
        date: "2026-06-01",
      },
    ],
  },

  {
    id: "amber-bloom-men",
    name: "Amber Spice",
    price: "PKR 8,800",
    priceNum: 8800,
    category: "men",
    // img: "/perfumes/p4.jpg",
    images: [
      "/perfumes/p4.jpg",],
    badge: "Limited",
    shortDesc: "Warm amber and oriental spices for cooler evenings.",
    description:
      "Amber Spice is an oriental powerhouse designed for the bold man.",
    notes: {
      top: ["Cinnamon", "Clove", "Black Pepper"],
      heart: ["Amber", "Cedarwood", "Labdanum"],
      base: ["Vanilla", "Benzoin", "Sandalwood"],
    },
    size: "100ml",
    longevity: "10–12 hours",
    sillage: "Heavy",
    season: ["Winter"],

    reviews: [
      {
        user: "Ali",
        rating: 5,
        comment: "Luxury smell, very long lasting.",
        date: "2026-06-01",
      },
    ],
  },

  // ───────── WOMEN ─────────

  {
    id: "rose-mystique",
    name: "Rose Mystique",
    price: "PKR 8,000",
    priceNum: 8000,
    category: "women",
    // img: "/perfumes/p5.jpg",
    images: [
      "/perfumes/p5.jpg",],
    badge: "Best Seller",
    shortDesc: "A romantic rose heart wrapped in soft musk and peach.",
    description:
      "Rose Mystique is Eloura's most beloved feminine fragrance.",
    notes: {
      top: ["Bergamot", "Peach", "Pink Grapefruit"],
      heart: ["Turkish Rose", "Peony", "Magnolia"],
      base: ["White Musk", "Cashmere Wood", "Sandalwood"],
    },
    size: "100ml",
    longevity: "8–10 hours",
    sillage: "Moderate",
    season: ["Spring", "Summer"],

    reviews: [
      {
        user: "Ayesha",
        rating: 5,
        comment: "Smells like pure elegance.",
        date: "2026-06-05",
      },
      {
        user: "Ali",
        rating: 5,
        comment: "Luxury smell, very long lasting.",
        date: "2026-06-01",
      },
    ],
  },

  {
    id: "fleur-blanc",
    name: "Fleur Blanc",
    price: "PKR 7,500",
    priceNum: 7500,
    category: "women",
    // img: "/perfumes/p6.jpg",
    images: [
      "/perfumes/p6.jpg",],
    shortDesc: "Airy white florals with a clean powdery finish.",
    description:
      "Fleur Blanc is the essence of understated femininity.",
    notes: {
      top: ["White Jasmine", "Green Leaves", "Lemon Zest"],
      heart: ["Gardenia", "Muguet", "Iris"],
      base: ["Powdery Musk", "Cedarwood", "Ambrette"],
    },
    size: "100ml",
    longevity: "6–8 hours",
    sillage: "Light–Moderate",
    season: ["Spring", "Summer"],

    reviews: [
      {
        user: "Ali",
        rating: 5,
        comment: "Luxury smell, very long lasting.",
        date: "2026-06-01",
      },
    ],
  },


  {
    id: "velvet-rose",
    name: "Velvet Rose Noir",
    price: "PKR 9,000",
    priceNum: 9000,
    category: "women",
    // img: "/perfumes/p7.jpg",
    images: [
      "/perfumes/p7.jpg",],
    shortDesc: "Dark rose meets smoky oud — sensual and mysterious.",
    description: "A bold feminine fragrance with oud and rose.",
    notes: {
      top: ["Black Pepper", "Saffron", "Plum"],
      heart: ["Bulgarian Rose", "Oud", "Patchouli"],
      base: ["Vanilla", "Labdanum", "Amber"],
    },
    size: "100ml",
    longevity: "10–12 hours",
    sillage: "Heavy",
    season: ["Autumn", "Winter"],
    reviews: [
      {
        user: "Ali",
        rating: 5,
        comment: "Luxury smell, very long lasting.",
        date: "2026-06-01",
      },
    ],
  },

  {
    id: "golden-orchid",
    name: "Golden Orchid",
    price: "PKR 8,200",
    priceNum: 8200,
    category: "women",
    // img: "/perfumes/p8.jpg",
    images: [
      "/perfumes/p8.jpg",],
    shortDesc: "Exotic orchid and vanilla for a warm glow.",
    description: "A soft floral sweet fragrance.",
    notes: {
      top: ["Mandarin", "Bergamot", "Lychee"],
      heart: ["White Orchid", "Ylang-Ylang", "Jasmine"],
      base: ["Vanilla", "Honey", "Blonde Woods"],
    },
    size: "100ml",
    longevity: "8–10 hours",
    sillage: "Moderate",
    season: ["Spring", "Summer", "Autumn"],
    reviews: [
      {
        user: "Ali",
        rating: 5,
        comment: "Luxury smell, very long lasting.",
        date: "2026-06-01",
      },
    ],
  },

  // ───────── UNISEX ─────────

  {
    id: "golden-musk",
    name: "Golden Musk",
    price: "PKR 9,500",
    priceNum: 9500,
    category: "unisex",
    // img: "/perfumes/p9.jpg",
    images: [
      "/perfumes/p9.jpg",],
    badge: "Best Seller",
    shortDesc: "Warm golden musk that becomes your second skin.",
    description: "Signature unisex fragrance.",
    notes: {
      top: ["Bergamot", "Lemon", "Green Tea"],
      heart: ["Golden Musk", "Amber", "Rose Absolute"],
      base: ["Sandalwood", "Vetiver", "Vanilla"],
    },
    size: "100ml",
    longevity: "8–10 hours",
    sillage: "Moderate",
    season: ["All Seasons"],
    reviews: [
      {
        user: "Ali",
        rating: 5,
        comment: "Luxury smell, very long lasting.",
        date: "2026-06-01",
      },
    ],
  },

  {
    id: "cedar-sage",
    name: "Cedar & Sage",
    price: "PKR 8,400",
    priceNum: 8400,
    category: "unisex",
    // img: "/perfumes/p10.jpg",
    images: [
      "/perfumes/p10.jpg",],
    shortDesc: "Earthy sage and cedar — fresh and grounded.",
    description: "Nature inspired fragrance.",
    notes: {
      top: ["Sage", "Eucalyptus", "Grapefruit"],
      heart: ["Cedarwood", "Fougère", "Lavender"],
      base: ["Oakmoss", "Clean Musk", "Amber"],
    },
    size: "100ml",
    longevity: "7–9 hours",
    sillage: "Moderate",
    season: ["Spring", "Summer", "Autumn"],
    reviews: [
      {
        user: "Ali",
        rating: 5,
        comment: "Luxury smell, very long lasting.",
        date: "2026-06-01",
      },
    ],
  },

  {
    id: "smoke-and-silk",
    name: "Smoke & Silk",
    price: "PKR 9,800",
    priceNum: 9800,
    category: "unisex",
    // img: "/perfumes/p11.jpg",
    images: [
      "/perfumes/p11.jpg",],
    badge: "Limited",
    shortDesc: "Smoky incense meets silky musks.",
    description: "Dark elegant fragrance.",
    notes: {
      top: ["Incense", "Cardamom", "Bergamot"],
      heart: ["Rose", "Oud", "Orris"],
      base: ["Benzoin", "White Musk", "Amber"],
    },
    size: "100ml",
    longevity: "10–12 hours",
    sillage: "Heavy",
    season: ["Autumn", "Winter"],
    reviews: [
      {
        user: "Ali",
        rating: 5,
        comment: "Luxury smell, very long lasting.",
        date: "2026-06-01",
      },
    ],
  },

  {
    id: "aqua-verde",
    name: "Aqua Verde",
    price: "PKR 7,600",
    priceNum: 7600,
    category: "unisex",
    // img: "/perfumes/p12.jpg",
    images: [
      "/perfumes/p12.jpg",],
    shortDesc: "Clean green aquatic freshness.",
    description: "Fresh everyday fragrance.",
    notes: {
      top: ["Marine Accord", "Green Fig", "Mint"],
      heart: ["Violet Leaf", "Light Musk", "Cucumber"],
      base: ["Cedarwood", "White Tea", "Ambergris"],
    },
    size: "100ml",
    longevity: "6–8 hours",
    sillage: "Light–Moderate",
    season: ["Spring", "Summer"],
    reviews: [
      {
        user: "Ali",
        rating: 5,
        comment: "Luxury smell, very long lasting.",
        date: "2026-06-01",
      },
    ],
  },

  // ───────── LUXURY ─────────

  {
    id: "oud-royal",
    name: "Oud Royal",
    price: "PKR 18,500",
    priceNum: 18500,
    category: "luxury",
    // img: "/perfumes/p13.jpg",
    images: [
      "/perfumes/p13.jpg",],
    badge: "Exclusive",
    shortDesc: "Royal aged oud masterpiece.",
    description: "Luxury oud fragrance.",
    notes: {
      top: ["Rare Saffron", "Rose Absolute", "Black Pepper"],
      heart: ["Aged Hindi Oud", "Frankincense", "Myrrh"],
      base: ["Dark Amber", "Sandalwood", "Musk"],
    },
    size: "75ml",
    longevity: "12–16 hours",
    sillage: "Massive",
    season: ["Autumn", "Winter"],
    reviews: [
      {
        user: "Ali",
        rating: 5,
        comment: "Luxury smell, very long lasting.",
        date: "2026-06-01",
      },
    ],
  },

  {
    id: "la-nuit-absolute",
    name: "La Nuit Absolue",
    price: "PKR 16,000",
    priceNum: 16000,
    category: "luxury",
    // img: "/perfumes/p14.jpg",
    images: [
      "/perfumes/p14.jpg",],
    badge: "Limited",
    shortDesc: "Dark floral night elegance.",
    description: "Deep sensual fragrance.",
    notes: {
      top: ["Midnight Jasmine", "Dark Plum", "Cognac"],
      heart: ["Black Rose", "Tobacco", "Cocoa"],
      base: ["Opoponax", "Leather", "Vanilla"],
    },
    size: "75ml",
    longevity: "12–14 hours",
    sillage: "Heavy–Massive",
    season: ["Winter"],
    reviews: [
      {
        user: "Ali",
        rating: 5,
        comment: "Luxury smell, very long lasting.",
        date: "2026-06-01",
      },
    ],
  },

  {
    id: "imperial-amber",
    name: "Imperial Amber",
    price: "PKR 14,500",
    priceNum: 14500,
    category: "luxury",
    // img: "/perfumes/p15.jpg",
    images: [
      "/perfumes/p15.jpg",],
    badge: "Exclusive",
    shortDesc: "Golden amber richness.",
    description: "Warm amber masterpiece.",
    notes: {
      top: ["Labdanum", "Benzoin", "Bergamot"],
      heart: ["Amber Absolute", "Rose", "Vanilla Bourbon"],
      base: ["Oud", "Beeswax", "Civet"],
    },
    size: "100ml",
    longevity: "12–14 hours",
    sillage: "Heavy",
    season: ["Autumn", "Winter"],
    reviews: [
      {
        user: "Ali",
        rating: 5,
        comment: "Luxury smell, very long lasting.",
        date: "2026-06-01",
      },
    ],
  },

  {
    id: "white-diamond",
    name: "White Diamond",
    price: "PKR 15,000",
    priceNum: 15000,
    category: "luxury",
    // img: "/perfumes/p16.jpg",
    images: [
      "/perfumes/p16.jpg",],
    shortDesc: "Crystal white floral luxury.",
    description: "Elegant floral fragrance.",
    notes: {
      top: ["Aldehydes", "Bergamot", "Neroli"],
      heart: ["Sambac Jasmine", "Iris Crystal", "Violet"],
      base: ["Cashmere", "Sandalwood", "White Amber"],
    },
    size: "75ml",
    longevity: "10–12 hours",
    sillage: "Moderate–Heavy",
    season: ["Spring", "Autumn"],
    reviews: [
      {
        user: "Ali",
        rating: 5,
        comment: "Luxury smell, very long lasting.",
        date: "2026-06-01",
      },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export const getProductsByCategory = (slug: string): Product[] => {
  if (slug === "all") return products;
  return products.filter((p) => p.category === slug);
};

export const getProductById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

export const getCategoryBySlug = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);