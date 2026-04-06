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
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    car_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  } as never,
  {
    sequelize,
    tableName: "saved_cars",
    modelName: "SavedCar",
    indexes: [{ unique: true, fields: ["user_id", "car_id"] }],
  }
);
