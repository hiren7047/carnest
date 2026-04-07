import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import sequelize from "../config/database.js";

export class Car extends Model<InferAttributes<Car>, InferCreationAttributes<Car>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare brand: string;
  declare model: string;
  declare year: number;
  declare price: number;
  declare market_price: CreationOptional<number | null>;
  declare fuel_type: string;
  declare transmission: string;
  declare km_driven: number;
  declare location: string;
  declare images: string[];
  declare description: string;
  declare is_featured: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Car.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING(255), allowNull: false },
    brand: { type: DataTypes.STRING(120), allowNull: false },
    model: { type: DataTypes.STRING(120), allowNull: false },
    year: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: false },
    price: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    market_price: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    fuel_type: { type: DataTypes.STRING(60), allowNull: false },
    transmission: { type: DataTypes.STRING(60), allowNull: false },
    km_driven: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    location: { type: DataTypes.STRING(120), allowNull: false },
    images: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    description: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    is_featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  } as never,
  { sequelize, tableName: "cars", modelName: "Car" }
);
