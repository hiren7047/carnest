import { api } from "./api";

export type StaffMember = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  color: string;
  sort_order: number;
};

export type StaffTarget = {
  id: number;
  staff_id: number;
  year: number;
  month: number;
  target_cars: number;
  target_revenue: number | null;
  notes: string | null;
};

export type CarSaleRow = {
  id: number;
  car_id: number;
  staff_id: number;
  sale_price: number;
  sold_at: string;
  notes: string | null;
  car: {
    id: number;
    title: string;
    brand: string;
    model: string;
    year: number;
    image: string | null;
  } | null;
  staff: { id: number; name: string; color: string } | null;
};

export type StaffPerformanceRow = StaffMember & {
  target_cars: number;
  target_revenue: number | null;
  target_notes: string | null;
  sold_count: number;
  sold_revenue: number;
  progress_percent: number;
  revenue_progress_percent: number;
  milestone_reached: boolean;
  sales: CarSaleRow[];
};

export type StaffPerformance = {
  period: { year: number; month: number; label: string; key: "last" | "current" | "next" };
  staff: StaffPerformanceRow[];
  totals: {
    target_cars: number;
    target_revenue: number;
    sold_count: number;
    sold_revenue: number;
    progress_percent: number;
  };
};

export type AvailableCarOption = {
  id: number;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string | null;
};

export async function fetchStaff(): Promise<StaffMember[]> {
  const { data } = await api.get<{ data: StaffMember[] }>("/api/admin/staff");
  return data.data;
}

export async function createStaff(body: {
  name: string;
  phone?: string;
  email?: string;
  color?: string;
}): Promise<StaffMember> {
  const { data } = await api.post<StaffMember>("/api/admin/staff", body);
  return data;
}

export async function updateStaff(
  id: number,
  body: Partial<Pick<StaffMember, "name" | "phone" | "email" | "is_active" | "color" | "sort_order">>
): Promise<StaffMember> {
  const { data } = await api.patch<StaffMember>(`/api/admin/staff/${id}`, body);
  return data;
}

export async function upsertStaffTarget(
  staffId: number,
  body: {
    year: number;
    month: number;
    target_cars: number;
    target_revenue?: number | null;
    notes?: string | null;
  }
): Promise<StaffTarget> {
  const { data } = await api.put<StaffTarget>(`/api/admin/staff/${staffId}/targets`, body);
  return data;
}

export async function fetchStaffPerformance(params: {
  period?: "last" | "current" | "next";
  year?: number;
  month?: number;
}): Promise<StaffPerformance> {
  const { data } = await api.get<StaffPerformance>("/api/admin/staff/performance", { params });
  return data;
}

export async function fetchSales(params: {
  page?: number;
  limit?: number;
  staff_id?: number;
  year?: number;
  month?: number;
}): Promise<{ data: CarSaleRow[]; meta: { total: number; page: number; limit: number; pages: number } }> {
  const { data } = await api.get("/api/admin/sales", { params });
  return data;
}

export async function recordCarSale(body: {
  car_id: number;
  staff_id: number;
  sale_price: number;
  sold_at?: string;
  notes?: string;
}): Promise<CarSaleRow> {
  const { data } = await api.post<CarSaleRow>("/api/admin/sales", body);
  return data;
}

export async function fetchAvailableCarsForSale(): Promise<AvailableCarOption[]> {
  const { data } = await api.get<{ data: AvailableCarOption[] }>("/api/admin/sales/available-cars");
  return data.data;
}
