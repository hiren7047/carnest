import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const CarDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeImg, setActiveImg] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState<Date | undefined>(undefined);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

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
        }) — Listing ID ${car.id}`
      )
    : "#";

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
              <div className="flex flex-wrap gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setActiveImg(i);
                      carouselApi?.scrollTo(i);
                    }}
                    className={`flex h-[4.5rem] w-[5.5rem] shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-muted/50 transition-colors ${
                      i === activeImg ? "border-secondary ring-2 ring-secondary/30" : "border-border/60"
                    }`}
                  >
                    <img src={img} alt="" className="max-h-full max-w-full object-contain" loading="lazy" />
                  </button>
                ))}
              </div>

              <div className="bg-card rounded-xl p-6 border border-border/50 mt-6">
                <h3 className="font-heading font-semibold text-lg mb-4">Description</h3>
                <div className="prose prose-sm max-w-none text-foreground/90 dark:prose-invert prose-p:leading-relaxed prose-p:mb-3 last:prose-p:mb-0">
                  <p className="whitespace-pre-wrap text-[15px] leading-relaxed md:text-base">{car.description}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-card rounded-xl p-6 border border-border/50 sticky top-24">
                <div className="flex gap-2 mb-3 flex-wrap">
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
                <h1 className="text-2xl font-heading font-bold text-foreground mb-1">{car.name}</h1>
                <div className="mb-6 space-y-1">
                  {car.marketPrice != null && car.marketPrice > car.price && (
                    <p className="text-lg font-medium tabular-nums text-muted-foreground line-through">
                      Market price {formatPrice(car.marketPrice)}
                    </p>
                  )}
                  <p className="text-3xl font-heading font-bold text-secondary">
                    {formatPrice(car.price)}
                    {car.marketPrice != null && car.marketPrice > car.price && (
                      <span className="ml-2 block text-sm font-semibold text-foreground">Fixed price</span>
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {specs.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-2 text-sm">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="font-medium text-foreground">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Button variant="cta" className="w-full gap-2" onClick={() => setBookingOpen(true)}>
                    <CalendarCheck className="h-4 w-4" />
                    Book Test Drive
                  </Button>
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <a href="tel:+919876543210">
                      <Phone className="h-4 w-4" />
                      Contact Dealer
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full gap-2 text-whatsapp hover:text-whatsapp/80" asChild>
                    <a href={waLink} target="_blank" rel="noreferrer">
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </Button>
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
