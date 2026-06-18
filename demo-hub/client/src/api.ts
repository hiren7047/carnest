import axios from "axios";

const TOKEN_KEY = "hub_token";

export const hubApi = axios.create({
  baseURL: "",
  timeout: 30000,
});

hubApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export { TOKEN_KEY };

export type HubUser = { id: number; name: string; email: string };

export type DemoListItem = {
  id: number;
  slug: string;
  client_name: string;
  client_notes: string | null;
  status: string;
  public_url: string;
  view_count: number;
  credentials: {
    admin: { email: string; password: string };
    buyer: { email: string; password: string };
  };
  createdAt: string;
};

export type DemoTheme = { primary: string; secondary: string; accent: string };

export async function hubLogin(email: string, password: string) {
  const { data } = await hubApi.post<{ token: string; user: HubUser }>("/api/hub/auth/login", {
    email,
    password,
  });
  localStorage.setItem(TOKEN_KEY, data.token);
  return data;
}

export async function fetchDemos() {
  const { data } = await hubApi.get<{ data: DemoListItem[] }>("/api/hub/demos");
  return data.data;
}

export async function fetchDemoDefaults() {
  const { data } = await hubApi.get<{ content: Record<string, unknown> }>("/api/hub/defaults/site-content");
  return data.content;
}

export async function createDemo(payload: Record<string, unknown>) {
  const { data } = await hubApi.post<DemoListItem>("/api/hub/demos", payload);
  return data;
}

export async function updateDemo(id: number, payload: Record<string, unknown>) {
  const { data } = await hubApi.put<DemoListItem>(`/api/hub/demos/${id}`, payload);
  return data;
}

export async function archiveDemo(id: number) {
  await hubApi.delete(`/api/hub/demos/${id}`);
}

export async function uploadDemoLogo(id: number, file: File) {
  const form = new FormData();
  form.append("logo", file);
  const { data } = await hubApi.post<{ logo_url: string }>(`/api/hub/demos/${id}/logo`, form);
  return data.logo_url;
}

export function hexToHsl(hex: string): string {
  const raw = hex.replace("#", "");
  const r = parseInt(raw.slice(0, 2), 16) / 255;
  const g = parseInt(raw.slice(2, 4), 16) / 255;
  const b = parseInt(raw.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
