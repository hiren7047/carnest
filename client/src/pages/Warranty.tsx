import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Warranty = () => (
  <PageShell
    title="Warranty"
    subtitle="Extended protection plans for selected vehicles—know what is covered before you buy."
  >
    <div className="space-y-10">
      <section className="space-y-3">
        <h2 className="text-xl font-heading font-semibold text-foreground">What warranty can cover</h2>
        <ul className="list-disc pl-5 text-muted-foreground space-y-2">
          <li>Mechanical and electrical components per plan terms (not wear items like tyres or brake pads unless specified).</li>
          <li>Optional roadside assistance and labour caps depending on the product.</li>
          <li>Eligibility often depends on vehicle age, mileage, and inspection outcome.</li>
        </ul>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-heading font-semibold text-foreground">Claims</h2>
        <p className="text-muted-foreground">
          Claims are processed by the warranty provider against policy terms. Keep service records and report issues as soon as symptoms appear to avoid disputes.
        </p>
      </section>
      <section className="rounded-xl border border-border/50 bg-card p-6">
        <p className="text-sm text-muted-foreground mb-4">
          Availability varies by inventory. Ask your Carnest advisor which plans apply to the car you are considering.
        </p>
        <Button variant="cta" asChild>
          <Link to="/contact">Ask about warranty</Link>
        </Button>
      </section>
    </div>
  </PageShell>
);

export default Warranty;
