import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSiteAdmin, putSiteAdminMerge } from "@/services/admin.service";
import type { SiteContent } from "@/types/siteContent";
import { normalizeSiteContent } from "@/lib/defaultSiteContent";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Plus, Trash2 } from "lucide-react";

const AdminReviews = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "site"],
    queryFn: fetchSiteAdmin,
  });

  const [testimonials, setTestimonials] = useState<SiteContent["testimonials"]>(
    () => normalizeSiteContent(undefined).testimonials
  );

  useEffect(() => {
    if (data?.content != null) {
      setTestimonials(normalizeSiteContent(data.content).testimonials);
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const items = testimonials.items.filter((item) => item.name.trim() && item.text.trim());
      if (!items.length) {
        return Promise.reject(new Error("At least one review with name and quote is required"));
      }
      return putSiteAdminMerge({ testimonials: { ...testimonials, items } });
    },
    onSuccess: () => {
      toast.success("Reviews saved");
      qc.invalidateQueries({ queryKey: ["admin", "site"] });
      qc.invalidateQueries({ queryKey: ["site", "public"] });
    },
    onError: (err: Error) => toast.error(err.message || "Save failed"),
  });

  const updateItem = (index: number, patch: Partial<SiteContent["testimonials"]["items"][0]>) => {
    setTestimonials((t) => {
      const items = [...t.items];
      items[index] = { ...items[index], ...patch };
      return { ...t, items };
    });
  };

  const addItem = () => {
    setTestimonials((t) => ({
      ...t,
      items: [...t.items, { name: "", city: "", rating: 5, text: "" }],
    }));
  };

  const removeItem = (index: number) => {
    setTestimonials((t) => ({
      ...t,
      items: t.items.filter((_, i) => i !== index),
    }));
  };

  if (isLoading && !data) {
    return <Skeleton className="h-48 w-full max-w-3xl rounded-xl" />;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Reviews</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Customer reviews on /reviews and the homepage testimonials section
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/reviews" target="_blank" rel="noreferrer" className="gap-1">
              Preview <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
          <Button variant="cta" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            Save
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page headings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Homepage section title</Label>
            <Input
              className="mt-1"
              value={testimonials.sectionTitle}
              onChange={(e) => setTestimonials((t) => ({ ...t, sectionTitle: e.target.value }))}
            />
          </div>
          <div>
            <Label>Reviews page title</Label>
            <Input
              className="mt-1"
              value={testimonials.pageTitle}
              onChange={(e) => setTestimonials((t) => ({ ...t, pageTitle: e.target.value }))}
            />
          </div>
          <div>
            <Label>Reviews page subtitle</Label>
            <Input
              className="mt-1"
              value={testimonials.pageSubtitle}
              onChange={(e) => setTestimonials((t) => ({ ...t, pageSubtitle: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>Review entries</CardTitle>
            <CardDescription>Name, city, star rating, and customer quote</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {testimonials.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-border/50 p-4 space-y-3 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeItem(i)}
                disabled={testimonials.items.length <= 1}
                aria-label="Remove review"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    className="mt-1"
                    value={item.name}
                    onChange={(e) => updateItem(i, { name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    className="mt-1"
                    value={item.city}
                    onChange={(e) => updateItem(i, { city: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Rating (1–5)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  className="mt-1 max-w-[120px]"
                  value={item.rating}
                  onChange={(e) => updateItem(i, { rating: Number(e.target.value) || 5 })}
                />
              </div>
              <div>
                <Label>Quote</Label>
                <Textarea
                  className="mt-1"
                  rows={3}
                  value={item.text}
                  onChange={(e) => updateItem(i, { text: e.target.value })}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button variant="cta" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
        Save reviews
      </Button>
    </div>
  );
};

export default AdminReviews;
