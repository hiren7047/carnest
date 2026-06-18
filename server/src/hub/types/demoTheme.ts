/** HSL components matching client CSS variables (without hsl() wrapper). */
export type DemoThemeJson = {
  primary: string;
  secondary: string;
  accent: string;
};

export const defaultDemoTheme = (): DemoThemeJson => ({
  primary: "222 47% 11%",
  secondary: "24 95% 53%",
  accent: "40 50% 62%",
});

function parseHslParts(hsl: string): [number, number, number] | null {
  const m = hsl.trim().match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

/** CTAs need visible color — very muted secondaries look “all white” on the site. */
function ensureReadableSecondary(theme: DemoThemeJson): DemoThemeJson {
  const parts = parseHslParts(theme.secondary);
  if (!parts) return theme;
  const [, sat, light] = parts;
  if (sat < 30 || light < 38) {
    const accentParts = parseHslParts(theme.accent);
    if (accentParts && accentParts[1] >= 30) {
      return { ...theme, secondary: theme.accent };
    }
    return { ...theme, secondary: defaultDemoTheme().secondary };
  }
  return theme;
}

/** MariaDB/Sequelize may return JSON columns as strings — normalize before API response. */
export function parseDemoTheme(raw: unknown): DemoThemeJson {
  const defaults = defaultDemoTheme();
  let value: unknown = raw;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value) as unknown;
    } catch {
      return defaults;
    }
  }
  if (!value || typeof value !== "object") return defaults;
  const o = value as Record<string, unknown>;
  const theme: DemoThemeJson = {
    primary: typeof o.primary === "string" ? o.primary : defaults.primary,
    secondary: typeof o.secondary === "string" ? o.secondary : defaults.secondary,
    accent: typeof o.accent === "string" ? o.accent : defaults.accent,
  };
  return ensureReadableSecondary(theme);
}
