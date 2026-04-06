import { Link, useLocation } from "react-router-dom";
import { Home, Car, Tag, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/cars", label: "Browse", icon: Car },
  { to: "/sell", label: "Sell", icon: Tag },
  { to: "/dashboard", label: "Account", icon: User },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border bg-card/95 pb-safe backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="grid grid-cols-4 h-14">
        {links.map(({ to, label, icon: Icon }) => {
          const href = to === "/dashboard" && !user ? "/login" : to;
          const active =
            to === "/"
              ? location.pathname === "/"
              : to === "/dashboard"
                ? ["/dashboard", "/login", "/register"].some((p) => location.pathname.startsWith(p))
                : location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={href}
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
