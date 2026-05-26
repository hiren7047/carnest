import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Car, Upload, User, Phone, Mail, MapPin, ChevronDown, X } from "lucide-react";
import { sellFuelTypes } from "@/utils/constants";
import { useState, useRef, useEffect, useCallback } from "react";
import { submitSellRequest } from "@/services/sell.service";
import { toast } from "sonner";
import { useSearchBrands } from "@/hooks/useSearchBrands";

type SellForm = {
  brand: string;
  model: string;
  year: string;
  fuel: string;
  transmission: string;
  km: string;
  price: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  description: string;
};

const emptyForm: SellForm = {
  brand: "",
  model: "",
  year: "",
  fuel: "",
  transmission: "",
  km: "",
  price: "",
  name: "",
  phone: "",
  email: "",
  city: "",
  description: "",
};

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_IMAGES = 12;

type FieldProps = {
  label: string;
  icon: typeof Car;
  name: keyof SellForm;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (name: keyof SellForm, val: string) => void;
  required?: boolean;
};

const Field = ({ label, icon: Icon, name, type = "text", placeholder, value, onChange, required }: FieldProps) => (
  <div>
    <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-10 pr-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
        required={required}
      />
    </div>
  </div>
);

const SellYourCar = () => {
  const searchBrands = useSearchBrands();
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<SellForm>(emptyForm);
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);

  const update = useCallback((key: keyof SellForm, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
  }, []);

  const imagesRef = useRef(images);
  imagesRef.current = images;
  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, []);

  const addImages = (incoming: FileList | null) => {
    if (!incoming?.length) return;
    const next: { file: File; preview: string }[] = [];
    for (let i = 0; i < incoming.length; i++) {
      const file = incoming[i];
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error(`${file.name}: only JPG, PNG, WebP, or GIF (convert iPhone HEIC to JPG)`);
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        toast.error(`${file.name}: max 10MB per image`);
        continue;
      }
      next.push({ file, preview: URL.createObjectURL(file) });
    }
    if (!next.length) return;
    setImages((prev) => {
      const combined = [...prev, ...next].slice(0, MAX_IMAGES);
      if (prev.length + next.length > MAX_IMAGES) {
        toast.info(`Up to ${MAX_IMAGES} images allowed`);
      }
      return combined;
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.brand.trim() || !form.model.trim()) {
      toast.error("Brand and model are required");
      return;
    }
    const fd = new FormData();
    fd.append("name", form.name.trim());
    fd.append("phone", form.phone.trim());
    const car_details = [
      `Brand: ${form.brand.trim()}`,
      `Model: ${form.model.trim()}`,
      `Year: ${form.year}`,
      `Fuel: ${form.fuel}`,
      `Transmission: ${form.transmission}`,
      `KM driven: ${form.km}`,
      `Expected price (₹): ${form.price}`,
      `City: ${form.city}`,
      `Email: ${form.email}`,
      "",
      "Notes:",
      form.description,
    ].join("\n");
    fd.append("car_details", car_details);

    for (const { file } of images) {
      fd.append("images", file);
    }

    setLoading(true);
    try {
      await submitSellRequest(fd);
      toast.success("Request submitted — our team will contact you within 24 hours.");
      setForm(emptyForm);
      setImages((prev) => {
        prev.forEach((img) => URL.revokeObjectURL(img.preview));
        return [];
      });
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      /* api toasts error */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-secondary tracking-widest uppercase mb-2">
              Sell With Confidence
            </p>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Sell Your Car</h1>
            <p className="text-muted-foreground mt-2">
              Get the best price for your car from our network of verified buyers.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-card rounded-2xl p-6 md:p-8 border border-border/50 space-y-8"
          >
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <Car className="h-5 w-5 text-secondary" /> Car Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Brand</label>
                  <div className="relative">
                    <Car className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <select
                      required
                      value={form.brand}
                      onChange={(e) => update("brand", e.target.value)}
                      className="h-11 w-full appearance-none rounded-lg border border-border bg-card pl-10 pr-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <option value="">Select brand</option>
                      {searchBrands.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
                <Field
                  label="Model"
                  icon={Car}
                  name="model"
                  placeholder="e.g. C-Class"
                  value={form.model}
                  onChange={update}
                  required
                />
                <Field
                  label="Year"
                  icon={Car}
                  name="year"
                  type="number"
                  placeholder="e.g. 2022"
                  value={form.year}
                  onChange={update}
                />
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Fuel Type</label>
                  <div className="relative">
                    <Car className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <select
                      required
                      value={form.fuel}
                      onChange={(e) => update("fuel", e.target.value)}
                      className="h-11 w-full appearance-none rounded-lg border border-border bg-card pl-10 pr-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <option value="">Select fuel</option>
                      {sellFuelTypes.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
                <Field
                  label="Transmission"
                  icon={Car}
                  name="transmission"
                  placeholder="Automatic"
                  value={form.transmission}
                  onChange={update}
                />
                <Field
                  label="KM Driven"
                  icon={Car}
                  name="km"
                  type="number"
                  placeholder="e.g. 25000"
                  value={form.km}
                  onChange={update}
                />
                <Field
                  label="Expected Price (₹)"
                  icon={Car}
                  name="price"
                  type="number"
                  placeholder="e.g. 3500000"
                  value={form.price}
                  onChange={update}
                />
              </div>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-secondary" /> Upload Images
                {images.length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    ({images.length}/{MAX_IMAGES})
                  </span>
                )}
              </h3>
              <label className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center cursor-pointer hover:border-secondary transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  {images.length ? "Add more photos" : "Click to select car images"}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  JPG, PNG, WebP or GIF — up to 10MB each, max {MAX_IMAGES} photos
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  multiple
                  className="sr-only"
                  onChange={(e) => addImages(e.target.files)}
                />
              </label>
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <div key={img.preview} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                      <img src={img.preview} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-secondary" /> Contact Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Full Name"
                  icon={User}
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={update}
                  required
                />
                <Field
                  label="Phone"
                  icon={Phone}
                  name="phone"
                  type="tel"
                  placeholder="+91 9XXXX XXXXX"
                  value={form.phone}
                  onChange={update}
                  required
                />
                <Field
                  label="Email"
                  icon={Mail}
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={update}
                />
                <Field
                  label="City"
                  icon={MapPin}
                  name="city"
                  placeholder="Mumbai"
                  value={form.city}
                  onChange={update}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Additional Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                placeholder="Any additional details about your car..."
                className="w-full p-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
              />
            </div>

            <Button variant="cta" size="lg" type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting…" : "Get Best Price"}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellYourCar;
