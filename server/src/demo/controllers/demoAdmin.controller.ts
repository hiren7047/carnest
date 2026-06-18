import type { Request, Response } from "express";
import {
  DemoSiteContent,
  TemplateCar,
  DemoSandboxBooking,
  DemoSandboxSellRequest,
  TemplateStaffMember,
  TemplateStaffMonthlyTarget,
  TemplateUser,
} from "../../hub/models/index.js";
import { mergeSiteContent } from "../../lib/mergeSiteContent.js";
import { normalizeSiteContent } from "../../lib/normalizeSiteContent.js";
import { defaultSiteContent } from "../../lib/siteContentDefaults.js";
import { siteContentPartialSchema } from "../../validators/site.js";
import { serializeTemplateCar } from "../lib/serializeTemplateCar.js";

export async function demoAdminStats(req: Request, res: Response): Promise<void> {
  try {
    const demoId = req.demo!.id;
    const [
      totalCars,
      sellPending,
      sellContacted,
      sellClosed,
      bookPending,
      bookConfirmed,
      bookCancelled,
      totalUsers,
      totalStaff,
    ] = await Promise.all([
      TemplateCar.count(),
      DemoSandboxSellRequest.count({ where: { demo_id: demoId, status: "pending" } }),
      DemoSandboxSellRequest.count({ where: { demo_id: demoId, status: "contacted" } }),
      DemoSandboxSellRequest.count({ where: { demo_id: demoId, status: "closed" } }),
      DemoSandboxBooking.count({ where: { demo_id: demoId, status: "pending" } }),
      DemoSandboxBooking.count({ where: { demo_id: demoId, status: "confirmed" } }),
      DemoSandboxBooking.count({ where: { demo_id: demoId, status: "cancelled" } }),
      TemplateUser.count({ where: { role: "user" } }),
      TemplateStaffMember.count({ where: { is_active: true } }),
    ]);

    res.json({
      cars: { total: totalCars },
      sell_requests: {
        pending: sellPending,
        contacted: sellContacted,
        closed: sellClosed,
        total: sellPending + sellContacted + sellClosed,
      },
      bookings: {
        pending: bookPending,
        confirmed: bookConfirmed,
        cancelled: bookCancelled,
        total: bookPending + bookConfirmed + bookCancelled,
      },
      users: { total: totalUsers },
      staff: { total: totalStaff },
      demo_mode: true,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load stats" });
  }
}

export async function getDemoSiteAdmin(req: Request, res: Response): Promise<void> {
  try {
    let row = await DemoSiteContent.findOne({ where: { demo_id: req.demo!.id } });
    if (!row) {
      row = await DemoSiteContent.create({
        demo_id: req.demo!.id,
        content: defaultSiteContent(),
      });
    }
    res.json({ content: normalizeSiteContent(row.content), demo_mode: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load site content" });
  }
}

export async function putDemoSiteAdminMerge(req: Request, res: Response): Promise<void> {
  try {
    const { error, value } = siteContentPartialSchema.validate(req.body?.content ?? req.body);
    if (error) {
      res.status(400).json({ message: error.details[0]?.message ?? "Invalid content" });
      return;
    }
    let row = await DemoSiteContent.findOne({ where: { demo_id: req.demo!.id } });
    const base = normalizeSiteContent(row?.content ?? defaultSiteContent());
    const merged = mergeSiteContent(base, value);
    if (!row) {
      row = await DemoSiteContent.create({
        demo_id: req.demo!.id,
        content: normalizeSiteContent(merged),
      });
    } else {
      await row.update({ content: normalizeSiteContent(merged) });
    }
    res.json({ content: normalizeSiteContent(row.content), demo_mode: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update site content" });
  }
}

export async function listDemoAdminCars(req: Request, res: Response): Promise<void> {
  try {
    const cars = await TemplateCar.findAll({ order: [["id", "DESC"]] });
    res.json({
      data: cars.map(serializeTemplateCar),
      demo_mode: true,
      read_only: true,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to list cars" });
  }
}

function parsePagination(req: Request) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export async function listDemoSellRequests(req: Request, res: Response): Promise<void> {
  try {
    const { page, limit, offset } = parsePagination(req);
    const status = req.query.status as string | undefined;
    const where: Record<string, unknown> = { demo_id: req.demo!.id };
    if (status) where.status = status;
    const { rows, count } = await DemoSandboxSellRequest.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
    res.json({
      data: rows,
      meta: { total: count, page, limit, pages: Math.ceil(count / limit) || 1 },
      demo_mode: true,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to list sell requests" });
  }
}

export async function listDemoBookings(req: Request, res: Response): Promise<void> {
  try {
    const { page, limit, offset } = parsePagination(req);
    const status = req.query.status as string | undefined;
    const where: Record<string, unknown> = { demo_id: req.demo!.id };
    if (status) where.status = status;
    const { rows, count } = await DemoSandboxBooking.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
    res.json({
      data: rows,
      meta: { total: count, page, limit, pages: Math.ceil(count / limit) || 1 },
      demo_mode: true,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to list bookings" });
  }
}

export async function listDemoStaff(_req: Request, res: Response): Promise<void> {
  try {
    const staff = await TemplateStaffMember.findAll({
      order: [["sort_order", "ASC"], ["name", "ASC"]],
    });
    res.json({
      data: staff.map((s) => ({
        id: s.id,
        name: s.name,
        phone: s.phone,
        email: s.email,
        is_active: s.is_active,
        color: s.color,
        sort_order: s.sort_order,
      })),
      demo_mode: true,
      read_only: true,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to list staff" });
  }
}

export async function getDemoStaffPerformance(_req: Request, res: Response): Promise<void> {
  try {
    const staff = await TemplateStaffMember.findAll({ where: { is_active: true } });
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const targets = await TemplateStaffMonthlyTarget.findAll({
      where: { year, month },
    });
    res.json({
      period: { year, month },
      staff: staff.map((s) => {
        const target = targets.find((t) => t.staff_id === s.id);
        return {
          staff: { id: s.id, name: s.name, color: s.color },
          target_cars: target?.target_cars ?? 0,
          target_revenue: target ? Number(target.target_revenue) : 0,
          sold_cars: 0,
          revenue: 0,
        };
      }),
      demo_mode: true,
      read_only: true,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load staff performance" });
  }
}

export async function demoAdminMutationBlocked(_req: Request, res: Response): Promise<void> {
  res.status(403).json({ message: "This action is read-only in demo mode." });
}
