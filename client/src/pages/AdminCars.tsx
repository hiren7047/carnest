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
  variant_name: "",
  registration_year: "",
  registration_month: "",
  owner_count: "",
  color: "",
  body_type: "",
  rto_city: "",

  engine_cc: "",
  power_bhp: "",
  torque_nm: "",
  top_speed_kmph: "",
  accel_0_100_sec: "",
  drivetrain: "",
  seating_capacity: "",
  boot_space_l: "",

  battery_kwh: "",
  range_km: "",
  charging_time_ac: "",
  charging_time_dc: "",

  insurance_valid_till: "",
  warranty_info: "",
  service_history: "",

  sunroof: false,
  alloy_wheels: false,
  led_headlamps: false,
  fog_lamps: false,
  rear_camera: false,
  parking_sensors: false,

  ventilated_seats: false,
  leather_seats: false,
  ambient_lighting: false,
  digital_cluster: false,

  airbags_count: "",
  abs: false,
  esc: false,
  tpms: false,
  adas: false,

  android_auto: false,
  apple_carplay: false,
  wireless_charging: false,
  cruise_control: false,

  emi_note: "",
  imageUrls: [] as string[],
  is_featured: false,
};

function carToForm(c: ApiCar) {
  return {
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
    variant_name: c.variant_name ?? "",
    registration_year: c.registration_year != null ? String(c.registration_year) : "",
    registration_month: c.registration_month != null ? String(c.registration_month) : "",
    owner_count: c.owner_count != null ? String(c.owner_count) : "",
    color: c.color ?? "",
    body_type: c.body_type ?? "",
    rto_city: c.rto_city ?? "",

    engine_cc: c.engine_cc != null ? String(c.engine_cc) : "",
    power_bhp: c.power_bhp != null ? String(c.power_bhp) : "",
    torque_nm: c.torque_nm != null ? String(c.torque_nm) : "",
    top_speed_kmph: c.top_speed_kmph != null ? String(c.top_speed_kmph) : "",
    accel_0_100_sec: c.accel_0_100_sec != null ? String(c.accel_0_100_sec) : "",
    drivetrain: c.drivetrain ?? "",
    seating_capacity: c.seating_capacity != null ? String(c.seating_capacity) : "",
    boot_space_l: c.boot_space_l != null ? String(c.boot_space_l) : "",

    battery_kwh: c.battery_kwh != null ? String(c.battery_kwh) : "",
    range_km: c.range_km != null ? String(c.range_km) : "",
    charging_time_ac: c.charging_time_ac ?? "",
    charging_time_dc: c.charging_time_dc ?? "",

    insurance_valid_till: c.insurance_valid_till ?? "",
    warranty_info: c.warranty_info ?? "",
    service_history: c.service_history ?? "",

    sunroof: Boolean(c.sunroof),
    alloy_wheels: Boolean(c.alloy_wheels),
    led_headlamps: Boolean(c.led_headlamps),
    fog_lamps: Boolean(c.fog_lamps),
    rear_camera: Boolean(c.rear_camera),
    parking_sensors: Boolean(c.parking_sensors),

    ventilated_seats: Boolean(c.ventilated_seats),
    leather_seats: Boolean(c.leather_seats),
    ambient_lighting: Boolean(c.ambient_lighting),
    digital_cluster: Boolean(c.digital_cluster),

    airbags_count: c.airbags_count != null ? String(c.airbags_count) : "",
    abs: Boolean(c.abs),
    esc: Boolean(c.esc),
    tpms: Boolean(c.tpms),
    adas: Boolean(c.adas),

    android_auto: Boolean(c.android_auto),
    apple_carplay: Boolean(c.apple_carplay),
    wireless_charging: Boolean(c.wireless_charging),
    cruise_control: Boolean(c.cruise_control),

    emi_note: c.emi_note ?? "",
    imageUrls: normalizeCarImageUrls(c.images),
    is_featured: Boolean(c.is_featured),
  };
}

function toOptionalNumber(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function toOptionalInt(raw: string): number | null {
  const n = toOptionalNumber(raw);
  if (n == null) return null;
  return Math.trunc(n);
}

function toOptionalString(raw: string): string | null {
  const t = raw.trim();
  return t ? t : null;
}

function BoolField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-border/60 bg-muted/10 px-3 py-2.5 transition-colors hover:bg-muted/25">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-border"
      />
      <div className="min-w-0">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </label>
  );
}

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

        variant_name: toOptionalString(form.variant_name),
        registration_year: toOptionalInt(form.registration_year),
        registration_month: toOptionalInt(form.registration_month),
        owner_count: toOptionalInt(form.owner_count),
        color: toOptionalString(form.color),
        body_type: toOptionalString(form.body_type),
        rto_city: toOptionalString(form.rto_city),

        engine_cc: toOptionalInt(form.engine_cc),
        power_bhp: toOptionalNumber(form.power_bhp),
        torque_nm: toOptionalNumber(form.torque_nm),
        top_speed_kmph: toOptionalInt(form.top_speed_kmph),
        accel_0_100_sec: toOptionalNumber(form.accel_0_100_sec),
        drivetrain: toOptionalString(form.drivetrain),
        seating_capacity: toOptionalInt(form.seating_capacity),
        boot_space_l: toOptionalInt(form.boot_space_l),

        battery_kwh: toOptionalNumber(form.battery_kwh),
        range_km: toOptionalInt(form.range_km),
        charging_time_ac: toOptionalString(form.charging_time_ac),
        charging_time_dc: toOptionalString(form.charging_time_dc),

        insurance_valid_till: toOptionalString(form.insurance_valid_till),
        warranty_info: toOptionalString(form.warranty_info),
        service_history: toOptionalString(form.service_history),

        sunroof: form.sunroof,
        alloy_wheels: form.alloy_wheels,
        led_headlamps: form.led_headlamps,
        fog_lamps: form.fog_lamps,
        rear_camera: form.rear_camera,
        parking_sensors: form.parking_sensors,

        ventilated_seats: form.ventilated_seats,
        leather_seats: form.leather_seats,
        ambient_lighting: form.ambient_lighting,
        digital_cluster: form.digital_cluster,

        airbags_count: toOptionalInt(form.airbags_count),
        abs: form.abs,
        esc: form.esc,
        tpms: form.tpms,
        adas: form.adas,

        android_auto: form.android_auto,
        apple_carplay: form.apple_carplay,
        wireless_charging: form.wireless_charging,
        cruise_control: form.cruise_control,

        emi_note: toOptionalString(form.emi_note),
      };
      if (editingId) {
        return updateCar(editingId, payload);
      }
      return createCar(payload);
    },
    onSuccess: (saved) => {
      toast.success(editingId ? "Car updated" : "Car created");
      qc.invalidateQueries({ queryKey: ["cars", "admin"] });
      qc.invalidateQueries({ queryKey: ["cars"] });
      qc.invalidateQueries({ queryKey: ["car", saved.id] });

      // Keep form filled after update so re-clicking Edit shows the saved state.
      if (editingId) {
        setForm(carToForm(saved));
        setEditingId(saved.id);
        return;
      }

      setForm(emptyForm);
      setEditingId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMutation = useMutation({
    mutationFn: (id: number) => deleteCar(id),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["cars", "admin"] });
      qc.invalidateQueries({ queryKey: ["cars"] });
    },
  });

  const startEdit = async (c: ApiCar) => {
    setEditingId(c.id);
    setLoadingEdit(true);
    setForm(carToForm(c));
    try {
      const { car } = await fetchCarById(c.id);
      const urls = normalizeCarImageUrls(car.images);
      setForm({ ...carToForm(car), imageUrls: urls });
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
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Registration & Ownership</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="sm:col-span-2 lg:col-span-3">
                <Label htmlFor="variant">Variant / Trim</Label>
                <Input
                  id="variant"
                  className="mt-1.5"
                  value={form.variant_name}
                  onChange={(e) => setForm((f) => ({ ...f, variant_name: e.target.value }))}
                  placeholder="e.g. GTX+ / SX(O) / M Sport"
                />
              </div>
              <div>
                <Label htmlFor="regy">Registration year</Label>
                <Input
                  id="regy"
                  className="mt-1.5"
                  value={form.registration_year}
                  onChange={(e) => setForm((f) => ({ ...f, registration_year: e.target.value }))}
                  placeholder="e.g. 2023"
                />
              </div>
              <div>
                <Label htmlFor="regm">Registration month</Label>
                <Input
                  id="regm"
                  className="mt-1.5"
                  value={form.registration_month}
                  onChange={(e) => setForm((f) => ({ ...f, registration_month: e.target.value }))}
                  placeholder="1-12"
                />
              </div>
              <div>
                <Label htmlFor="owners">Owner count</Label>
                <Input
                  id="owners"
                  className="mt-1.5"
                  value={form.owner_count}
                  onChange={(e) => setForm((f) => ({ ...f, owner_count: e.target.value }))}
                  placeholder="e.g. 1"
                />
              </div>
              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  className="mt-1.5"
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  placeholder="e.g. Mojave Silver"
                />
              </div>
              <div>
                <Label htmlFor="body">Body type</Label>
                <Input
                  id="body"
                  className="mt-1.5"
                  value={form.body_type}
                  onChange={(e) => setForm((f) => ({ ...f, body_type: e.target.value }))}
                  placeholder="SUV / Sedan / Hatchback"
                />
              </div>
              <div>
                <Label htmlFor="rto">RTO city</Label>
                <Input
                  id="rto"
                  className="mt-1.5"
                  value={form.rto_city}
                  onChange={(e) => setForm((f) => ({ ...f, rto_city: e.target.value }))}
                  placeholder="e.g. Surat"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Specs & Performance</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label htmlFor="cc">Engine (cc)</Label>
                <Input
                  id="cc"
                  className="mt-1.5"
                  value={form.engine_cc}
                  onChange={(e) => setForm((f) => ({ ...f, engine_cc: e.target.value }))}
                  placeholder="e.g. 1993"
                />
              </div>
              <div>
                <Label htmlFor="bhp">Power (bhp)</Label>
                <Input
                  id="bhp"
                  className="mt-1.5"
                  value={form.power_bhp}
                  onChange={(e) => setForm((f) => ({ ...f, power_bhp: e.target.value }))}
                  placeholder="e.g. 197"
                />
              </div>
              <div>
                <Label htmlFor="torque">Torque (Nm)</Label>
                <Input
                  id="torque"
                  className="mt-1.5"
                  value={form.torque_nm}
                  onChange={(e) => setForm((f) => ({ ...f, torque_nm: e.target.value }))}
                  placeholder="e.g. 440"
                />
              </div>
              <div>
                <Label htmlFor="topspeed">Top speed (km/h)</Label>
                <Input
                  id="topspeed"
                  className="mt-1.5"
                  value={form.top_speed_kmph}
                  onChange={(e) => setForm((f) => ({ ...f, top_speed_kmph: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="accel">0-100 (sec)</Label>
                <Input
                  id="accel"
                  className="mt-1.5"
                  value={form.accel_0_100_sec}
                  onChange={(e) => setForm((f) => ({ ...f, accel_0_100_sec: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="drive">Drivetrain</Label>
                <Input
                  id="drive"
                  className="mt-1.5"
                  value={form.drivetrain}
                  onChange={(e) => setForm((f) => ({ ...f, drivetrain: e.target.value }))}
                  placeholder="FWD / RWD / AWD"
                />
              </div>
              <div>
                <Label htmlFor="seat">Seating capacity</Label>
                <Input
                  id="seat"
                  className="mt-1.5"
                  value={form.seating_capacity}
                  onChange={(e) => setForm((f) => ({ ...f, seating_capacity: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="boot">Boot space (L)</Label>
                <Input
                  id="boot"
                  className="mt-1.5"
                  value={form.boot_space_l}
                  onChange={(e) => setForm((f) => ({ ...f, boot_space_l: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">EV details (optional)</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label htmlFor="batt">Battery (kWh)</Label>
                <Input
                  id="batt"
                  className="mt-1.5"
                  value={form.battery_kwh}
                  onChange={(e) => setForm((f) => ({ ...f, battery_kwh: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="range">Range (km)</Label>
                <Input
                  id="range"
                  className="mt-1.5"
                  value={form.range_km}
                  onChange={(e) => setForm((f) => ({ ...f, range_km: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <Label htmlFor="ac">Charging time (AC)</Label>
                <Input
                  id="ac"
                  className="mt-1.5"
                  value={form.charging_time_ac}
                  onChange={(e) => setForm((f) => ({ ...f, charging_time_ac: e.target.value }))}
                  placeholder="e.g. 0-100% in ~6h (7.4kW)"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <Label htmlFor="dc">Charging time (DC)</Label>
                <Input
                  id="dc"
                  className="mt-1.5"
                  value={form.charging_time_dc}
                  onChange={(e) => setForm((f) => ({ ...f, charging_time_dc: e.target.value }))}
                  placeholder="e.g. 10-80% in ~35m"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Features</h3>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Exterior</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <BoolField label="Sunroof" checked={form.sunroof} onChange={(v) => setForm((f) => ({ ...f, sunroof: v }))} />
                  <BoolField label="Alloy wheels" checked={form.alloy_wheels} onChange={(v) => setForm((f) => ({ ...f, alloy_wheels: v }))} />
                  <BoolField label="LED headlamps" checked={form.led_headlamps} onChange={(v) => setForm((f) => ({ ...f, led_headlamps: v }))} />
                  <BoolField label="Fog lamps" checked={form.fog_lamps} onChange={(v) => setForm((f) => ({ ...f, fog_lamps: v }))} />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Interior</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <BoolField label="Ventilated seats" checked={form.ventilated_seats} onChange={(v) => setForm((f) => ({ ...f, ventilated_seats: v }))} />
                  <BoolField label="Leather seats" checked={form.leather_seats} onChange={(v) => setForm((f) => ({ ...f, leather_seats: v }))} />
                  <BoolField label="Ambient lighting" checked={form.ambient_lighting} onChange={(v) => setForm((f) => ({ ...f, ambient_lighting: v }))} />
                  <BoolField label="Digital cluster" checked={form.digital_cluster} onChange={(v) => setForm((f) => ({ ...f, digital_cluster: v }))} />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Safety</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="airbags">Airbags (count)</Label>
                    <Input
                      id="airbags"
                      className="mt-1.5"
                      value={form.airbags_count}
                      onChange={(e) => setForm((f) => ({ ...f, airbags_count: e.target.value }))}
                      placeholder="e.g. 6"
                    />
                  </div>
                  <BoolField label="ABS" checked={form.abs} onChange={(v) => setForm((f) => ({ ...f, abs: v }))} />
                  <BoolField label="ESC" checked={form.esc} onChange={(v) => setForm((f) => ({ ...f, esc: v }))} />
                  <BoolField label="TPMS" checked={form.tpms} onChange={(v) => setForm((f) => ({ ...f, tpms: v }))} />
                  <BoolField label="ADAS" checked={form.adas} onChange={(v) => setForm((f) => ({ ...f, adas: v }))} hint="If car has driver assistance features" />
                  <BoolField label="Rear camera" checked={form.rear_camera} onChange={(v) => setForm((f) => ({ ...f, rear_camera: v }))} />
                  <BoolField label="Parking sensors" checked={form.parking_sensors} onChange={(v) => setForm((f) => ({ ...f, parking_sensors: v }))} />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Convenience & Infotainment</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <BoolField label="Android Auto" checked={form.android_auto} onChange={(v) => setForm((f) => ({ ...f, android_auto: v }))} />
                  <BoolField label="Apple CarPlay" checked={form.apple_carplay} onChange={(v) => setForm((f) => ({ ...f, apple_carplay: v }))} />
                  <BoolField label="Wireless charging" checked={form.wireless_charging} onChange={(v) => setForm((f) => ({ ...f, wireless_charging: v }))} />
                  <BoolField label="Cruise control" checked={form.cruise_control} onChange={(v) => setForm((f) => ({ ...f, cruise_control: v }))} />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Warranty / Service / Finance</h3>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <Label htmlFor="ins">Insurance valid till</Label>
                <Input
                  id="ins"
                  className="mt-1.5"
                  value={form.insurance_valid_till}
                  onChange={(e) => setForm((f) => ({ ...f, insurance_valid_till: e.target.value }))}
                  placeholder="e.g. Feb 2027"
                />
              </div>
              <div>
                <Label htmlFor="warr">Warranty info</Label>
                <Input
                  id="warr"
                  className="mt-1.5"
                  value={form.warranty_info}
                  onChange={(e) => setForm((f) => ({ ...f, warranty_info: e.target.value }))}
                  placeholder="e.g. Extended warranty till 2028"
                />
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="svc">Service history</Label>
                <Input
                  id="svc"
                  className="mt-1.5"
                  value={form.service_history}
                  onChange={(e) => setForm((f) => ({ ...f, service_history: e.target.value }))}
                  placeholder="e.g. Company service record available"
                />
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="emi">EMI note (optional)</Label>
                <Input
                  id="emi"
                  className="mt-1.5"
                  value={form.emi_note}
                  onChange={(e) => setForm((f) => ({ ...f, emi_note: e.target.value }))}
                  placeholder="Shown near EMI widget"
                />
              </div>
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
