import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Demo } from "../../hub/models/Demo.js";
import type { TemplateUserRole } from "../../hub/models/TemplateUser.js";
import { JWT_SECRET } from "../../hub/middlewares/hubAuth.js";

export interface DemoJwtPayload {
  id: number;
  email: string;
  role: TemplateUserRole;
  demoId: number;
  demoSlug: string;
  scope: "demo";
}

declare global {
  namespace Express {
    interface Request {
      demo?: Demo;
      demoUser?: DemoJwtPayload;
    }
  }
}

export async function resolveDemoSlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const slug = req.params.slug;
    if (!slug || typeof slug !== "string") {
      res.status(400).json({ message: "Demo slug required" });
      return;
    }
    const demo = await Demo.findOne({
      where: { slug, status: "active" },
    });
    if (!demo) {
      res.status(404).json({ message: "Demo not found or archived" });
      return;
    }
    if (demo.expires_at && new Date(demo.expires_at) < new Date()) {
      res.status(410).json({ message: "Demo has expired" });
      return;
    }
    req.demo = demo;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to resolve demo" });
  }
}

export async function incrementDemoView(req: Request): Promise<void> {
  if (!req.demo) return;
  await Demo.increment("view_count", { where: { id: req.demo.id } });
}

export function demoAuthRequired(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DemoJwtPayload;
    if (decoded.scope !== "demo") {
      res.status(401).json({ message: "Invalid demo token" });
      return;
    }
    if (req.demo && decoded.demoId !== req.demo.id) {
      res.status(403).json({ message: "Token not valid for this demo" });
      return;
    }
    req.demoUser = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function demoOptionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as DemoJwtPayload;
      if (decoded.scope === "demo" && (!req.demo || decoded.demoId === req.demo.id)) {
        req.demoUser = decoded;
      }
    } catch {
      /* ignore */
    }
  }
  next();
}

export function requireDemoAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.demoUser) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  if (req.demoUser.role !== "admin") {
    res.status(403).json({ message: "Admin access required" });
    return;
  }
  next();
}

export function signDemoToken(payload: Omit<DemoJwtPayload, "scope">): string {
  const expiresIn = process.env.JWT_EXPIRES_IN ?? "7d";
  return jwt.sign({ ...payload, scope: "demo" }, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function demoPublicBaseUrl(): string {
  return (process.env.DEMO_PUBLIC_BASE_URL ?? "http://localhost:8080/d").replace(/\/$/, "");
}

export const DEMO_STATIC_CREDENTIALS = {
  admin: { email: "admin@demo.com", password: "Demo123!" },
  buyer: { email: "buyer@demo.com", password: "Demo123!" },
};
