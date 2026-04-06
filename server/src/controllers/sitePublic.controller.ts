import type { Request, Response } from "express";
import { SiteSettings } from "../models/index.js";
import type { SiteContent } from "../types/siteContent.js";
import { defaultSiteContent } from "../lib/siteContentDefaults.js";

/** Public homepage payload (no admin notes). */
export async function getSitePublic(_req: Request, res: Response): Promise<void> {
  try {
    const row = await SiteSettings.findByPk(1);
    const content = (row?.content as SiteContent | undefined) ?? defaultSiteContent();
    res.json({ content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load site content" });
  }
}
