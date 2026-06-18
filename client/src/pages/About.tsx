import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAppPath } from "@/hooks/useAppPath";

const OFFICE_ADDRESS = "Shiv Ashirwad Compound, Between Polaris and Param Hospital, BRTS Canal Road, Varachha, Surat.";
const OFFICE_MAPS_LINK = "https://maps.app.goo.gl/P1Tg8eKr2X2Y6My5A";

const About = () => {
  const contactPath = useAppPath("/contact");

  return (
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
          <a
            href={OFFICE_MAPS_LINK}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-secondary hover:underline"
          >
            {OFFICE_ADDRESS}
          </a>
          <p className="text-sm text-muted-foreground">Mon–Sat, 10:00–19:00 IST (by appointment on Sundays).</p>
        </section>
        <Button variant="cta" asChild>
          <Link to={contactPath}>Get in touch</Link>
        </Button>
      </div>
    </PageShell>
  );
};

export default About;
