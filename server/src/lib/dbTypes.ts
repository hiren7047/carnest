import { DataTypes } from "sequelize";
import { resolveDialect } from "../config/sequelizeFactory.js";

function isPostgres(): boolean {
  return resolveDialect() === "postgres";
}

/** Primary key / FK integer — PG has no UNSIGNED. */
export const dbInteger = isPostgres() ? DataTypes.INTEGER : DataTypes.INTEGER.UNSIGNED;

/** Small counts (year, month, airbags) — PG uses SMALLINT instead of TINYINT. */
export const dbSmallInt = isPostgres() ? DataTypes.SMALLINT : DataTypes.SMALLINT.UNSIGNED;

/** 0–255 range fields — PG: SMALLINT; MySQL: TINYINT UNSIGNED. */
export const dbTinyInt = isPostgres() ? DataTypes.SMALLINT : DataTypes.TINYINT.UNSIGNED;

/** Money / odometer — PG: BIGINT; MySQL: BIGINT UNSIGNED. */
export const dbBigInt = isPostgres() ? DataTypes.BIGINT : DataTypes.BIGINT.UNSIGNED;
