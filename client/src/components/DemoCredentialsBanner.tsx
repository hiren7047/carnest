import { useState } from "react";
import { X } from "lucide-react";
import { useDemoRequired } from "@/context/DemoContext";

export function DemoCredentialsBanner() {
  const demo = useDemoRequired();
  const [open, setOpen] = useState(true);
  if (!open) return null;

  const { admin, buyer } = demo.credentials;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[60] bg-card border border-border shadow-lg rounded-xl p-4 text-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-semibold text-foreground">Demo login credentials</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-1 text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">Admin:</span> {admin.email} / {admin.password}
        </p>
        <p>
          <span className="font-medium text-foreground">Buyer:</span> {buyer.email} / {buyer.password}
        </p>
      </div>
    </div>
  );
}
