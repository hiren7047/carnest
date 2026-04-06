import { Search, CalendarCheck, Wallet, Truck } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const steps = [
  { icon: Search, title: "Browse Cars", desc: "Search from our curated collection of premium vehicles" },
  { icon: CalendarCheck, title: "Book Test Drive", desc: "Schedule a test drive at your convenience" },
  { icon: Wallet, title: "Finance Options", desc: "Explore partner bank financing — we guide you through the process" },
  { icon: Truck, title: "Get Delivery", desc: "We deliver your dream car to your doorstep" },
];

const HowItWorks = () => (
  <section id="how-it-works" className="scroll-mt-24 bg-primary py-12 md:py-20">
    <div className="container">
      <ScrollReveal>
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-secondary md:mb-2 md:text-sm">
            Simple Process
          </p>
          <h2 className="text-2xl font-heading font-bold leading-tight text-primary-foreground md:text-4xl">
            How It Works
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
        {steps.map(({ icon: Icon, title, desc }, i) => (
          <ScrollReveal key={title} delay={i * 0.15} direction="up">
            <div className="relative min-w-0 px-1 text-center">
              <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/20 md:mb-5 md:h-16 md:w-16">
                <Icon className="h-6 w-6 text-secondary md:h-7 md:w-7" />
                <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground shadow-sm md:h-8 md:w-8 md:text-sm">
                  {i + 1}
                </span>
              </div>
              <h3 className="mb-2 text-base font-semibold leading-snug text-primary-foreground md:text-lg">{title}</h3>
              <p className="text-sm leading-relaxed text-primary-foreground/65">{desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
