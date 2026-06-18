import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/productModel";
import Category from "./models/categoryModel";
import Review from "./models/reviewModel"; 

// Load environmental variables for MONGO_URI
dotenv.config();

const seedCategories = [
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

const seedProducts = [
  {
    name: "Allure Homme",
    price: 8500,
    category: "men",
    brand: "Chanel",
    images: ["/perfumes/p1-1.jpg", "/perfumes/p1-2.jfif", "/perfumes/p1-3.jfif"],
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
      { user: "Ali", rating: 5, comment: "Luxury smell, very long lasting.", date: "2026-06-01" },
      { user: "Sara", rating: 5, comment: "Very premium feel, loved it.", date: "2026-06-03" },
      { user: "Sarim", rating: 4, comment: "Very premium feel, loved it.", date: "2026-06-03" },
      { user: "zara", rating: 5, comment: "Very premium feel, loved it.", date: "2026-06-03" },
      { user: "zain", rating: 4, comment: "Very premium feel, loved it.", date: "2026-06-03" },
    ],
  },
  {
    name: "Irresistible",
    price: 9200,
    category: "women",
    brand: "Givenchy",
    images: ["/perfumes/p2-1.jpg", "/perfumes/p2-2.jfif", "/perfumes/p2-3.jfif"],
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
      { user: "Hassan", rating: 5, comment: "Perfect winter fragrance, very strong.", date: "2026-06-02" },
      { user: "Ali", rating: 5, comment: "Luxury smell, very long lasting.", date: "2026-06-01" },
    ],
  },
  {
    name: "Noir Sport",
    price: 7800,
    category: "men",
    brand: "Dior",
    images: ["/perfumes/p3.jpg"],
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
      { user: "Ahmed", rating: 4, comment: "Good everyday perfume.", date: "2026-06-04" },
      { user: "Ali", rating: 5, comment: "Luxury smell, very long lasting.", date: "2026-06-01" },
    ],
  },
  {
    name: "Amber Spice",
    price: 8800,
    category: "men",
    brand: "Dior",
    images: ["/perfumes/p4.jpg"],
    badge: "Limited",
    shortDesc: "Warm amber and oriental spices for cooler evenings.",
    description: "Amber Spice is an oriental powerhouse designed for the bold man.",
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
      { user: "Ali", rating: 5, comment: "Luxury smell, very long lasting.", date: "2026-06-01" },
      { user: "zara", rating: 4, comment: "Very premium feel, loved it.", date: "2026-06-03" },
    ],
  },
  {
    name: "Rose Mystique",
    price: 8000,
    category: "women",
    brand: "Givenchy",
    images: ["/perfumes/p5.jpg"],
    badge: "Best Seller",
    shortDesc: "A romantic rose heart wrapped in soft musk and peach.",
    description: "Rose Mystique is Eloura's most beloved feminine fragrance.",
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
      { user: "Ayesha", rating: 5, comment: "Smells like pure elegance.", date: "2026-06-05" },
      { user: "Ali", rating: 5, comment: "Luxury smell, very long lasting.", date: "2026-06-01" },
    ],
  },
  {
    name: "Fleur Blanc",
    price: 7500,
    category: "women",
    brand: "Givenchy",
    images: ["/perfumes/p6.jpg"],
    shortDesc: "Airy white florals with a clean powdery finish.",
    description: "Fleur Blanc is the essence of understated femininity.",
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
      { user: "Ali", rating: 5, comment: "Luxury smell, very long lasting.", date: "2026-06-01" },
      { user: "zara", rating: 4, comment: "Very premium feel, loved it.", date: "2026-06-03" },
    ],
  },
  {
    name: "Velvet Rose Noir",
    price: 9000,
    category: "women",
    brand: "Dior",
    images: ["/perfumes/p7.jpg"],
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
      { user: "Ali", rating: 5, comment: "Luxury smell, very long lasting.", date: "2026-06-01" },
      { user: "zara", rating: 4, comment: "Very premium feel, loved it.", date: "2026-06-03" },
    ],
  },
  {
    name: "Golden Orchid",
    price: 8200,
    category: "women",
    brand: "Chanel",
    images: ["/perfumes/p8.jpg"],
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
      { user: "Ali", rating: 5, comment: "Luxury smell, very long lasting.", date: "2026-06-01" },
      { user: "zara", rating: 4, comment: "Very premium feel, loved it.", date: "2026-06-03" },
    ],
  },
  {
    name: "Golden Musk",
    price: 9500,
    category: "unisex",
    brand: "Chanel",
    images: ["/perfumes/p9.jpg"],
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
      { user: "Ali", rating: 5, comment: "Luxury smell, very long lasting.", date: "2026-06-01" },
      { user: "zara", rating: 4, comment: "Very premium feel, loved it.", date: "2026-06-03" },
    ],
  },
  {
    name: "Cedar & Sage",
    price: 8400,
    category: "unisex",
    brand: "Tom Ford",
    images: ["/perfumes/p10.jpg"],
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
      { user: "Ali", rating: 5, comment: "Luxury smell, very long lasting.", date: "2026-06-01" },
      { user: "zara", rating: 4, comment: "Very premium feel, loved it.", date: "2026-06-03" },
    ],
  },
  {
    name: "Smoke & Silk",
    price: 9800,
    category: "unisex",
    brand: "Tom Ford",
    images: ["/perfumes/p11.jpg"],
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
      { user: "Ali", rating: 5, comment: "Luxury smell, very long lasting.", date: "2026-06-01" },
      { user: "zara", rating: 4, comment: "Very premium feel, loved it.", date: "2026-06-03" },
    ],
  },
  {
    name: "Aqua Verde",
    price: 7600,
    category: "unisex",
    brand: "Tom Ford",
    images: ["/perfumes/p12.jpg"],
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
      { user: "Ali", rating: 5, comment: "Luxury smell, very long lasting.", date: "2026-06-01" },
      { user: "zara", rating: 4, comment: "Very premium feel, loved it.", date: "2026-06-03" },
    ],
  },
  {
    name: "Oud Royal",
    price: 18500,
    category: "luxury",
    brand: "Creed",
    images: ["/perfumes/p13.jpg"],
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
      { user: "Ali", rating: 5, comment: "Luxury smell, very long lasting.", date: "2026-06-01" },
      { user: "zara", rating: 4, comment: "Very premium feel, loved it.", date: "2026-06-03" },
    ],
  },
  {
    name: "La Nuit Absolue",
    price: 16000,
    category: "luxury",
    brand: "Creed",
    images: ["/perfumes/p14.jpg"],
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
      { user: "Ali", rating: 5, comment: "Luxury smell, very long lasting.", date: "2026-06-01" },
      { user: "zara", rating: 4, comment: "Very premium feel, loved it.", date: "2026-06-03" },
    ],
  },
  {
    name: "Imperial Amber",
    price: 14500,
    category: "luxury",
    brand: "Creed",
    images: ["/perfumes/p15.jpg"],
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
      { user: "Ali", rating: 5, comment: "Luxury smell, very long lasting.", date: "2026-06-01" },
      { user: "zara", rating: 4, comment: "Very premium feel, loved it.", date: "2026-06-03" },
    ],
  },
  {
    name: "White Diamond",
    price: 15000,
    category: "luxury",
    brand: "Versace",
    images: ["/perfumes/p16.jpg"],
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
      { user: "Ali", rating: 5, comment: "Luxury smell, very long lasting.", date: "2026-06-01" },
      { user: "zara", rating: 4, comment: "Very premium feel, loved it.", date: "2026-06-03" },
    ],
  },
];

const runSeeder = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from your environmental variables (.env)");
    }

    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connection successful.");

    console.log("Clearing old products, categories, and reviews details...");
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Review.deleteMany({}); 

    // 🔥 FIX: Explicitly drop the old 'id_1' unique index if it still exists in the database collection
    try {
      await Product.collection.dropIndex("id_1");
      console.log("Successfully dropped legacy unique 'id' index.");
    } catch (indexError) {
      // If the index doesn't exist, ignore the error and proceed cleanly
      console.log("Legacy index not found or already dropped. Proceeding...");
    }

    console.log("Inserting new Categories collection data...");
    await Category.insertMany(seedCategories);

    // Separate the nested reviews out so we can insert raw clean products first
    const productsWithoutReviews = seedProducts.map((p) => {
      const { reviews, ...cleanProduct } = p;
      return cleanProduct;
    });

    console.log("Inserting new Cleaned Products collection data...");
    const insertedProducts = await Product.insertMany(productsWithoutReviews);

    // Build the decoupled reviews using the actual dynamic _id properties generated by MongoDB
    console.log("Processing and inserting decoupled reviews with valid database ObjectIds...");
    const extractedReviews: any[] = [];

    insertedProducts.forEach((insertedProduct) => {
      const originalProductData = seedProducts.find(
        (p) => p.name === insertedProduct.name
      );

      if (originalProductData && originalProductData.reviews && originalProductData.reviews.length > 0) {
        originalProductData.reviews.forEach((rev) => {
          extractedReviews.push({
            productId: insertedProduct._id, // Links accurately using dynamic mongoose generated Product ObjectId
            user: rev.user,
            rating: rev.rating,
            comment: rev.comment
          });
        });
      }
    });

    if (extractedReviews.length > 0) {
      await Review.insertMany(extractedReviews);
      console.log("Reviews saved successfully.");
    }

    // Compute the initial average ratings directly based on those fresh reviews
    console.log("Calculating and saving average ratings into Product collection...");
    for (const productDoc of insertedProducts) {
      const matchingReviews = extractedReviews.filter(
        (r) => r.productId.toString() === productDoc._id.toString()
      );

      if (matchingReviews.length > 0) {
        const total = matchingReviews.reduce((sum, r) => sum + r.rating, 0);
        const avg = parseFloat((total / matchingReviews.length).toFixed(1));

        await Product.findByIdAndUpdate(productDoc._id, { averageRating: avg });
      }
    }
    console.log("Average ratings mapped completely!");

    console.log("Database Successfully Seeded with decoupled collections!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding Operation Failed Error:", error);
    process.exit(1);
  }
};

runSeeder();

