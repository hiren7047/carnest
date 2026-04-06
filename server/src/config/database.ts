import { Sequelize } from "sequelize";
import mysql2 from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const isDev = process.env.NODE_ENV === "development";

/** MySQL / MariaDB connection (uses `mysql2` driver). Set all `DB_*` vars in `.env`. */
const poolMax = Math.max(1, Number(process.env.DB_POOL_MAX ?? 10));
const poolMin = Math.max(0, Number(process.env.DB_POOL_MIN ?? 0));
const poolAcquire = Math.max(1000, Number(process.env.DB_POOL_ACQUIRE ?? 30000));
const poolIdle = Math.max(0, Number(process.env.DB_POOL_IDLE ?? 10000));

const sslEnabled = process.env.DB_SSL === "true" || process.env.DB_SSL === "1";

const dialectOptions: Record<string, unknown> = {
  charset: "utf8mb4",
};

if (sslEnabled) {
  dialectOptions.ssl =
    process.env.DB_SSL_REJECT_UNAUTHORIZED === "false"
      ? { rejectUnauthorized: false }
      : { rejectUnauthorized: true };
}

const sequelize = new Sequelize(
  process.env.DB_NAME ?? "carnest",
  process.env.DB_USER ?? "root",
  process.env.DB_PASSWORD ?? "",
  {
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    dialect: "mysql",
    dialectModule: mysql2,
    logging:
      isDev && process.env.DB_LOGGING !== "false"
        ? (sql: string) => console.log("[SQL]", sql)
        : false,
    pool: {
      max: poolMax,
      min: poolMin,
      acquire: poolAcquire,
      idle: poolIdle,
      evict: 1000,
    },
    define: {
      underscored: true,
      timestamps: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
    dialectOptions,
    /** App timezone for Sequelize date handling (India: +05:30). */
    timezone: process.env.DB_TIMEZONE ?? "+05:30",
    retry: {
      max: 3,
      match: [/Deadlock/i, /SequelizeConnectionError/i, /ETIMEDOUT/i, /ECONNRESET/i],
    },
  }
);

/**
 * Test DB connectivity (used on startup and by GET /api/health).
 */
export async function testConnection(): Promise<void> {
  await sequelize.authenticate();
}

/**
 * Close all pool connections — call on process shutdown.
 */
export async function closeConnection(): Promise<void> {
  await sequelize.close();
}

export function logConnectionTarget(): void {
  if (!isDev) return;
  const host = process.env.DB_HOST ?? "127.0.0.1";
  const port = process.env.DB_PORT ?? "3306";
  const name = process.env.DB_NAME ?? "carnest";
  const user = process.env.DB_USER ?? "root";
  console.log(`[DB] MySQL target: mysql://${user}@${host}:${port}/${name}`);
}

export default sequelize;
