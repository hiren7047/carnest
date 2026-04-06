import { api } from "./api";

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

export async function submitContact(payload: ContactPayload): Promise<{ ok: boolean; message: string }> {
  const { data } = await api.post<{ ok: boolean; message: string }>("/api/contact", {
    ...payload,
    phone: payload.phone?.trim() || undefined,
  });
  return data;
}
