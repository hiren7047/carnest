import { api } from "./api";
import type { SiteContent } from "@/types/siteContent";

export type AdminStats = {
  cars: { total: number };
  sell_requests: {
    pending: number;
    contacted: number;
    closed: number;
    total: number;
  };
  bookings: {
    pending: number;
    confirmed: number;
    cancelled: number;
    total: number;
  };
  users: { total: number };
};

export async function fetchAdminStats(): Promise<AdminStats> {
  const { data } = await api.get<AdminStats>("/api/admin/stats");
  return data;
}

export type SellRequestRow = {
  id: number;
  name: string;
  phone: string;
  car_details: string;
  images: string[];
  status: "pending" | "contacted" | "closed";
  admin_notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function fetchSellRequestsAdmin(params: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<{ data: SellRequestRow[]; total: number; page: number; limit: number }> {
  const { data } = await api.get("/api/admin/sell-requests", { params });
  return data;
}

export async function patchSellRequestAdmin(
  id: number,
  body: { status?: SellRequestRow["status"]; admin_notes?: string | null }
): Promise<SellRequestRow> {
  const { data } = await api.patch<SellRequestRow>(`/api/admin/sell-requests/${id}`, body);
  return data;
}

export type AdminBookingRow = {
  id: number;
  user_id: number;
  car_id: number;
  date: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  user?: { id: number; name: string; email: string };
  car?: { id: number; title: string; brand: string; price: number; images: string[] };
};

export async function fetchBookingsAdmin(params: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<{ data: AdminBookingRow[]; total: number; page: number; limit: number }> {
  const { data } = await api.get("/api/admin/bookings", { params });
  return data;
}

export async function patchBookingAdmin(
  id: number,
  body: { status: AdminBookingRow["status"] }
): Promise<AdminBookingRow> {
  const { data } = await api.patch<AdminBookingRow>(`/api/admin/bookings/${id}`, body);
  return data;
}

export async function fetchSiteAdmin(): Promise<{ id: number; content: SiteContent }> {
  const { data } = await api.get<{ id: number; content: SiteContent }>("/api/admin/site");
  return data;
}

export async function putSiteAdminMerge(content: Partial<SiteContent>): Promise<{ id: number; content: SiteContent }> {
  const { data } = await api.put<{ id: number; content: SiteContent }>("/api/admin/site", { content });
  return data;
}
