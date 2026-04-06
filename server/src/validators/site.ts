import Joi from "joi";
import type { SiteContent } from "../types/siteContent.js";

const heroSchema = Joi.object({
  eyebrow: Joi.string().max(200).required(),
  headlineLines: Joi.array().items(Joi.string().max(500)).min(1).max(10).required(),
  subheadline: Joi.string().max(500).required(),
  heroImageUrl: Joi.string().max(2000).allow("").required(),
  primaryCtaLabel: Joi.string().max(120).required(),
  primaryCtaHref: Joi.string().max(500).required(),
  secondaryCtaLabel: Joi.string().max(120).required(),
  secondaryCtaHref: Joi.string().max(500).required(),
});

const testimonialItemSchema = Joi.object({
  name: Joi.string().max(120).required(),
  city: Joi.string().max(120).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  text: Joi.string().max(2000).required(),
});

const testimonialsSchema = Joi.object({
  sectionTitle: Joi.string().max(200).required(),
  items: Joi.array().items(testimonialItemSchema).min(1).max(20).required(),
});

const contactSchema = Joi.object({
  whatsappNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({ "string.pattern.base": "WhatsApp number must be 10–15 digits" }),
  supportEmail: Joi.string().email().allow("").required(),
});

export const siteContentSchema = Joi.object({
  hero: heroSchema.required(),
  testimonials: testimonialsSchema.required(),
  contact: contactSchema.required(),
});

export function validateSiteContent(data: unknown): SiteContent {
  const { error, value } = siteContentSchema.validate(data, { abortEarly: false, stripUnknown: true });
  if (error) {
    throw new Error(error.details.map((d) => d.message).join("; "));
  }
  return value as SiteContent;
}

/** Partial merge payload (admin PUT): top-level sections only; nested fields merged in code before full validation. */
export const siteContentPartialSchema = Joi.object({
  hero: Joi.object().unknown(true).optional(),
  testimonials: Joi.object().unknown(true).optional(),
  contact: Joi.object().unknown(true).optional(),
}).min(1);
