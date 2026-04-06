import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validate.js";
import { registerSchema, loginSchema } from "../validators/auth.js";

const r = Router();
r.post("/register", validateBody(registerSchema), register);
r.post("/login", validateBody(loginSchema), login);

export default r;
