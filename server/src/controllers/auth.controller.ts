import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/index.js";
import { signToken } from "../middlewares/auth.js";

const SALT_ROUNDS = 12;

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };
    const existing = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existing) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hash,
      role: "user",
    });
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Registration failed" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Login failed" });
  }
}
