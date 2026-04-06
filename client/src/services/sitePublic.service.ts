import type { SiteContent } from "@/types/siteContent";
import { defaultSiteContent, normalizeSiteContent } from "@/lib/defaultSiteContent";

function publicUrl(path: string): string {
  const base = import.meta.env.VITE_API_URL ?? "";
  return base ? `${base.replace(/\/$/, "")}${path}` : path;
}

/** Uses fetch (not axios) so failed loads do not trigger global error toasts. */
export async function fetchSitePublic(): Promise<{ content: SiteContent }> {
  try {
    const res = await fetch(publicUrl("/api/site/public"));
    if (!res.ok) return { content: defaultSiteContent() };
    const json = (await res.json()) as { content?: unknown };
    return { content: normalizeSiteContent(json?.content) };
  } catch {
    return { content: defaultSiteContent() };
  }
}
