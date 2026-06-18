import { dbInteger, dbSmallInt, dbTinyInt, dbBigInt } from "../../lib/dbTypes.js";
import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import demoHubSequelize from "../../config/demoHubDatabase.js";

export class DemoSandboxSellRequest extends Model<
  InferAttributes<DemoSandboxSellRequest>,
  InferCreationAttributes<DemoSandboxSellRequest>
> {
  declare id: CreationOptional<number>;
  declare demo_id: number;
  declare name: string;
  declare phone: string;
  declare car_details: string;
  declare images: string[];
  declare status: CreationOptional<"pending" | "contacted" | "closed">;
  declare admin_notes: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

DemoSandboxSellRequest.init(
  {
    id: {
      type: dbInteger,
      autoIncrement: true,
      primaryKey: true,
    },
    demo_id: { type: dbInteger, allowNull: false },
    name: { type: DataTypes.STRING(120), allowNull: false },
    phone: { type: DataTypes.STRING(32), allowNull: false },
    car_details: { type: DataTypes.TEXT, allowNull: false },
    images: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    status: {
      type: DataTypes.ENUM("pending", "contacted", "closed"),
      allowNull: false,
      defaultValue: "pending",
    },
    admin_notes: { type: DataTypes.TEXT, allowNull: true },
  } as never,
  {
    sequelize: demoHubSequelize,
    tableName: "demo_sandbox_sell_requests",
    modelName: "DemoSandboxSellRequest",
  }
);
