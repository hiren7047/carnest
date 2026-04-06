import { Router } from "express";
import { createSellRequest } from "../controllers/sell.controller.js";
import { upload } from "../config/multer.js";
import { validateBody } from "../middlewares/validate.js";
import { sellRequestSchema } from "../validators/sell.js";

const r = Router();
r.post("/", upload.array("images", 12), validateBody(sellRequestSchema), createSellRequest);

export default r;
