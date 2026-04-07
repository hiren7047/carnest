import type { ApiCar, CarDetailResponse, CarsListResponse } from "@/types/car";
import { api } from "./api";

export type CarsQuery = {
  page?: number;
  limit?: number;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  fuel_type?: string;
  transmission?: string;
  location?: string;
  year?: number;
  featured?: boolean;
  sort?: "price" | "year";
  order?: "asc" | "desc";
};

export async function fetchCars(params: CarsQuery = {}): Promise<CarsListResponse> {
  const { data } = await api.get<CarsListResponse>("/api/cars", { params });
  return data;
}

export async function fetchCarById(id: string | number): Promise<CarDetailResponse> {
  const { data } = await api.get<CarDetailResponse>(`/api/cars/${id}`);
  return data;
}

export async function createCar(body: Record<string, unknown>): Promise<ApiCar> {
  const { data } = await api.post<ApiCar>("/api/cars", body);
  return data;
}

export async function updateCar(id: number, body: Record<string, unknown>): Promise<ApiCar> {
  const { data } = await api.put<ApiCar>(`/api/cars/${id}`, body);
  return data;
}

export async function deleteCar(id: number): Promise<void> {
  await api.delete(`/api/cars/${id}`);
}
