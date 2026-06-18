import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { HubAdmin } from "../models/HubAdmin.js";
import { signHubToken } from "../middlewares/hubAuth.js";

export async function hubLogin(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const admin = await HubAdmin.findOne({ where: { email: email.toLowerCase() } });
    if (!admin) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    const token = signHubToken({ id: admin.id, email: admin.email });
    res.json({
      user: { id: admin.id, name: admin.name, email: admin.email },
      token,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Login failed" });
  }
}

export async function hubMe(req: Request, res: Response): Promise<void> {
  try {
    const admin = await HubAdmin.findByPk(req.hubUser!.id, {
      attributes: ["id", "name", "email"],
    });
    if (!admin) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ user: admin });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load profile" });
  }
}
