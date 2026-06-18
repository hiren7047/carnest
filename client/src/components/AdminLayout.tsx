import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAppAuth } from "@/context/DemoAuthContext";
import { useAppPath } from "@/hooks/useAppPath";
import { useDemo } from "@/context/DemoContext";
import { appPath } from "@/lib/demoMode";
import { useTheme } from "next-themes";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  CalendarRange,
  Car,
  Home,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  Moon,
  Settings,
  Star,
  Sun,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin", label: "Dashboard", end: true, icon: LayoutDashboard },
  { to: "/admin/cars", label: "Cars", end: false, icon: Car },
  { to: "/admin/sell-inquiries", label: "Sell inquiries", end: false, icon: Inbox },
  { to: "/admin/bookings", label: "Test drives", end: false, icon: CalendarRange },
  { to: "/admin/homepage", label: "Homepage", end: false, icon: Home },
  { to: "/admin/gallery", label: "Gallery", end: false, icon: ImageIcon },
  { to: "/admin/reviews", label: "Reviews", end: false, icon: Star },
  { to: "/admin/staff", label: "Staff & sales", end: false, icon: Users },
  { to: "/admin/settings", label: "Settings", end: false, icon: Settings },
];

function NavItem({
  to,
  label,
  end,
  icon: Icon,
}: {
  to: string;
  label: string;
  end?: boolean;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const { pathname } = useLocation();
  const active = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} tooltip={label}>
        <NavLink to={to} end={end}>
          <Icon className="shrink-0" />
          <span>{label}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

const AdminLayout = () => {
  const { user, logout } = useAppAuth();
  const { theme, setTheme } = useTheme();
  const demo = useDemo();
  const home = useAppPath("/");
  const adminTitle = demo?.branding.business_name
    ? `${demo.branding.business_name} Admin`
    : "Carnest Admin";
  const navWithPaths = nav.map((item) => ({
    ...item,
    to: appPath(demo?.slug ?? null, item.to),
  }));

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader className="border-b border-sidebar-border">
          <Link
            to={home}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-heading font-bold text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {demo?.branding.logo_url ? (
              <img src={demo.branding.logo_url} alt="" className="h-6 w-auto object-contain" />
            ) : (
              <Car className="h-6 w-6 text-secondary" />
            )}
            <span className="font-heading">{adminTitle}</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navWithPaths.map((item) => (
                  <NavItem key={item.to} {...item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border">
          <Link
            to={home}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-sidebar-foreground"
            )}
          >
            ← Back to site
          </Link>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline truncate max-w-[220px]">
              {user?.name}
            </span>
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
            <Button variant="outline" size="sm" onClick={logout}>
              Log out
            </Button>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {demo && (
            <div className="mb-4 rounded-lg border border-secondary/30 bg-secondary/5 px-4 py-2 text-sm text-muted-foreground">
              Demo mode — car inventory is sample data (read-only). CMS changes save for this demo only.
            </div>
          )}
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
