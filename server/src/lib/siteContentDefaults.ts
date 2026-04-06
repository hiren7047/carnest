import type { SiteContent } from "../types/siteContent.js";

/** Default CMS payload when DB row is missing (matches current static marketing copy). */
export const defaultSiteContent = (): SiteContent => ({
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
});
