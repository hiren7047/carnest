import {
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";
import demoHubSequelize from "../../config/demoHubDatabase.js";
import { templateCarAttributes } from "./templateCarAttributes.js";

export class TemplateCar extends Model<
  InferAttributes<TemplateCar>,
  InferCreationAttributes<TemplateCar>
> {
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
  declare emi_note: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

TemplateCar.init(templateCarAttributes as never, {
  sequelize: demoHubSequelize,
  tableName: "template_cars",
  modelName: "TemplateCar",
});
