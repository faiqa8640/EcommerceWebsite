// ── Central product data — imported by Shop, CategoryPage, ProductDetail ──────

export type Product = {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  category: string;           // slug — matches URL param
  img: string;
  badge?: string;             // e.g. "Best Seller", "New", "Limited"
  shortDesc: string;          // shown on category card
  description: string;        // shown on detail page
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  size: string;               // e.g. "100ml"
  longevity: string;          // e.g. "8–10 hours"
  sillage: string;            // e.g. "Heavy"
  season: string[];
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
  // ── MEN ───────────────────────────────────────────────────────────────────
  {
    id: "allure",
    name: "Allure Homme",
    price: "PKR 8,500",
    priceNum: 8500,
    category: "men",
    img: "/perfumes/p1.jpg",
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
  },
  {
    id: "velvet-oud",
    name: "Velvet Oud",
    price: "PKR 9,200",
    priceNum: 9200,
    category: "men",
    img: "/perfumes/p2.jpg",
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
  },
  {
    id: "noir-sport",
    name: "Noir Sport",
    price: "PKR 7,800",
    priceNum: 7800,
    category: "men",
    img: "/perfumes/p3.jpg",
    shortDesc: "Fresh aquatic sport scent with a dark woody heart.",
    description:
      "Noir Sport bridges the gap between sport freshness and dark sophistication. Sea salt and grapefruit open the fragrance, leading into a cool lavender and tonka bean heart. The base is a subtle cedar and vetiver blend — versatile enough for day and evening.",
    notes: {
      top: ["Sea Salt", "Grapefruit", "Mint"],
      heart: ["Lavender", "Tonka Bean", "Iris"],
      base: ["Cedar", "Vetiver", "Musk"],
    },
    size: "100ml",
    longevity: "6–8 hours",
    sillage: "Moderate",
    season: ["Spring", "Summer"],
  },
  {
    id: "amber-bloom-men",
    name: "Amber Spice",
    price: "PKR 8,800",
    priceNum: 8800,
    category: "men",
    img: "/perfumes/p4.jpg",
    badge: "Limited",
    shortDesc: "Warm amber and oriental spices for cooler evenings.",
    description:
      "Amber Spice is an oriental powerhouse designed for the bold man. Cinnamon and clove open with intensity, mellowed by a heart of warm amber and cedarwood. The base is a rich vanilla and benzoin — a fragrance that wraps you like a cashmere coat.",
    notes: {
      top: ["Cinnamon", "Clove", "Black Pepper"],
      heart: ["Amber", "Cedarwood", "Labdanum"],
      base: ["Vanilla", "Benzoin", "Sandalwood"],
    },
    size: "100ml",
    longevity: "10–12 hours",
    sillage: "Heavy",
    season: ["Winter"],
  },

  // ── WOMEN ─────────────────────────────────────────────────────────────────
  {
    id: "rose-mystique",
    name: "Rose Mystique",
    price: "PKR 8,000",
    priceNum: 8000,
    category: "women",
    img: "/perfumes/p5.jpg",
    badge: "Best Seller",
    shortDesc: "A romantic rose heart wrapped in soft musk and peach.",
    description:
      "Rose Mystique is Eloura's most beloved feminine fragrance. A lush Turkish rose absolute forms the heart, supported by delicate peach and bergamot at the top. The base of white musk and cashmere wood gives it a skin-close sensuality that lasts all day.",
    notes: {
      top: ["Bergamot", "Peach", "Pink Grapefruit"],
      heart: ["Turkish Rose", "Peony", "Magnolia"],
      base: ["White Musk", "Cashmere Wood", "Sandalwood"],
    },
    size: "100ml",
    longevity: "8–10 hours",
    sillage: "Moderate",
    season: ["Spring", "Summer"],
  },
  {
    id: "fleur-blanc",
    name: "Fleur Blanc",
    price: "PKR 7,500",
    priceNum: 7500,
    category: "women",
    img: "/perfumes/p6.jpg",
    shortDesc: "Airy white florals with a clean powdery finish.",
    description:
      "Fleur Blanc is the essence of understated femininity. White jasmine and gardenia float in an airy opening, grounded by soft iris and muguet. The dry-down is a clean, powdery musk — perfect for the woman who speaks softly but leaves a lasting impression.",
    notes: {
      top: ["White Jasmine", "Green Leaves", "Lemon Zest"],
      heart: ["Gardenia", "Muguet", "Iris"],
      base: ["Powdery Musk", "Cedarwood", "Ambrette"],
    },
    size: "100ml",
    longevity: "6–8 hours",
    sillage: "Light–Moderate",
    season: ["Spring", "Summer"],
  },
  {
    id: "velvet-rose",
    name: "Velvet Rose Noir",
    price: "PKR 9,000",
    priceNum: 9000,
    category: "women",
    img: "/perfumes/p7.jpg",
    badge: "New",
    shortDesc: "Dark rose meets smoky oud — sensual and mysterious.",
    description:
      "Velvet Rose Noir is for the woman who commands every room. A deep Bulgarian rose is paired with smoky oud and black pepper in a bold, mysterious composition. Vanilla and labdanum anchor it with warmth — this is femininity with an edge.",
    notes: {
      top: ["Black Pepper", "Saffron", "Plum"],
      heart: ["Bulgarian Rose", "Oud", "Patchouli"],
      base: ["Vanilla", "Labdanum", "Amber"],
    },
    size: "100ml",
    longevity: "10–12 hours",
    sillage: "Heavy",
    season: ["Autumn", "Winter"],
  },
  {
    id: "golden-orchid",
    name: "Golden Orchid",
    price: "PKR 8,200",
    priceNum: 8200,
    category: "women",
    img: "/perfumes/p8.jpg",
    shortDesc: "Exotic orchid and vanilla for a warm, feminine glow.",
    description:
      "Golden Orchid captures the lush warmth of an exotic greenhouse. White orchid and ylang-ylang form a heady floral heart, topped with bright mandarin. The base is a golden blend of vanilla, honey, and soft woods — sweet, warm, and deeply feminine.",
    notes: {
      top: ["Mandarin", "Bergamot", "Lychee"],
      heart: ["White Orchid", "Ylang-Ylang", "Jasmine"],
      base: ["Vanilla", "Honey", "Blonde Woods"],
    },
    size: "100ml",
    longevity: "8–10 hours",
    sillage: "Moderate",
    season: ["Spring", "Summer", "Autumn"],
  },

  // ── UNISEX ────────────────────────────────────────────────────────────────
  {
    id: "golden-musk",
    name: "Golden Musk",
    price: "PKR 9,500",
    priceNum: 9500,
    category: "unisex",
    img: "/perfumes/p9.jpg",
    badge: "Best Seller",
    shortDesc: "Warm golden musk that becomes your second skin.",
    description:
      "Golden Musk is Eloura's most versatile signature scent — a fragrance that adapts to the wearer. An opening of soft citrus and light woods leads to a heart of musk, amber, and a whisper of rose. It settles into something that smells unmistakably like you, only better.",
    notes: {
      top: ["Bergamot", "Lemon", "Green Tea"],
      heart: ["Golden Musk", "Amber", "Rose Absolute"],
      base: ["Sandalwood", "Vetiver", "Vanilla"],
    },
    size: "100ml",
    longevity: "8–10 hours",
    sillage: "Moderate",
    season: ["All Seasons"],
  },
  {
    id: "cedar-sage",
    name: "Cedar & Sage",
    price: "PKR 8,400",
    priceNum: 8400,
    category: "unisex",
    img: "/perfumes/p10.jpg",
    shortDesc: "Earthy sage and aromatic cedar — fresh and grounded.",
    description:
      "Cedar & Sage is a nature-inspired composition for those who find beauty in simplicity. Fresh sage and eucalyptus open cleanly, giving way to a heart of aromatic cedarwood and fougère. The base is a minimal musk and oakmoss — effortlessly sophisticated.",
    notes: {
      top: ["Sage", "Eucalyptus", "Grapefruit"],
      heart: ["Cedarwood", "Fougère", "Lavender"],
      base: ["Oakmoss", "Clean Musk", "Amber"],
    },
    size: "100ml",
    longevity: "7–9 hours",
    sillage: "Moderate",
    season: ["Spring", "Summer", "Autumn"],
  },
  {
    id: "smoke-and-silk",
    name: "Smoke & Silk",
    price: "PKR 9,800",
    priceNum: 9800,
    category: "unisex",
    img: "/perfumes/p11.jpg",
    badge: "Limited",
    shortDesc: "Smoky incense meets silky musks — bold and elegant.",
    description:
      "Smoke & Silk is a study in contrasts. The opening is dramatic — smoky incense and cardamom — before surrendering to a silky rose and oud heart. The base is an intoxicating mix of benzoin and white musk, leaving a trail of quiet elegance.",
    notes: {
      top: ["Incense", "Cardamom", "Bergamot"],
      heart: ["Rose", "Oud", "Orris"],
      base: ["Benzoin", "White Musk", "Amber"],
    },
    size: "100ml",
    longevity: "10–12 hours",
    sillage: "Heavy",
    season: ["Autumn", "Winter"],
  },
  {
    id: "aqua-verde",
    name: "Aqua Verde",
    price: "PKR 7,600",
    priceNum: 7600,
    category: "unisex",
    img: "/perfumes/p12.jpg",
    shortDesc: "A clean green aquatic — like morning dew in a forest.",
    description:
      "Aqua Verde is a breath of fresh air in a bottle. Marine accord and green fig open with cool freshness, leading into a heart of violet leaf and light musk. The dry-down is crisp cedarwood and white tea — the ideal everyday scent for any season.",
    notes: {
      top: ["Marine Accord", "Green Fig", "Mint"],
      heart: ["Violet Leaf", "Light Musk", "Cucumber"],
      base: ["Cedarwood", "White Tea", "Ambergris"],
    },
    size: "100ml",
    longevity: "6–8 hours",
    sillage: "Light–Moderate",
    season: ["Spring", "Summer"],
  },

  // ── LUXURY ────────────────────────────────────────────────────────────────
  {
    id: "oud-royal",
    name: "Oud Royal",
    price: "PKR 18,500",
    priceNum: 18500,
    category: "luxury",
    img: "/perfumes/p13.jpg",
    badge: "Exclusive",
    shortDesc: "The finest aged oud in a regal, unforgettable composition.",
    description:
      "Oud Royal is Eloura's crown jewel — a fragrance fit for royalty. Rare aged Hindi oud forms the core, surrounded by precious saffron, rose absolute, and 24-karat gold flakes. The base of frankincense and dark amber creates a trail that commands reverence. Comes in a hand-crafted crystal flacon.",
    notes: {
      top: ["Rare Saffron", "Rose Absolute", "Black Pepper"],
      heart: ["Aged Hindi Oud", "Frankincense", "Myrrh"],
      base: ["Dark Amber", "Sandalwood", "Musk Ambrette"],
    },
    size: "75ml",
    longevity: "12–16 hours",
    sillage: "Massive",
    season: ["Autumn", "Winter"],
  },
  {
    id: "la-nuit-absolute",
    name: "La Nuit Absolue",
    price: "PKR 16,000",
    priceNum: 16000,
    category: "luxury",
    img: "/perfumes/p14.jpg",
    badge: "Limited",
    shortDesc: "A noir floral of impossible depth and dark elegance.",
    description:
      "La Nuit Absolue is darkness distilled into fragrance. Midnight jasmine and black rose form a hypnotic heart, framed by dark cocoa and tobacco. The base is a resinous blend of opoponax and leather — a scent for those who are unafraid of the night.",
    notes: {
      top: ["Midnight Jasmine", "Dark Plum", "Cognac"],
      heart: ["Black Rose", "Tobacco", "Cocoa"],
      base: ["Opoponax", "Leather", "Vanilla Absolute"],
    },
    size: "75ml",
    longevity: "12–14 hours",
    sillage: "Heavy–Massive",
    season: ["Winter"],
  },
  {
    id: "imperial-amber",
    name: "Imperial Amber",
    price: "PKR 14,500",
    priceNum: 14500,
    category: "luxury",
    img: "/perfumes/p15.jpg",
    badge: "Exclusive",
    shortDesc: "A glowing amber accord of extraordinary warmth and richness.",
    description:
      "Imperial Amber is a monument to the warmth of amber. Opening with bright labdanum and sweet benzoin, the heart reveals a lush vanilla and rose duet. The base is a masterclass in amber perfumery — deep, golden, and infinitely complex. A fragrance that announces your arrival and lingers in your memory.",
    notes: {
      top: ["Labdanum", "Benzoin", "Bergamot"],
      heart: ["Amber Absolute", "Rose", "Vanilla Bourbon"],
      base: ["Oud", "Beeswax", "Civet"],
    },
    size: "100ml",
    longevity: "12–14 hours",
    sillage: "Heavy",
    season: ["Autumn", "Winter"],
  },
  {
    id: "white-diamond",
    name: "White Diamond",
    price: "PKR 15,000",
    priceNum: 15000,
    category: "luxury",
    img: "/perfumes/p16.jpg",
    shortDesc: "Pristine white florals with a crystalline iris heart.",
    description:
      "White Diamond is the pinnacle of floral luxury. Rare Sambac jasmine and Tahitian gardenia form a breathtaking heart, polished with crystalline iris and violet. The base is a flawless cashmere and sandalwood — transparent, radiant, and endlessly refined.",
    notes: {
      top: ["Aldehydes", "Bergamot", "Neroli"],
      heart: ["Sambac Jasmine", "Iris Crystal", "Violet"],
      base: ["Cashmere", "Sandalwood", "White Amber"],
    },
    size: "75ml",
    longevity: "10–12 hours",
    sillage: "Moderate–Heavy",
    season: ["Spring", "Autumn"],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export const getProductsByCategory = (
  slug: string
): Product[] => {
  if (slug === "all") {
    return products;
  }

  return products.filter(
    (p) => p.category === slug
  );
};

export const getProductById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

export const getCategoryBySlug = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);
