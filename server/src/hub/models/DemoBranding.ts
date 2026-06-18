import { dbInteger, dbSmallInt, dbTinyInt, dbBigInt } from "../../lib/dbTypes.js";
import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import demoHubSequelize from "../../config/demoHubDatabase.js";
import type { DemoThemeJson } from "../types/demoTheme.js";

export class DemoBranding extends Model<
  InferAttributes<DemoBranding>,
  InferCreationAttributes<DemoBranding>
> {
  declare id: CreationOptional<number>;
  declare demo_id: number;
  declare logo_url: CreationOptional<string | null>;
  declare favicon_url: CreationOptional<string | null>;
  declare business_name: CreationOptional<string | null>;
  declare theme_json: DemoThemeJson;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

DemoBranding.init(
  {
    id: {
      type: dbInteger,
      autoIncrement: true,
      primaryKey: true,
    },
    demo_id: { type: dbInteger, allowNull: false, unique: true },
    logo_url: { type: DataTypes.STRING(500), allowNull: true },
    favicon_url: { type: DataTypes.STRING(500), allowNull: true },
    business_name: { type: DataTypes.STRING(200), allowNull: true },
    theme_json: { type: DataTypes.JSON, allowNull: false },
  } as never,
  { sequelize: demoHubSequelize, tableName: "demo_branding", modelName: "DemoBranding" }
);
