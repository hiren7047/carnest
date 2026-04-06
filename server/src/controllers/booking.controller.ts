import type { Request, Response } from "express";
import { Booking, Car } from "../models/index.js";

export async function createBooking(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { car_id, date } = req.body as { car_id: number; date: string };
    const car = await Car.findByPk(car_id);
    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }
    const parsed = new Date(date as string);
    if (Number.isNaN(parsed.getTime())) {
      res.status(400).json({ message: "Invalid date" });
      return;
    }
    const dateStr = parsed.toISOString().slice(0, 10);
    const booking = await Booking.create({
      user_id: userId,
      car_id,
      date: new Date(`${dateStr}T12:00:00.000Z`),
      status: "pending",
    });
    const withCar = await Booking.findByPk(booking.id, {
      include: [{ model: Car, as: "car" }],
    });
    res.status(201).json(formatBooking(withCar!));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to create booking" });
  }
}

function formatBooking(b: Booking & { car?: Car }) {
  const c = b.car;
  return {
    id: b.id,
    user_id: b.user_id,
    car_id: b.car_id,
    date: b.date,
    status: b.status,
    car: c
      ? {
          id: c.id,
          title: c.title,
          brand: c.brand,
          images: c.images,
          price: Number(c.price),
        }
      : undefined,
    createdAt: b.createdAt,
  };
}

export async function listUserBookings(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const rows = await Booking.findAll({
      where: { user_id: userId },
      include: [{ model: Car, as: "car" }],
      order: [["date", "DESC"]],
    });
    res.json(rows.map((b) => formatBooking(b as Booking & { car?: Car })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to list bookings" });
  }
}
