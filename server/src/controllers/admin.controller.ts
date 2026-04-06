import type { Request, Response } from "express";
import {
  Car,
  Booking,
  SellRequest,
  User,
  SiteSettings,
} from "../models/index.js";
import type { SiteContent } from "../types/siteContent.js";
import { defaultSiteContent } from "../lib/siteContentDefaults.js";
import { mergeSiteContent } from "../lib/mergeSiteContent.js";
import { siteContentPartialSchema } from "../validators/site.js";

async function getOrCreateSiteRow() {
  let row = await SiteSettings.findByPk(1);
  if (!row) {
    row = await SiteSettings.create({
      id: 1,
      content: defaultSiteContent(),
    });
  }
  return row;
}

export async function adminStats(_req: Request, res: Response): Promise<void> {
  try {
    const [
      totalCars,
      sellPending,
      sellContacted,
      sellClosed,
      bookPending,
      bookConfirmed,
      bookCancelled,
      totalUsers,
    ] = await Promise.all([
      Car.count(),
      SellRequest.count({ where: { status: "pending" } }),
      SellRequest.count({ where: { status: "contacted" } }),
      SellRequest.count({ where: { status: "closed" } }),
      Booking.count({ where: { status: "pending" } }),
      Booking.count({ where: { status: "confirmed" } }),
      Booking.count({ where: { status: "cancelled" } }),
      User.count({ where: { role: "user" } }),
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
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load stats" });
  }
}

function parsePagination(req: Request) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export async function listSellRequestsAdmin(req: Request, res: Response): Promise<void> {
  try {
    const { page, limit, offset } = parsePagination(req);
    const status = req.query.status as string | undefined;
    const where =
      status && ["pending", "contacted", "closed"].includes(status)
        ? { status: status as "pending" | "contacted" | "closed" }
        : {};

    const { rows, count } = await SellRequest.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.json({
      data: rows.map((r) => ({
        id: r.id,
        name: r.name,
        phone: r.phone,
        car_details: r.car_details,
        images: r.images,
        status: r.status,
        admin_notes: r.admin_notes,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
      total: count,
      page,
      limit,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to list sell requests" });
  }
}

export async function patchSellRequestAdmin(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }
    const row = await SellRequest.findByPk(id);
    if (!row) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    const { status, admin_notes } = req.body as { status?: string; admin_notes?: string | null };
    if (status !== undefined) row.status = status as typeof row.status;
    if (admin_notes !== undefined) row.admin_notes = admin_notes;
    await row.save();
    res.json({
      id: row.id,
      name: row.name,
      phone: row.phone,
      car_details: row.car_details,
      images: row.images,
      status: row.status,
      admin_notes: row.admin_notes,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update sell request" });
  }
}

export async function listBookingsAdmin(req: Request, res: Response): Promise<void> {
  try {
    const { page, limit, offset } = parsePagination(req);
    const status = req.query.status as string | undefined;
    const where =
      status && ["pending", "confirmed", "cancelled"].includes(status)
        ? { status: status as "pending" | "confirmed" | "cancelled" }
        : {};

    const { rows, count } = await Booking.findAndCountAll({
      where,
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
        {
          model: Car,
          as: "car",
          attributes: ["id", "title", "brand", "price", "images"],
        },
      ],
      order: [["date", "DESC"]],
      limit,
      offset,
    });

    res.json({
      data: rows.map((b) => {
        const row = b as typeof b & { user?: User; car?: Car };
        const u = row.user;
        const c = row.car;
        return {
          id: b.id,
          user_id: b.user_id,
          car_id: b.car_id,
          date: b.date,
          status: b.status,
          createdAt: b.createdAt,
          user: u ? { id: u.id, name: u.name, email: u.email } : undefined,
          car: c
            ? {
                id: c.id,
                title: c.title,
                brand: c.brand,
                price: Number(c.price),
                images: c.images,
              }
            : undefined,
        };
      }),
      total: count,
      page,
      limit,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to list bookings" });
  }
}

export async function patchBookingAdmin(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }
    const found = await Booking.findByPk(id, {
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
        { model: Car, as: "car", attributes: ["id", "title", "brand", "price", "images"] },
      ],
    });
    if (!found) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    const row = found as typeof found & { user?: User; car?: Car };
    const { status } = req.body as { status: string };
    row.status = status as typeof row.status;
    await row.save();
    const u = row.user;
    const c = row.car;
    res.json({
      id: row.id,
      user_id: row.user_id,
      car_id: row.car_id,
      date: row.date,
      status: row.status,
      createdAt: row.createdAt,
      user: u ? { id: u.id, name: u.name, email: u.email } : undefined,
      car: c
        ? {
            id: c.id,
            title: c.title,
            brand: c.brand,
            price: Number(c.price),
            images: c.images,
          }
        : undefined,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update booking" });
  }
}

export async function getSiteAdmin(_req: Request, res: Response): Promise<void> {
  try {
    const row = await getOrCreateSiteRow();
    res.json({ id: row.id, content: row.content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load site settings" });
  }
}

export async function putSiteAdmin(req: Request, res: Response): Promise<void> {
  try {
    const { content } = req.body as { content: Record<string, unknown> };
    const { error } = siteContentPartialSchema.validate(content, { abortEarly: false });
    if (error) {
      res.status(400).json({
        message: "Validation failed",
        details: error.details.map((d) => d.message),
      });
      return;
    }
    const row = await getOrCreateSiteRow();
    const base = row.content as SiteContent;
    let merged: SiteContent;
    try {
      merged = mergeSiteContent(base, content as Partial<SiteContent>);
    } catch (err) {
      res.status(400).json({
        message: err instanceof Error ? err.message : "Invalid content after merge",
      });
      return;
    }
    row.content = merged;
    await row.save();
    res.json({ id: row.id, content: row.content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to save site settings" });
  }
}
