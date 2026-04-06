import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchWishlist } from "@/services/wishlist.service";
import { fetchUserBookings } from "@/services/bookings.service";
import { mapApiCarToView } from "@/types/car";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/formatPrice";

const Dashboard = () => {
  const { data: wishlist, isLoading: wlLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
  });
  const { data: bookings, isLoading: bkLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchUserBookings,
  });

  const saved = (wishlist ?? []).map(mapApiCarToView);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container pt-24 pb-16">
        <h1 className="text-3xl font-heading font-bold mb-8">Your Dashboard</h1>
        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="saved">Saved cars</TabsTrigger>
            <TabsTrigger value="bookings">Test drives</TabsTrigger>
          </TabsList>
          <TabsContent value="saved">
            {wlLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[340px] rounded-xl" />
                ))}
              </div>
            ) : saved.length === 0 ? (
              <p className="text-muted-foreground">
                No saved cars yet.{" "}
                <Link to="/cars" className="text-secondary underline">
                  Browse listings
                </Link>
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {saved.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="bookings">
            {bkLoading ? (
              <Skeleton className="h-40 rounded-xl" />
            ) : !bookings?.length ? (
              <p className="text-muted-foreground">No test drive bookings yet.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-card border border-border/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-heading font-semibold">{b.car?.title ?? `Car #${b.car_id}`}</p>
                      <p className="text-sm text-muted-foreground">
                        {String(b.date).slice(0, 10)} ·{" "}
                        {b.car?.price != null ? formatPrice(Number(b.car.price)) : ""}
                      </p>
                    </div>
                    <Badge variant="secondary">{b.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
