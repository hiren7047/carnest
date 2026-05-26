import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSiteAdmin, putSiteAdminMerge } from "@/services/admin.service";
import { uploadImages } from "@/services/upload.service";
import type { SiteContent } from "@/types/siteContent";
import { normalizeSiteContent } from "@/lib/defaultSiteContent";
import { resolveMediaUrl } from "@/utils/mediaUrl";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Plus, Trash2, Upload } from "lucide-react";

const AdminGallery = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "site"],
    queryFn: fetchSiteAdmin,
  });

  const [gallery, setGallery] = useState<SiteContent["gallery"]>(() => normalizeSiteContent(undefined).gallery);

  useEffect(() => {
    if (data?.content != null) {
      setGallery(normalizeSiteContent(data.content).gallery);
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () => putSiteAdminMerge({ gallery }),
    onSuccess: () => {
      toast.success("Gallery saved");
      qc.invalidateQueries({ queryKey: ["admin", "site"] });
      qc.invalidateQueries({ queryKey: ["site", "public"] });
    },
    onError: () => toast.error("Save failed"),
  });

  const updateImage = (index: number, patch: Partial<SiteContent["gallery"]["images"][0]>) => {
    setGallery((g) => {
      const images = [...g.images];
      images[index] = { ...images[index], ...patch };
      return { ...g, images };
    });
  };

  const removeImage = (index: number) => {
    setGallery((g) => ({ ...g, images: g.images.filter((_, i) => i !== index) }));
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    try {
      const urls = await uploadImages(Array.from(files));
      const added = urls.map((imageUrl, i) => ({
        imageUrl,
        alt: files[i]?.name?.replace(/\.[^.]+$/, "") || "Gallery photo",
      }));
      setGallery((g) => ({ ...g, images: [...g.images, ...added] }));
      toast.success(added.length === 1 ? "Image uploaded" : `${added.length} images uploaded`);
    } catch {
      toast.error("Upload failed");
    }
    e.target.value = "";
  };

  if (isLoading && !data) {
    return <Skeleton className="h-48 w-full max-w-3xl rounded-xl" />;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Gallery</h1>
          <p className="text-muted-foreground text-sm mt-1">Photos on the public /gallery page</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/gallery" target="_blank" rel="noreferrer" className="gap-1">
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
          <CardTitle>Page text</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              className="mt-1"
              value={gallery.title}
              onChange={(e) => setGallery((g) => ({ ...g, title: e.target.value }))}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              className="mt-1"
              value={gallery.subtitle}
              onChange={(e) => setGallery((g) => ({ ...g, subtitle: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>Images</CardTitle>
            <CardDescription>Upload showroom and vehicle photos (JPEG, PNG, WebP)</CardDescription>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <Upload className="h-3.5 w-3.5" />
              Upload images
            </Label>
            <Input type="file" accept="image/*" multiple className="mt-1 max-w-xs" onChange={onUpload} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {gallery.images.length === 0 && (
            <p className="text-sm text-muted-foreground">No images yet. Upload photos to show on the gallery page.</p>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            {gallery.images.map((img, i) => (
              <div key={`${img.imageUrl}-${i}`} className="rounded-lg border border-border/50 p-3 space-y-3">
                <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted">
                  <img src={resolveMediaUrl(img.imageUrl)} alt="" className="h-full w-full object-cover" />
                </div>
                <div>
                  <Label>Alt text</Label>
                  <Input
                    className="mt-1"
                    value={img.alt}
                    onChange={(e) => updateImage(i, { alt: e.target.value })}
                    placeholder="Describe the photo"
                  />
                </div>
                <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => removeImage(i)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button variant="cta" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
        Save gallery
      </Button>
    </div>
  );
};

export default AdminGallery;
