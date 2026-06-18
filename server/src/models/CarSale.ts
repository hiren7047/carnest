import { dbInteger, dbSmallInt, dbTinyInt, dbBigInt } from "../lib/dbTypes.js";
import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import sequelize from "../config/database.js";

export class CarSale extends Model<InferAttributes<CarSale>, InferCreationAttributes<CarSale>> {
  declare id: CreationOptional<number>;
  declare car_id: number;
  declare staff_id: number;
  declare sale_price: number;
  declare sold_at: Date;
  declare notes: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CarSale.init(
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
    notes: { type: DataTypes.TEXT, allowNull: true },
  } as never,
  { sequelize, tableName: "car_sales", modelName: "CarSale" }
);
