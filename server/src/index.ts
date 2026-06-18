import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import sequelize, {
  testConnection,
  closeConnection,
  logConnectionTarget,
} from "./config/database.js";
import {
  testDemoHubConnection,
  closeDemoHubConnection,
  logDemoHubConnectionTarget,
} from "./config/demoHubDatabase.js";
import "./models/index.js";
import "./hub/models/index.js";
import { ensureUploadDir } from "./config/multer.js";
import authRoutes from "./routes/auth.routes.js";
import carsRoutes from "./routes/cars.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import sellRoutes from "./routes/sell.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import siteRoutes from "./routes/site.routes.js";
import hubRoutes from "./hub/routes/hub.routes.js";
import demoRoutes from "./demo/routes/demo.routes.js";

const app = express();
const uploadDir = process.env.UPLOAD_DIR ?? "uploads";
ensureUploadDir();
const allowedOrigins = (process.env.CLIENT_URLS ?? process.env.CLIENT_URL ?? "http://localhost:8080,http://localhost:8090")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server calls and same-origin requests without Origin header.
      if (!origin) {
        callback(null, true);
        return;
      }
      callback(null, allowedOrigins.includes(origin));
    },
    credentials: true,
  })
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use("/uploads", express.static(path.resolve(process.cwd(), uploadDir)));

app.get("/api/health", async (_req: Request, res: Response) => {
  try {
    await testConnection();
    res.json({ ok: true, database: "connected" });
  } catch {
    res.status(503).json({ ok: false, database: "disconnected" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/cars", carsRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/sell", sellRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/site", siteRoutes);
app.use("/api/hub", hubRoutes);
app.use("/api/demo/:slug", demoRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (err.message === "Only image files are allowed") {
    res.status(400).json({ message: err.message });
    return;
  }
  res.status(500).json({ message: "Internal server error" });
});

const PORT = Number(process.env.PORT) || 4000;

async function start() {
  try {
    logConnectionTarget();
    logDemoHubConnectionTarget();
    await testConnection();
    console.log("[DB] connection OK");
    await testDemoHubConnection();
    console.log("[DemoHub DB] connection OK");
    const alter =
      process.env.NODE_ENV === "development" ||
      String(process.env.DB_SYNC_ALTER ?? "").trim().toLowerCase() === "true";
    await sequelize.sync({ alter });
    const demoHubAlter =
      process.env.NODE_ENV === "development" ||
      String(process.env.DEMO_HUB_DB_SYNC_ALTER ?? "true").trim().toLowerCase() === "true";
    const { demoHubSequelize } = await import("./hub/models/index.js");
    await demoHubSequelize.sync({ alter: demoHubAlter });
    if (alter && process.env.NODE_ENV === "production") {
      console.warn(
        "[DB] sequelize.sync({ alter: true }) is enabled in production via DB_SYNC_ALTER=true. Disable after schema is updated."
      );
    }

    const server = app.listen(PORT, () => {
      console.log(`Carnest API listening on http://localhost:${PORT}`);
    });

    const shutdown = (signal: string) => {
      console.log(`\n[${signal}] Shutting down…`);
      server.close(async () => {
        try {
          await closeConnection();
          await closeDemoHubConnection();
          console.log("[DB] Pool closed");
        } catch (e) {
          console.error("[DB] Error closing pool:", e);
        }
        process.exit(0);
      });
      setTimeout(() => {
        console.error("Forced exit after timeout");
        process.exit(1);
      }, 10_000).unref();
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (e) {
    console.error("Failed to start server:", e);
    console.error(
      "Check PostgreSQL/MySQL is running, database exists, and .env DB_* / DEMO_HUB_DB_* values are correct."
    );
    process.exit(1);
  }
}

start();
