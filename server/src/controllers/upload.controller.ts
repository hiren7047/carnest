import fs from "fs/promises";
import type { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { isCloudinaryConfigured, configureCloudinary } from "../config/cloudinary.js";
import { diskUploadUrlFromParts } from "../lib/diskUploadUrls.js";

export async function uploadFiles(req: Request, res: Response): Promise<void> {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files?.length) {
      res.status(400).json({ message: "No files uploaded" });
      return;
    }
    const urls: string[] = [];

    if (isCloudinaryConfigured()) {
      configureCloudinary();
      for (const f of files) {
        const result = await cloudinary.uploader.upload(f.path, { folder: "carnest" });
        urls.push(result.secure_url);
        await fs.unlink(f.path).catch(() => {});
      }
    } else {
      for (const f of files) {
        urls.push(diskUploadUrlFromParts(f.filename));
      }
    }

    res.json({ urls });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Upload failed" });
  }
}
