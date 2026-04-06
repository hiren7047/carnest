/** Published homepage + contact shape stored in site_settings.content */
export type SiteContent = {
  hero: {
    eyebrow: string;
    headlineLines: string[];
    subheadline: string;
    heroImageUrl: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
  testimonials: {
    sectionTitle: string;
    items: { name: string; city: string; rating: number; text: string }[];
  };
  contact: {
    whatsappNumber: string;
    supportEmail: string;
  };
};
