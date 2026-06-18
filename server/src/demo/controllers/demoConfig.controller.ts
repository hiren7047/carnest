import type { Request, Response } from "express";
import {
  DemoBranding,
  DemoSiteContent,
  DemoContact,
} from "../../hub/models/index.js";
import { normalizeSiteContent } from "../../lib/normalizeSiteContent.js";
import { parseDemoTheme } from "../../hub/types/demoTheme.js";
import {
  incrementDemoView,
  DEMO_STATIC_CREDENTIALS,
  demoPublicBaseUrl,
} from "../middlewares/demoContext.js";

export async function getDemoConfig(req: Request, res: Response): Promise<void> {
  try {
    const demo = req.demo!;
    await incrementDemoView(req);

    const [branding, siteContent, contact] = await Promise.all([
      DemoBranding.findOne({ where: { demo_id: demo.id } }),
      DemoSiteContent.findOne({ where: { demo_id: demo.id } }),
      DemoContact.findOne({ where: { demo_id: demo.id } }),
    ]);

    const content = normalizeSiteContent(siteContent?.content);
    res.json({
      demo: {
        id: demo.id,
        slug: demo.slug,
        client_name: demo.client_name,
        public_url: `${demoPublicBaseUrl()}/${demo.slug}`,
      },
      branding: {
        logo_url: branding?.logo_url ?? null,
        favicon_url: branding?.favicon_url ?? null,
        business_name: branding?.business_name ?? demo.client_name,
        theme: parseDemoTheme(branding?.theme_json),
      },
      contact: {
        office_address: contact?.office_address ?? null,
        maps_url: contact?.maps_url ?? null,
        instagram_url: contact?.instagram_url ?? null,
        whatsappNumber: content.contact.whatsappNumber,
        supportEmail: content.contact.supportEmail,
      },
      content,
      credentials: DEMO_STATIC_CREDENTIALS,
      demo_mode: true,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load demo config" });
  }
}

export async function getDemoSitePublic(req: Request, res: Response): Promise<void> {
  try {
    const row = await DemoSiteContent.findOne({ where: { demo_id: req.demo!.id } });
    const content = normalizeSiteContent(row?.content);
    res.json({ content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load site content" });
  }
}
