import type { Request, Response } from "express";
import { Op } from "sequelize";
import { Car, CarSale, StaffMember, StaffMonthlyTarget } from "../models/index.js";
import { normalizeCarImagesFromDb } from "../lib/carImages.js";
import { monthDateRange, resolveYearMonth, type MonthPeriod } from "../lib/monthPeriod.js";

const STAFF_COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#ef4444"];

function serializeStaff(s: StaffMember) {
  return {
    id: s.id,
    name: s.name,
    phone: s.phone,
    email: s.email,
    is_active: s.is_active,
    color: s.color,
    sort_order: s.sort_order,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}

function serializeSale(sale: CarSale, car?: Car | null, staff?: StaffMember | null) {
  const imgs = car ? normalizeCarImagesFromDb(car.images as unknown) : [];
  return {
    id: sale.id,
    car_id: sale.car_id,
    staff_id: sale.staff_id,
    sale_price: Number(sale.sale_price),
    sold_at: sale.sold_at,
    notes: sale.notes,
    car: car
      ? {
          id: car.id,
          title: car.title,
          brand: car.brand,
          model: car.model,
          year: car.year,
          image: imgs[0] ?? null,
        }
      : null,
    staff: staff ? { id: staff.id, name: staff.name, color: staff.color } : null,
  };
}

export async function listStaff(_req: Request, res: Response): Promise<void> {
  try {
    const rows = await StaffMember.findAll({ order: [["sort_order", "ASC"], ["name", "ASC"]] });
    res.json({ data: rows.map(serializeStaff) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load staff" });
  }
}

export async function createStaff(req: Request, res: Response): Promise<void> {
  try {
    const { name, phone, email, color, sort_order } = req.body as {
      name: string;
      phone?: string | null;
      email?: string | null;
      color?: string;
      sort_order?: number;
    };
    const count = await StaffMember.count({ where: { is_active: true } });
    if (count >= 20) {
      res.status(400).json({ message: "Maximum active staff limit reached" });
      return;
    }
    const row = await StaffMember.create({
      name: name.trim(),
      phone: phone?.trim() || null,
      email: email?.trim() || null,
      color: color || STAFF_COLORS[count % STAFF_COLORS.length],
      sort_order: sort_order ?? count,
      is_active: true,
    });
    res.status(201).json(serializeStaff(row));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to create staff" });
  }
}

export async function updateStaff(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    const row = await StaffMember.findByPk(id);
    if (!row) {
      res.status(404).json({ message: "Staff not found" });
      return;
    }
    const body = req.body as Partial<{
      name: string;
      phone: string | null;
      email: string | null;
      is_active: boolean;
      color: string;
      sort_order: number;
    }>;
    if (body.name != null) row.name = body.name.trim();
    if (body.phone !== undefined) row.phone = body.phone?.trim() || null;
    if (body.email !== undefined) row.email = body.email?.trim() || null;
    if (body.is_active != null) row.is_active = body.is_active;
    if (body.color != null) row.color = body.color;
    if (body.sort_order != null) row.sort_order = body.sort_order;
    await row.save();
    res.json(serializeStaff(row));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to update staff" });
  }
}

export async function upsertStaffTarget(req: Request, res: Response): Promise<void> {
  try {
    const staffId = Number(req.params.id);
    const staff = await StaffMember.findByPk(staffId);
    if (!staff) {
      res.status(404).json({ message: "Staff not found" });
      return;
    }
    const { year, month, target_cars, target_revenue, notes } = req.body as {
      year: number;
      month: number;
      target_cars: number;
      target_revenue?: number | null;
      notes?: string | null;
    };
    const [target] = await StaffMonthlyTarget.findOrCreate({
      where: { staff_id: staffId, year, month },
      defaults: {
        staff_id: staffId,
        year,
        month,
        target_cars,
        target_revenue: target_revenue ?? null,
        notes: notes?.trim() || null,
      },
    });
    target.target_cars = target_cars;
    target.target_revenue = target_revenue ?? null;
    target.notes = notes?.trim() || null;
    await target.save();
    res.json({
      id: target.id,
      staff_id: target.staff_id,
      year: target.year,
      month: target.month,
      target_cars: target.target_cars,
      target_revenue: target.target_revenue != null ? Number(target.target_revenue) : null,
      notes: target.notes,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to save target" });
  }
}

export async function getStaffPerformance(req: Request, res: Response): Promise<void> {
  try {
    const period = (req.query.period as MonthPeriod) || "current";
    let year = req.query.year != null ? Number(req.query.year) : undefined;
    let month = req.query.month != null ? Number(req.query.month) : undefined;
    if (year == null || month == null || Number.isNaN(year) || Number.isNaN(month)) {
      const resolved = resolveYearMonth(period);
      year = resolved.year;
      month = resolved.month;
    }
    const { start, end } = monthDateRange(year!, month!);
    const label = resolveYearMonth("current", new Date(year!, month! - 1, 1)).label;

    const staffRows = await StaffMember.findAll({
      where: { is_active: true },
      order: [["sort_order", "ASC"], ["name", "ASC"]],
    });

    const targets = await StaffMonthlyTarget.findAll({
      where: { year: year!, month: month! },
    });
    const targetByStaff = new Map(targets.map((t) => [t.staff_id, t]));

    const sales = await CarSale.findAll({
      where: { sold_at: { [Op.gte]: start, [Op.lt]: end } },
      include: [
        { model: Car, as: "car", required: false },
        { model: StaffMember, as: "staff", required: false },
      ],
      order: [["sold_at", "DESC"]],
    });

    const salesByStaff = new Map<number, CarSale[]>();
    for (const sale of sales) {
      const list = salesByStaff.get(sale.staff_id) ?? [];
      list.push(sale);
      salesByStaff.set(sale.staff_id, list);
    }

    const staff = staffRows.map((s) => {
      const target = targetByStaff.get(s.id);
      const memberSales = salesByStaff.get(s.id) ?? [];
      const soldCount = memberSales.length;
      const soldRevenue = memberSales.reduce((sum, x) => sum + Number(x.sale_price), 0);
      const targetCars = target?.target_cars ?? 0;
      const targetRevenue = target?.target_revenue != null ? Number(target.target_revenue) : null;
      const progressPercent =
        targetCars > 0 ? Math.min(100, Math.round((soldCount / targetCars) * 100)) : soldCount > 0 ? 100 : 0;
      const revenueProgressPercent =
        targetRevenue && targetRevenue > 0
          ? Math.min(100, Math.round((soldRevenue / targetRevenue) * 100))
          : soldRevenue > 0
            ? 100
            : 0;

      return {
        ...serializeStaff(s),
        target_cars: targetCars,
        target_revenue: targetRevenue,
        target_notes: target?.notes ?? null,
        sold_count: soldCount,
        sold_revenue: soldRevenue,
        progress_percent: progressPercent,
        revenue_progress_percent: revenueProgressPercent,
        milestone_reached: targetCars > 0 && soldCount >= targetCars,
        sales: memberSales.map((sale) =>
          serializeSale(sale, sale.get("car") as Car | undefined, sale.get("staff") as StaffMember | undefined)
        ),
      };
    });

    const totals = staff.reduce(
      (acc, s) => ({
        target_cars: acc.target_cars + s.target_cars,
        target_revenue: acc.target_revenue + (s.target_revenue ?? 0),
        sold_count: acc.sold_count + s.sold_count,
        sold_revenue: acc.sold_revenue + s.sold_revenue,
      }),
      { target_cars: 0, target_revenue: 0, sold_count: 0, sold_revenue: 0 }
    );

    res.json({
      period: { year: year!, month: month!, label, key: period },
      staff,
      totals: {
        ...totals,
        progress_percent:
          totals.target_cars > 0
            ? Math.min(100, Math.round((totals.sold_count / totals.target_cars) * 100))
            : totals.sold_count > 0
              ? 100
              : 0,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load performance" });
  }
}

export async function listSales(req: Request, res: Response): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const offset = (page - 1) * limit;
    const staffId = req.query.staff_id != null ? Number(req.query.staff_id) : undefined;
    const year = req.query.year != null ? Number(req.query.year) : undefined;
    const month = req.query.month != null ? Number(req.query.month) : undefined;

    const where: Record<string, unknown> = {};
    if (staffId && !Number.isNaN(staffId)) where.staff_id = staffId;
    if (year && month && !Number.isNaN(year) && !Number.isNaN(month)) {
      const { start, end } = monthDateRange(year, month);
      where.sold_at = { [Op.gte]: start, [Op.lt]: end };
    }

    const { rows, count } = await CarSale.findAndCountAll({
      where,
      include: [
        { model: Car, as: "car", required: false },
        { model: StaffMember, as: "staff", required: false },
      ],
      order: [["sold_at", "DESC"]],
      limit,
      offset,
    });

    res.json({
      data: rows.map((sale) =>
        serializeSale(sale, sale.get("car") as Car | undefined, sale.get("staff") as StaffMember | undefined)
      ),
      meta: { total: count, page, limit, pages: Math.ceil(count / limit) || 1 },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to list sales" });
  }
}

export async function recordSale(req: Request, res: Response): Promise<void> {
  try {
    const { car_id, staff_id, sale_price, sold_at, notes } = req.body as {
      car_id: number;
      staff_id: number;
      sale_price: number;
      sold_at?: string;
      notes?: string | null;
    };

    const car = await Car.findByPk(car_id);
    if (!car) {
      res.status(404).json({ message: "Car not found" });
      return;
    }
    if (car.listing_status === "sold") {
      res.status(400).json({ message: "This car is already marked as sold" });
      return;
    }

    const staff = await StaffMember.findByPk(staff_id);
    if (!staff || !staff.is_active) {
      res.status(400).json({ message: "Invalid or inactive staff member" });
      return;
    }

    const existing = await CarSale.findOne({ where: { car_id } });
    if (existing) {
      res.status(400).json({ message: "Sale record already exists for this car" });
      return;
    }

    const soldDate = sold_at ? new Date(sold_at) : new Date();
    const sale = await CarSale.create({
      car_id,
      staff_id,
      sale_price,
      sold_at: soldDate,
      notes: notes?.trim() || null,
    });

    car.listing_status = "sold";
    car.sold_at = soldDate;
    car.is_featured = false;
    await car.save();

    res.status(201).json(
      serializeSale(sale, car, staff)
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to record sale" });
  }
}

export async function listAvailableCarsForSale(_req: Request, res: Response): Promise<void> {
  try {
    const rows = await Car.findAll({
      where: {
        [Op.or]: [{ listing_status: "available" }, { listing_status: null }],
      } as never,
      order: [["brand", "ASC"], ["title", "ASC"]],
      attributes: ["id", "title", "brand", "model", "year", "price", "images"],
    });
    res.json({
      data: rows.map((c) => {
        const imgs = normalizeCarImagesFromDb(c.images as unknown);
        return {
          id: c.id,
          title: c.title,
          brand: c.brand,
          model: c.model,
          year: c.year,
          price: Number(c.price),
          image: imgs[0] ?? null,
        };
      }),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load cars" });
  }
}
