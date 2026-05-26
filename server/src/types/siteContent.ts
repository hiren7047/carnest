/** Published homepage + site CMS shape stored in site_settings.content */
export type TestimonialItem = {
  name: string;
  city: string;
  rating: number;
  text: string;
};

export type GalleryImage = {
  imageUrl: string;
  alt: string;
};

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
    pageTitle: string;
    pageSubtitle: string;
    items: TestimonialItem[];
  };
  gallery: {
    title: string;
    subtitle: string;
    images: GalleryImage[];
  };
  social: {
    facebookUrl: string;
    youtubeUrl: string;
    instagramUrl: string;
    twitterUrl: string;
    instagramHandle: string;
  };
  contact: {
    whatsappNumber: string;
    supportEmail: string;
  };
  searchFilters: {
    brands: string[];
  };
};
