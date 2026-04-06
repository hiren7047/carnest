import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const OFFICE_ADDRESS = "Bandra Kurla Complex, Mumbai 400051, Maharashtra, India";

const About = () => (
  <PageShell
    title="About Us"
    subtitle="Carnest is India's premium pre-owned car marketplace—curated inventory, transparent inspections, and end-to-end support."
  >
    <div className="space-y-10">
      <section className="space-y-3">
        <h2 className="text-xl font-heading font-semibold text-foreground">Our mission</h2>
        <p className="text-muted-foreground">
          We believe buying or selling a luxury car should be predictable, honest, and stress-free. Every listing is vetted, photographed, and priced with market context so you can decide with confidence.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-heading font-semibold text-foreground">Team</h2>
        <p className="text-muted-foreground">
          Our team combines automotive specialists, finance coordinators, and customer success—so you have one point of contact from enquiry to handover.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-heading font-semibold text-foreground">Visit</h2>
        <p className="text-muted-foreground">{OFFICE_ADDRESS}</p>
        <p className="text-sm text-muted-foreground">Mon–Sat, 10:00–19:00 IST (by appointment on Sundays).</p>
      </section>
      <Button variant="cta" asChild>
        <Link to="/contact">Get in touch</Link>
      </Button>
    </div>
  </PageShell>
);

export default About;
