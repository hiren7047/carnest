import type { Request, Response } from "express";
import { ContactInquiry } from "../models/index.js";

export async function createContactInquiry(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, phone, message } = req.body as {
      name: string;
      email: string;
      phone?: string | null;
      message: string;
    };
    await ContactInquiry.create({
      name,
      email: email.toLowerCase(),
      phone: phone?.trim() || null,
      message,
    });
    res.status(201).json({ ok: true, message: "Thank you — we will get back to you shortly." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not submit your message. Please try again later." });
  }
}
