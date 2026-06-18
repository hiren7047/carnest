import { dbInteger, dbSmallInt, dbTinyInt, dbBigInt } from "../lib/dbTypes.js";
import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import sequelize from "../config/database.js";

export class StaffMonthlyTarget extends Model<
  InferAttributes<StaffMonthlyTarget>,
  InferCreationAttributes<StaffMonthlyTarget>
> {
  declare id: CreationOptional<number>;
  declare staff_id: number;
  declare year: number;
  declare month: number;
  declare target_cars: number;
  declare target_revenue: CreationOptional<number | null>;
  declare notes: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

StaffMonthlyTarget.init(
  {
    id: {
      type: dbInteger,
      autoIncrement: true,
      primaryKey: true,
    },
    staff_id: { type: dbInteger, allowNull: false },
    year: { type: dbSmallInt, allowNull: false },
    month: { type: dbTinyInt, allowNull: false },
    target_cars: { type: dbInteger, allowNull: false, defaultValue: 0 },
    target_revenue: { type: dbBigInt, allowNull: true },
    notes: { type: DataTypes.STRING(500), allowNull: true },
  } as never,
  { sequelize, tableName: "staff_monthly_targets", modelName: "StaffMonthlyTarget" }
);
