import { Router } from "express";
import { createContactInquiry } from "../controllers/contact.controller.js";
import { validateBody } from "../middlewares/validate.js";
import { contactInquirySchema } from "../validators/contact.js";

const r = Router();
r.post("/", validateBody(contactInquirySchema), createContactInquiry);

export default r;
