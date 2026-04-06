import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAdminStats } from "@/services/admin.service";
import { Car, CalendarRange, Inbox, Users } from "lucide-react";

const AdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: fetchAdminStats,
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const cards: {
    title: string;
    value: number;
    sub?: string;
    icon: typeof Car;
    href?: string;
  }[] = [
    {
      title: "Cars listed",
      value: data.cars.total,
      icon: Car,
      href: "/admin/cars",
    },
    {
      title: "Sell inquiries",
      value: data.sell_requests.total,
      sub: `${data.sell_requests.pending} pending`,
      icon: Inbox,
      href: "/admin/sell-inquiries",
    },
    {
      title: "Test drives",
      value: data.bookings.total,
      sub: `${data.bookings.pending} pending`,
      icon: CalendarRange,
      href: "/admin/bookings",
    },
    {
      title: "Users",
      value: data.users.total,
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your Carnest marketplace</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ title, value, sub, icon: Icon, href }) => {
          const inner = (
            <Card
              className={
                href ? "hover:border-secondary/50 transition-colors h-full" : "h-full"
              }
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
              </CardContent>
            </Card>
          );
          return href ? (
            <Link key={title} to={href}>
              {inner}
            </Link>
          ) : (
            <div key={title}>{inner}</div>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sell inquiries by status</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>Pending: {data.sell_requests.pending}</p>
            <p>Contacted: {data.sell_requests.contacted}</p>
            <p>Closed: {data.sell_requests.closed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bookings by status</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>Pending: {data.bookings.pending}</p>
            <p>Confirmed: {data.bookings.confirmed}</p>
            <p>Cancelled: {data.bookings.cancelled}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
