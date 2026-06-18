import type { DemoTheme } from "@/context/DemoContext";

const DEFAULT_THEME: DemoTheme = {
  primary: "222 47% 11%",
  secondary: "24 95% 53%",
  accent: "40 50% 62%",
};

function parseHslParts(hsl: string): [number, number, number] | null {
  const m = hsl.trim().match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function ensureReadableSecondary(theme: DemoTheme): DemoTheme {
  const parts = parseHslParts(theme.secondary);
  if (!parts) return theme;
  const [, sat, light] = parts;
  if (sat < 30 || light < 38) {
    const accentParts = parseHslParts(theme.accent);
    if (accentParts && accentParts[1] >= 30) {
      return { ...theme, secondary: theme.accent };
    }
    return { ...theme, secondary: DEFAULT_THEME.secondary };
  }
  return theme;
}

export function parseDemoTheme(raw: unknown): DemoTheme {
  let value: unknown = raw;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value) as unknown;
    } catch {
      return DEFAULT_THEME;
    }
  }
  if (!value || typeof value !== "object") return DEFAULT_THEME;
  const o = value as Record<string, unknown>;
  const theme: DemoTheme = {
    primary: typeof o.primary === "string" ? o.primary : DEFAULT_THEME.primary,
    secondary: typeof o.secondary === "string" ? o.secondary : DEFAULT_THEME.secondary,
    accent: typeof o.accent === "string" ? o.accent : DEFAULT_THEME.accent,
  };
  return ensureReadableSecondary(theme);
}

export function foregroundForHsl(hsl: string): string {
  const parts = parseHslParts(hsl);
  if (!parts) return "0 0% 100%";
  return parts[2] > 55 ? "222 47% 11%" : "0 0% 100%";
}
