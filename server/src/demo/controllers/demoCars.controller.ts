import type { Request, Response } from "express";
import { Op } from "sequelize";
import { TemplateCar } from "../../hub/models/TemplateCar.js";
import { serializeTemplateCar } from "../lib/serializeTemplateCar.js";

function parseBool(v: unknown): boolean | undefined {
  if (v === "true" || v === true) return true;
  if (v === "false" || v === false) return false;
  return undefined;
}

export async function listDemoCars(req: Request, res: Response): Promise<void> {
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
    const yearQ = req.query.year != null ? Number(req.query.year) : undefined;
    const featured = parseBool(req.query.featured);
    const sortField = req.query.sort === "price" ? "price" : "year";
    const orderDir = req.query.order === "asc" ? "ASC" : "DESC";

    const adminViewAll = req.query.all === "true" && req.demoUser?.role === "admin";
    const where: Record<string, unknown> = adminViewAll
      ? {}
      : {
          [Op.or]: [{ listing_status: "available" }, { listing_status: { [Op.is]: null } }],
        };

    if (brand) where.brand = brand;
    if (fuel_type) where.fuel_type = fuel_type;
    if (transmission) where.transmission = transmission;
    if (location) where.location = location;
    if (yearQ != null && !Number.isNaN(yearQ) && yearQ >= 1990 && yearQ <= 2035) {
      where.year = yearQ;
    }
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

    const { rows, count } = await TemplateCar.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortField, orderDir]],
    });

    res.json({
      data: rows.map(serializeTemplateCar),
      meta: { total: count, page, limit, pages: Math.ceil(count / limit) || 1 },
      demo_mode: true,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to list cars" });
  }
}

async function findSimilar(car: TemplateCar, limit = 4) {
  const price = Number(car.price);
  const band = Math.max(price * 0.2, 500000);
  return TemplateCar.findAll({
    where: {
      id: { [Op.ne]: car.id },
      [Op.or]: [
        { brand: car.brand },
        { price: { [Op.between]: [Math.max(0, price - band), price + band] } },
      ],
    },
    limit,
    order: [["is_featured", "DESC"]],
  });
}

export async function getDemoCarById(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }
    const car = await TemplateCar.findByPk(id);
    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }
    const adminView = req.demoUser?.role === "admin";
    if (!adminView && (car.listing_status === "sold" || car.listing_status === "withdrawn")) {
      res.status(404).json({ message: "Car not found" });
      return;
    }
    const similar = await findSimilar(car, 4);
    res.json({
      car: serializeTemplateCar(car),
      similar: similar.map(serializeTemplateCar),
      demo_mode: true,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load car" });
  }
}

export async function demoCarMutationsBlocked(_req: Request, res: Response): Promise<void> {
  res.status(403).json({
    message: "Car inventory is read-only in demo mode. Sample data is shared across all demos.",
  });
}
