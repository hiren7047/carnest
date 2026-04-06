import type { SiteContent } from "../types/siteContent.js";
import { validateSiteContent } from "../validators/site.js";

/** Deep-merge top-level sections; shallow-merge nested objects inside each section. */
export function mergeSiteContent(base: SiteContent, patch: Partial<SiteContent>): SiteContent {
  const merged: SiteContent = {
    hero: patch.hero ? { ...base.hero, ...patch.hero } : base.hero,
    testimonials: patch.testimonials
      ? { ...base.testimonials, ...patch.testimonials }
      : base.testimonials,
    contact: patch.contact ? { ...base.contact, ...patch.contact } : base.contact,
  };
  return validateSiteContent(merged);
}
