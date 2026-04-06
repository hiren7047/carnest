import type { ApiCar } from "@/types/car";
import { api } from "./api";

export type BookingRow = {
  id: number;
  user_id: number;
  car_id: number;
  date: string;
  status: string;
  car?: Pick<ApiCar, "id" | "title" | "brand" | "images" | "price">;
  createdAt?: string;
};

export async function createBooking(car_id: number, date: string): Promise<BookingRow> {
  const { data } = await api.post<BookingRow>("/api/bookings", { car_id, date });
  return data;
}

export async function fetchUserBookings(): Promise<BookingRow[]> {
  const { data } = await api.get<BookingRow[]>("/api/bookings/user");
  return data;
}
