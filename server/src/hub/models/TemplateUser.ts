import { dbInteger, dbSmallInt, dbTinyInt, dbBigInt } from "../../lib/dbTypes.js";
import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import demoHubSequelize from "../../config/demoHubDatabase.js";

export type TemplateUserRole = "user" | "admin";

export class TemplateUser extends Model<
  InferAttributes<TemplateUser>,
  InferCreationAttributes<TemplateUser>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: TemplateUserRole;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

TemplateUser.init(
  {
    id: {
      type: dbInteger,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
  } as never,
  { sequelize: demoHubSequelize, tableName: "template_users", modelName: "TemplateUser" }
);
