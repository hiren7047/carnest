import { Router } from "express";
import {
  listCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from "../controllers/cars.controller.js";
import { authRequired, requireAdmin } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { createCarSchema, updateCarSchema } from "../validators/cars.js";

const r = Router();
r.get("/", listCars);
r.get("/:id", getCarById);
r.post("/", authRequired, requireAdmin, validateBody(createCarSchema), createCar);
r.put("/:id", authRequired, requireAdmin, validateBody(updateCarSchema), updateCar);
r.delete("/:id", authRequired, requireAdmin, deleteCar);

export default r;
