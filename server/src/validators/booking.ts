import Joi from "joi";

export const createBookingSchema = Joi.object({
  car_id: Joi.number().integer().positive().required(),
  date: Joi.string().required(),
});
