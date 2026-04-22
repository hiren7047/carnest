import type { Request, Response } from "express";
import { SellRequest } from "../models/index.js";
import { diskUploadUrlFromParts } from "../lib/diskUploadUrls.js";

export async function createSellRequest(req: Request, res: Response): Promise<void> {
  try {
    const { name, phone, car_details } = req.body as {
      name: string;
      phone: string;
      car_details: string;
    };
    const files = req.files as Express.Multer.File[] | undefined;
    const urls: string[] = [];
    if (files?.length) {
      for (const f of files) {
        urls.push(diskUploadUrlFromParts(f.filename));
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
