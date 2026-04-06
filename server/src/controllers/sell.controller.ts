import type { Request, Response } from "express";
import { SellRequest } from "../models/index.js";

export async function createSellRequest(req: Request, res: Response): Promise<void> {
  try {
    const { name, phone, car_details } = req.body as {
      name: string;
      phone: string;
      car_details: string;
    };
    const files = req.files as Express.Multer.File[] | undefined;
    const publicBase = process.env.PUBLIC_BASE_URL ?? `http://localhost:${process.env.PORT ?? 4000}`;
    const urls: string[] = [];
    if (files?.length) {
      for (const f of files) {
        urls.push(`${publicBase}/uploads/${f.filename}`);
      }
    }
    const row = await SellRequest.create({
      name,
      phone,
      car_details,
      images: urls,
      status: "pending",
    });
    res.status(201).json({
      id: row.id,
      message: "Request submitted successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to submit request" });
  }
}
