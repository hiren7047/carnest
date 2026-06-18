import type { Request, Response } from "express";
import { DemoSandboxContactInquiry } from "../../hub/models/DemoSandboxContactInquiry.js";
import { DemoSandboxSellRequest } from "../../hub/models/DemoSandboxSellRequest.js";
import { DemoSandboxBooking } from "../../hub/models/DemoSandboxBooking.js";

export async function submitDemoContact(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, phone, message } = req.body as {
      name: string;
      email: string;
      phone?: string;
      message: string;
    };
    await DemoSandboxContactInquiry.create({
      demo_id: req.demo!.id,
      name,
      email,
      phone: phone ?? null,
      message,
    });
    res.status(201).json({
      message: "Thank you! Your message has been received (demo mode).",
      demo_mode: true,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to submit contact form" });
  }
}

export async function submitDemoSell(req: Request, res: Response): Promise<void> {
  try {
    const { name, phone, car_details, images } = req.body as {
      name: string;
      phone: string;
      car_details: string;
      images?: string[];
    };
    const row = await DemoSandboxSellRequest.create({
      demo_id: req.demo!.id,
      name,
      phone,
      car_details,
      images: images ?? [],
      status: "pending",
    });
    res.status(201).json({ id: row.id, message: "Sell request submitted (demo mode).", demo_mode: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to submit sell request" });
  }
}

export async function createDemoBooking(req: Request, res: Response): Promise<void> {
  try {
    if (!req.demoUser) {
      res.status(401).json({ message: "Login required for test drive booking" });
      return;
    }
    const { car_id, date } = req.body as { car_id: number; date: string };
    const row = await DemoSandboxBooking.create({
      demo_id: req.demo!.id,
      user_id: req.demoUser.id,
      car_id,
      date,
      status: "pending",
    });
    res.status(201).json({ booking: row, demo_mode: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to create booking" });
  }
}

export async function patchDemoSellRequest(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const row = await DemoSandboxSellRequest.findOne({
      where: { id, demo_id: req.demo!.id },
    });
    if (!row) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    const { status, admin_notes } = req.body as { status?: string; admin_notes?: string };
    if (status) row.status = status as "pending" | "contacted" | "closed";
    if (admin_notes !== undefined) row.admin_notes = admin_notes;
    await row.save();
    res.json({ data: row, demo_mode: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update sell request" });
  }
}

export async function patchDemoBooking(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const row = await DemoSandboxBooking.findOne({
      where: { id, demo_id: req.demo!.id },
    });
    if (!row) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    const { status } = req.body as { status?: string };
    if (status) row.status = status as "pending" | "confirmed" | "cancelled";
    await row.save();
    res.json({ data: row, demo_mode: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update booking" });
  }
}
