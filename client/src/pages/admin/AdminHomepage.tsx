import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchSiteAdmin, putSiteAdminMerge } from "@/services/admin.service";
import { uploadImages } from "@/services/upload.service";
import type { SiteContent } from "@/types/siteContent";
import { normalizeSiteContent } from "@/lib/defaultSiteContent";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Plus, Trash2 } from "lucide-react";

const AdminHomepage = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "site"],
    queryFn: fetchSiteAdmin,
  });

  const [content, setContent] = useState<SiteContent>(() => normalizeSiteContent(undefined));

  useEffect(() => {
    if (data?.content != null) {
      setContent(normalizeSiteContent(data.content));
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () => putSiteAdminMerge(content),
    onSuccess: () => {
      toast.success("Homepage saved");
      qc.invalidateQueries({ queryKey: ["admin", "site"] });
      qc.invalidateQueries({ queryKey: ["site", "public"] });
    },
    onError: () => toast.error("Save failed"),
  });

  const updateHero = (patch: Partial<SiteContent["hero"]>) => {
    setContent((c) => ({ ...c, hero: { ...c.hero, ...patch } }));
  };

  const updateTestimonial = (index: number, patch: Partial<SiteContent["testimonials"]["items"][0]>) => {
    setContent((c) => {
      const items = [...c.testimonials.items];
      items[index] = { ...items[index], ...patch };
      return { ...c, testimonials: { ...c.testimonials, items } };
    });
  };

  const addTestimonial = () => {
    setContent((c) => ({
      ...c,
      testimonials: {
        ...c.testimonials,
        items: [...c.testimonials.items, { name: "", city: "", rating: 5, text: "" }],
      },
    }));
  };

  const removeTestimonial = (index: number) => {
    setContent((c) => ({
      ...c,
      testimonials: {
        ...c.testimonials,
        items: c.testimonials.items.filter((_, i) => i !== index),
      },
    }));
  };

  const onHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    try {
      const urls = await uploadImages(Array.from(files));
      if (urls[0]) updateHero({ heroImageUrl: urls[0] });
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    }
    e.target.value = "";
  };

  if (isLoading && !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Homepage</h1>
          <p className="text-muted-foreground text-sm mt-1">Hero and testimonials on the public home page</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/" target="_blank" rel="noreferrer" className="gap-1">
              Preview site <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
          <Button variant="cta" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            Save
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero</CardTitle>
          <CardDescription>Top section on the home page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Eyebrow</Label>
            <Input
              className="mt-1"
              value={content.hero.eyebrow}
              onChange={(e) => updateHero({ eyebrow: e.target.value })}
            />
          </div>
          <div>
            <Label>Headline (one line per row)</Label>
            <Textarea
              className="mt-1 font-mono text-sm"
              rows={3}
              value={content.hero.headlineLines.join("\n")}
              onChange={(e) =>
                updateHero({
                  headlineLines: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
          <div>
            <Label>Subheadline</Label>
            <Input
              className="mt-1"
              value={content.hero.subheadline}
              onChange={(e) => updateHero({ subheadline: e.target.value })}
            />
          </div>
          <div>
            <Label>Hero image URL</Label>
            <Input
              className="mt-1"
              value={content.hero.heroImageUrl}
              onChange={(e) => updateHero({ heroImageUrl: e.target.value })}
              placeholder="https://... or leave empty for default asset"
            />
            <div className="mt-2">
              <Label className="text-xs text-muted-foreground">Upload image</Label>
              <Input type="file" accept="image/*" className="mt-1 max-w-xs" onChange={onHeroImageUpload} />
            </div>
          </div>
          <Separator />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Primary CTA label</Label>
              <Input
                className="mt-1"
                value={content.hero.primaryCtaLabel}
                onChange={(e) => updateHero({ primaryCtaLabel: e.target.value })}
              />
            </div>
            <div>
              <Label>Primary CTA link</Label>
              <Input
                className="mt-1"
                value={content.hero.primaryCtaHref}
                onChange={(e) => updateHero({ primaryCtaHref: e.target.value })}
              />
            </div>
            <div>
              <Label>Secondary CTA label</Label>
              <Input
                className="mt-1"
                value={content.hero.secondaryCtaLabel}
                onChange={(e) => updateHero({ secondaryCtaLabel: e.target.value })}
              />
            </div>
            <div>
              <Label>Secondary CTA link</Label>
              <Input
                className="mt-1"
                value={content.hero.secondaryCtaHref}
                onChange={(e) => updateHero({ secondaryCtaHref: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>Testimonials</CardTitle>
            <CardDescription>Customer quotes section</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addTestimonial}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Section title</Label>
            <Input
              className="mt-1"
              value={content.testimonials.sectionTitle}
              onChange={(e) =>
                setContent((c) => ({
                  ...c,
                  testimonials: { ...c.testimonials, sectionTitle: e.target.value },
                }))
              }
            />
          </div>
          {content.testimonials.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-border/50 p-4 space-y-3 relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeTestimonial(i)}
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    className="mt-1"
                    value={item.name}
                    onChange={(e) => updateTestimonial(i, { name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    className="mt-1"
                    value={item.city}
                    onChange={(e) => updateTestimonial(i, { city: e.target.value })}
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
                  onChange={(e) => updateTestimonial(i, { rating: Number(e.target.value) || 5 })}
                />
              </div>
              <div>
                <Label>Quote</Label>
                <Textarea
                  className="mt-1"
                  rows={3}
                  value={item.text}
                  onChange={(e) => updateTestimonial(i, { text: e.target.value })}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button variant="cta" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
        Save
      </Button>
    </div>
  );
};

export default AdminHomepage;
