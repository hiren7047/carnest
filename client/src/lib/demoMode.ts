let activeDemoSlug: string | null = null;

export function setActiveDemoSlug(slug: string | null): void {
  activeDemoSlug = slug;
}

export function getActiveDemoSlug(): string | null {
  return activeDemoSlug;
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
