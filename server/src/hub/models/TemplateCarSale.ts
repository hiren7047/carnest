import { dbInteger, dbSmallInt, dbTinyInt, dbBigInt } from "../../lib/dbTypes.js";
import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import demoHubSequelize from "../../config/demoHubDatabase.js";

export class TemplateCarSale extends Model<
  InferAttributes<TemplateCarSale>,
  InferCreationAttributes<TemplateCarSale>
> {
  declare id: CreationOptional<number>;
  declare car_id: number;
  declare staff_id: number;
  declare sale_price: number;
  declare sold_at: Date;
  declare notes: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

TemplateCarSale.init(
  {
    id: {
      type: dbInteger,
      autoIncrement: true,
      primaryKey: true,
    },
    car_id: { type: dbInteger, allowNull: false, unique: true },
    staff_id: { type: dbInteger, allowNull: false },
    sale_price: { type: dbBigInt, allowNull: false },
    sold_at: { type: DataTypes.DATE, allowNull: false },
    notes: { type: DataTypes.STRING(500), allowNull: true },
  } as never,
  {
    sequelize: demoHubSequelize,
    tableName: "template_car_sales",
    modelName: "TemplateCarSale",
  }
);
