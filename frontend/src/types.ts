export type Review = {
  _id?: string;
  productId: string;
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
  reviews?: Review[];
  averageRating?: number; // pre-stored in MongoDB, updated on each review
};

export type Category = {
  slug: string;
  label: string;
  desc: string;
  img: string;
  bannerImg: string;
};