const DEFAULT_CONTACT_NUMBER = "919714335588";

function cleanDigits(raw?: string): string {
  return raw?.replace(/\D/g, "") ?? "";
}

function isValidContactDigits(raw?: string): boolean {
  const digits = cleanDigits(raw);
  return digits.length >= 10 && digits.length <= 15;
}

export function resolvePublicContactDigits(cmsDigits?: string): string {
  if (isValidContactDigits(cmsDigits)) return cleanDigits(cmsDigits);

  const envPhoneTel = cleanDigits(import.meta.env.VITE_PUBLIC_PHONE_TEL);
  if (isValidContactDigits(envPhoneTel)) return envPhoneTel;

  const envWhatsapp = cleanDigits(import.meta.env.VITE_WHATSAPP_NUMBER);
  if (isValidContactDigits(envWhatsapp)) return envWhatsapp;

  return DEFAULT_CONTACT_NUMBER;
}

/** `tel:` href with E.164-style digits after +. */
export function digitsToTelHref(digits: string): string {
  const cleaned = resolvePublicContactDigits(digits);
  return `tel:+${cleaned}`;
}

/** Display string shown in UI (e.g. +91 98765 43210). */
export function formatPhoneDisplay(digits: string): string {
  const cleaned = resolvePublicContactDigits(digits);
  if (cleaned.startsWith("91") && cleaned.length === 12) {
    const national = cleaned.slice(2);
    return `+91 ${national.slice(0, 5)} ${national.slice(5)}`;
  }
  return `+${cleaned}`;
}

/** Backward-compatible wrapper used by legacy callers. */
export function getPublicPhoneDisplay(cmsDigits?: string): string {
  return formatPhoneDisplay(cmsDigits ?? "");
}

/** Backward-compatible wrapper used by legacy callers. */
export function getPublicPhoneTelHref(cmsDigits?: string): string {
  return digitsToTelHref(cmsDigits ?? "");
}
