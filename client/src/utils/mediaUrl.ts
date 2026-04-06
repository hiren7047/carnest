/** API origin when client and API are on different hosts (production). Empty in dev → same-origin + Vite proxy. */
const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

/**
 * Normalizes car/upload image URLs so they load when the app is opened via LAN IP or phone
 * (absolute `http://localhost:4000/uploads/...` would hit the wrong host). Prefer `/uploads/...`
 * and let the dev server proxy to the API; in production use `VITE_API_URL` + path.
 */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (url == null || url === "") return "/placeholder.svg";

  const trimmed = url.trim();
  if (trimmed === "") return "/placeholder.svg";

  if (trimmed.startsWith("/uploads/")) {
    return API_BASE ? `${API_BASE}${trimmed}` : trimmed;
  }

  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  try {
    const u = new URL(trimmed);
    if (u.pathname.startsWith("/uploads")) {
      const pathAndQuery = u.pathname + u.search;
      return API_BASE ? `${API_BASE}${pathAndQuery}` : pathAndQuery;
    }
  } catch {
    /* not absolute */
  }

  return trimmed;
}
