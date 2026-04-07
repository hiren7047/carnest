import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Car, Upload, User, Phone, Mail, MapPin, ChevronDown } from "lucide-react";
import { sellFuelTypes } from "@/utils/constants";
import { useState, useRef } from "react";
import { submitSellRequest } from "@/services/sell.service";
import { toast } from "sonner";

const SellYourCar = () => {
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
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
  });

  const update = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("phone", form.phone);
    const car_details = [
      `Brand: ${form.brand}`,
      `Model: ${form.model}`,
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

    const files = fileRef.current?.files;
    if (files?.length) {
      for (let i = 0; i < files.length; i++) {
        fd.append("images", files[i]);
      }
    }

    setLoading(true);
    try {
      await submitSellRequest(fd);
      toast.success("Request submitted — our team will contact you within 24 hours.");
      setForm({
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
      });
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      /* api toasts error */
    } finally {
      setLoading(false);
    }
  };

  const Field = ({
    label,
    icon: Icon,
    name,
    type = "text",
    placeholder,
  }: {
    label: string;
    icon: typeof Car;
    name: keyof typeof form;
    type?: string;
    placeholder: string;
  }) => (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type={type}
          value={form[name]}
          onChange={(e) => update(name, e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 pl-10 pr-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
          required={name === "name" || name === "phone"}
        />
      </div>
    </div>
  );

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
                <Field label="Brand" icon={Car} name="brand" placeholder="e.g. Mercedes-Benz" />
                <Field label="Model" icon={Car} name="model" placeholder="e.g. C-Class" />
                <Field label="Year" icon={Car} name="year" type="number" placeholder="e.g. 2022" />
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
                <Field label="Transmission" icon={Car} name="transmission" placeholder="Automatic" />
                <Field label="KM Driven" icon={Car} name="km" type="number" placeholder="e.g. 25000" />
                <Field label="Expected Price (₹)" icon={Car} name="price" type="number" placeholder="e.g. 3500000" />
              </div>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-secondary" /> Upload Images
              </h3>
              <label className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center cursor-pointer hover:border-secondary transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Click to select car images</p>
                <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG, WebP up to 10MB each</p>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="sr-only" />
              </label>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-secondary" /> Contact Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full Name" icon={User} name="name" placeholder="John Doe" />
                <Field label="Phone" icon={Phone} name="phone" type="tel" placeholder="+91 98765 43210" />
                <Field label="Email" icon={Mail} name="email" type="email" placeholder="john@example.com" />
                <Field label="City" icon={MapPin} name="city" placeholder="Mumbai" />
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
