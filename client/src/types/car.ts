import { resolveMediaUrl } from "@/utils/mediaUrl";

/** Shape returned by GET /api/cars and list endpoints */
export type ApiCar = {
  id: number;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  market_price?: number | null;
  fuel_type: string;
  transmission: string;
  km_driven: number;
  location: string;
  images: string[];
  image: string | null;
  description: string;
  is_featured: boolean;

  variant_name?: string | null;
  registration_year?: number | null;
  registration_month?: number | null;
  owner_count?: number | null;
  color?: string | null;
  body_type?: string | null;
  rto_city?: string | null;

  engine_cc?: number | null;
  power_bhp?: number | null;
  torque_nm?: number | null;
  top_speed_kmph?: number | null;
  accel_0_100_sec?: number | null;
  drivetrain?: string | null;
  seating_capacity?: number | null;
  boot_space_l?: number | null;

  battery_kwh?: number | null;
  range_km?: number | null;
  charging_time_ac?: string | null;
  charging_time_dc?: string | null;

  insurance_valid_till?: string | null;
  warranty_info?: string | null;
  service_history?: string | null;

  sunroof?: boolean;
  alloy_wheels?: boolean;
  led_headlamps?: boolean;
  fog_lamps?: boolean;
  rear_camera?: boolean;
  parking_sensors?: boolean;

  ventilated_seats?: boolean;
  leather_seats?: boolean;
  ambient_lighting?: boolean;
  digital_cluster?: boolean;

  airbags_count?: number | null;
  abs?: boolean;
  esc?: boolean;
  tpms?: boolean;
  adas?: boolean;

  android_auto?: boolean;
  apple_carplay?: boolean;
  wireless_charging?: boolean;
  cruise_control?: boolean;

  emi_note?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CarsListResponse = {
  data: ApiCar[];
  meta: { total: number; page: number; limit: number; pages: number };
};

export type CarDetailResponse = {
  car: ApiCar;
  similar: ApiCar[];
};

/** UI-friendly car (aligned with existing components) */
export type CarView = {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  marketPrice?: number | null;
  year: number;
  kmDriven: number;
  fuelType: string;
  transmission: string;
  location: string;
  image: string;
  images: string[];
  description: string;
  is_featured: boolean;
  isPremium?: boolean;
  isHotDeal?: boolean;

  variantName?: string | null;
  registrationYear?: number | null;
  registrationMonth?: number | null;
  ownerCount?: number | null;
  color?: string | null;
  bodyType?: string | null;
  rtoCity?: string | null;

  engineCc?: number | null;
  powerBhp?: number | null;
  torqueNm?: number | null;
  topSpeedKmph?: number | null;
  accel0To100Sec?: number | null;
  drivetrain?: string | null;
  seatingCapacity?: number | null;
  bootSpaceL?: number | null;

  batteryKwh?: number | null;
  rangeKm?: number | null;
  chargingTimeAc?: string | null;
  chargingTimeDc?: string | null;

  insuranceValidTill?: string | null;
  warrantyInfo?: string | null;
  serviceHistory?: string | null;

  sunroof?: boolean;
  alloyWheels?: boolean;
  ledHeadlamps?: boolean;
  fogLamps?: boolean;
  rearCamera?: boolean;
  parkingSensors?: boolean;

  ventilatedSeats?: boolean;
  leatherSeats?: boolean;
  ambientLighting?: boolean;
  digitalCluster?: boolean;

  airbagsCount?: number | null;
  abs?: boolean;
  esc?: boolean;
  tpms?: boolean;
  adas?: boolean;

  androidAuto?: boolean;
  appleCarplay?: boolean;
  wirelessCharging?: boolean;
  cruiseControl?: boolean;

  emiNote?: string | null;
};

export function mapApiCarToView(c: ApiCar): CarView {
  const imgs = Array.isArray(c.images) ? c.images.map(resolveMediaUrl) : [];
  const primary = resolveMediaUrl(c.image ?? imgs[0]) ?? "/placeholder.svg";
  return {
    id: String(c.id),
    name: c.title,
    brand: c.brand,
    model: c.model,
    price: c.price,
    marketPrice: c.market_price != null ? c.market_price : null,
    year: c.year,
    kmDriven: c.km_driven,
    fuelType: c.fuel_type,
    transmission: c.transmission,
    location: c.location,
    image: primary,
    images: imgs.length ? imgs : [primary],
    description: c.description ?? "",
    is_featured: c.is_featured,
    isPremium: c.is_featured,
    isHotDeal: false,

    variantName: c.variant_name ?? null,
    registrationYear: c.registration_year ?? null,
    registrationMonth: c.registration_month ?? null,
    ownerCount: c.owner_count ?? null,
    color: c.color ?? null,
    bodyType: c.body_type ?? null,
    rtoCity: c.rto_city ?? null,

    engineCc: c.engine_cc ?? null,
    powerBhp: c.power_bhp ?? null,
    torqueNm: c.torque_nm ?? null,
    topSpeedKmph: c.top_speed_kmph ?? null,
    accel0To100Sec: c.accel_0_100_sec ?? null,
    drivetrain: c.drivetrain ?? null,
    seatingCapacity: c.seating_capacity ?? null,
    bootSpaceL: c.boot_space_l ?? null,

    batteryKwh: c.battery_kwh ?? null,
    rangeKm: c.range_km ?? null,
    chargingTimeAc: c.charging_time_ac ?? null,
    chargingTimeDc: c.charging_time_dc ?? null,

    insuranceValidTill: c.insurance_valid_till ?? null,
    warrantyInfo: c.warranty_info ?? null,
    serviceHistory: c.service_history ?? null,

    sunroof: Boolean(c.sunroof),
    alloyWheels: Boolean(c.alloy_wheels),
    ledHeadlamps: Boolean(c.led_headlamps),
    fogLamps: Boolean(c.fog_lamps),
    rearCamera: Boolean(c.rear_camera),
    parkingSensors: Boolean(c.parking_sensors),

    ventilatedSeats: Boolean(c.ventilated_seats),
    leatherSeats: Boolean(c.leather_seats),
    ambientLighting: Boolean(c.ambient_lighting),
    digitalCluster: Boolean(c.digital_cluster),

    airbagsCount: c.airbags_count ?? null,
    abs: Boolean(c.abs),
    esc: Boolean(c.esc),
    tpms: Boolean(c.tpms),
    adas: Boolean(c.adas),

    androidAuto: Boolean(c.android_auto),
    appleCarplay: Boolean(c.apple_carplay),
    wirelessCharging: Boolean(c.wireless_charging),
    cruiseControl: Boolean(c.cruise_control),

    emiNote: c.emi_note ?? null,
  };
}
