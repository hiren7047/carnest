import { useState, useRef, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { createCar, deleteCar, fetchCars, fetchCarById, updateCar } from "@/services/cars.service";
import { uploadImages } from "@/services/upload.service";
import { toast } from "sonner";
import type { ApiCar } from "@/types/car";
import { Upload, X, Loader2, ImageOff, Star, Car, Pencil, Trash2, Sparkles } from "lucide-react";
import { resolveMediaUrl } from "@/utils/mediaUrl";
import { normalizeCarImageUrls } from "@/utils/carImages";
import { formatPrice } from "@/utils/formatPrice";
import { cn } from "@/lib/utils";

const emptyForm = {
  title: "",
  brand: "",
  model: "",
  year: String(new Date().getFullYear()),
  price: "",
  market_price: "",
  fuel_type: "Petrol",
  transmission: "Automatic",
  km_driven: "0",
  location: "Mumbai",
  description: "",
  imageUrls: [] as string[],
  is_featured: false,
};

function PhotoThumb({
  url,
  isCover,
  onRemove,
  onSetCover,
}: {
  url: string;
  isCover: boolean;
  onRemove: () => void;
  onSetCover: () => void;
}) {
  const [broken, setBroken] = useState(false);
  const src = resolveMediaUrl(url);

  return (
    <div
      className={cn(
        "flex w-[6.5rem] shrink-0 flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md",
        isCover && "ring-2 ring-secondary/60 ring-offset-2 ring-offset-background"
      )}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 bg-muted/80">
        {broken ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center">
            <ImageOff className="h-6 w-6 text-muted-foreground" />
            <span className="text-[9px] leading-tight text-muted-foreground">Preview failed</span>
          </div>
        ) : (
          <img
            src={src}
            alt=""
            className="h-full w-full object-contain object-center"
            onError={() => setBroken(true)}
          />
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="absolute right-1 top-1 rounded-lg bg-background/95 p-1.5 shadow-md ring-1 ring-border transition-colors hover:bg-destructive/15 hover:text-destructive"
          aria-label="Remove image"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex min-h-[2rem] items-center justify-center border-t border-border/50 bg-muted/30 px-1 py-1.5">
        {isCover ? (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-secondary">
            <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
            Main
          </span>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSetCover();
            }}
            className="rounded-md px-2 py-1 text-[11px] font-medium text-primary hover:bg-muted"
          >
            Set as main
          </button>
        )}
      </div>
    </div>
  );
}

const AdminCars = () => {
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["cars", "admin"],
    queryFn: () => fetchCars({ limit: 100, page: 1 }),
  });

  const addFiles = useCallback(async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => /^image\/(jpeg|png|webp|gif)$/i.test(f.type));
    if (files.length === 0) {
      toast.error("Only JPEG, PNG, WebP, or GIF images are allowed (convert iPhone HEIC to JPG if needed)");
      return;
    }
    setUploading(true);
    try {
      const urls = await uploadImages(files);
      setForm((f) => ({ ...f, imageUrls: [...f.imageUrls, ...urls] }));
      toast.success(`Uploaded ${urls.length} image(s)`);
    } catch {
      /* axios interceptor already toasts */
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.length) void addFiles(e.dataTransfer.files);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (form.imageUrls.length === 0) {
        throw new Error("Add at least one image");
      }
      const payload = {
        title: form.title,
        brand: form.brand,
        model: form.model,
        year: Number(form.year),
        price: Number(form.price),
        market_price: form.market_price.trim() ? Number(form.market_price) : null,
        fuel_type: form.fuel_type,
        transmission: form.transmission,
        km_driven: Number(form.km_driven),
        location: form.location,
        description: form.description,
        images: form.imageUrls,
        is_featured: form.is_featured,
      };
      if (editingId) {
        return updateCar(editingId, payload);
      }
      return createCar(payload);
    },
    onSuccess: () => {
      toast.success(editingId ? "Car updated" : "Car created");
      qc.invalidateQueries({ queryKey: ["cars"] });
      setForm(emptyForm);
      setEditingId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMutation = useMutation({
    mutationFn: (id: number) => deleteCar(id),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["cars"] });
    },
  });

  const startEdit = async (c: ApiCar) => {
    setEditingId(c.id);
    setLoadingEdit(true);
    setForm({
      title: c.title,
      brand: c.brand,
      model: c.model,
      year: String(c.year),
      price: String(c.price),
      market_price: c.market_price != null ? String(c.market_price) : "",
      fuel_type: c.fuel_type,
      transmission: c.transmission,
      km_driven: String(c.km_driven),
      location: c.location,
      description: c.description,
      imageUrls: normalizeCarImageUrls(c.images),
      is_featured: c.is_featured,
    });
    try {
      const { car } = await fetchCarById(c.id);
      const urls = normalizeCarImageUrls(car.images);
      setForm({
        title: car.title,
        brand: car.brand,
        model: car.model,
        year: String(car.year),
        price: String(car.price),
        market_price: car.market_price != null ? String(car.market_price) : "",
        fuel_type: car.fuel_type,
        transmission: car.transmission,
        km_driven: String(car.km_driven),
        location: car.location,
        description: car.description,
        imageUrls: urls,
        is_featured: car.is_featured,
      });
      if (urls.length === 0) {
        toast.warning("No images saved — add photos and click Update.");
      }
    } catch {
      setEditingId(null);
      setForm(emptyForm);
    } finally {
      setLoadingEdit(false);
    }
  };

  const removeImageAt = (index: number) => {
    setForm((f) => ({ ...f, imageUrls: f.imageUrls.filter((_, i) => i !== index) }));
  };

  const setMainPhotoAt = (index: number) => {
    if (index <= 0) return;
    setForm((f) => {
      const next = [...f.imageUrls];
      const [picked] = next.splice(index, 1);
      next.unshift(picked);
      return { ...f, imageUrls: next };
    });
    toast.success("Main photo selected — click Save to apply");
  };

  const cars = data?.data ?? [];
  const listThumb = (c: ApiCar) => {
    const urls = normalizeCarImageUrls(c.images);
    return urls[0] ? resolveMediaUrl(urls[0]) : null;
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1.5 inline-flex items-center gap-2 rounded-full bg-secondary/15 px-3 py-1 text-xs font-medium text-secondary">
            <Car className="h-3.5 w-3.5" />
            Inventory
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">Vehicle listings</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Add or edit cars, upload photos, and set the main thumbnail. Changes save to the site immediately after
            you publish.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
          }}
          disabled={loadingEdit}
        >
          New listing
        </Button>
      </div>

      <Card className="overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-heading">
                {editingId ? "Edit listing" : "Create listing"}
              </CardTitle>
              <CardDescription className="mt-1 max-w-2xl">
                {loadingEdit
                  ? "Loading…"
                  : "First photo is the main image on browse & detail pages. Use “Set as main” to reorder."}
              </CardDescription>
            </div>
            {editingId && (
              <Badge variant="secondary" className="gap-1 font-normal">
                <Pencil className="h-3 w-3" />
                ID {editingId}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          {loadingEdit && (
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              Loading listing…
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Basics</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    className="mt-1.5"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    className="mt-1.5"
                    value={form.brand}
                    onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    className="mt-1.5"
                    value={form.model}
                    onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    className="mt-1.5"
                    value={form.year}
                    onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="price">Fixed price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    className="mt-1.5"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="market_price">Market price (₹, optional)</Label>
                  <Input
                    id="market_price"
                    type="number"
                    className="mt-1.5"
                    placeholder="Higher MRP for comparison"
                    value={form.market_price}
                    onChange={(e) => setForm((f) => ({ ...f, market_price: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="km">KM driven</Label>
                  <Input
                    id="km"
                    className="mt-1.5"
                    value={form.km_driven}
                    onChange={(e) => setForm((f) => ({ ...f, km_driven: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="fuel">Fuel</Label>
                  <Input
                    id="fuel"
                    className="mt-1.5"
                    value={form.fuel_type}
                    onChange={(e) => setForm((f) => ({ ...f, fuel_type: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="trans">Transmission</Label>
                  <Input
                    id="trans"
                    className="mt-1.5"
                    value={form.transmission}
                    onChange={(e) => setForm((f) => ({ ...f, transmission: e.target.value }))}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="loc">Location</Label>
                  <Input
                    id="loc"
                    className="mt-1.5"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Description</h3>
              <div>
                <Label htmlFor="desc">Notes</Label>
                <Textarea
                  id="desc"
                  className="mt-1.5 min-h-[140px] resize-y"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Specs, registration, highlights…"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/40">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                  className="h-4 w-4 rounded border-border"
                />
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 text-secondary" />
                  <div>
                    <span className="text-sm font-medium">Featured on homepage</span>
                    <p className="text-xs text-muted-foreground">Shows in Featured / Luxury sections when enabled.</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Photos</h3>
                <p className="mt-1 max-w-xl text-xs text-muted-foreground">
                  Uploads match the site preview (full car inside frame). “Main” is the listing thumbnail.
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="gap-2"
                disabled={uploading || loadingEdit}
                onClick={() => fileRef.current?.click()}
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                Add images
              </Button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="sr-only"
              onChange={(e) => {
                const list = e.target.files;
                if (list?.length) void addFiles(list);
              }}
            />
            <button
              type="button"
              disabled={uploading || loadingEdit}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={onDrop}
              className={cn(
                "flex w-full min-h-[120px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/80 bg-muted/15 px-4 py-6 text-center transition-all",
                "hover:border-secondary/40 hover:bg-muted/25",
                "disabled:opacity-50"
              )}
            >
              {uploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">
                {uploading ? "Uploading…" : "Drop images here or click to browse"}
              </span>
              <span className="text-xs text-muted-foreground">JPEG, PNG, WebP, GIF · up to ~10 MB each</span>
            </button>

            {form.imageUrls.length > 0 && (
              <div className="rounded-xl border border-border/50 bg-muted/10 p-4">
                <p className="mb-3 text-xs font-medium text-muted-foreground">
                  {form.imageUrls.length} photo{form.imageUrls.length !== 1 ? "s" : ""} · starred = main
                </p>
                <div className="flex flex-wrap gap-4">
                  {form.imageUrls.map((url, i) => (
                    <PhotoThumb
                      key={`${i}-${url.slice(-32)}`}
                      url={url}
                      isCover={i === 0}
                      onRemove={() => removeImageAt(i)}
                      onSetCover={() => setMainPhotoAt(i)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              variant="cta"
              size="lg"
              className="min-w-[140px]"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || uploading || loadingEdit}
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : editingId ? (
                "Save changes"
              ) : (
                "Publish listing"
              )}
            </Button>
            {editingId && (
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                disabled={loadingEdit}
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading text-xl font-semibold">All listings</h2>
          <span className="text-sm text-muted-foreground">{cars.length} total</span>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        ) : cars.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Car className="mb-3 h-12 w-12 text-muted-foreground/50" />
              <p className="font-medium text-foreground">No cars yet</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">Create your first listing above.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {cars.map((c) => {
              const thumb = listThumb(c);
              return (
                <Card
                  key={c.id}
                  className="group overflow-hidden border-border/60 transition-shadow hover:shadow-md"
                >
                  <CardContent className="flex gap-4 p-4">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted/60">
                      {thumb ? (
                        <img src={thumb} alt="" className="h-full w-full object-contain object-center" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <ImageOff className="h-8 w-8 opacity-40" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start gap-2">
                        <p className="line-clamp-2 font-heading font-semibold leading-snug">{c.title}</p>
                        {c.is_featured && (
                          <Badge variant="secondary" className="shrink-0 gap-0.5 text-[10px]">
                            <Sparkles className="h-3 w-3" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-lg font-bold tabular-nums text-secondary">{formatPrice(c.price)}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {c.brand} {c.model} · {c.year} · {c.location}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          onClick={() => startEdit(c)}
                          disabled={loadingEdit}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => delMutation.mutate(c.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCars;
