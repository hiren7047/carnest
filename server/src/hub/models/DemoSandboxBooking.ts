import { dbInteger, dbSmallInt, dbTinyInt, dbBigInt } from "../../lib/dbTypes.js";
import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import demoHubSequelize from "../../config/demoHubDatabase.js";

export class DemoSandboxBooking extends Model<
  InferAttributes<DemoSandboxBooking>,
  InferCreationAttributes<DemoSandboxBooking>
> {
  declare id: CreationOptional<number>;
  declare demo_id: number;
  declare user_id: number;
  declare car_id: number;
  declare date: string;
  declare status: CreationOptional<"pending" | "confirmed" | "cancelled">;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

DemoSandboxBooking.init(
  {
    id: {
      type: dbInteger,
      autoIncrement: true,
      primaryKey: true,
    },
    demo_id: { type: dbInteger, allowNull: false },
    user_id: { type: dbInteger, allowNull: false },
    car_id: { type: dbInteger, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
  } as never,
  {
    sequelize: demoHubSequelize,
    tableName: "demo_sandbox_bookings",
    modelName: "DemoSandboxBooking",
  }
);
