import type { SiteContent } from "@/types/siteContent";
import { defaultSearchBrands } from "@/utils/constants";

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
      pageTitle: "Reviews",
      pageSubtitle: "Real feedback from buyers and sellers who chose Carnest.",
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
    gallery: {
      title: "Gallery",
      subtitle: "A glimpse of our showroom, vehicles, and the Carnest experience.",
      images: [],
    },
    social: {
      facebookUrl: "",
      youtubeUrl: "",
      instagramUrl: "https://instagram.com/carnest_surat",
      twitterUrl: "",
      instagramHandle: "carnest_surat",
    },
    contact: {
      whatsappNumber: "919714335588",
      supportEmail: "",
    },
    searchFilters: {
      brands: [...defaultSearchBrands],
    },
  };
}

/**
 * API may return partial CMS JSON (e.g. only `contact`). Merge with defaults so
 * sections are never undefined.
 */
export function normalizeSiteContent(raw: unknown): SiteContent {
  const d = defaultSiteContent();
  if (!raw || typeof raw !== "object") return d;
  const c = raw as Partial<SiteContent>;
  const h = c.hero && typeof c.hero === "object" ? c.hero : undefined;
  const t = c.testimonials && typeof c.testimonials === "object" ? c.testimonials : undefined;
  const g = c.gallery && typeof c.gallery === "object" ? c.gallery : undefined;
  const o = c.social && typeof c.social === "object" ? c.social : undefined;
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
      pageTitle: t?.pageTitle?.trim() ? t.pageTitle : d.testimonials.pageTitle,
      pageSubtitle: t?.pageSubtitle?.trim() ? t.pageSubtitle : d.testimonials.pageSubtitle,
      items: t?.items?.length ? t.items : d.testimonials.items,
    },
    gallery: {
      title: g?.title?.trim() ? g.title : d.gallery.title,
      subtitle: g?.subtitle?.trim() ? g.subtitle : d.gallery.subtitle,
      images: Array.isArray(g?.images) ? g.images : d.gallery.images,
    },
    social: {
      facebookUrl: o?.facebookUrl ?? d.social.facebookUrl,
      youtubeUrl: o?.youtubeUrl ?? d.social.youtubeUrl,
      instagramUrl: o?.instagramUrl ?? d.social.instagramUrl,
      twitterUrl: o?.twitterUrl ?? d.social.twitterUrl,
      instagramHandle: o?.instagramHandle?.trim() ? o.instagramHandle : d.social.instagramHandle,
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
