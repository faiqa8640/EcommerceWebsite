

// export type Product = {
//   id: string;
//   name: string;
//   price: string;
//   priceNum: number;
//   category: string;
//   brand: string;
//   images: string[];
//   badge?: string;
//   shortDesc: string;
//   description: string;
//   notes: {
//     top: string[];
//     heart: string[];
//     base: string[];
//   };
//   size: string;
//   longevity: string;
//   sillage: string;
//   season: string[];
//   reviews?: {
//     user: string;
//     rating: number;
//     comment: string;
//     date: string;
//   }[];
// };

// export type Category = {
//   slug: string;
//   label: string;
//   desc: string;
//   img: string;
//   bannerImg: string;
// };



export type Review = {
  _id?: string;      // Included from MongoDB backend
  productId: string; // Links back to the fragrance slug
  user: string;
  rating: number;
  comment: string;
  date: string;
  createdAt?: string;
};

export type Product = {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  category: string;
  brand: string;
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
  reviews?: Review[]; // Uses the clean, independent Review type defined above
};

export type Category = {
  slug: string;
  label: string;
  desc: string;
  img: string;
  bannerImg: string;
};