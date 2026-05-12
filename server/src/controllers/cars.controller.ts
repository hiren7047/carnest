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
    const yearQ = req.query.year != null ? Number(req.query.year) : undefined;
    const featured = parseBool(req.query.featured);

    const sortField = req.query.sort === "price" ? "price" : "year";
    const orderDir = req.query.order === "asc" ? "ASC" : "DESC";

    const where: Record<string, unknown> = {};
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
    market_price: c.market_price != null ? Number(c.market_price) : null,
    fuel_type: c.fuel_type,
    transmission: c.transmission,
    km_driven: c.km_driven,
    location: c.location,
    images: imgs,
    image: imgs[0] ?? null,
    description: c.description,
    is_featured: c.is_featured,

    variant_name: c.variant_name ?? null,
    registration_year: c.registration_year ?? null,
    registration_month: c.registration_month ?? null,
    owner_count: c.owner_count ?? null,
    color: c.color ?? null,
    body_type: c.body_type ?? null,
    rto_city: c.rto_city ?? null,

    engine_cc: c.engine_cc ?? null,
    power_bhp: c.power_bhp != null ? Number(c.power_bhp) : null,
    torque_nm: c.torque_nm != null ? Number(c.torque_nm) : null,
    top_speed_kmph: c.top_speed_kmph ?? null,
    accel_0_100_sec: c.accel_0_100_sec != null ? Number(c.accel_0_100_sec) : null,
    drivetrain: c.drivetrain ?? null,
    seating_capacity: c.seating_capacity ?? null,
    boot_space_l: c.boot_space_l ?? null,

    battery_kwh: c.battery_kwh != null ? Number(c.battery_kwh) : null,
    range_km: c.range_km ?? null,
    charging_time_ac: c.charging_time_ac ?? null,
    charging_time_dc: c.charging_time_dc ?? null,

    insurance_valid_till: c.insurance_valid_till ?? null,
    warranty_info: c.warranty_info ?? null,
    service_history: c.service_history ?? null,

    sunroof: Boolean(c.sunroof),
    alloy_wheels: Boolean(c.alloy_wheels),
    led_headlamps: Boolean(c.led_headlamps),
    fog_lamps: Boolean(c.fog_lamps),
    rear_camera: Boolean(c.rear_camera),
    parking_sensors: Boolean(c.parking_sensors),

    ventilated_seats: Boolean(c.ventilated_seats),
    leather_seats: Boolean(c.leather_seats),
    ambient_lighting: Boolean(c.ambient_lighting),
    digital_cluster: Boolean(c.digital_cluster),

    airbags_count: c.airbags_count ?? null,
    abs: Boolean(c.abs),
    esc: Boolean(c.esc),
    tpms: Boolean(c.tpms),
    adas: Boolean(c.adas),

    android_auto: Boolean(c.android_auto),
    apple_carplay: Boolean(c.apple_carplay),
    wireless_charging: Boolean(c.wireless_charging),
    cruise_control: Boolean(c.cruise_control),

    emi_note: c.emi_note ?? null,
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
      market_price:
        body.market_price != null && body.market_price !== ""
          ? Number(body.market_price as number)
          : null,
      fuel_type: body.fuel_type as string,
      transmission: body.transmission as string,
      km_driven: (body.km_driven as number) ?? 0,
      location: body.location as string,
      images: normalizeCarImagesFromDb(body.images),
      description: (body.description as string) ?? "",
      is_featured: Boolean(body.is_featured),

      variant_name: (body.variant_name as string) ?? null,
      registration_year: (body.registration_year as number) ?? null,
      registration_month: (body.registration_month as number) ?? null,
      owner_count: (body.owner_count as number) ?? null,
      color: (body.color as string) ?? null,
      body_type: (body.body_type as string) ?? null,
      rto_city: (body.rto_city as string) ?? null,

      engine_cc: (body.engine_cc as number) ?? null,
      power_bhp: (body.power_bhp as number) ?? null,
      torque_nm: (body.torque_nm as number) ?? null,
      top_speed_kmph: (body.top_speed_kmph as number) ?? null,
      accel_0_100_sec: (body.accel_0_100_sec as number) ?? null,
      drivetrain: (body.drivetrain as string) ?? null,
      seating_capacity: (body.seating_capacity as number) ?? null,
      boot_space_l: (body.boot_space_l as number) ?? null,

      battery_kwh: (body.battery_kwh as number) ?? null,
      range_km: (body.range_km as number) ?? null,
      charging_time_ac: (body.charging_time_ac as string) ?? null,
      charging_time_dc: (body.charging_time_dc as string) ?? null,

      insurance_valid_till: (body.insurance_valid_till as string) ?? null,
      warranty_info: (body.warranty_info as string) ?? null,
      service_history: (body.service_history as string) ?? null,

      sunroof: Boolean(body.sunroof),
      alloy_wheels: Boolean(body.alloy_wheels),
      led_headlamps: Boolean(body.led_headlamps),
      fog_lamps: Boolean(body.fog_lamps),
      rear_camera: Boolean(body.rear_camera),
      parking_sensors: Boolean(body.parking_sensors),

      ventilated_seats: Boolean(body.ventilated_seats),
      leather_seats: Boolean(body.leather_seats),
      ambient_lighting: Boolean(body.ambient_lighting),
      digital_cluster: Boolean(body.digital_cluster),

      airbags_count: (body.airbags_count as number) ?? null,
      abs: Boolean(body.abs),
      esc: Boolean(body.esc),
      tpms: Boolean(body.tpms),
      adas: Boolean(body.adas),

      android_auto: Boolean(body.android_auto),
      apple_carplay: Boolean(body.apple_carplay),
      wireless_charging: Boolean(body.wireless_charging),
      cruise_control: Boolean(body.cruise_control),

      emi_note: (body.emi_note as string) ?? null,
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
      "market_price",
      "fuel_type",
      "transmission",
      "km_driven",
      "location",
      "images",
      "description",
      "is_featured",

      "variant_name",
      "registration_year",
      "registration_month",
      "owner_count",
      "color",
      "body_type",
      "rto_city",

      "engine_cc",
      "power_bhp",
      "torque_nm",
      "top_speed_kmph",
      "accel_0_100_sec",
      "drivetrain",
      "seating_capacity",
      "boot_space_l",

      "battery_kwh",
      "range_km",
      "charging_time_ac",
      "charging_time_dc",

      "insurance_valid_till",
      "warranty_info",
      "service_history",

      "sunroof",
      "alloy_wheels",
      "led_headlamps",
      "fog_lamps",
      "rear_camera",
      "parking_sensors",

      "ventilated_seats",
      "leather_seats",
      "ambient_lighting",
      "digital_cluster",

      "airbags_count",
      "abs",
      "esc",
      "tpms",
      "adas",

      "android_auto",
      "apple_carplay",
      "wireless_charging",
      "cruise_control",

      "emi_note",
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
