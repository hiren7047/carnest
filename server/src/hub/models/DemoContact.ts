import { dbInteger, dbSmallInt, dbTinyInt, dbBigInt } from "../../lib/dbTypes.js";
import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import demoHubSequelize from "../../config/demoHubDatabase.js";

export class DemoContact extends Model<
  InferAttributes<DemoContact>,
  InferCreationAttributes<DemoContact>
> {
  declare id: CreationOptional<number>;
  declare demo_id: number;
  declare office_address: CreationOptional<string | null>;
  declare maps_url: CreationOptional<string | null>;
  declare instagram_url: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

DemoContact.init(
  {
    id: {
      type: dbInteger,
      autoIncrement: true,
      primaryKey: true,
    },
    demo_id: { type: dbInteger, allowNull: false, unique: true },
    office_address: { type: DataTypes.STRING(500), allowNull: true },
    maps_url: { type: DataTypes.STRING(500), allowNull: true },
    instagram_url: { type: DataTypes.STRING(500), allowNull: true },
  } as never,
  { sequelize: demoHubSequelize, tableName: "demo_contact", modelName: "DemoContact" }
);
