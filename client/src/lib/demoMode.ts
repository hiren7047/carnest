let activeDemoSlug: string | null = null;

export function setActiveDemoSlug(slug: string | null): void {
  activeDemoSlug = slug;
}

export function getActiveDemoSlug(): string | null {
  return activeDemoSlug;
}

/** Read demo slug from URL when React context is unavailable (e.g. bottom nav outside DemoProvider). */
export function parseDemoSlugFromPathname(pathname: string): string | null {
  const match = pathname.match(/^\/d\/([^/]+)/);
  return match?.[1] ?? null;
}

export function resolveDemoSlug(pathname?: string): string | null {
  if (activeDemoSlug) return activeDemoSlug;
  const path =
    pathname ?? (typeof window !== "undefined" ? window.location.pathname : "");
  return path ? parseDemoSlugFromPathname(path) : null;
}

/** Rewrite production API paths to demo-scoped paths when a demo slug is active. */
export function rewriteApiUrlForDemo(url: string): string {
  if (!activeDemoSlug) return url;
  if (url.startsWith("/api/hub")) return url;
  if (url.startsWith(`/api/demo/${activeDemoSlug}`)) return url;
  if (url.startsWith("/api/")) {
    const rest = url.slice("/api/".length);
    return `/api/demo/${activeDemoSlug}/${rest}`;
  }
  return url;
}

export function demoStorageKey(slug: string, key: "token" | "user"): string {
  return `carnest_demo_${slug}_${key}`;
}

export function appPath(demoSlug: string | null, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!demoSlug) return normalized;
  if (normalized === "/") return `/d/${demoSlug}`;
  return `/d/${demoSlug}${normalized}`;
}
