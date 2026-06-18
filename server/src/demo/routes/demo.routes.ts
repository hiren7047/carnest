import { Router } from "express";
import {
  resolveDemoSlug,
  demoAuthRequired,
  demoOptionalAuth,
  requireDemoAdmin,
} from "../middlewares/demoContext.js";
import { getDemoConfig, getDemoSitePublic } from "../controllers/demoConfig.controller.js";
import { demoLogin, demoRegister, demoMe } from "../controllers/demoAuth.controller.js";
import {
  listDemoCars,
  getDemoCarById,
  demoCarMutationsBlocked,
} from "../controllers/demoCars.controller.js";
import {
  demoAdminStats,
  getDemoSiteAdmin,
  putDemoSiteAdminMerge,
  listDemoAdminCars,
  listDemoSellRequests,
  listDemoBookings,
  listDemoStaff,
  getDemoStaffPerformance,
  demoAdminMutationBlocked,
} from "../controllers/demoAdmin.controller.js";
import {
  submitDemoContact,
  submitDemoSell,
  createDemoBooking,
  patchDemoSellRequest,
  patchDemoBooking,
} from "../controllers/demoSandbox.controller.js";

const router = Router({ mergeParams: true });

router.use(resolveDemoSlug);

router.get("/config", getDemoConfig);
router.get("/site/public", getDemoSitePublic);

router.post("/auth/login", demoLogin);
router.post("/auth/register", demoRegister);
router.get("/auth/me", demoAuthRequired, demoMe);

router.get("/cars", demoOptionalAuth, listDemoCars);
router.get("/cars/:id", demoOptionalAuth, getDemoCarById);
router.post("/cars", demoAuthRequired, requireDemoAdmin, demoCarMutationsBlocked);
router.put("/cars/:id", demoAuthRequired, requireDemoAdmin, demoCarMutationsBlocked);
router.delete("/cars/:id", demoAuthRequired, requireDemoAdmin, demoCarMutationsBlocked);

router.post("/contact", submitDemoContact);
router.post("/sell", submitDemoSell);
router.post("/bookings", demoAuthRequired, createDemoBooking);

router.get("/admin/stats", demoAuthRequired, requireDemoAdmin, demoAdminStats);
router.get("/admin/site", demoAuthRequired, requireDemoAdmin, getDemoSiteAdmin);
router.put("/admin/site", demoAuthRequired, requireDemoAdmin, putDemoSiteAdminMerge);
router.get("/admin/cars", demoAuthRequired, requireDemoAdmin, listDemoAdminCars);
router.get("/admin/sell-requests", demoAuthRequired, requireDemoAdmin, listDemoSellRequests);
router.patch("/admin/sell-requests/:id", demoAuthRequired, requireDemoAdmin, patchDemoSellRequest);
router.get("/admin/bookings", demoAuthRequired, requireDemoAdmin, listDemoBookings);
router.patch("/admin/bookings/:id", demoAuthRequired, requireDemoAdmin, patchDemoBooking);
router.get("/admin/staff", demoAuthRequired, requireDemoAdmin, listDemoStaff);
router.get("/admin/staff/performance", demoAuthRequired, requireDemoAdmin, getDemoStaffPerformance);
router.post("/admin/staff", demoAuthRequired, requireDemoAdmin, demoAdminMutationBlocked);
router.put("/admin/staff/:id", demoAuthRequired, requireDemoAdmin, demoAdminMutationBlocked);
router.delete("/admin/staff/:id", demoAuthRequired, requireDemoAdmin, demoAdminMutationBlocked);

export default router;
