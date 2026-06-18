import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface HubJwtPayload {
  id: number;
  email: string;
  scope: "hub";
}

declare global {
  namespace Express {
    interface Request {
      hubUser?: HubJwtPayload;
    }
  }
}

function resolveJwtSecret(): string {
  const raw = process.env.JWT_SECRET;
  const trimmed = raw?.trim();
  if (trimmed) return trimmed;
  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing JWT_SECRET");
  }
  return "dev-secret-change-me";
}

const JWT_SECRET = resolveJwtSecret();

export function hubAuthRequired(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ message: "Hub authentication required" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as HubJwtPayload;
    if (decoded.scope !== "hub") {
      res.status(401).json({ message: "Invalid hub token" });
      return;
    }
    req.hubUser = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function signHubToken(payload: Omit<HubJwtPayload, "scope">): string {
  const expiresIn = process.env.JWT_EXPIRES_IN ?? "7d";
  return jwt.sign({ ...payload, scope: "hub" }, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export { JWT_SECRET };
