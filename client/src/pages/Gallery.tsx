import { PageShell } from "@/components/PageShell";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSitePublic";
import { resolveMediaUrl } from "@/utils/mediaUrl";

const Gallery = () => {
  const { gallery } = useSiteContent();

  return (
    <PageShell wide title={gallery.title} subtitle={gallery.subtitle}>
      {gallery.images.length === 0 ? (
        <p className="text-muted-foreground text-sm">Gallery photos will appear here soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gallery.images.map(({ imageUrl, alt }, i) => (
            <div
              key={`${imageUrl}-${i}`}
              className="aspect-[4/3] overflow-hidden rounded-xl border border-border/50 bg-muted"
            >
              <img
                src={resolveMediaUrl(imageUrl)}
                alt={alt || "Gallery photo"}
                className="h-full w-full object-cover hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}
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
};

export default Gallery;
