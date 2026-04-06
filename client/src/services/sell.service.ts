import { api } from "./api";

export async function submitSellRequest(form: FormData): Promise<{ id: number; message: string }> {
  const { data } = await api.post<{ id: number; message: string }>("/api/sell", form);
  return data;
}
