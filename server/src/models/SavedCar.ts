import { dbInteger, dbSmallInt, dbTinyInt, dbBigInt } from "../lib/dbTypes.js";
import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import sequelize from "../config/database.js";

export class SavedCar extends Model<InferAttributes<SavedCar>, InferCreationAttributes<SavedCar>> {
  declare id: CreationOptional<number>;
  declare user_id: number;
  declare car_id: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

SavedCar.init(
  {
    id: {
      type: dbInteger,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: dbInteger, allowNull: false },
    car_id: { type: dbInteger, allowNull: false },
  } as never,
  {
    sequelize,
    tableName: "saved_cars",
    modelName: "SavedCar",
    indexes: [{ unique: true, fields: ["user_id", "car_id"] }],
  }
);
