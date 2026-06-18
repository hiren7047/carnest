import { Demo } from "../models/Demo.js";

export function slugifyClientName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export async function generateUniqueDemoSlug(clientName: string): Promise<string> {
  const base = slugifyClientName(clientName) || "demo";
  let slug = base;
  let n = 0;
  while (await Demo.findOne({ where: { slug } })) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}
