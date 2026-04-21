/** Display string shown in UI (e.g. +91 98765 43210). */
export function getPublicPhoneDisplay(): string {
  return import.meta.env.VITE_PUBLIC_PHONE_DISPLAY ?? "+91 97378 75735";
}

/** `tel:` href with E.164-style digits after +. */
export function getPublicPhoneTelHref(): string {
  const raw = import.meta.env.VITE_PUBLIC_PHONE_TEL;
  const digits = (typeof raw === "string" ? raw : "919737875735").replace(/\D/g, "");
  return `tel:+${digits}`;
}
