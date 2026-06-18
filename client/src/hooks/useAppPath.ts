import { useLocation } from "react-router-dom";
import { useDemo } from "@/context/DemoContext";
import {
  appPath,
  getActiveDemoSlug,
  parseDemoSlugFromPathname,
} from "@/lib/demoMode";

/** Demo slug from context, module state, or current URL — works outside DemoProvider. */
export function useDemoSlug(): string | null {
  const demo = useDemo();
  const { pathname } = useLocation();
  return demo?.slug ?? getActiveDemoSlug() ?? parseDemoSlugFromPathname(pathname);
}

export function useAppPath(path: string): string {
  return appPath(useDemoSlug(), path);
}

export function useAppBasePath(): string {
  const slug = useDemoSlug();
  return slug ? `/d/${slug}` : "";
}
