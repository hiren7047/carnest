import Joi from "joi";

export const patchSellRequestSchema = Joi.object({
  status: Joi.string().valid("pending", "contacted", "closed").optional(),
  admin_notes: Joi.string().max(10000).allow("", null).optional(),
}).min(1);

export const patchAdminBookingSchema = Joi.object({
  status: Joi.string().valid("pending", "confirmed", "cancelled").required(),
});

export const putSiteMergeSchema = Joi.object({
  content: Joi.object().unknown(true).required(),
});
