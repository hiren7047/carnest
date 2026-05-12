import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarCheck,
  MessageCircle,
  Phone,
  Fuel,
  Gauge,
  Settings,
  MapPin,
  Calendar,
  Heart,
  Users,
  Palette,
  IdCard,
  BatteryCharging,
  Zap,
  GaugeCircle,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/utils/formatPrice";
import { formatKmDriven } from "@/utils/formatKm";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { fetchCarById } from "@/services/cars.service";
import { mapApiCarToView } from "@/types/car";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar as CalendarUi } from "@/components/ui/calendar";
import { useAuth } from "@/context/AuthContext";
import { createBooking } from "@/services/bookings.service";
import { saveCar, removeCar, fetchWishlist } from "@/services/wishlist.service";
import { toast } from "sonner";
import { whatsAppChatUrl } from "@/utils/whatsapp";
import { digitsToTelHref, resolvePublicContactDigits } from "@/utils/phone";
import { useSiteContent } from "@/hooks/useSitePublic";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { submitContact } from "@/services/contact.service";

function firstOwnerLabel(n: number | null | undefined): string | null {
  if (!n || n < 1) return null;
  if (n === 1) return "1st";
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

function fmtRegMonthYear(month?: number | null, year?: number | null): string | null {
  if (!year) return null;
  if (month && month >= 1 && month <= 12) return `${String(month).padStart(2, "0")}-${year}`;
  return `${year}`;
}

function money(x: number): string {
  return x.toLocaleString("en-IN");
}

function calcEmi(params: { principal: number; annualRatePct: number; months: number }): number {
  const { principal, annualRatePct, months } = params;
  if (principal <= 0 || months <= 0) return 0;
  const r = (annualRatePct / 100) / 12;
  if (r <= 0) return Math.round(principal / months);
  const pow = Math.pow(1 + r, months);
  const emi = principal * r * pow / (pow - 1);
  return Math.round(emi);
}

const CarDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const siteContent = useSiteContent();
  const contactDigits = resolvePublicContactDigits(siteContent.contact.whatsappNumber);
  const queryClient = useQueryClient();
  const [activeImg, setActiveImg] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState<Date | undefined>(undefined);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [downPct, setDownPct] = useState(20);
  const [tenureYears, setTenureYears] = useState(5);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadCity, setLeadCity] = useState<string>("");
  const [leadLoading, setLeadLoading] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["car", id],
    queryFn: () => fetchCarById(id!),
    enabled: Boolean(id),
  });

  const { data: wishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
    enabled: Boolean(user),
  });

  const car = data ? mapApiCarToView(data.car) : null;

  useEffect(() => {
    if (wishlist && car) {
      setSaved(wishlist.some((w) => String(w.id) === car.id));
    }
  }, [wishlist, car]);
  const similar = data?.similar?.map(mapApiCarToView) ?? [];

  const images = useMemo(() => {
    if (!car) return [];
    const imgs = car.images?.length ? car.images : [car.image];
    return imgs;
  }, [car]);

  useEffect(() => {
    if (!carouselApi || !lightboxOpen) return;
    const onSelect = () => setActiveImg(carouselApi.selectedScrollSnap());
    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi, lightboxOpen]);

  const handleBooking = async () => {
    if (!user) {
      toast.info("Sign in to book a test drive");
      return;
    }
    if (!car || !bookingDate || !id) return;
    const iso = bookingDate.toISOString().slice(0, 10);
    setBookingLoading(true);
    try {
      await createBooking(Number(car.id), iso);
      toast.success("Test drive requested");
      setBookingOpen(false);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    } finally {
      setBookingLoading(false);
    }
  };

  const toggleSave = async () => {
    if (!user) {
      toast.info("Sign in to save cars");
      return;
    }
    if (!car) return;
    try {
      if (saved) {
        await removeCar(Number(car.id));
        setSaved(false);
        toast.success("Removed from saved");
      } else {
        await saveCar(Number(car.id));
        setSaved(true);
        toast.success("Saved to your list");
      }
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    } catch {
      /* toast from api */
    }
  };

  const waLink = car
    ? whatsAppChatUrl(
        `Hi Carnest, I'm interested in ${car.name} (₹${car.price.toLocaleString("en-IN")}${
          car.marketPrice != null && car.marketPrice > car.price
            ? `, below market ~₹${car.marketPrice.toLocaleString("en-IN")}`
            : ""
        }) — Listing ID ${car.id}`,
        contactDigits
      )
    : "#";

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car) return;
    setLeadLoading(true);
    try {
      const message = [
        `Car enquiry`,
        `Car: ${car.name} (ID ${car.id})`,
        `Price: ₹${car.price.toLocaleString("en-IN")}`,
        leadCity ? `City: ${leadCity}` : null,
        leadPhone ? `Mobile: ${leadPhone}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      // Store inquiry in backend (email is required server-side).
      const fallbackEmail = user?.email || `lead+${Date.now()}@carnest.in`;
      await submitContact({
        name: leadName.trim(),
        email: fallbackEmail,
        phone: leadPhone.trim(),
        message,
      });

      toast.success("Thanks! We'll contact you shortly.");

      // Also open WhatsApp chat (matches reference flow).
      const chatLink = whatsAppChatUrl(
        `Hi Carnest, I'm interested in ${car.name} (ID ${car.id}).\nName: ${leadName}\nMobile: ${leadPhone}\nCity: ${leadCity}`,
        contactDigits
      );
      window.open(chatLink, "_blank", "noreferrer");

      setLeadName("");
      setLeadPhone("");
      setLeadCity("");
    } catch {
      /* axios interceptor + toast above */
    } finally {
      setLeadLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-24 pb-16">
          <Skeleton className="h-[400px] rounded-xl mb-4" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">Car not found</h2>
          <Link to="/cars">
            <Button variant="cta">Browse Cars</Button>
          </Link>
        </div>
      </div>
    );
  }

  const specs = [
    { icon: Fuel, label: "Fuel", value: car.fuelType },
    { icon: Settings, label: "Transmission", value: car.transmission },
    { icon: Gauge, label: "KM Driven", value: formatKmDriven(car.kmDriven) },
    { icon: Calendar, label: "Year", value: car.year.toString() },
    { icon: MapPin, label: "Location", value: car.location },
  ];

  const regLabel = fmtRegMonthYear(car.registrationMonth ?? null, car.registrationYear ?? null);
  const ownerLabel = firstOwnerLabel(car.ownerCount ?? null);

  const overviewItems = [
    { icon: IdCard, label: "Reg. Year", value: regLabel },
    { icon: Calendar, label: "Make Year", value: car.year ? String(car.year) : null },
    { icon: Gauge, label: "KM Driven", value: car.kmDriven != null ? String(car.kmDriven) : null },
    { icon: Fuel, label: "Fuel Type", value: car.fuelType || null },
    { icon: Settings, label: "Transmission", value: car.transmission || null },
    { icon: Users, label: "No. of Owner", value: ownerLabel },
    { icon: Palette, label: "Colour", value: car.color ?? null },
    { icon: MapPin, label: "Reg. City", value: car.rtoCity ?? null },
    { icon: BatteryCharging, label: "Battery", value: car.batteryKwh != null ? `${car.batteryKwh} kWh` : null },
    { icon: Zap, label: "Range", value: car.rangeKm != null ? `${car.rangeKm} km` : null },
    { icon: GaugeCircle, label: "Top Speed", value: car.topSpeedKmph != null ? `${car.topSpeedKmph} km/h` : null },
    { icon: ShieldCheck, label: "Airbags", value: car.airbagsCount != null ? String(car.airbagsCount) : null },
  ].filter((x) => x.value);

  const exteriorFeatures = [
    { key: "sunroof", label: "Sunroof", on: Boolean(car.sunroof) },
    { key: "alloy_wheels", label: "Alloy wheels", on: Boolean(car.alloyWheels) },
    { key: "led_headlamps", label: "LED headlamps", on: Boolean(car.ledHeadlamps) },
    { key: "fog_lamps", label: "Fog lamps", on: Boolean(car.fogLamps) },
  ].filter((f) => f.on);

  const interiorFeatures = [
    { key: "ventilated_seats", label: "Ventilated seats", on: Boolean(car.ventilatedSeats) },
    { key: "leather_seats", label: "Leather seats", on: Boolean(car.leatherSeats) },
    { key: "ambient_lighting", label: "Ambient lighting", on: Boolean(car.ambientLighting) },
    { key: "digital_cluster", label: "Digital cluster", on: Boolean(car.digitalCluster) },
  ].filter((f) => f.on);

  const safetyFeatures = [
    { key: "abs", label: "ABS", on: Boolean(car.abs) },
    { key: "esc", label: "ESC", on: Boolean(car.esc) },
    { key: "tpms", label: "TPMS", on: Boolean(car.tpms) },
    { key: "adas", label: "ADAS", on: Boolean(car.adas) },
    { key: "rear_camera", label: "Rear camera", on: Boolean(car.rearCamera) },
    { key: "parking_sensors", label: "Parking sensors", on: Boolean(car.parkingSensors) },
  ].filter((f) => f.on);

  const convenienceFeatures = [
    { key: "android_auto", label: "Android Auto", on: Boolean(car.androidAuto) },
    { key: "apple_carplay", label: "Apple CarPlay", on: Boolean(car.appleCarplay) },
    { key: "wireless_charging", label: "Wireless charging", on: Boolean(car.wirelessCharging) },
    { key: "cruise_control", label: "Cruise control", on: Boolean(car.cruiseControl) },
  ].filter((f) => f.on);

  const showFeatureAccordion =
    exteriorFeatures.length + interiorFeatures.length + safetyFeatures.length + convenienceFeatures.length > 0;

  const downAmt = Math.round((car.price * downPct) / 100);
  const principal = Math.max(0, car.price - downAmt);
  const months = Math.max(12, tenureYears * 12);
  const estEmi = calcEmi({ principal, annualRatePct: 10.5, months });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-secondary">
              Home
            </Link>{" "}
            /{" "}
            <Link to="/cars" className="hover:text-secondary">
              Cars
            </Link>{" "}
            / <span className="text-foreground">{car.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{car.name}</h1>
                  {car.variantName ? (
                    <p className="text-sm text-muted-foreground mt-1">{car.variantName}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {car.isPremium && (
                    <Badge className="bg-accent text-accent-foreground border-0">Premium</Badge>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={toggleSave}
                  >
                    <Heart className={`h-4 w-4 ${saved ? "fill-secondary text-secondary" : ""}`} />
                    {saved ? "Saved" : "Save"}
                  </Button>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border border-border/40 bg-muted/60">
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="group flex min-h-[min(55vh,520px)] w-full cursor-zoom-in items-center justify-center p-2 sm:p-4 md:min-h-[min(60vh,560px)]"
                  aria-label="View photos full screen"
                >
                  <img
                    src={images[activeImg] ?? car.image}
                    alt={car.name}
                    loading="lazy"
                    className="max-h-[min(55vh,520px)] w-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.01] md:max-h-[min(60vh,560px)]"
                  />
                </button>
              </div>
              <div
                className="-mx-1 flex gap-2 overflow-x-auto overflow-y-hidden px-1 pb-2 pt-1 scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:thin]"
                aria-label="Gallery thumbnails"
              >
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setActiveImg(i);
                      carouselApi?.scrollTo(i);
                    }}
                    className={`flex h-[4.5rem] w-[5.5rem] shrink-0 snap-start items-center justify-center overflow-hidden rounded-lg border-2 bg-muted/50 transition-colors ${
                      i === activeImg ? "border-secondary ring-2 ring-secondary/30" : "border-border/60"
                    }`}
                  >
                    <img src={img} alt="" className="max-h-full max-w-full object-contain" loading="lazy" />
                  </button>
                ))}
              </div>

              {overviewItems.length > 0 && (
                <div className="bg-card rounded-xl p-6 border border-border/50 mt-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {overviewItems.map(({ icon: Icon, label, value }) => (
                      <div
                        key={label}
                        className="rounded-xl border border-border/60 bg-white dark:bg-muted/20 p-4 flex flex-col items-center text-center gap-2 shadow-sm"
                      >
                        <div className="h-10 w-10 rounded-xl bg-muted/60 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-foreground/80" />
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-none">{label}</p>
                        <p className="text-sm font-semibold text-foreground truncate max-w-full">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-card rounded-xl border border-border/50">
                <Accordion type="multiple" className="px-6">
                  <AccordionItem value="basic">
                    <AccordionTrigger>Basic information</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {regLabel ? (
                          <div className="rounded-lg border border-border/60 bg-muted/10 p-3">
                            <p className="text-xs text-muted-foreground">Registration</p>
                            <p className="font-semibold">{regLabel}</p>
                          </div>
                        ) : null}
                        {car.insuranceValidTill ? (
                          <div className="rounded-lg border border-border/60 bg-muted/10 p-3">
                            <p className="text-xs text-muted-foreground">Insurance validity</p>
                            <p className="font-semibold">{car.insuranceValidTill}</p>
                          </div>
                        ) : null}
                        {car.warrantyInfo ? (
                          <div className="rounded-lg border border-border/60 bg-muted/10 p-3">
                            <p className="text-xs text-muted-foreground">Warranty</p>
                            <p className="font-semibold">{car.warrantyInfo}</p>
                          </div>
                        ) : null}
                        {car.serviceHistory ? (
                          <div className="rounded-lg border border-border/60 bg-muted/10 p-3 sm:col-span-2">
                            <p className="text-xs text-muted-foreground">Service history</p>
                            <p className="font-semibold">{car.serviceHistory}</p>
                          </div>
                        ) : null}
                      </div>
                      {!car.insuranceValidTill && !car.warrantyInfo && !car.serviceHistory && !regLabel ? (
                        <p className="text-sm text-muted-foreground">No additional info added.</p>
                      ) : null}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="engine">
                    <AccordionTrigger>Engine & performance</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {car.engineCc != null ? (
                          <div className="rounded-lg border border-border/60 bg-muted/10 p-3">
                            <p className="text-xs text-muted-foreground">Engine</p>
                            <p className="font-semibold">{car.engineCc} cc</p>
                          </div>
                        ) : null}
                        {car.powerBhp != null ? (
                          <div className="rounded-lg border border-border/60 bg-muted/10 p-3">
                            <p className="text-xs text-muted-foreground">Power</p>
                            <p className="font-semibold">{car.powerBhp} bhp</p>
                          </div>
                        ) : null}
                        {car.torqueNm != null ? (
                          <div className="rounded-lg border border-border/60 bg-muted/10 p-3">
                            <p className="text-xs text-muted-foreground">Torque</p>
                            <p className="font-semibold">{car.torqueNm} Nm</p>
                          </div>
                        ) : null}
                        {car.drivetrain ? (
                          <div className="rounded-lg border border-border/60 bg-muted/10 p-3">
                            <p className="text-xs text-muted-foreground">Drive type</p>
                            <p className="font-semibold">{car.drivetrain}</p>
                          </div>
                        ) : null}
                        {car.accel0To100Sec != null ? (
                          <div className="rounded-lg border border-border/60 bg-muted/10 p-3">
                            <p className="text-xs text-muted-foreground">0–100 km/h</p>
                            <p className="font-semibold">{car.accel0To100Sec} sec</p>
                          </div>
                        ) : null}
                        {car.topSpeedKmph != null ? (
                          <div className="rounded-lg border border-border/60 bg-muted/10 p-3">
                            <p className="text-xs text-muted-foreground">Top speed</p>
                            <p className="font-semibold">{car.topSpeedKmph} km/h</p>
                          </div>
                        ) : null}
                        {car.batteryKwh != null ? (
                          <div className="rounded-lg border border-border/60 bg-muted/10 p-3">
                            <p className="text-xs text-muted-foreground">Battery</p>
                            <p className="font-semibold">{car.batteryKwh} kWh</p>
                          </div>
                        ) : null}
                        {car.rangeKm != null ? (
                          <div className="rounded-lg border border-border/60 bg-muted/10 p-3">
                            <p className="text-xs text-muted-foreground">Range</p>
                            <p className="font-semibold">{car.rangeKm} km</p>
                          </div>
                        ) : null}
                        {car.chargingTimeAc ? (
                          <div className="rounded-lg border border-border/60 bg-muted/10 p-3 sm:col-span-2">
                            <p className="text-xs text-muted-foreground">Charging (AC)</p>
                            <p className="font-semibold">{car.chargingTimeAc}</p>
                          </div>
                        ) : null}
                        {car.chargingTimeDc ? (
                          <div className="rounded-lg border border-border/60 bg-muted/10 p-3 sm:col-span-2">
                            <p className="text-xs text-muted-foreground">Charging (DC)</p>
                            <p className="font-semibold">{car.chargingTimeDc}</p>
                          </div>
                        ) : null}
                      </div>
                      {!car.engineCc &&
                      !car.powerBhp &&
                      !car.torqueNm &&
                      !car.drivetrain &&
                      !car.accel0To100Sec &&
                      !car.topSpeedKmph &&
                      !car.batteryKwh &&
                      !car.rangeKm &&
                      !car.chargingTimeAc &&
                      !car.chargingTimeDc ? (
                        <p className="text-sm text-muted-foreground">No performance data added.</p>
                      ) : null}
                    </AccordionContent>
                  </AccordionItem>

                  {showFeatureAccordion && (
                    <AccordionItem value="features">
                      <AccordionTrigger>Features</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-6 lg:grid-cols-2">
                          {exteriorFeatures.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                                Exterior
                              </p>
                              <ul className="space-y-2">
                                {exteriorFeatures.map((f) => (
                                  <li key={f.key} className="flex items-center gap-2 text-sm">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                                      ✓
                                    </span>
                                    {f.label}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {interiorFeatures.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                                Interior
                              </p>
                              <ul className="space-y-2">
                                {interiorFeatures.map((f) => (
                                  <li key={f.key} className="flex items-center gap-2 text-sm">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                                      ✓
                                    </span>
                                    {f.label}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {safetyFeatures.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                                Safety
                              </p>
                              <ul className="space-y-2">
                                {safetyFeatures.map((f) => (
                                  <li key={f.key} className="flex items-center gap-2 text-sm">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                                      ✓
                                    </span>
                                    {f.label}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {convenienceFeatures.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                                Convenience
                              </p>
                              <ul className="space-y-2">
                                {convenienceFeatures.map((f) => (
                                  <li key={f.key} className="flex items-center gap-2 text-sm">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-secondary/15 text-secondary">
                                      ✓
                                    </span>
                                    {f.label}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                </Accordion>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading font-semibold text-lg">Calculate your EMI</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Estimated monthly EMI based on typical loan rates.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Estimated EMI</p>
                    <p className="text-2xl font-heading font-bold text-secondary tabular-nums">
                      ₹{money(estEmi)}
                    </p>
                    {car.emiNote ? <p className="mt-1 text-xs text-muted-foreground">{car.emiNote}</p> : null}
                  </div>
                </div>
                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Down payment</span>
                      <span className="font-semibold tabular-nums">
                        {downPct}% (₹{money(downAmt)})
                      </span>
                    </div>
                    <Slider
                      value={[downPct]}
                      min={0}
                      max={60}
                      step={1}
                      onValueChange={(v) => setDownPct(v[0] ?? 20)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tenure</span>
                      <span className="font-semibold tabular-nums">{tenureYears} years</span>
                    </div>
                    <Slider
                      value={[tenureYears]}
                      min={1}
                      max={7}
                      step={1}
                      onValueChange={(v) => setTenureYears(v[0] ?? 5)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Principal ₹{money(principal)} · Rate 10.5% p.a. · {months} months
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/50">
                <h3 className="font-heading font-semibold text-lg mb-4">Description</h3>
                <div className="prose prose-sm max-w-none text-foreground/90 dark:prose-invert prose-p:leading-relaxed prose-p:mb-3 last:prose-p:mb-0">
                  <p className="whitespace-pre-wrap text-[15px] leading-relaxed md:text-base">{car.description}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-card rounded-xl p-6 border border-border/50 sticky top-24">
                <div className="bg-white dark:bg-card rounded-xl border border-border/50 p-5 shadow-sm">
                  <p className="text-sm font-semibold text-foreground/90 text-center">Carnest Fixed Price :</p>
                  <p className="text-3xl font-heading font-bold text-center mt-3" style={{ color: "#cba333" }}>
                    {formatPrice(car.price)}
                  </p>
                  {car.marketPrice != null && car.marketPrice > 0 && (
                    <p className="mt-4 text-sm font-semibold text-center text-muted-foreground">
                      Pre-Owned Market Price :{" "}
                      <span className="tabular-nums text-foreground/90">
                        ₹{car.marketPrice.toLocaleString("en-IN")}
                      </span>
                    </p>
                  )}
                </div>

                <div className="bg-white dark:bg-card rounded-xl border border-border/50 p-5 shadow-sm mt-4">
                  <p className="text-sm font-semibold text-foreground mb-3">Certified &amp; Verified Cars</p>
                  <ul className="space-y-2 text-sm text-foreground/90">
                    {[
                      "More than 120 check point",
                      "Non Accidental & Non Tampered Cars",
                      "Peace of mind & convenience",
                      "Complete vehicle history",
                      "Quality Inventory",
                      "6 month Warranty",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2">
                        <ShieldCheck className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white dark:bg-card rounded-xl border border-border/50 p-5 shadow-sm mt-4">
                  <form onSubmit={handleLeadSubmit} className="space-y-3">
                    <p className="text-base font-heading font-semibold text-foreground">Get in Touch</p>

                    <div className="space-y-1">
                      <Label htmlFor="lead-name">Name</Label>
                      <Input
                        id="lead-name"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        required
                        minLength={2}
                        placeholder="Name"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="lead-phone">Mobile No.</Label>
                      <Input
                        id="lead-phone"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value.replace(/[^\d+]/g, ""))}
                        required
                        minLength={10}
                        placeholder="Mobile No."
                        inputMode="numeric"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>City</Label>
                      <Select value={leadCity} onValueChange={setLeadCity}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Surat", "Ahmedabad", "Vadodara", "Mumbai", "Delhi", "Pune", "Bengaluru"].map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full" variant="cta" disabled={leadLoading}>
                      {leadLoading ? "Sending…" : "Send Message"}
                    </Button>

                    <Button type="button" className="w-full gap-2" variant="outline" asChild>
                      <a href={waLink} target="_blank" rel="noreferrer">
                        <MessageCircle className="h-4 w-4" />
                        Chat Via Whatsapp
                      </a>
                    </Button>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {specs.slice(0, 4).map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Icon className="h-4 w-4" />
                          <span className="truncate">{value}</span>
                        </div>
                      ))}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {similar.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Similar Cars</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similar.slice(0, 3).map((c) => (
                  <CarCard key={c.id} car={c} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="fixed left-0 top-0 z-[60] flex h-[100dvh] max-h-[100dvh] w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-zinc-950 p-0 text-white shadow-none data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100 [&>button]:right-4 [&>button]:top-4 [&>button]:text-white"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Photo gallery</DialogTitle>
          </DialogHeader>
          <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-2 pb-10 pt-14 sm:px-6">
            <Carousel
              opts={{ loop: true, startIndex: activeImg }}
              setApi={setCarouselApi}
              className="w-full max-w-5xl"
            >
              <CarouselContent className="-ml-2">
                {images.map((src, i) => (
                  <CarouselItem key={i} className="basis-full pl-2">
                    <div className="flex h-[min(70vh,520px)] w-full items-center justify-center sm:h-[min(75vh,600px)]">
                      <img
                        src={src}
                        alt={`${car.name} ${i + 1}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 border-white/40 bg-white/10 text-white hover:bg-white/20 disabled:opacity-0 sm:left-4" />
              <CarouselNext className="right-2 border-white/40 bg-white/10 text-white hover:bg-white/20 disabled:opacity-0 sm:right-4" />
            </Carousel>
            <p className="mt-4 text-center text-sm text-white/70">
              {activeImg + 1} / {images.length} — swipe or use arrows
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book a test drive</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Pick a preferred date for {car.name}.</p>
          <CalendarUi
            mode="single"
            selected={bookingDate}
            onSelect={setBookingDate}
            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
            className="rounded-md border pointer-events-auto"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingOpen(false)}>
              Cancel
            </Button>
            <Button variant="cta" onClick={handleBooking} disabled={!bookingDate || bookingLoading}>
              {bookingLoading ? "Submitting…" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default CarDetail;
