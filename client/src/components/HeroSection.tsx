import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brands, fuelTypes, locations } from "@/utils/constants";
import heroBg from "@/assets/hero-car.jpg";
import { useSiteContent } from "@/hooks/useSitePublic";
import { cn } from "@/lib/utils";

const HeroSection = () => {
  const content = useSiteContent();
  const { hero } = content;
  const [brand, setBrand] = useState("");
  const [fuel, setFuel] = useState("");
  const [location, setLocation] = useState("");

  const searchParams = new URLSearchParams();
  if (brand) searchParams.set("brand", brand);
  if (fuel) searchParams.set("fuel_type", fuel);
  if (location) searchParams.set("location", location);
  const qs = searchParams.toString();
  const carsHref = qs ? `/cars?${qs}` : "/cars";

  const bgSrc = hero.heroImageUrl?.trim() ? hero.heroImageUrl : heroBg;
  const lines = hero.headlineLines.length ? hero.headlineLines : ["Driven by Trust.", "Defined by Quality."];

  return (
    <section className="relative flex min-h-0 flex-col overflow-hidden pt-[calc(5.25rem+env(safe-area-inset-top,0px))] pb-10 md:min-h-[min(100dvh,90vh)] md:pb-14 md:pt-[calc(4.5rem+env(safe-area-inset-top,0px))]">
      <img
        src={bgSrc}
        alt="Luxury car showroom"
        className="absolute inset-0 h-full w-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 gradient-overlay" />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col justify-start px-4 pb-2 pt-5 text-center sm:pt-6 md:min-h-0 md:max-w-none md:container md:justify-center md:px-4 md:pb-0 md:pt-0">
        <p
          className="mb-4 animate-fade-up text-[0.6875rem] font-semibold uppercase leading-normal tracking-[0.28em] text-[hsl(43_74%_66%)] sm:mb-5 sm:text-xs sm:tracking-[0.22em]"
          style={{ animationDelay: "0.1s" }}
        >
          {hero.eyebrow}
        </p>
        <h1
          className="mb-4 animate-fade-up text-balance font-heading font-extrabold leading-[1.2] tracking-[-0.02em] text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.45)] sm:mb-5 sm:leading-[1.1] md:mb-5 md:text-6xl md:leading-[1.08] lg:text-7xl text-[clamp(1.625rem,5vw+0.5rem,3.5rem)]"
          style={{ animationDelay: "0.2s" }}
        >
          {lines.map((line, i) => (
            <span key={i} className="inline-block max-w-full">
              {i > 0 && <br />}
              {i === lines.length - 1 ? (
                <span className="text-gradient-gold">{line}</span>
              ) : (
                line
              )}
            </span>
          ))}
        </h1>
        <p
          className="mx-auto mb-8 max-w-lg animate-fade-up text-sm font-medium leading-relaxed text-[hsl(210_40%_96%)] [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] sm:mb-9 sm:max-w-2xl sm:text-base md:mb-10 md:text-lg"
          style={{ animationDelay: "0.3s" }}
        >
          {hero.subheadline}
        </p>

        <div
          className="mb-8 grid w-full max-w-md grid-cols-2 gap-3 animate-fade-up sm:mx-auto md:mb-10 md:max-w-xl"
          style={{ animationDelay: "0.4s" }}
        >
          <HeroCta href={hero.primaryCtaHref} variant="hero">
            {hero.primaryCtaLabel}
          </HeroCta>
          <HeroCta href={hero.secondaryCtaHref} variant="hero-outline">
            {hero.secondaryCtaLabel}
          </HeroCta>
        </div>

        <div
          className="glass mx-auto w-full max-w-4xl animate-fade-up rounded-2xl border border-white/10 p-4 shadow-xl sm:p-5 md:p-6"
          style={{ animationDelay: "0.5s" }}
        >
          <p className="mb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
            Quick search
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
            <SelectField label="Brand" value={brand} onChange={setBrand} options={brands} />
            <SelectField label="Fuel Type" value={fuel} onChange={setFuel} options={fuelTypes} />
            <SelectField label="Location" value={location} onChange={setLocation} options={locations} />
            <Link to={carsHref} className="flex sm:col-span-2 lg:col-span-1">
              <Button variant="cta" className="min-h-[48px] w-full gap-2 text-sm font-semibold">
                <Search className="h-4 w-4 shrink-0" />
                Search Cars
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

function HeroCta({
  href,
  variant,
  children,
  className,
}: {
  href: string;
  variant: "hero" | "hero-outline";
  children: React.ReactNode;
  className?: string;
}) {
  const internal = href.startsWith("/") && !href.startsWith("//");
  const btnClass = cn(
    "h-11 w-full px-3 text-xs font-semibold sm:h-12 sm:px-5 sm:text-sm md:h-12 md:px-8 md:text-base",
    className
  );
  if (internal) {
    return (
      <Link to={href} className="min-w-0">
        <Button variant={variant} size="lg" className={btnClass}>
          {children}
        </Button>
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className="min-w-0">
      <Button variant={variant} size="lg" className={btnClass}>
        {children}
      </Button>
    </a>
  );
}

const SelectField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) => (
  <div className="relative min-w-0">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full appearance-none rounded-xl border border-border/80 bg-card pl-3.5 pr-9 text-[13px] text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary sm:text-sm"
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  </div>
);

export default HeroSection;
