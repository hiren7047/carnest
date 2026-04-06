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
import { patchSellRequestSchema, patchAdminBookingSchema, putSiteMergeSchema } from "../validators/admin.js";

const r = Router();
r.use(authRequired, requireAdmin);

r.get("/stats", adminStats);
r.get("/sell-requests", listSellRequestsAdmin);
r.patch("/sell-requests/:id", validateBody(patchSellRequestSchema), patchSellRequestAdmin);
r.get("/bookings", listBookingsAdmin);
r.patch("/bookings/:id", validateBody(patchAdminBookingSchema), patchBookingAdmin);
r.get("/site", getSiteAdmin);
r.put("/site", validateBody(putSiteMergeSchema), putSiteAdmin);

export default r;
