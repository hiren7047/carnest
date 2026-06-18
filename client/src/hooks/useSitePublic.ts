import { useQuery } from "@tanstack/react-query";
import { fetchSitePublic } from "@/services/sitePublic.service";
import { normalizeSiteContent } from "@/lib/defaultSiteContent";
import type { SiteContent } from "@/types/siteContent";
import { useDemo } from "@/context/DemoContext";

const staleTime = 5 * 60 * 1000;

export function useSiteContent(): SiteContent {
  const demo = useDemo();
  const { data } = useQuery({
    queryKey: ["site", "public"],
    queryFn: fetchSitePublic,
    staleTime,
    enabled: !demo,
  });
  if (demo) return normalizeSiteContent(demo.content);
  return normalizeSiteContent(data?.content);
}
