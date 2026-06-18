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
  const src = demo?.branding.logo_url ? resolveMediaUrl(demo.branding.logo_url) : logo;

  return (
    <Link to={homePath} className={`inline-flex items-center ${className}`.trim()} aria-label={`${alt} home`}>
      <img src={src} alt={alt} className={`h-8 w-auto object-contain ${imageClassName}`.trim()} />
    </Link>
  );
}
