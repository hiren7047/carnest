import type { Request, Response } from "express";
import { Op } from "sequelize";
import {
  Demo,
  DemoBranding,
  DemoSiteContent,
  DemoContact,
  demoHubSequelize,
} from "../models/index.js";
import { defaultSiteContent } from "../../lib/siteContentDefaults.js";
import { mergeSiteContent } from "../../lib/mergeSiteContent.js";
import { normalizeSiteContent } from "../../lib/normalizeSiteContent.js";
import { defaultDemoTheme } from "../types/demoTheme.js";
import { generateUniqueDemoSlug } from "../lib/slugify.js";
import {
  demoPublicBaseUrl,
  DEMO_STATIC_CREDENTIALS,
} from "../../demo/middlewares/demoContext.js";
import type { SiteContent } from "../../types/siteContent.js";
import type { DemoThemeJson } from "../types/demoTheme.js";

type CreateDemoBody = {
  client_name: string;
  client_notes?: string;
  expires_at?: string | null;
  branding?: {
    logo_url?: string | null;
    favicon_url?: string | null;
    business_name?: string | null;
    theme_json?: DemoThemeJson;
  };
  contact?: {
    office_address?: string | null;
    maps_url?: string | null;
    instagram_url?: string | null;
  };
  site_content?: Partial<SiteContent>;
};

function buildPublicUrl(slug: string): string {
  return `${demoPublicBaseUrl()}/${slug}`;
}

function demoListItem(demo: Demo) {
  return {
    id: demo.id,
    slug: demo.slug,
    client_name: demo.client_name,
    client_notes: demo.client_notes,
    status: demo.status,
    expires_at: demo.expires_at,
    view_count: demo.view_count,
    public_url: buildPublicUrl(demo.slug),
    credentials: DEMO_STATIC_CREDENTIALS,
    createdAt: demo.createdAt,
    updatedAt: demo.updatedAt,
  };
}

export async function listDemos(_req: Request, res: Response): Promise<void> {
  try {
    const demos = await Demo.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        { model: DemoBranding, as: "branding" },
        { model: DemoSiteContent, as: "siteContent" },
        { model: DemoContact, as: "contactInfo" },
      ],
    });
    res.json({ data: demos.map(demoListItem) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to list demos" });
  }
}

export async function getDemo(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid demo id" });
      return;
    }
    const demo = await Demo.findByPk(id, {
      include: [
        { model: DemoBranding, as: "branding" },
        { model: DemoSiteContent, as: "siteContent" },
        { model: DemoContact, as: "contactInfo" },
      ],
    });
    if (!demo) {
      res.status(404).json({ message: "Demo not found" });
      return;
    }
    res.json({
      ...demoListItem(demo),
      branding: demo.get("branding") as DemoBranding | null,
      site_content: (demo.get("siteContent") as DemoSiteContent | null)?.content,
      contact: demo.get("contactInfo") as DemoContact | null,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load demo" });
  }
}

export async function createDemo(req: Request, res: Response): Promise<void> {
  const t = await demoHubSequelize.transaction();
  try {
    const body = req.body as CreateDemoBody;
    const clientName = body.client_name?.trim();
    if (!clientName) {
      res.status(400).json({ message: "client_name is required" });
      return;
    }

    const slug = await generateUniqueDemoSlug(clientName);
    const baseContent = defaultSiteContent();
    const mergedContent = body.site_content
      ? mergeSiteContent(baseContent, body.site_content)
      : baseContent;

    const demo = await Demo.create(
      {
        slug,
        client_name: clientName,
        client_notes: body.client_notes?.trim() || null,
        status: "active",
        expires_at: body.expires_at ? new Date(body.expires_at) : null,
      },
      { transaction: t }
    );

    const branding = body.branding ?? {};
    await DemoBranding.create(
      {
        demo_id: demo.id,
        logo_url: branding.logo_url ?? null,
        favicon_url: branding.favicon_url ?? null,
        business_name: branding.business_name ?? clientName,
        theme_json: branding.theme_json ?? defaultDemoTheme(),
      },
      { transaction: t }
    );

    await DemoSiteContent.create(
      { demo_id: demo.id, content: normalizeSiteContent(mergedContent) },
      { transaction: t }
    );

    const contact = body.contact ?? {};
    await DemoContact.create(
      {
        demo_id: demo.id,
        office_address:
          contact.office_address ??
          "Shiv Ashirwad Compound, Between Polaris and Param Hospital, BRTS Canal Road, Varachha, Surat.",
        maps_url: contact.maps_url ?? "https://maps.app.goo.gl/P1Tg8eKr2X2Y6My5A",
        instagram_url: contact.instagram_url ?? "https://instagram.com/carnest_surat",
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({
      ...demoListItem(demo),
      slug,
      public_url: buildPublicUrl(slug),
      credentials: DEMO_STATIC_CREDENTIALS,
    });
  } catch (e) {
    await t.rollback();
    console.error(e);
    res.status(500).json({ message: "Failed to create demo" });
  }
}

export async function updateDemo(req: Request, res: Response): Promise<void> {
  const t = await demoHubSequelize.transaction();
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid demo id" });
      return;
    }
    const demo = await Demo.findByPk(id);
    if (!demo) {
      res.status(404).json({ message: "Demo not found" });
      return;
    }

    const body = req.body as CreateDemoBody & { status?: "active" | "archived" };

    if (body.client_name?.trim()) {
      await demo.update({ client_name: body.client_name.trim() }, { transaction: t });
    }
    if (body.client_notes !== undefined) {
      await demo.update({ client_notes: body.client_notes?.trim() || null }, { transaction: t });
    }
    if (body.expires_at !== undefined) {
      await demo.update(
        { expires_at: body.expires_at ? new Date(body.expires_at) : null },
        { transaction: t }
      );
    }
    if (body.status) {
      await demo.update({ status: body.status }, { transaction: t });
    }

    if (body.branding) {
      const branding = await DemoBranding.findOne({ where: { demo_id: demo.id } });
      if (branding) {
        await branding.update(
          {
            logo_url: body.branding.logo_url ?? branding.logo_url,
            favicon_url: body.branding.favicon_url ?? branding.favicon_url,
            business_name: body.branding.business_name ?? branding.business_name,
            theme_json: body.branding.theme_json ?? branding.theme_json,
          },
          { transaction: t }
        );
      }
    }

    if (body.site_content) {
      const siteRow = await DemoSiteContent.findOne({ where: { demo_id: demo.id } });
      if (siteRow) {
        const merged = mergeSiteContent(siteRow.content, body.site_content);
        await siteRow.update({ content: normalizeSiteContent(merged) }, { transaction: t });
      }
    }

    if (body.contact) {
      const contactRow = await DemoContact.findOne({ where: { demo_id: demo.id } });
      if (contactRow) {
        await contactRow.update(
          {
            office_address: body.contact.office_address ?? contactRow.office_address,
            maps_url: body.contact.maps_url ?? contactRow.maps_url,
            instagram_url: body.contact.instagram_url ?? contactRow.instagram_url,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();
    const updated = await Demo.findByPk(demo.id, {
      include: [
        { model: DemoBranding, as: "branding" },
        { model: DemoSiteContent, as: "siteContent" },
        { model: DemoContact, as: "contactInfo" },
      ],
    });
    res.json({
      ...demoListItem(updated!),
      branding: updated!.get("branding") as DemoBranding | null,
      site_content: (updated!.get("siteContent") as DemoSiteContent | null)?.content,
      contact: updated!.get("contactInfo") as DemoContact | null,
    });
  } catch (e) {
    await t.rollback();
    console.error(e);
    res.status(500).json({ message: "Failed to update demo" });
  }
}

export async function archiveDemo(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid demo id" });
      return;
    }
    const demo = await Demo.findByPk(id);
    if (!demo) {
      res.status(404).json({ message: "Demo not found" });
      return;
    }
    await demo.update({ status: "archived" });
    res.json({ message: "Demo archived", id: demo.id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to archive demo" });
  }
}

export async function uploadDemoLogo(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid demo id" });
      return;
    }
    const demo = await Demo.findByPk(id);
    if (!demo) {
      res.status(404).json({ message: "Demo not found" });
      return;
    }
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      res.status(400).json({ message: "Logo file required" });
      return;
    }
    const base = process.env.PUBLIC_BASE_URL ?? "http://localhost:4000";
    const url = `${base}/uploads/${file.filename}`;
    const branding = await DemoBranding.findOne({ where: { demo_id: demo.id } });
    if (!branding) {
      res.status(404).json({ message: "Demo branding not found" });
      return;
    }
    await branding.update({ logo_url: url });
    res.json({ logo_url: url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Logo upload failed" });
  }
}

export async function searchDemos(req: Request, res: Response): Promise<void> {
  try {
    const q = String(req.query.q ?? "").trim();
    const where = q
      ? {
          [Op.or]: [
            { client_name: { [Op.like]: `%${q}%` } },
            { slug: { [Op.like]: `%${q}%` } },
          ],
        }
      : {};
    const demos = await Demo.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json({ data: demos.map(demoListItem) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Search failed" });
  }
}
