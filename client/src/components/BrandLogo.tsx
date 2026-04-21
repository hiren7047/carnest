import logo from "@/assets/carnest-logo.png";
import { Link } from "react-router-dom";

type BrandLogoProps = {
  to?: string;
  className?: string;
  imageClassName?: string;
};

export function BrandLogo({ to = "/", className = "", imageClassName = "" }: BrandLogoProps) {
  return (
    <Link to={to} className={`inline-flex items-center ${className}`.trim()} aria-label="Carnest home">
      <img src={logo} alt="Carnest" className={`h-8 w-auto object-contain ${imageClassName}`.trim()} />
    </Link>
  );
}
