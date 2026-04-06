import Joi from "joi";

export const contactInquirySchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().max(255).required(),
  phone: Joi.string().max(32).allow("").optional(),
  message: Joi.string().min(10).max(5000).required(),
});
