import axios from "axios";
import { toast } from "sonner";
import { getActiveDemoSlug, rewriteApiUrlForDemo, demoStorageKey } from "@/lib/demoMode";

const baseURL = import.meta.env.VITE_API_URL ?? "";

export const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (config.url) {
    config.url = rewriteApiUrlForDemo(config.url);
  }
  if (config.data instanceof FormData) {
    const h = config.headers;
    if (h && typeof (h as { delete?: (k: string) => void }).delete === "function") {
      (h as { delete: (k: string) => void }).delete("Content-Type");
    } else {
      delete (h as Record<string, unknown>)["Content-Type"];
    }
  }
  const slug = getActiveDemoSlug();
  const token = slug
    ? localStorage.getItem(demoStorageKey(slug, "token"))
    : localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: { response?: { data?: { message?: string } }; message?: string }) => {
    const msg =
      err.response?.data?.message ||
      (typeof err.response?.data === "object" &&
        err.response?.data !== null &&
        "details" in err.response.data &&
        Array.isArray((err.response.data as { details: string[] }).details) &&
        (err.response.data as { details: string[] }).details[0]) ||
      err.message ||
      "Request failed";
    toast.error(String(msg));
    return Promise.reject(err);
  }
);
