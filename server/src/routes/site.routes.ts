import { Router } from "express";
import { getSitePublic } from "../controllers/sitePublic.controller.js";

const r = Router();
r.get("/public", getSitePublic);

export default r;
