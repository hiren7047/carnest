import { useDemo } from "@/context/DemoContext";
import { appPath } from "@/lib/demoMode";

export function useAppPath(path: string): string {
  const demo = useDemo();
  return appPath(demo?.slug ?? null, path);
}

export function useAppBasePath(): string {
  const demo = useDemo();
  return demo?.basePath ?? "";
}
