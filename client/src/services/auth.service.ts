import { api } from "./api";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/register", { name, email, password });
  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/login", { email, password });
  return data;
}
