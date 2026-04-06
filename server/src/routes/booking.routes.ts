import { Router } from "express";
import { createBooking, listUserBookings } from "../controllers/booking.controller.js";
import { authRequired } from "../middlewares/auth.js";
import { validateBody } from "../middlewares/validate.js";
import { createBookingSchema } from "../validators/booking.js";

const r = Router();
r.post("/", authRequired, validateBody(createBookingSchema), createBooking);
r.get("/user", authRequired, listUserBookings);

export default r;
