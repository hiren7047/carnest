import { dbInteger, dbSmallInt, dbTinyInt, dbBigInt } from "../../lib/dbTypes.js";
import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import demoHubSequelize from "../../config/demoHubDatabase.js";
import type { SiteContent } from "../../types/siteContent.js";

export class DemoSiteContent extends Model<
  InferAttributes<DemoSiteContent>,
  InferCreationAttributes<DemoSiteContent>
> {
  declare id: CreationOptional<number>;
  declare demo_id: number;
  declare content: SiteContent;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

DemoSiteContent.init(
  {
    id: {
      type: dbInteger,
      autoIncrement: true,
      primaryKey: true,
    },
    demo_id: { type: dbInteger, allowNull: false, unique: true },
    content: { type: DataTypes.JSON, allowNull: false },
  } as never,
  { sequelize: demoHubSequelize, tableName: "demo_site_content", modelName: "DemoSiteContent" }
);
