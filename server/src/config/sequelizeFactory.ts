import { Sequelize, type Options } from "sequelize";
import mysql2 from "mysql2";

export type DbDialect = "postgres" | "mysql";

const isDev = process.env.NODE_ENV === "development";

function envKey(prefix: string, name: string): string {
  return prefix ? `${prefix}${name}` : name;
}

function readEnv(prefix: string, name: string, fallback?: string): string | undefined {
  return process.env[envKey(prefix, name)] ?? fallback;
}

/** Resolve dialect from `DB_DIALECT` or `DEMO_HUB_DB_DIALECT`. Defaults to postgres. */
export function resolveDialect(prefix = ""): DbDialect {
  const dialectKey = prefix ? `${prefix}DB_DIALECT` : "DB_DIALECT";
  const raw = (process.env[dialectKey] ?? process.env.DB_DIALECT ?? "postgres").toLowerCase();
  if (raw === "mysql" || raw === "mariadb") return "mysql";
  return "postgres";
}

function defaultPort(dialect: DbDialect): number {
  return dialect === "mysql" ? 3306 : 5432;
}

function poolFromEnv(prefix: string) {
  const poolMax = Math.max(1, Number(readEnv(prefix, "DB_POOL_MAX", process.env.DB_POOL_MAX ?? "10")));
  const poolMin = Math.max(0, Number(readEnv(prefix, "DB_POOL_MIN", process.env.DB_POOL_MIN ?? "0")));
  const poolAcquire = Math.max(
    1000,
    Number(readEnv(prefix, "DB_POOL_ACQUIRE", process.env.DB_POOL_ACQUIRE ?? "30000"))
  );
  const poolIdle = Math.max(0, Number(readEnv(prefix, "DB_POOL_IDLE", process.env.DB_POOL_IDLE ?? "10000")));
  return { max: poolMax, min: poolMin, acquire: poolAcquire, idle: poolIdle, evict: 1000 };
}

function sslDialectOptions(prefix: string): Record<string, unknown> {
  const sslKey = prefix ? `${prefix}DB_SSL` : "DB_SSL";
  const sslEnabled = process.env[sslKey] === "true" || process.env[sslKey] === "1";
  if (!sslEnabled) return {};
  const rejectKey = prefix ? `${prefix}DB_SSL_REJECT_UNAUTHORIZED` : "DB_SSL_REJECT_UNAUTHORIZED";
  return {
    ssl:
      process.env[rejectKey] === "false"
        ? { rejectUnauthorized: false }
        : { rejectUnauthorized: true },
  };
}

export type SequelizeFactoryOptions = {
  /** `DEMO_HUB_` for demo hub connection; empty for main DB. */
  prefix?: "" | "DEMO_HUB_";
  defaultDatabase: string;
  logTag: string;
  defaultLogging?: boolean;
};

export function createSequelize({
  prefix = "",
  defaultDatabase,
  logTag,
  defaultLogging = true,
}: SequelizeFactoryOptions): Sequelize {
  const dialect = resolveDialect(prefix);
  const host = readEnv(prefix, "DB_HOST", process.env.DB_HOST ?? "127.0.0.1")!;
  const port = Number(readEnv(prefix, "DB_PORT") ?? defaultPort(dialect));
  const database =
    readEnv(prefix, "DB_NAME", prefix ? process.env.DB_NAME : undefined) ?? defaultDatabase;
  const username =
    readEnv(prefix, "DB_USER", prefix ? process.env.DB_USER : undefined) ??
    (dialect === "postgres" ? "postgres" : "root");
  const password =
    readEnv(prefix, "DB_PASSWORD", prefix ? process.env.DB_PASSWORD : undefined) ?? "";

  const timezone =
    readEnv(prefix, "DB_TIMEZONE", process.env.DB_TIMEZONE ?? "+05:30") ?? "+05:30";

  const dialectOptions: Record<string, unknown> = {
    ...sslDialectOptions(prefix),
  };
  if (dialect === "mysql") {
    dialectOptions.charset = "utf8mb4";
  }

  const define: Options["define"] = {
    underscored: true,
    timestamps: true,
  };
  if (dialect === "mysql") {
    define.charset = "utf8mb4";
    define.collate = "utf8mb4_unicode_ci";
  }

  const loggingEnabled =
    isDev &&
    (prefix
      ? process.env.DEMO_HUB_DB_LOGGING === "true"
      : process.env.DB_LOGGING !== "false" && defaultLogging);

  const options: Options = {
    host,
    port,
    dialect,
    logging: loggingEnabled ? (sql: string) => console.log(`[${logTag}]`, sql) : false,
    pool: poolFromEnv(prefix),
    define,
    dialectOptions,
    timezone,
    retry: {
      max: 3,
      match: [/Deadlock/i, /SequelizeConnectionError/i, /ETIMEDOUT/i, /ECONNRESET/i],
    },
  };

  if (dialect === "mysql") {
    options.dialectModule = mysql2;
  }

  return new Sequelize(database, username, password, options);
}

export function logSequelizeTarget(
  sequelize: Sequelize,
  prefix: string,
  defaultDatabase: string
): void {
  if (!isDev) return;
  const dialect = resolveDialect(prefix);
  const host = readEnv(prefix, "DB_HOST", process.env.DB_HOST ?? "127.0.0.1");
  const port = readEnv(prefix, "DB_PORT") ?? String(defaultPort(dialect));
  const name = readEnv(prefix, "DB_NAME", prefix ? process.env.DB_NAME : undefined) ?? defaultDatabase;
  const user =
    readEnv(prefix, "DB_USER", prefix ? process.env.DB_USER : undefined) ??
    (dialect === "postgres" ? "postgres" : "root");
  const scheme = dialect === "postgres" ? "postgresql" : "mysql";
  console.log(`[${prefix || "DB"}] ${scheme}://${user}@${host}:${port}/${name}`);
}
