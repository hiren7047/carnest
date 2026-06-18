import { dbInteger, dbSmallInt, dbTinyInt, dbBigInt } from "../../lib/dbTypes.js";
import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import demoHubSequelize from "../../config/demoHubDatabase.js";

export class DemoSandboxContactInquiry extends Model<
  InferAttributes<DemoSandboxContactInquiry>,
  InferCreationAttributes<DemoSandboxContactInquiry>
> {
  declare id: CreationOptional<number>;
  declare demo_id: number;
  declare name: string;
  declare email: string;
  declare phone: CreationOptional<string | null>;
  declare message: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

DemoSandboxContactInquiry.init(
  {
    id: {
      type: dbInteger,
      autoIncrement: true,
      primaryKey: true,
    },
    demo_id: { type: dbInteger, allowNull: false },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(32), allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: false },
  } as never,
  {
    sequelize: demoHubSequelize,
    tableName: "demo_sandbox_contact_inquiries",
    modelName: "DemoSandboxContactInquiry",
  }
);
