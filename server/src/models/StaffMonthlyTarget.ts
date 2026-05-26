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
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    staff_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    year: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false },
    month: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false },
    target_cars: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    target_revenue: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    notes: { type: DataTypes.STRING(500), allowNull: true },
  },
  { sequelize, tableName: "staff_monthly_targets", modelName: "StaffMonthlyTarget" }
);
