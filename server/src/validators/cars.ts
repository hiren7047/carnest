import Joi from "joi";

export const createCarSchema = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  brand: Joi.string().min(1).max(120).required(),
  model: Joi.string().min(1).max(120).required(),
  year: Joi.number().integer().min(1990).max(2030).required(),
  price: Joi.number().integer().min(0).required(),
  fuel_type: Joi.string().max(60).required(),
  transmission: Joi.string().max(60).required(),
  km_driven: Joi.number().integer().min(0).default(0),
  location: Joi.string().max(120).required(),
  images: Joi.array().items(Joi.string().min(1)).min(1).required(),
  description: Joi.string().allow("").max(20000),
  is_featured: Joi.boolean().default(false),
});

export const updateCarSchema = Joi.object({
  title: Joi.string().min(2).max(255),
  brand: Joi.string().min(1).max(120),
  model: Joi.string().min(1).max(120),
  year: Joi.number().integer().min(1990).max(2030),
  price: Joi.number().integer().min(0),
  fuel_type: Joi.string().max(60),
  transmission: Joi.string().max(60),
  km_driven: Joi.number().integer().min(0),
  location: Joi.string().max(120),
  images: Joi.array().items(Joi.string().min(1)).min(1),
  description: Joi.string().allow("").max(20000),
  is_featured: Joi.boolean(),
});
