import { Link, useLocation } from "react-router-dom";
import { Home, Car, Tag, User } from "lucide-react";
import { useAppAuth } from "@/context/DemoAuthContext";
import { useAppPath } from "@/hooks/useAppPath";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAppAuth();
  const home = useAppPath("/");
  const cars = useAppPath("/cars");
  const sell = useAppPath("/sell");
  const dashboard = useAppPath("/dashboard");
  const login = useAppPath("/login");

  const links = [
    { to: home, match: (p: string) => p === home || /\/d\/[^/]+\/?$/.test(p), label: "Home", icon: Home },
    { to: cars, match: (p: string) => p.includes("/cars"), label: "Browse", icon: Car },
    { to: sell, match: (p: string) => p.includes("/sell"), label: "Sell", icon: Tag },
    {
      to: user ? dashboard : login,
      match: (p: string) => p.includes("/dashboard") || p.includes("/login"),
      label: "Account",
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border bg-card/95 pb-safe backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="grid grid-cols-4 h-14">
        {links.map(({ to, match, label, icon: Icon }) => {
          const active = match(location.pathname);
          return (
            <Link
              key={label}
              to={to}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                active ? "text-secondary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
