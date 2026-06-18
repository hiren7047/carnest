import { Link } from "react-router-dom";
import { ChevronDown, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAppAuth } from "@/context/DemoAuthContext";
import { useAppPath } from "@/hooks/useAppPath";
import { appPath } from "@/lib/demoMode";
import { useDemo } from "@/context/DemoContext";
import { useTheme } from "next-themes";
import { MobileNavDrawer } from "@/components/MobileNavDrawer";
import { primaryNavItems } from "@/config/nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BrandLogo } from "@/components/BrandLogo";

const pinnedPaths = new Set(["/", "/cars", "/sell", "/contact"]);
const exploreItems = primaryNavItems.filter((p) => !pinnedPaths.has(p.to));

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAppAuth();
  const { theme, setTheme } = useTheme();
  const home = useAppPath("/");
  const cars = useAppPath("/cars");
  const sell = useAppPath("/sell");
  const contact = useAppPath("/contact");
  const admin = useAppPath("/admin");
  const login = useAppPath("/login");
  const dashboard = useAppPath("/dashboard");
  const register = useAppPath("/register");
  const demo = useDemo();
  const pathFor = (p: string) => appPath(demo?.slug ?? null, p);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <BrandLogo imageClassName="h-9" />

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              to={home}
              className="text-sm font-medium text-foreground/80 hover:text-secondary transition-colors"
            >
              Home
            </Link>
            <Link
              to={cars}
              className="text-sm font-medium text-foreground/80 hover:text-secondary transition-colors"
            >
              Car Stock
            </Link>
            <Link
              to={sell}
              className="text-sm font-medium text-foreground/80 hover:text-secondary transition-colors"
            >
              Sell Your Car
            </Link>
            <Link
              to={contact}
              className="text-sm font-medium text-foreground/80 hover:text-secondary transition-colors"
            >
              Contact
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-secondary outline-none">
                Explore
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 max-h-[min(70vh,24rem)] overflow-y-auto">
                {exploreItems.map(({ to, label }) => (
                  <DropdownMenuItem key={to} asChild>
                    <Link to={pathFor(to)}>{label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {user?.role === "admin" && (
              <Link
                to={admin}
                className="text-sm font-medium text-foreground/80 hover:text-secondary transition-colors"
              >
                Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute inset-0 m-auto h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={dashboard}>Dashboard</Link>
                </Button>
                <Button variant="outline" size="sm" onClick={logout}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={login}>Sign In</Link>
                </Button>
                <Button variant="cta" size="sm" asChild>
                  <Link to={register}>Join</Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute inset-0 m-auto h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      <MobileNavDrawer open={mobileOpen} onOpenChange={setMobileOpen} />
    </>
  );
};

export default Navbar;
