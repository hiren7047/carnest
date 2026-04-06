import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Banknote,
  Car,
  CarFront,
  CircleHelp,
  HelpCircle,
  Home,
  IdCard,
  ImageIcon,
  Mail,
  Rss,
  ShieldCheck,
  Star,
} from "lucide-react";

export type NavItem = { to: string; label: string; icon: LucideIcon };

/** Primary marketing navigation (13 items, reference IA). */
export const primaryNavItems: NavItem[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/cars", label: "Car Stock", icon: Car },
  { to: "/finance", label: "Finance", icon: Banknote },
  { to: "/insurance", label: "Insurance", icon: ShieldCheck },
  { to: "/sell", label: "Sell A Car", icon: CarFront },
  { to: "/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/reviews", label: "Reviews", icon: Star },
  { to: "/why-us", label: "Why Us", icon: HelpCircle },
  { to: "/warranty", label: "Warranty", icon: BadgeCheck },
  { to: "/about", label: "About Us", icon: IdCard },
  { to: "/contact", label: "Contact", icon: Mail },
  { to: "/faqs", label: "FAQs", icon: CircleHelp },
  { to: "/blogs", label: "Blogs", icon: Rss },
];
