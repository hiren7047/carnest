import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { TemplateUser } from "../../hub/models/TemplateUser.js";
import { signDemoToken } from "../middlewares/demoContext.js";

export async function demoLogin(req: Request, res: Response): Promise<void> {
  try {
    const demo = req.demo!;
    const { email, password } = req.body as { email: string; password: string };
    const user = await TemplateUser.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    const token = signDemoToken({
      id: user.id,
      email: user.email,
      role: user.role,
      demoId: demo.id,
      demoSlug: demo.slug,
    });
    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
      demo_mode: true,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Login failed" });
  }
}

export async function demoRegister(_req: Request, res: Response): Promise<void> {
  res.status(403).json({
    message: "Registration is disabled in demo mode. Use buyer@demo.com / Demo123!",
  });
}

export async function demoMe(req: Request, res: Response): Promise<void> {
  try {
    const user = await TemplateUser.findByPk(req.demoUser!.id, {
      attributes: ["id", "name", "email", "role"],
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ user, demo_mode: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load profile" });
  }
}
