import { dbInteger, dbSmallInt, dbTinyInt, dbBigInt } from "../../lib/dbTypes.js";
import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import demoHubSequelize from "../../config/demoHubDatabase.js";

export class TemplateStaffMonthlyTarget extends Model<
  InferAttributes<TemplateStaffMonthlyTarget>,
  InferCreationAttributes<TemplateStaffMonthlyTarget>
> {
  declare id: CreationOptional<number>;
  declare staff_id: number;
  declare year: number;
  declare month: number;
  declare target_cars: number;
  declare target_revenue: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

TemplateStaffMonthlyTarget.init(
  {
    id: {
      type: dbInteger,
      autoIncrement: true,
      primaryKey: true,
    },
    staff_id: { type: dbInteger, allowNull: false },
    year: { type: dbSmallInt, allowNull: false },
    month: { type: dbTinyInt, allowNull: false },
    target_cars: { type: dbSmallInt, allowNull: false, defaultValue: 0 },
    target_revenue: { type: dbBigInt, allowNull: false, defaultValue: 0 },
  } as never,
  {
    sequelize: demoHubSequelize,
    tableName: "template_staff_monthly_targets",
    modelName: "TemplateStaffMonthlyTarget",
  }
);
