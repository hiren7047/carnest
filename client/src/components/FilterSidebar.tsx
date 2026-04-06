import { Button } from "@/components/ui/button";
import { brands, fuelTypes, transmissions, locations } from "@/utils/constants";
import { ChevronDown } from "lucide-react";

export type FilterState = {
  brand: string;
  fuel: string;
  trans: string;
  loc: string;
  maxPrice: number;
};

type Props = {
  brand: string;
  fuel: string;
  trans: string;
  loc: string;
  maxPrice: number;
  onBrand: (v: string) => void;
  onFuel: (v: string) => void;
  onTrans: (v: string) => void;
  onLoc: (v: string) => void;
  onMaxPrice: (v: number) => void;
  onClear: () => void;
  formatPrice: (n: number) => string;
};

const FilterSelect = ({
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
  <div>
    <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 pl-3 pr-8 rounded-lg border border-border bg-card text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        <option value="">All {label}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  </div>
);

export function FilterSidebar({
  brand,
  fuel,
  trans,
  loc,
  maxPrice,
  onBrand,
  onFuel,
  onTrans,
  onLoc,
  onMaxPrice,
  onClear,
  formatPrice,
}: Props) {
  return (
    <div className="space-y-4">
      <FilterSelect label="Brand" value={brand} onChange={onBrand} options={brands} />
      <FilterSelect label="Fuel Type" value={fuel} onChange={onFuel} options={fuelTypes} />
      <FilterSelect label="Transmission" value={trans} onChange={onTrans} options={transmissions} />
      <FilterSelect label="Location" value={loc} onChange={onLoc} options={locations} />
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">
          Max Price: {formatPrice(maxPrice)}
        </label>
        <input
          type="range"
          min={500000}
          max={20000000}
          step={100000}
          value={Math.min(maxPrice, 20000000)}
          onChange={(e) => onMaxPrice(Number(e.target.value))}
          className="w-full accent-secondary"
        />
      </div>
      <Button variant="ghost" size="sm" onClick={onClear} className="w-full">
        Clear Filters
      </Button>
    </div>
  );
}
