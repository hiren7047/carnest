import { useSiteContent } from "@/hooks/useSitePublic";
import { brands as defaultBrands } from "@/utils/constants";

/** Brand list for car search filters — admin-managed via Settings, with static fallback. */
export function useSearchBrands(): string[] {
  const content = useSiteContent();
  const list = content.searchFilters?.brands;
  if (list?.length) return list;
  return defaultBrands;
}
