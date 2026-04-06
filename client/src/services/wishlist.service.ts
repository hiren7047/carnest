import type { ApiCar } from "@/types/car";
import { api } from "./api";

export async function fetchWishlist(): Promise<ApiCar[]> {
  const { data } = await api.get<ApiCar[]>("/api/wishlist");
  return data;
}

export async function saveCar(carId: number): Promise<void> {
  await api.post(`/api/wishlist/${carId}`);
}

export async function removeCar(carId: number): Promise<void> {
  await api.delete(`/api/wishlist/${carId}`);
}
