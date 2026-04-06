import { useQuery } from "@tanstack/react-query";
import { fetchSitePublic } from "@/services/sitePublic.service";
import { normalizeSiteContent } from "@/lib/defaultSiteContent";
import type { SiteContent } from "@/types/siteContent";

const staleTime = 5 * 60 * 1000;

export function useSiteContent(): SiteContent {
  const { data } = useQuery({
    queryKey: ["site", "public"],
    queryFn: fetchSitePublic,
    staleTime,
  });
  return normalizeSiteContent(data?.content);
}
