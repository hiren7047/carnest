import { Router } from "express";
import { uploadFiles } from "../controllers/upload.controller.js";
import { upload } from "../config/multer.js";
import { authRequired } from "../middlewares/auth.js";

const r = Router();
r.post("/", authRequired, upload.array("files", 12), uploadFiles);

export default r;
