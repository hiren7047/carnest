import { createSequelize, logSequelizeTarget } from "./sequelizeFactory.js";

/** Demo hub tables — same PostgreSQL database as production when `DEMO_HUB_DB_NAME` matches `DB_NAME`. */
export const demoHubSequelize = createSequelize({
  prefix: "DEMO_HUB_",
  defaultDatabase: process.env.DB_NAME ?? "carnest_db",
  logTag: "DemoHub SQL",
  defaultLogging: false,
});

export async function testDemoHubConnection(): Promise<void> {
  await demoHubSequelize.authenticate();
}

export async function closeDemoHubConnection(): Promise<void> {
  await demoHubSequelize.close();
}

export function logDemoHubConnectionTarget(): void {
  logSequelizeTarget(demoHubSequelize, "DEMO_HUB_", process.env.DB_NAME ?? "carnest_db");
}

export default demoHubSequelize;
