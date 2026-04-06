import { PageShell } from "@/components/PageShell";
import { Star } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { testimonials } from "@/data/testimonials";

const Reviews = () => (
  <PageShell
    title="Reviews"
    subtitle="Real feedback from buyers and sellers who chose Carnest."
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {testimonials.map(({ name, city, rating, text }, i) => (
        <ScrollReveal key={name} delay={i * 0.08} direction="up">
          <div className="bg-card rounded-xl p-6 border border-border/50 hover-lift h-full">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: rating }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-secondary text-secondary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{text}"</p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center text-sm font-heading font-bold text-secondary">
                {name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground">{city}</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  </PageShell>
);

export default Reviews;
