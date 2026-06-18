import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "./ScrollReveal";
import { useSearchBrands } from "@/hooks/useSearchBrands";
import { useSiteContent } from "@/hooks/useSitePublic";
import { useState } from "react";
import { toast } from "sonner";
import { BrandLogo } from "./BrandLogo";
import { useDemo } from "@/context/DemoContext";
import { appPath } from "@/lib/demoMode";

const quickLinks: { label: string; to: string }[] = [
  { label: "Browse Cars", to: "/cars" },
  { label: "Sell Your Car", to: "/sell" },
  { label: "How It Works", to: "/#how-it-works" },
  { label: "Contact", to: "/contact" },
  { label: "FAQs", to: "/faqs" },
  { label: "Finance", to: "/finance" },
  { label: "Blogs", to: "/blogs" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
];

function openSocial(url: string, label: string) {
  const trimmed = url?.trim();
  if (!trimmed) {
    toast.info(`${label} link not set yet — add it in Admin → Settings`);
    return;
  }
  window.open(trimmed, "_blank", "noopener,noreferrer");
}

const Footer = () => {
  const searchBrands = useSearchBrands();
  const { social } = useSiteContent();
  const demo = useDemo();
  const to = (path: string) => appPath(demo?.slug ?? null, path);
  const [email, setEmail] = useState("");
  const brandName = demo?.branding.business_name ?? demo?.clientName ?? "Carnest";

  const instagramDisplay = social.instagramHandle
    ? `@${social.instagramHandle.replace(/^@/, "")}`
    : "";

  const newsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.info("Newsletter signup coming soon — thanks for your interest.");
    setEmail("");
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-16">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <BrandLogo className="mb-4" imageClassName="h-10" />
              <p className="text-sm text-primary-foreground/60 leading-relaxed">
                India's most trusted premium car marketplace. Curated luxury vehicles with complete transparency.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  className="h-9 w-9 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-secondary hover:border-secondary transition-colors"
                  aria-label="Facebook"
                  onClick={() => openSocial(social.facebookUrl, "Facebook")}
                >
                  <Facebook className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="h-9 w-9 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-secondary hover:border-secondary transition-colors"
                  aria-label="Instagram"
                  onClick={() => openSocial(social.instagramUrl, "Instagram")}
                >
                  <Instagram className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="h-9 w-9 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-secondary hover:border-secondary transition-colors"
                  aria-label="Twitter"
                  onClick={() => openSocial(social.twitterUrl, "Twitter")}
                >
                  <Twitter className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="h-9 w-9 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-secondary hover:border-secondary transition-colors"
                  aria-label="YouTube"
                  onClick={() => openSocial(social.youtubeUrl, "YouTube")}
                >
                  <Youtube className="h-4 w-4" />
                </button>
              </div>
              {instagramDisplay && social.instagramUrl?.trim() ? (
                <a
                  href={social.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm text-primary-foreground/60 hover:text-secondary transition-colors"
                >
                  {instagramDisplay}
                </a>
              ) : null}
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
              <div className="flex flex-col gap-2.5">
                {quickLinks.map(({ label, to: path }) => {
                  const href = path === "/#how-it-works" ? `${to("/")}#how-it-works` : to(path);
                  return (
                  <Link
                    key={path + label}
                    to={href}
                    className="text-sm text-primary-foreground/60 hover:text-secondary transition-colors"
                  >
                    {label}
                  </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-4">Popular Brands</h4>
              <div className="flex flex-col gap-2.5">
                {searchBrands.slice(0, 8).map((b) => (
                  <Link
                    key={b}
                    to={to(`/cars?brand=${encodeURIComponent(b)}`)}
                    className="text-sm text-primary-foreground/60 hover:text-secondary transition-colors"
                  >
                    {b}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading font-semibold mb-4">Stay Updated</h4>
              <p className="text-sm text-primary-foreground/60 mb-4">
                Get notified about new premium listings.
              </p>
              <form onSubmit={newsletterSubmit} className="flex gap-2 flex-col sm:flex-row">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-sm placeholder:text-primary-foreground/40 focus:outline-none focus:ring-1 focus:ring-secondary"
                  />
                </div>
                <Button type="submit" variant="cta" size="default">
                  Join
                </Button>
              </form>
            </div>
          </div>
        </ScrollReveal>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/40">
          <span>© 2026 {brandName}. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to={to("/privacy")} className="hover:text-secondary transition-colors">
              Privacy
            </Link>
            <Link to={to("/terms")} className="hover:text-secondary transition-colors">
              Terms
            </Link>
            <Link to={to("/contact")} className="hover:text-secondary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
