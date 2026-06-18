import { Router } from "express";
import { hubAuthRequired } from "../middlewares/hubAuth.js";
import { hubLogin, hubMe } from "../controllers/hubAuth.controller.js";
import {
  listDemos,
  getDemo,
  createDemo,
  updateDemo,
  archiveDemo,
  uploadDemoLogo,
  searchDemos,
} from "../controllers/hubDemos.controller.js";
import { upload } from "../../config/multer.js";
import { defaultSiteContent } from "../../lib/siteContentDefaults.js";

const router = Router();

router.post("/auth/login", hubLogin);
router.get("/auth/me", hubAuthRequired, hubMe);

router.get("/defaults/site-content", (_req, res) => {
  res.json({ content: defaultSiteContent() });
});

router.get("/demos", hubAuthRequired, listDemos);
router.get("/demos/search", hubAuthRequired, searchDemos);
router.get("/demos/:id", hubAuthRequired, getDemo);
router.post("/demos", hubAuthRequired, createDemo);
router.put("/demos/:id", hubAuthRequired, updateDemo);
router.delete("/demos/:id", hubAuthRequired, archiveDemo);
router.post("/demos/:id/logo", hubAuthRequired, upload.single("logo"), uploadDemoLogo);

export default router;
