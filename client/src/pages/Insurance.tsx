import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Insurance = () => (
  <PageShell
    title="Insurance"
    subtitle="Comprehensive and own-damage cover for your car—compare options and protect your investment."
  >
    <div className="space-y-10">
      <section className="space-y-3">
        <h2 className="text-xl font-heading font-semibold text-foreground">Coverage</h2>
        <p className="text-muted-foreground">
          We can help you understand third-party vs comprehensive policies, add-ons (zero depreciation, engine, tyre), and IDV (insured declared value) so you pick cover that fits your usage and risk.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-heading font-semibold text-foreground">At purchase</h2>
        <p className="text-muted-foreground">
          When you buy through Carnest, you can align insurance start date with delivery and transfer of ownership. We recommend confirming NCB (no-claim bonus) transfer if applicable.
        </p>
      </section>
      <section className="rounded-xl border border-border/50 bg-card p-6">
        <p className="text-sm text-muted-foreground mb-4">
          Insurance is issued by licensed insurers. Carnest is not an insurer; we facilitate introductions and documentation guidance only.
        </p>
        <Button variant="cta" asChild>
          <Link to="/contact">Insurance enquiry</Link>
        </Button>
      </section>
    </div>
  </PageShell>
);

export default Insurance;
