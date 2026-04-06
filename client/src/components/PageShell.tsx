import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type PageShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Wider layout for gallery etc. */
  wide?: boolean;
};

export function PageShell({ title, subtitle, children, wide }: PageShellProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className={`flex-1 container pt-24 pb-16 ${wide ? "max-w-6xl" : "max-w-4xl"}`}>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">{title}</h1>
        {subtitle ? <p className="text-muted-foreground mb-10 max-w-2xl">{subtitle}</p> : null}
        {children}
      </main>
      <Footer />
    </div>
  );
}
