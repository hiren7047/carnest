import { dbInteger, dbSmallInt, dbTinyInt, dbBigInt } from "../../lib/dbTypes.js";
import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import demoHubSequelize from "../../config/demoHubDatabase.js";

export type DemoStatus = "active" | "archived";

export class Demo extends Model<InferAttributes<Demo>, InferCreationAttributes<Demo>> {
  declare id: CreationOptional<number>;
  declare slug: string;
  declare client_name: string;
  declare client_notes: CreationOptional<string | null>;
  declare status: CreationOptional<DemoStatus>;
  declare expires_at: CreationOptional<Date | null>;
  declare view_count: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Demo.init(
  {
    id: {
      type: dbInteger,
      autoIncrement: true,
      primaryKey: true,
    },
    slug: { type: DataTypes.STRING(64), allowNull: false, unique: true },
    client_name: { type: DataTypes.STRING(200), allowNull: false },
    client_notes: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM("active", "archived"),
      allowNull: false,
      defaultValue: "active",
    },
    expires_at: { type: DataTypes.DATE, allowNull: true },
    view_count: { type: dbInteger, allowNull: false, defaultValue: 0 },
  } as never,
  { sequelize: demoHubSequelize, tableName: "demos", modelName: "Demo" }
);
