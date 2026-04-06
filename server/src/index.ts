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
import "./models/index.js";
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

const app = express();
const uploadDir = process.env.UPLOAD_DIR ?? "uploads";
ensureUploadDir();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:8080",
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
    await testConnection();
    console.log("[DB] MySQL connection OK");
    const alter = process.env.NODE_ENV === "development";
    await sequelize.sync({ alter });

    const server = app.listen(PORT, () => {
      console.log(`Carnest API listening on http://localhost:${PORT}`);
    });

    const shutdown = (signal: string) => {
      console.log(`\n[${signal}] Shutting down…`);
      server.close(async () => {
        try {
          await closeConnection();
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
      "Check MySQL is running, database exists (see sql/init-mysql.sql), and .env DB_* values are correct."
    );
    process.exit(1);
  }
}

start();
