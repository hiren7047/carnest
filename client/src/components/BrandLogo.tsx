import logo from "@/assets/carnest-logo.png";
import { Link } from "react-router-dom";
import { useDemo } from "@/context/DemoContext";
import { useAppPath, useDemoSlug } from "@/hooks/useAppPath";
import { resolveMediaUrl } from "@/utils/mediaUrl";

type BrandLogoProps = {
  to?: string;
  className?: string;
  imageClassName?: string;
};

const DEMO_CUSTOM_LOGO_CLASS =
  "h-16 sm:h-[4.5rem] w-auto min-w-[180px] max-w-[min(360px,78vw)] object-contain object-left";
const DEMO_DEFAULT_LOGO_CLASS = "h-11 sm:h-12 w-auto max-w-[200px] object-contain object-left";
const SITE_DEFAULT_LOGO_CLASS = "h-9 w-auto max-w-[180px] object-contain";

export function BrandLogo({ to = "/", className = "", imageClassName = "" }: BrandLogoProps) {
  const demo = useDemo();
  const demoSlug = useDemoSlug();
  const homePath = useAppPath(to);
  const alt = demo?.branding.business_name ?? demo?.clientName ?? "Carnest";
  const customLogo = demo?.branding.logo_url;
  const src = customLogo ? resolveMediaUrl(customLogo) : logo;

  const imgClass = customLogo
    ? DEMO_CUSTOM_LOGO_CLASS
    : demoSlug
      ? DEMO_DEFAULT_LOGO_CLASS
      : `${SITE_DEFAULT_LOGO_CLASS} ${imageClassName}`.trim();

  return (
    <Link to={homePath} className={`inline-flex items-center shrink-0 ${className}`.trim()} aria-label={`${alt} home`}>
      <img src={src} alt={alt} className={imgClass} />
    </Link>
  );
}
