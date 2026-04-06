import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import sequelize from "../config/database.js";

export type SellRequestStatus = "pending" | "contacted" | "closed";

export class SellRequest extends Model<
  InferAttributes<SellRequest>,
  InferCreationAttributes<SellRequest>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare phone: string;
  declare car_details: string;
  declare images: string[];
  declare status: SellRequestStatus;
  declare admin_notes: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

SellRequest.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
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
  { sequelize, tableName: "sell_requests", modelName: "SellRequest" }
);
