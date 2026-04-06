/** Digits only, country code included (e.g. India 91XXXXXXXXXX). */
const DEFAULT_NUMBER = "919876543210";

export function getWhatsAppNumber(): string {
  const n = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, "");
  return n && n.length >= 10 ? n : DEFAULT_NUMBER;
}

/** Opens WhatsApp chat with optional preset message (URL-encoded). */
export function whatsAppChatUrl(message?: string, digitsOverride?: string): string {
  const cleaned = digitsOverride?.replace(/\D/g, "") ?? "";
  const num =
    cleaned.length >= 10 ? cleaned : getWhatsAppNumber();
  const base = `https://wa.me/${num}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

export const PRESET_HERO_ENQUIRY =
  "Hi Carnest, I would like to enquire about your premium car listings and book a viewing.";

export const PRESET_FLOAT_ENQUIRY =
  "Hi Carnest, I'd like to know more about your listings and services.";
