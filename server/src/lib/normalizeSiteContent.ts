import type { SiteContent } from "../types/siteContent.js";
import { defaultSiteContent } from "./siteContentDefaults.js";

/** Merge partial CMS JSON from DB with defaults (e.g. legacy rows without searchFilters). */
export function normalizeSiteContent(raw: unknown): SiteContent {
  const d = defaultSiteContent();
  if (!raw || typeof raw !== "object") return d;
  const c = raw as Partial<SiteContent>;
  const h = c.hero && typeof c.hero === "object" ? c.hero : undefined;
  const t = c.testimonials && typeof c.testimonials === "object" ? c.testimonials : undefined;
  const k = c.contact && typeof c.contact === "object" ? c.contact : undefined;
  const s = c.searchFilters && typeof c.searchFilters === "object" ? c.searchFilters : undefined;

  return {
    hero: {
      eyebrow: h?.eyebrow ?? d.hero.eyebrow,
      headlineLines: h?.headlineLines?.length ? h.headlineLines : d.hero.headlineLines,
      subheadline: h?.subheadline ?? d.hero.subheadline,
      heroImageUrl: h?.heroImageUrl ?? d.hero.heroImageUrl,
      primaryCtaLabel: h?.primaryCtaLabel ?? d.hero.primaryCtaLabel,
      primaryCtaHref: h?.primaryCtaHref ?? d.hero.primaryCtaHref,
      secondaryCtaLabel: h?.secondaryCtaLabel ?? d.hero.secondaryCtaLabel,
      secondaryCtaHref: h?.secondaryCtaHref ?? d.hero.secondaryCtaHref,
    },
    testimonials: {
      sectionTitle: t?.sectionTitle?.trim() ? t.sectionTitle : d.testimonials.sectionTitle,
      items: t?.items?.length ? t.items : d.testimonials.items,
    },
    contact: {
      whatsappNumber: k?.whatsappNumber ?? d.contact.whatsappNumber,
      supportEmail: k?.supportEmail ?? d.contact.supportEmail,
    },
    searchFilters: {
      brands: s?.brands?.length ? s.brands : d.searchFilters.brands,
    },
  };
}
