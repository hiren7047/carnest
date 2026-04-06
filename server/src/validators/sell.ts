import Joi from "joi";

export const sellRequestSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  phone: Joi.string().min(8).max(32).required(),
  car_details: Joi.string().min(10).max(10000).required(),
});
