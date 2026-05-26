import type { SiteContent } from "../types/siteContent.js";
import { validateSiteContent } from "../validators/site.js";
import { normalizeSiteContent } from "./normalizeSiteContent.js";

/** Deep-merge top-level sections; shallow-merge nested objects inside each section. */
export function mergeSiteContent(base: SiteContent, patch: Partial<SiteContent>): SiteContent {
  const normalizedBase = normalizeSiteContent(base);
  const merged: SiteContent = {
    hero: patch.hero ? { ...normalizedBase.hero, ...patch.hero } : normalizedBase.hero,
    testimonials: patch.testimonials
      ? { ...normalizedBase.testimonials, ...patch.testimonials }
      : normalizedBase.testimonials,
    gallery: patch.gallery ? { ...normalizedBase.gallery, ...patch.gallery } : normalizedBase.gallery,
    social: patch.social ? { ...normalizedBase.social, ...patch.social } : normalizedBase.social,
    contact: patch.contact ? { ...normalizedBase.contact, ...patch.contact } : normalizedBase.contact,
    searchFilters: patch.searchFilters
      ? { ...normalizedBase.searchFilters, ...patch.searchFilters }
      : normalizedBase.searchFilters,
  };
  return validateSiteContent(merged);
}
