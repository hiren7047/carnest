import { PageShell } from "@/components/PageShell";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroCar from "@/assets/hero-car.jpg";

const images = [
  { src: heroCar, alt: "Premium showroom vehicle" },
  { src: heroCar, alt: "Curated inventory" },
  { src: heroCar, alt: "Inspection bay" },
  { src: heroCar, alt: "Handover experience" },
  { src: heroCar, alt: "Luxury sedan" },
  { src: heroCar, alt: "SUV lineup" },
];

const Gallery = () => (
  <PageShell
    wide
    title="Gallery"
    subtitle="A glimpse of our showroom, vehicles, and the Carnest experience."
  >
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map(({ src, alt }, i) => (
        <div
          key={i}
          className="aspect-[4/3] overflow-hidden rounded-xl border border-border/50 bg-muted"
        >
          <img src={src} alt={alt} className="h-full w-full object-cover hover:scale-[1.02] transition-transform duration-300" />
        </div>
      ))}
    </div>
    <div className="mt-10 flex flex-wrap gap-3">
      <Button variant="cta" asChild>
        <Link to="/cars">Browse car stock</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link to="/contact">Book a visit</Link>
      </Button>
    </div>
  </PageShell>
);

export default Gallery;
