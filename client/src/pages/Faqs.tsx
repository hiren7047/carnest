import { PageShell } from "@/components/PageShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqGroups = [
  {
    title: "Buying",
    items: [
      {
        q: "Can I inspect a car before paying?",
        a: "Yes. We encourage viewings and test drives where available. Schedule via contact or WhatsApp and we will confirm slot and location.",
      },
      {
        q: "Are prices negotiable?",
        a: "Listings are priced with market data. Your advisor can explain how a specific car is priced and whether there is room to align on serious offers.",
      },
      {
        q: "Do you help with RC transfer?",
        a: "We guide you through documentation and timelines. Requirements vary by state; our team lists what you need upfront.",
      },
    ],
  },
  {
    title: "Selling",
    items: [
      {
        q: "How do I sell my car through Carnest?",
        a: "Submit the sell form with vehicle details. Our team will contact you for inspection and a valuation.",
      },
      {
        q: "How long does listing take?",
        a: "After inspection and agreement, photography and listing typically go live within a few business days.",
      },
    ],
  },
  {
    title: "Finance & insurance",
    items: [
      {
        q: "Do you offer loans?",
        a: "We work with partner banks and NBFCs. Eligibility and rates are determined by the lender, not Carnest.",
      },
      {
        q: "Can I insure through Carnest?",
        a: "We can connect you with licensed partners. Policy terms are set by the insurer.",
      },
    ],
  },
];

const Faqs = () => (
  <PageShell
    title="FAQs"
    subtitle="Quick answers about buying, selling, and services. For anything else, contact us."
  >
    <div className="space-y-10">
      {faqGroups.map((group) => (
        <section key={group.title}>
          <h2 className="text-lg font-heading font-semibold text-foreground mb-3">{group.title}</h2>
          <Accordion type="single" collapsible className="w-full">
            {group.items.map((item, i) => (
              <AccordionItem key={item.q} value={`${group.title}-${i}`}>
                <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ))}
    </div>
  </PageShell>
);

export default Faqs;
