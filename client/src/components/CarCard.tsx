import type { CarView } from "@/types/car";
import { formatPrice } from "@/utils/formatPrice";
import { formatKmDriven } from "@/utils/formatKm";
import { Fuel, Gauge, MapPin, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const CarCard = ({ car, large = false }: { car: CarView; large?: boolean }) => (
  <Link to={`/cars/${car.id}`} className="group block min-w-0 w-full max-w-full">
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-shadow hover:shadow-md">
      <div
        className={`relative flex w-full shrink-0 items-center justify-center overflow-hidden bg-muted/90 ${
          large ? "aspect-[5/3] sm:aspect-[2/1]" : "aspect-[4/3] sm:aspect-[16/10]"
        }`}
      >
        <img
          src={car.image}
          alt={car.name}
          loading="lazy"
          className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="pointer-events-none absolute left-2 top-2 flex max-w-[calc(100%-1rem)] flex-wrap gap-1.5 sm:left-3 sm:top-3">
          {car.isPremium && (
            <Badge className="border-0 bg-accent text-[10px] font-semibold text-accent-foreground sm:text-xs">
              Premium
            </Badge>
          )}
          {car.isHotDeal && (
            <Badge className="border-0 bg-secondary text-[10px] font-semibold text-secondary-foreground sm:text-xs">
              Hot Deal
            </Badge>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-3.5 sm:p-4">
        <div className="min-w-0 space-y-1.5">
          <h3 className="line-clamp-2 text-left text-sm font-semibold leading-snug text-foreground sm:text-base">
            {car.name}
          </h3>
          <div className="space-y-0.5">
            {car.marketPrice != null && car.marketPrice > car.price && (
              <p className="text-sm tabular-nums text-muted-foreground line-through">
                MRP {formatPrice(car.marketPrice)}
              </p>
            )}
            <p className="text-base font-bold tabular-nums text-secondary sm:text-lg">
              {formatPrice(car.price)}
              {car.marketPrice != null && car.marketPrice > car.price && (
                <span className="ml-1.5 text-xs font-semibold text-foreground">Fixed price</span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-1">
            <div className="flex min-w-0 items-start gap-1 text-[11px] leading-tight text-muted-foreground sm:text-xs">
              <Fuel className="mt-0.5 h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
              <span className="break-words">{car.fuelType}</span>
            </div>
            <div className="flex min-w-0 items-start gap-1 text-[11px] leading-tight text-muted-foreground sm:text-xs">
              <Gauge className="mt-0.5 h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
              <span className="tabular-nums">{formatKmDriven(car.kmDriven)}</span>
            </div>
            <div className="flex min-w-0 items-start gap-1 text-[11px] leading-tight text-muted-foreground sm:text-xs">
              <Settings className="mt-0.5 h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
              <span className="break-words">{car.transmission}</span>
            </div>
            <div className="flex min-w-0 items-start gap-1 text-[11px] leading-tight text-muted-foreground sm:text-xs">
              <MapPin className="mt-0.5 h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
              <span className="break-words">{car.location}</span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none flex flex-col gap-2 sm:flex-row sm:gap-2">
          <Button variant="cta" size="sm" className="h-9 w-full text-xs sm:flex-1">
            View Details
          </Button>
          <Button variant="outline" size="sm" className="h-9 w-full text-xs sm:flex-1">
            Book Test Drive
          </Button>
        </div>
      </div>
    </div>
  </Link>
);

export default CarCard;
