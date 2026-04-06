import { useQuery } from "@tanstack/react-query";
import CarCard from "@/components/CarCard";
import ScrollReveal from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { fetchCars } from "@/services/cars.service";
import { mapApiCarToView } from "@/types/car";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedCars = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["cars", "featured-home"],
    queryFn: () => fetchCars({ featured: true, limit: 12, sort: "year", order: "desc" }),
  });

  const items = data?.data ?? [];
  const featured = items.slice(0, 4).map(mapApiCarToView);
  const luxury = items.slice(4, 9).map(mapApiCarToView);

  const skeletonGrid = (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-[340px] rounded-xl" />
      ))}
    </div>
  );

  return (
    <>
      <section className="bg-muted/50 py-12 md:py-20">
        <div className="container">
          <ScrollReveal>
            <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
              <div className="min-w-0 text-left">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-secondary md:mb-2 md:text-sm">
                  Featured
                </p>
                <h2 className="text-balance text-2xl font-heading font-bold leading-tight text-foreground md:text-4xl">
                  Handpicked For You
                </h2>
              </div>
              <Link to="/cars" className="hidden md:flex">
                <Button variant="ghost" className="gap-1 text-secondary hover:text-secondary/80">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
          {isLoading ? (
            skeletonGrid
          ) : featured.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No featured listings yet. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {featured.map((car, i) => (
                <ScrollReveal key={car.id} delay={i * 0.1} direction="up">
                  <CarCard car={car} />
                </ScrollReveal>
              ))}
            </div>
          )}
          <div className="mt-8 text-center md:hidden">
            <Link to="/cars">
              <Button variant="cta">View All Cars</Button>
            </Link>
          </div>
        </div>
      </section>

      {(isLoading || luxury.length > 0) && (
        <section className="bg-background py-12 md:py-20">
          <div className="container">
            <ScrollReveal>
              <div className="mb-8 text-center md:mb-10">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-gold md:mb-2 md:text-sm">
                  Exclusive
                </p>
                <h2 className="text-balance text-2xl font-heading font-bold leading-tight text-foreground md:text-4xl">
                  Luxury Collection
                </h2>
              </div>
            </ScrollReveal>
            {isLoading ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[380px] rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
                {luxury.map((car, i) => (
                  <ScrollReveal key={car.id} delay={i * 0.12} direction="up">
                    <CarCard car={car} large />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default FeaturedCars;
