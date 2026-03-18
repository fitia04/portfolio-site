export type SpotCategory = "food" | "voyage" | "food-voyage";

export interface Spot {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: SpotCategory;
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  imageUrl: string;
  rating?: number;
  emoji: string;
  isFeatured: boolean;
  createdAt: string;
}
