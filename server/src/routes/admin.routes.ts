import { Router } from "express";
import { authRequired, requireAdmin } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import {
  adminStats,
  listSellRequestsAdmin,
  patchSellRequestAdmin,
  listBookingsAdmin,
  patchBookingAdmin,
  getSiteAdmin,
  putSiteAdmin,
} from "../controllers/admin.controller.js";
import {
  listStaff,
  createStaff,
  updateStaff,
  upsertStaffTarget,
  getStaffPerformance,
  listSales,
  recordSale,
  listAvailableCarsForSale,
} from "../controllers/staff.controller.js";
import { patchSellRequestSchema, patchAdminBookingSchema, putSiteMergeSchema } from "../validators/admin.js";
import {
  createStaffSchema,
  updateStaffSchema,
  upsertTargetSchema,
  recordSaleSchema,
} from "../validators/staff.js";

const r = Router();
r.use(authRequired, requireAdmin);

r.get("/stats", adminStats);
r.get("/sell-requests", listSellRequestsAdmin);
r.patch("/sell-requests/:id", validateBody(patchSellRequestSchema), patchSellRequestAdmin);
r.get("/bookings", listBookingsAdmin);
r.patch("/bookings/:id", validateBody(patchAdminBookingSchema), patchBookingAdmin);
r.get("/site", getSiteAdmin);
r.put("/site", validateBody(putSiteMergeSchema), putSiteAdmin);

r.get("/staff", listStaff);
r.get("/staff/performance", getStaffPerformance);
r.post("/staff", validateBody(createStaffSchema), createStaff);
r.patch("/staff/:id", validateBody(updateStaffSchema), updateStaff);
r.put("/staff/:id/targets", validateBody(upsertTargetSchema), upsertStaffTarget);
r.get("/sales", listSales);
r.post("/sales", validateBody(recordSaleSchema), recordSale);
r.get("/sales/available-cars", listAvailableCarsForSale);

export default r;
