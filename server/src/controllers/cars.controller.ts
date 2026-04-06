import type { Request, Response } from "express";
import { Op } from "sequelize";
import { Car } from "../models/index.js";
import { normalizeCarImagesFromDb } from "../lib/carImages.js";

function parseBool(v: unknown): boolean | undefined {
  if (v === "true" || v === true) return true;
  if (v === "false" || v === false) return false;
  return undefined;
}

export async function listCars(req: Request, res: Response): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 12));
    const offset = (page - 1) * limit;

    const brand = req.query.brand as string | undefined;
    const minPrice = req.query.minPrice != null ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice != null ? Number(req.query.maxPrice) : undefined;
    const fuel_type = req.query.fuel_type as string | undefined;
    const transmission = req.query.transmission as string | undefined;
    const location = req.query.location as string | undefined;
    const featured = parseBool(req.query.featured);

    const sortField = req.query.sort === "price" ? "price" : "year";
    const orderDir = req.query.order === "asc" ? "ASC" : "DESC";

    const where: Record<string, unknown> = {};
    if (brand) where.brand = brand;
    if (fuel_type) where.fuel_type = fuel_type;
    if (transmission) where.transmission = transmission;
    if (location) where.location = location;
    if (featured === true) where.is_featured = true;
    const minOk = minPrice != null && !Number.isNaN(minPrice);
    const maxOk = maxPrice != null && !Number.isNaN(maxPrice);
    if (minOk && maxOk) {
      where.price = { [Op.between]: [minPrice!, maxPrice!] };
    } else if (minOk) {
      where.price = { [Op.gte]: minPrice! };
    } else if (maxOk) {
      where.price = { [Op.lte]: maxPrice! };
    }

    const { rows, count } = await Car.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortField, orderDir]],
    });

    res.json({
      data: rows.map(serializeCar),
      meta: { total: count, page, limit, pages: Math.ceil(count / limit) || 1 },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to list cars" });
  }
}

function serializeCar(c: Car) {
  const imgs = normalizeCarImagesFromDb(c.images as unknown);
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
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

async function findSimilar(car: Car, limit = 4) {
  const price = Number(car.price);
  const band = Math.max(price * 0.2, 500000);
  return Car.findAll({
    where: {
      id: { [Op.ne]: car.id },
      [Op.or]: [
        { brand: car.brand },
        {
          price: {
            [Op.between]: [Math.max(0, price - band), price + band],
          },
        },
      ],
    },
    limit,
    order: [["is_featured", "DESC"]],
  });
}

export async function getCarById(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }
    const car = await Car.findByPk(id);
    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }
    const similar = await findSimilar(car, 4);
    res.json({
      car: serializeCar(car),
      similar: similar.map(serializeCar),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load car" });
  }
}

export async function createCar(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as Record<string, unknown>;
    const car = await Car.create({
      title: body.title as string,
      brand: body.brand as string,
      model: body.model as string,
      year: body.year as number,
      price: body.price as number,
      fuel_type: body.fuel_type as string,
      transmission: body.transmission as string,
      km_driven: (body.km_driven as number) ?? 0,
      location: body.location as string,
      images: normalizeCarImagesFromDb(body.images),
      description: (body.description as string) ?? "",
      is_featured: Boolean(body.is_featured),
    });
    res.status(201).json(serializeCar(car));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to create car" });
  }
}

export async function updateCar(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const car = await Car.findByPk(id);
    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }
    const body = req.body as Record<string, unknown>;
    const allowed = [
      "title",
      "brand",
      "model",
      "year",
      "price",
      "fuel_type",
      "transmission",
      "km_driven",
      "location",
      "images",
      "description",
      "is_featured",
    ] as const;
    for (const key of allowed) {
      if (body[key] !== undefined) {
        if (key === "images") {
          (car as unknown as Record<string, unknown>).images = normalizeCarImagesFromDb(body.images);
        } else {
          (car as unknown as Record<string, unknown>)[key] = body[key];
        }
      }
    }
    await car.save();
    res.json(serializeCar(car));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update car" });
  }
}

export async function deleteCar(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const car = await Car.findByPk(id);
    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }
    await car.destroy();
    res.status(204).send();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to delete car" });
  }
}
