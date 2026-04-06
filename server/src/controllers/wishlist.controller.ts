import type { Request, Response } from "express";
import { SavedCar, Car } from "../models/index.js";

function serializeCar(c: Car) {
  const imgs = Array.isArray(c.images) ? c.images : [];
  return {
    id: c.id,
    title: c.title,
    brand: c.brand,
    model: c.model,
    year: c.year,
    price: Number(c.price),
    fuel_type: c.fuel_type,
    transmission: c.transmission,
    km_driven: c.km_driven,
    location: c.location,
    images: imgs,
    image: imgs[0] ?? null,
    description: c.description,
    is_featured: c.is_featured,
  };
}

export async function listWishlist(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const rows = await SavedCar.findAll({
      where: { user_id: userId },
      include: [{ model: Car, as: "car" }],
      order: [["createdAt", "DESC"]],
    });
    const cars = rows
      .map((s) => (s as typeof s & { car?: Car }).car)
      .filter(Boolean) as Car[];
    res.json(cars.map(serializeCar));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load wishlist" });
  }
}

export async function addWishlist(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const carId = Number(req.params.carId);
    if (Number.isNaN(carId)) {
      res.status(400).json({ message: "Invalid car id" });
      return;
    }
    const car = await Car.findByPk(carId);
    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }
    await SavedCar.findOrCreate({ where: { user_id: userId, car_id: carId } });
    res.status(201).json({ message: "Saved" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to save car" });
  }
}

export async function removeWishlist(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const carId = Number(req.params.carId);
    await SavedCar.destroy({ where: { user_id: userId, car_id: carId } });
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to remove" });
  }
}
