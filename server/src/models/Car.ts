import { dbInteger, dbSmallInt, dbTinyInt, dbBigInt } from "../lib/dbTypes.js";
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
  declare listing_status: CreationOptional<"available" | "sold" | "withdrawn">;
  declare sold_at: CreationOptional<Date | null>;

  // Rich detail fields (nullable unless always present)
  declare variant_name: CreationOptional<string | null>;
  declare registration_year: CreationOptional<number | null>;
  declare registration_month: CreationOptional<number | null>;
  declare owner_count: CreationOptional<number | null>;
  declare color: CreationOptional<string | null>;
  declare body_type: CreationOptional<string | null>;
  declare rto_city: CreationOptional<string | null>;

  declare engine_cc: CreationOptional<number | null>;
  declare power_bhp: CreationOptional<number | null>;
  declare torque_nm: CreationOptional<number | null>;
  declare top_speed_kmph: CreationOptional<number | null>;
  declare accel_0_100_sec: CreationOptional<number | null>;
  declare drivetrain: CreationOptional<string | null>;
  declare seating_capacity: CreationOptional<number | null>;
  declare boot_space_l: CreationOptional<number | null>;

  declare battery_kwh: CreationOptional<number | null>;
  declare range_km: CreationOptional<number | null>;
  declare charging_time_ac: CreationOptional<string | null>;
  declare charging_time_dc: CreationOptional<string | null>;

  declare insurance_valid_till: CreationOptional<string | null>;
  declare warranty_info: CreationOptional<string | null>;
  declare service_history: CreationOptional<string | null>;

  // Feature flags
  declare sunroof: CreationOptional<boolean>;
  declare alloy_wheels: CreationOptional<boolean>;
  declare led_headlamps: CreationOptional<boolean>;
  declare fog_lamps: CreationOptional<boolean>;
  declare rear_camera: CreationOptional<boolean>;
  declare parking_sensors: CreationOptional<boolean>;

  declare ventilated_seats: CreationOptional<boolean>;
  declare leather_seats: CreationOptional<boolean>;
  declare ambient_lighting: CreationOptional<boolean>;
  declare digital_cluster: CreationOptional<boolean>;

  declare airbags_count: CreationOptional<number | null>;
  declare abs: CreationOptional<boolean>;
  declare esc: CreationOptional<boolean>;
  declare tpms: CreationOptional<boolean>;
  declare adas: CreationOptional<boolean>;

  declare android_auto: CreationOptional<boolean>;
  declare apple_carplay: CreationOptional<boolean>;
  declare wireless_charging: CreationOptional<boolean>;
  declare cruise_control: CreationOptional<boolean>;

  // Finance / display meta
  declare emi_note: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Car.init(
  {
    id: {
      type: dbInteger,
      autoIncrement: true,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING(255), allowNull: false },
    brand: { type: DataTypes.STRING(120), allowNull: false },
    model: { type: DataTypes.STRING(120), allowNull: false },
    year: { type: dbSmallInt, allowNull: false },
    price: { type: dbBigInt, allowNull: false },
    market_price: { type: dbBigInt, allowNull: true },
    fuel_type: { type: DataTypes.STRING(60), allowNull: false },
    transmission: { type: DataTypes.STRING(60), allowNull: false },
    km_driven: { type: dbInteger, allowNull: false, defaultValue: 0 },
    location: { type: DataTypes.STRING(120), allowNull: false },
    images: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    description: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    is_featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    listing_status: {
      type: DataTypes.ENUM("available", "sold", "withdrawn"),
      allowNull: false,
      defaultValue: "available",
    },
    sold_at: { type: DataTypes.DATE, allowNull: true },

    variant_name: { type: DataTypes.STRING(180), allowNull: true },
    registration_year: { type: dbSmallInt, allowNull: true },
    registration_month: { type: dbTinyInt, allowNull: true },
    owner_count: { type: dbTinyInt, allowNull: true },
    color: { type: DataTypes.STRING(80), allowNull: true },
    body_type: { type: DataTypes.STRING(80), allowNull: true },
    rto_city: { type: DataTypes.STRING(120), allowNull: true },

    engine_cc: { type: dbInteger, allowNull: true },
    power_bhp: { type: DataTypes.DECIMAL(6, 1), allowNull: true },
    torque_nm: { type: DataTypes.DECIMAL(7, 1), allowNull: true },
    top_speed_kmph: { type: dbSmallInt, allowNull: true },
    accel_0_100_sec: { type: DataTypes.DECIMAL(4, 1), allowNull: true },
    drivetrain: { type: DataTypes.STRING(40), allowNull: true },
    seating_capacity: { type: dbTinyInt, allowNull: true },
    boot_space_l: { type: dbSmallInt, allowNull: true },

    battery_kwh: { type: DataTypes.DECIMAL(6, 1), allowNull: true },
    range_km: { type: dbSmallInt, allowNull: true },
    charging_time_ac: { type: DataTypes.STRING(120), allowNull: true },
    charging_time_dc: { type: DataTypes.STRING(120), allowNull: true },

    insurance_valid_till: { type: DataTypes.STRING(40), allowNull: true },
    warranty_info: { type: DataTypes.STRING(500), allowNull: true },
    service_history: { type: DataTypes.STRING(500), allowNull: true },

    sunroof: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    alloy_wheels: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    led_headlamps: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    fog_lamps: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    rear_camera: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    parking_sensors: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

    ventilated_seats: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    leather_seats: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    ambient_lighting: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    digital_cluster: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

    airbags_count: { type: dbTinyInt, allowNull: true },
    abs: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    esc: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    tpms: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    adas: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

    android_auto: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    apple_carplay: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    wireless_charging: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    cruise_control: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

    emi_note: { type: DataTypes.STRING(300), allowNull: true },
  } as never,
  { sequelize, tableName: "cars", modelName: "Car" }
);
