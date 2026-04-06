import type { SiteContent } from "@/types/siteContent";

export function defaultSiteContent(): SiteContent {
  return {
    hero: {
      eyebrow: "India's Premium Car Marketplace",
      headlineLines: ["Driven by Trust.", "Defined by Quality."],
      subheadline: "Find Your Perfect Premium Ride",
      heroImageUrl: "",
      primaryCtaLabel: "Browse Cars",
      primaryCtaHref: "/cars",
      secondaryCtaLabel: "Sell Your Car",
      secondaryCtaHref: "/sell",
    },
    testimonials: {
      sectionTitle: "What Our Customers Say",
      items: [
        {
          name: "Rahul Sharma",
          city: "Mumbai",
          rating: 5,
          text: "Bought my BMW 5 Series from Carnest. The process was seamless, and the car was exactly as described. Truly premium experience!",
        },
        {
          name: "Priya Menon",
          city: "Bangalore",
          rating: 5,
          text: "Sold my Audi through Carnest and got the best price in the market. Their inspection team is top-notch.",
        },
        {
          name: "Vikram Singh",
          city: "Delhi",
          rating: 5,
          text: "The financing options made it easy to afford my dream Porsche Macan. Incredible customer service throughout.",
        },
      ],
    },
    contact: {
      whatsappNumber: "919876543210",
      supportEmail: "",
    },
  };
}

/**
 * API may return partial CMS JSON (e.g. only `contact`). Merge with defaults so
 * `hero` / `testimonials` are never undefined.
 */
export function normalizeSiteContent(raw: unknown): SiteContent {
  const d = defaultSiteContent();
  if (!raw || typeof raw !== "object") return d;
  const c = raw as Partial<SiteContent>;
  const h = c.hero && typeof c.hero === "object" ? c.hero : undefined;
  const t = c.testimonials && typeof c.testimonials === "object" ? c.testimonials : undefined;
  const k = c.contact && typeof c.contact === "object" ? c.contact : undefined;

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
  };
}
