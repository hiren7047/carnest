import { Outlet, useParams } from "react-router-dom";
import { DemoProvider } from "@/context/DemoContext";
import { DemoThemeProvider } from "@/components/DemoThemeProvider";
import { DemoAuthProvider } from "@/context/DemoAuthContext";
import { DemoCredentialsBanner } from "@/components/DemoCredentialsBanner";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { FloatingActions } from "@/components/FloatingActions";

export function DemoShell() {
  const { demoSlug } = useParams<{ demoSlug: string }>();
  if (!demoSlug) return null;

  return (
    <DemoProvider slug={demoSlug}>
      <DemoThemeProvider>
        <DemoAuthProvider>
          <DemoCredentialsBanner />
          <Outlet />
          <MobileBottomNav />
          <FloatingActions />
        </DemoAuthProvider>
      </DemoThemeProvider>
    </DemoProvider>
  );
}
