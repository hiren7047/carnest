import Joi from "joi";

export const createStaffSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  phone: Joi.string().trim().max(32).allow("", null),
  email: Joi.string().trim().email().allow("", null),
  color: Joi.string().trim().max(20).optional(),
  sort_order: Joi.number().integer().min(0).max(999).optional(),
});

export const updateStaffSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120),
  phone: Joi.string().trim().max(32).allow("", null),
  email: Joi.string().trim().email().allow("", null),
  is_active: Joi.boolean(),
  color: Joi.string().trim().max(20),
  sort_order: Joi.number().integer().min(0).max(999),
}).min(1);

export const upsertTargetSchema = Joi.object({
  year: Joi.number().integer().min(2020).max(2100).required(),
  month: Joi.number().integer().min(1).max(12).required(),
  target_cars: Joi.number().integer().min(0).max(100).required(),
  target_revenue: Joi.number().integer().min(0).allow(null),
  notes: Joi.string().max(500).allow("", null),
});

export const recordSaleSchema = Joi.object({
  car_id: Joi.number().integer().positive().required(),
  staff_id: Joi.number().integer().positive().required(),
  sale_price: Joi.number().integer().positive().required(),
  sold_at: Joi.date().iso().optional(),
  notes: Joi.string().max(2000).allow("", null),
});

export const performanceQuerySchema = Joi.object({
  period: Joi.string().valid("last", "current", "next").default("current"),
  year: Joi.number().integer().min(2020).max(2100),
  month: Joi.number().integer().min(1).max(12),
});
