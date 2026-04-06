import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import sequelize from "../config/database.js";
import type { SiteContent } from "../types/siteContent.js";

export class SiteSettings extends Model<
  InferAttributes<SiteSettings>,
  InferCreationAttributes<SiteSettings>
> {
  declare id: CreationOptional<number>;
  declare content: SiteContent;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

SiteSettings.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
    },
    content: { type: DataTypes.JSON, allowNull: false },
  } as never,
  { sequelize, tableName: "site_settings", modelName: "SiteSettings" }
);
