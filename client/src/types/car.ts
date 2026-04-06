import { resolveMediaUrl } from "@/utils/mediaUrl";

/** Shape returned by GET /api/cars and list endpoints */
export type ApiCar = {
  id: number;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuel_type: string;
  transmission: string;
  km_driven: number;
  location: string;
  images: string[];
  image: string | null;
  description: string;
  is_featured: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CarsListResponse = {
  data: ApiCar[];
  meta: { total: number; page: number; limit: number; pages: number };
};

export type CarDetailResponse = {
  car: ApiCar;
  similar: ApiCar[];
};

/** UI-friendly car (aligned with existing components) */
export type CarView = {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  kmDriven: number;
  fuelType: string;
  transmission: string;
  location: string;
  image: string;
  images: string[];
  description: string;
  is_featured: boolean;
  isPremium?: boolean;
  isHotDeal?: boolean;
};

export function mapApiCarToView(c: ApiCar): CarView {
  const imgs = Array.isArray(c.images) ? c.images.map(resolveMediaUrl) : [];
  const primary = resolveMediaUrl(c.image ?? imgs[0]) ?? "/placeholder.svg";
  return {
    id: String(c.id),
    name: c.title,
    brand: c.brand,
    model: c.model,
    price: c.price,
    year: c.year,
    kmDriven: c.km_driven,
    fuelType: c.fuel_type,
    transmission: c.transmission,
    location: c.location,
    image: primary,
    images: imgs.length ? imgs : [primary],
    description: c.description ?? "",
    is_featured: c.is_featured,
    isPremium: c.is_featured,
    isHotDeal: false,
  };
}
