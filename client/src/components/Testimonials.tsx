import { Star } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { testimonials as fallbackReviews } from "@/data/testimonials";
import { useSiteContent } from "@/hooks/useSitePublic";

const Testimonials = () => {
  const content = useSiteContent();
  const { sectionTitle, items } = content.testimonials;
  const reviews = items.length ? items : fallbackReviews;

  return (
    <section className="bg-muted/50 py-12 md:py-20">
      <div className="container">
        <ScrollReveal>
          <div className="mb-10 text-center md:mb-14">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-secondary md:mb-2 md:text-sm">
              Testimonials
            </p>
            <h2 className="text-balance text-2xl font-heading font-bold leading-tight text-foreground md:text-4xl">
              {sectionTitle}
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6">
          {reviews.map(({ name, city, rating, text }, i) => (
            <ScrollReveal key={`${name}-${i}`} delay={i * 0.12} direction="up">
              <div className="flex h-full min-w-0 flex-col rounded-xl border border-border/50 bg-card p-5 shadow-sm md:p-6">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-secondary text-secondary md:h-4 md:w-4" />
                  ))}
                </div>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground md:mb-6 md:text-[15px]">
                  &ldquo;{text}&rdquo;
                </p>
                <div className="flex items-center gap-3 border-t border-border/40 pt-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-sm font-bold text-secondary md:h-10 md:w-10">
                    {name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{name}</p>
                    <p className="truncate text-xs text-muted-foreground">{city}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
