import { ShieldCheck, BadgeDollarSign, Wallet, Truck, Eye, Wrench } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const items = [
  { icon: ShieldCheck, title: "Verified Listings", desc: "Every car undergoes 200+ point inspection" },
  { icon: BadgeDollarSign, title: "Best Price Guarantee", desc: "Market-competitive pricing with no hidden costs" },
  { icon: Wallet, title: "Easy Financing", desc: "Partner bank financing options available on request" },
  { icon: Truck, title: "Doorstep Delivery", desc: "Get your car delivered to your doorstep" },
  { icon: Eye, title: "100% Transparency", desc: "Complete history & documentation provided" },
  { icon: Wrench, title: "Expert Inspection", desc: "Certified mechanics inspect every vehicle" },
];

const WhyCarnest = () => (
  <section className="bg-background py-12 md:py-20">
    <div className="container">
      <ScrollReveal>
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-secondary md:mb-2 md:text-sm">
            Why Choose Us
          </p>
          <h2 className="text-balance text-2xl font-heading font-bold leading-tight text-foreground md:text-4xl">
            The Carnest Advantage
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {items.map(({ icon: Icon, title, desc }, i) => (
          <ScrollReveal key={title} delay={i * 0.1} direction="up">
            <div className="group flex h-full min-w-0 cursor-default flex-col rounded-xl border border-border/50 bg-card p-5 shadow-sm transition-shadow hover:shadow-md md:p-6">
              <div className="mb-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/10 transition-colors group-hover:bg-secondary/20 md:mb-4 md:h-12 md:w-12">
                <Icon className="h-5 w-5 shrink-0 text-secondary md:h-6 md:w-6" />
              </div>
              <h3 className="mb-2 text-left text-base font-semibold leading-snug text-foreground md:text-lg">{title}</h3>
              <p className="min-w-0 text-left text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default WhyCarnest;
