import sequelize from "../config/database.js";
import { User } from "./User.js";
import { Car } from "./Car.js";
import { Booking } from "./Booking.js";
import { SellRequest } from "./SellRequest.js";
import { SavedCar } from "./SavedCar.js";
import { ContactInquiry } from "./ContactInquiry.js";
import { SiteSettings } from "./SiteSettings.js";
import { StaffMember } from "./StaffMember.js";
import { StaffMonthlyTarget } from "./StaffMonthlyTarget.js";
import { CarSale } from "./CarSale.js";

User.hasMany(Booking, { foreignKey: "user_id", as: "bookings" });
Booking.belongsTo(User, { foreignKey: "user_id", as: "user" });

Car.hasMany(Booking, { foreignKey: "car_id", as: "bookings" });
Booking.belongsTo(Car, { foreignKey: "car_id", as: "car" });

User.hasMany(SavedCar, { foreignKey: "user_id", as: "savedCars" });
SavedCar.belongsTo(User, { foreignKey: "user_id", as: "user" });

Car.hasMany(SavedCar, { foreignKey: "car_id", as: "savedBy" });
SavedCar.belongsTo(Car, { foreignKey: "car_id", as: "car" });

StaffMember.hasMany(StaffMonthlyTarget, { foreignKey: "staff_id", as: "targets" });
StaffMonthlyTarget.belongsTo(StaffMember, { foreignKey: "staff_id", as: "staff" });

StaffMember.hasMany(CarSale, { foreignKey: "staff_id", as: "sales" });
CarSale.belongsTo(StaffMember, { foreignKey: "staff_id", as: "staff" });

Car.hasOne(CarSale, { foreignKey: "car_id", as: "sale" });
CarSale.belongsTo(Car, { foreignKey: "car_id", as: "car" });

export {
  sequelize,
  User,
  Car,
  Booking,
  SellRequest,
  SavedCar,
  ContactInquiry,
  SiteSettings,
  StaffMember,
  StaffMonthlyTarget,
  CarSale,
};
