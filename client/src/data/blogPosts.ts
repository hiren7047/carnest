export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  body: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "premium-sedan-buying-guide",
    title: "What to Check Before Buying a Used Premium Sedan",
    excerpt: "A practical checklist for inspecting paint, service history, and electronics on luxury sedans.",
    date: "2026-03-12",
    readTime: "6 min read",
    body: [
      "Start with a full exterior walk-around in good light. Look for paint mismatch between panels, overspray, and uneven panel gaps—these often indicate past repairs.",
      "Request the complete service history and verify major intervals: transmission fluid, brakes, and suspension components. Premium cars are sensitive to deferred maintenance.",
      "Test every electronic feature: adaptive cruise, parking sensors, infotainment, and climate zones. Repairs for these systems can be costly if issues are missed at purchase.",
      "At Carnest, every listing includes inspection notes so you can compare with your own checks—or book a third-party inspection before you commit.",
    ],
  },
  {
    slug: "ev-ownership-india",
    title: "EV Ownership in India: Charging, Range, and Resale",
    excerpt: "How home charging, public networks, and battery health affect the used EV market.",
    date: "2026-02-28",
    readTime: "5 min read",
    body: [
      "Electric vehicles can be excellent used buys if you understand charging access and battery degradation. Home charging remains the most convenient option for daily use.",
      "When evaluating a used EV, ask for battery health reports where available and compare real-world range to the original WLTP figures.",
      "Resale values are stabilising as charging infrastructure improves. Look for models with strong manufacturer support and updateable software.",
    ],
  },
  {
    slug: "financing-luxury-cars",
    title: "Financing Options for Luxury and Performance Cars",
    excerpt: "Partner banks, tenure, and how down payments affect your EMI on premium inventory.",
    date: "2026-01-15",
    readTime: "4 min read",
    body: [
      "Luxury car loans often use specialised products with competitive rates for high-ticket vehicles. Your profile, tenure, and down payment all influence the APR you are offered.",
      "A higher down payment reduces EMI burden and total interest paid—worth modelling before you choose tenure.",
      "Carnest can connect you with partner institutions; eligibility checks are quick and do not obligate you to proceed until you are comfortable.",
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
