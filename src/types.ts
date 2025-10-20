// Based on Section 8: Data Modeling
export type Game = {
  id: string;
  title: string;
  slug: string;
  description: string;
  genre: string[];
  platforms: string[]; // 'PC', 'PS5'...
  price: number;
  discount?: number;
  images: string[];
 trailerUrl?: string | null;
  rating: number; // avg
  releaseDate: string;
  publisher?: string;
  systemRequirements?: { os: string; cpu: string; ram: string; gpu: string; storage: string };
  tags: string[];
  reviewsCount: number;
  stock: number;
};

export type CartItem = {
  game: Game;
  quantity: number;
};