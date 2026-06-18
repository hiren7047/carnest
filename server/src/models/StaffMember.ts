import { dbInteger, dbSmallInt, dbTinyInt, dbBigInt } from "../lib/dbTypes.js";
import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import sequelize from "../config/database.js";

export class StaffMember extends Model<
  InferAttributes<StaffMember>,
  InferCreationAttributes<StaffMember>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare phone: CreationOptional<string | null>;
  declare email: CreationOptional<string | null>;
  declare is_active: CreationOptional<boolean>;
  declare color: CreationOptional<string>;
  declare sort_order: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

StaffMember.init(
  {
    id: {
      type: dbInteger,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(120), allowNull: false },
    phone: { type: DataTypes.STRING(32), allowNull: true },
    email: { type: DataTypes.STRING(255), allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    color: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "#3b82f6" },
    sort_order: { type: dbSmallInt, allowNull: false, defaultValue: 0 },
  } as never,
  { sequelize, tableName: "staff_members", modelName: "StaffMember" }
);
