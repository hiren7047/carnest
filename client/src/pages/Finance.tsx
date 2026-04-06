import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Finance = () => (
  <PageShell
    title="Finance"
    subtitle="Partner-led car loans and structured EMIs for premium and pre-owned vehicles—transparent eligibility and quick decisions."
  >
    <div className="space-y-10">
      <section className="space-y-3">
        <h2 className="text-xl font-heading font-semibold text-foreground">How it works</h2>
        <ul className="list-disc pl-5 text-muted-foreground space-y-2">
          <li>Share your preferred car and loan amount; we route your profile to partner banks and NBFCs.</li>
          <li>Get indicative EMI and tenure options before you commit to a booking.</li>
          <li>Documentation is handled digitally where possible; disbursement is aligned with vehicle handover.</li>
        </ul>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-heading font-semibold text-foreground">Eligibility</h2>
        <p className="text-muted-foreground">
          Typical requirements include stable income proof, identity and address verification, and credit assessment as per the lender. Final approval rests solely with the financing institution.
        </p>
      </section>
      <section className="rounded-xl border border-border/50 bg-card p-6">
        <p className="text-sm text-muted-foreground mb-4">
          Finance is subject to lender approval. Rates, tenure, and processing fees vary by lender and profile. Carnest does not provide loans directly.
        </p>
        <Button variant="cta" asChild>
          <Link to="/contact">Discuss financing</Link>
        </Button>
      </section>
    </div>
  </PageShell>
);

export default Finance;
