import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function LegalPageLayout({ title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container pt-24 pb-16 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mb-10">{subtitle}</p>}
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed [&_h2]:text-foreground [&_h2]:font-heading [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-foreground">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
