import logo from "@/assets/carnest-logo.png";
import { Link } from "react-router-dom";
import { useDemo } from "@/context/DemoContext";
import { useAppPath } from "@/hooks/useAppPath";
import { resolveMediaUrl } from "@/utils/mediaUrl";

type BrandLogoProps = {
  to?: string;
  className?: string;
  imageClassName?: string;
};

export function BrandLogo({ to = "/", className = "", imageClassName = "" }: BrandLogoProps) {
  const demo = useDemo();
  const homePath = useAppPath(to);
  const alt = demo?.branding.business_name ?? demo?.clientName ?? "Carnest";
  const customLogo = demo?.branding.logo_url;
  const src = customLogo ? resolveMediaUrl(customLogo) : logo;
  const imgClass = customLogo
    ? "h-14 sm:h-16 w-auto min-w-[140px] max-w-[min(300px,60vw)] object-contain object-left"
    : `h-9 w-auto object-contain ${imageClassName}`.trim();

  return (
    <Link to={homePath} className={`inline-flex items-center shrink-0 ${className}`.trim()} aria-label={`${alt} home`}>
      <img src={src} alt={alt} className={imgClass} />
    </Link>
  );
}
