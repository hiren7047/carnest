import { Router } from "express";
import { listWishlist, addWishlist, removeWishlist } from "../controllers/wishlist.controller.js";
import { authRequired } from "../middlewares/auth.js";

const r = Router();
r.get("/", authRequired, listWishlist);
r.post("/:carId", authRequired, addWishlist);
r.delete("/:carId", authRequired, removeWishlist);

export default r;
