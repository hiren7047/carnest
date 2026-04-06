import { Link } from "react-router-dom";
import { Car, X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { primaryNavItems } from "@/config/nav";
import { useAuth } from "@/context/AuthContext";

type MobileNavDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileNavDrawer({ open, onOpenChange }: MobileNavDrawerProps) {
  const { user, logout } = useAuth();

  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[min(100%,20rem)] border-zinc-800 bg-zinc-950 p-0 text-zinc-50 [&>button.absolute]:hidden flex flex-col"
      >
        <SheetTitle className="sr-only">Main navigation</SheetTitle>
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4">
          <Link to="/" className="flex items-center gap-2" onClick={close}>
            <Car className="h-7 w-7 text-secondary" />
            <span className="text-xl font-heading font-bold italic text-secondary">
              Car<span className="text-zinc-100 not-italic font-bold">nest</span>
            </span>
          </Link>
          <SheetClose asChild>
            <button
              type="button"
              className="rounded-sm p-2 text-zinc-100 hover:bg-zinc-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </SheetClose>
        </div>

        <nav className="flex-1 overflow-y-auto py-2" aria-label="Primary">
          {primaryNavItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={close}
              className="flex items-center gap-3 border-b border-zinc-800/80 px-4 py-3.5 text-sm font-medium text-zinc-100 hover:bg-zinc-900 transition-colors"
            >
              <Icon className="h-5 w-5 shrink-0 text-zinc-200" aria-hidden />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-zinc-800 p-4 space-y-2 bg-zinc-950">
          {user?.role === "admin" && (
            <Button variant="outline" className="w-full border-zinc-700 text-zinc-100 hover:bg-zinc-900" asChild>
              <Link to="/admin" onClick={close}>
                Admin
              </Link>
            </Button>
          )}
          {user ? (
            <>
              <Button variant="outline" className="w-full border-zinc-700 text-zinc-100 hover:bg-zinc-900" asChild>
                <Link to="/dashboard" onClick={close}>
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => {
                  logout();
                  close();
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="w-full border-zinc-700 text-zinc-100 hover:bg-zinc-900" asChild>
                <Link to="/login" onClick={close}>
                  Sign In
                </Link>
              </Button>
              <Button variant="cta" className="w-full" asChild>
                <Link to="/register" onClick={close}>
                  Join
                </Link>
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
