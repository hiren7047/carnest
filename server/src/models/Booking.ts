import { dbInteger, dbSmallInt, dbTinyInt, dbBigInt } from "../lib/dbTypes.js";
import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import sequelize from "../config/database.js";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export class Booking extends Model<InferAttributes<Booking>, InferCreationAttributes<Booking>> {
  declare id: CreationOptional<number>;
  declare user_id: number;
  declare car_id: number;
  declare date: Date;
  declare status: BookingStatus;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Booking.init(
  {
    id: {
      type: dbInteger,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: dbInteger, allowNull: false },
    car_id: { type: dbInteger, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
  } as never,
  { sequelize, tableName: "bookings", modelName: "Booking" }
);
