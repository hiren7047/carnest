import { useEffect, type ReactNode } from "react";
import { useDemoRequired } from "@/context/DemoContext";
import { foregroundForHsl, parseDemoTheme } from "@/lib/parseDemoTheme";

export function DemoThemeProvider({ children }: { children: ReactNode }) {
  const { branding } = useDemoRequired();
  const theme = parseDemoTheme(branding.theme);

  useEffect(() => {
    const styleId = "demo-theme-overrides";
    let el = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = styleId;
      document.head.appendChild(el);
    }

    const primaryFg = foregroundForHsl(theme.primary);
    const secondaryFg = foregroundForHsl(theme.secondary);
    const accentFg = foregroundForHsl(theme.accent);

    el.textContent = `
      :root {
        --primary: ${theme.primary};
        --primary-foreground: ${primaryFg};
        --secondary: ${theme.secondary};
        --secondary-foreground: ${secondaryFg};
        --accent: ${theme.accent};
        --accent-foreground: ${accentFg};
        --ring: ${theme.secondary};
        --gold: ${theme.accent};
        --navy: ${theme.primary};
        --orange: ${theme.secondary};
        --sidebar-background: ${theme.primary};
        --sidebar-foreground: ${primaryFg};
        --sidebar-primary: ${theme.secondary};
        --sidebar-primary-foreground: ${secondaryFg};
        --sidebar-accent: ${theme.primary};
        --sidebar-accent-foreground: ${primaryFg};
        --sidebar-border: ${theme.primary};
        --sidebar-ring: ${theme.secondary};
      }
    `;
    return () => {
      el?.remove();
    };
  }, [theme.primary, theme.secondary, theme.accent]);

  return <>{children}</>;
}
