/**
 * Legacy module — prefer `@/types/car` and `@/utils/formatPrice`.
 * Mock `cars` array removed; listings load from the API.
 */
export { formatPrice } from "@/utils/formatPrice";
export type { CarView as Car } from "@/types/car";
export { brands, fuelTypes, transmissions, locations, bodyTypes } from "@/utils/constants";
