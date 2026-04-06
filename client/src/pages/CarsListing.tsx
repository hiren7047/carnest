import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CarCard from "@/components/CarCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FilterSidebar } from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { fetchCars } from "@/services/cars.service";
import { mapApiCarToView } from "@/types/car";
import { Skeleton } from "@/components/ui/skeleton";

const CarsListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [brand, setBrand] = useState(() => searchParams.get("brand") ?? "");
  const [fuel, setFuel] = useState(() => searchParams.get("fuel_type") ?? "");
  const [trans, setTrans] = useState(() => searchParams.get("transmission") ?? "");
  const [loc, setLoc] = useState(() => searchParams.get("location") ?? "");
  const [sort, setSort] = useState(() => searchParams.get("sort") ?? "latest");
  const DEFAULT_MAX_PRICE = 20_000_000;
  const [maxPrice, setMaxPrice] = useState(() => {
    const fromUrl = Number(searchParams.get("maxPrice"));
    if (!Number.isNaN(fromUrl) && fromUrl > 0) return fromUrl;
    return DEFAULT_MAX_PRICE;
  });
  const [page, setPage] = useState(() => Number(searchParams.get("page")) || 1);

  const queryParams = useMemo(() => {
    let sortField: "price" | "year" = "year";
    let order: "asc" | "desc" = "desc";
    if (sort === "price-low") {
      sortField = "price";
      order = "asc";
    } else if (sort === "price-high") {
      sortField = "price";
      order = "desc";
    } else {
      sortField = "year";
      order = "desc";
    }
    return {
      page,
      limit: 12,
      brand: brand || undefined,
      fuel_type: fuel || undefined,
      transmission: trans || undefined,
      location: loc || undefined,
      maxPrice,
      sort: sortField,
      order,
    };
  }, [page, brand, fuel, trans, loc, maxPrice, sort]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["cars", queryParams],
    queryFn: () => fetchCars(queryParams),
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    const next = new URLSearchParams();
    if (brand) next.set("brand", brand);
    if (fuel) next.set("fuel_type", fuel);
    if (trans) next.set("transmission", trans);
    if (loc) next.set("location", loc);
    if (maxPrice !== DEFAULT_MAX_PRICE) next.set("maxPrice", String(maxPrice));
    if (page > 1) next.set("page", String(page));
    if (sort !== "latest") next.set("sort", sort);
    setSearchParams(next, { replace: true });
  }, [brand, fuel, trans, loc, maxPrice, page, sort, setSearchParams]);

  const clearFilters = () => {
    setBrand("");
    setFuel("");
    setTrans("");
    setLoc("");
    setMaxPrice(DEFAULT_MAX_PRICE);
    setPage(1);
  };

  const list = data?.data ?? [];
  const meta = data?.meta;
  const cars = list.map(mapApiCarToView);

  const FiltersContent = () => (
    <FilterSidebar
      brand={brand}
      fuel={fuel}
      trans={trans}
      loc={loc}
      maxPrice={maxPrice}
      onBrand={(v) => {
        setBrand(v);
        setPage(1);
      }}
      onFuel={(v) => {
        setFuel(v);
        setPage(1);
      }}
      onTrans={(v) => {
        setTrans(v);
        setPage(1);
      }}
      onLoc={(v) => {
        setLoc(v);
        setPage(1);
      }}
      onMaxPrice={(v) => {
        setMaxPrice(v);
        setPage(1);
      }}
      onClear={clearFilters}
      formatPrice={formatPrice}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">Browse Cars</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {isLoading ? "Loading…" : `${meta?.total ?? 0} cars available`}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <div className="relative hidden md:block">
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="h-10 pl-3 pr-8 rounded-lg border border-border bg-card text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="latest">Latest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setShowFilters(true)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24 bg-card rounded-xl border border-border/50 p-4">
                <h2 className="font-heading font-semibold mb-4">Filters</h2>
                <FiltersContent />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              {isLoading || isFetching ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-[360px] rounded-xl" />
                  ))}
                </div>
              ) : cars.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  No cars match your filters. Try adjusting them.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {cars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
              )}

              {meta && meta.pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-3 text-sm text-muted-foreground">
                    Page {page} of {meta.pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= meta.pages}
                    onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            aria-label="Close filters"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border p-4 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <FiltersContent />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CarsListing;
