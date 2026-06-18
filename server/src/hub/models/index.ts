import demoHubSequelize from "../../config/demoHubDatabase.js";
import { HubAdmin } from "./HubAdmin.js";
import { Demo } from "./Demo.js";
import { DemoBranding } from "./DemoBranding.js";
import { DemoSiteContent } from "./DemoSiteContent.js";
import { DemoContact } from "./DemoContact.js";
import { TemplateCar } from "./TemplateCar.js";
import { TemplateUser } from "./TemplateUser.js";
import { TemplateStaffMember } from "./TemplateStaffMember.js";
import { TemplateStaffMonthlyTarget } from "./TemplateStaffMonthlyTarget.js";
import { TemplateCarSale } from "./TemplateCarSale.js";
import { DemoSandboxBooking } from "./DemoSandboxBooking.js";
import { DemoSandboxSellRequest } from "./DemoSandboxSellRequest.js";
import { DemoSandboxContactInquiry } from "./DemoSandboxContactInquiry.js";

Demo.hasOne(DemoBranding, { foreignKey: "demo_id", as: "branding" });
DemoBranding.belongsTo(Demo, { foreignKey: "demo_id", as: "demo" });

Demo.hasOne(DemoSiteContent, { foreignKey: "demo_id", as: "siteContent" });
DemoSiteContent.belongsTo(Demo, { foreignKey: "demo_id", as: "demo" });

Demo.hasOne(DemoContact, { foreignKey: "demo_id", as: "contactInfo" });
DemoContact.belongsTo(Demo, { foreignKey: "demo_id", as: "demo" });

Demo.hasMany(DemoSandboxBooking, { foreignKey: "demo_id", as: "bookings" });
DemoSandboxBooking.belongsTo(Demo, { foreignKey: "demo_id", as: "demo" });

Demo.hasMany(DemoSandboxSellRequest, { foreignKey: "demo_id", as: "sellRequests" });
DemoSandboxSellRequest.belongsTo(Demo, { foreignKey: "demo_id", as: "demo" });

Demo.hasMany(DemoSandboxContactInquiry, { foreignKey: "demo_id", as: "contactInquiries" });
DemoSandboxContactInquiry.belongsTo(Demo, { foreignKey: "demo_id", as: "demo" });

TemplateStaffMember.hasMany(TemplateStaffMonthlyTarget, {
  foreignKey: "staff_id",
  as: "targets",
});
TemplateStaffMonthlyTarget.belongsTo(TemplateStaffMember, {
  foreignKey: "staff_id",
  as: "staff",
});

TemplateStaffMember.hasMany(TemplateCarSale, { foreignKey: "staff_id", as: "sales" });
TemplateCarSale.belongsTo(TemplateStaffMember, { foreignKey: "staff_id", as: "staff" });

TemplateCar.hasOne(TemplateCarSale, { foreignKey: "car_id", as: "sale" });
TemplateCarSale.belongsTo(TemplateCar, { foreignKey: "car_id", as: "car" });

export {
  demoHubSequelize,
  HubAdmin,
  Demo,
  DemoBranding,
  DemoSiteContent,
  DemoContact,
  TemplateCar,
  TemplateUser,
  TemplateStaffMember,
  TemplateStaffMonthlyTarget,
  TemplateCarSale,
  DemoSandboxBooking,
  DemoSandboxSellRequest,
  DemoSandboxContactInquiry,
};
