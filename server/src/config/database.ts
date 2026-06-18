import { createSequelize, logSequelizeTarget } from "./sequelizeFactory.js";

const sequelize = createSequelize({
  prefix: "",
  defaultDatabase: "carnest_db",
  logTag: "SQL",
});

export async function testConnection(): Promise<void> {
  await sequelize.authenticate();
}

export async function closeConnection(): Promise<void> {
  await sequelize.close();
}

export function logConnectionTarget(): void {
  logSequelizeTarget(sequelize, "", "carnest_db");
}

export default sequelize;
