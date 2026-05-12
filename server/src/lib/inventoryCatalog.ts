import fs from "fs";
import path from "path";
import { diskUploadUrlFromParts } from "./diskUploadUrls.js";

const PLACEHOLDER = "/placeholder.svg";

/** Subfolder under `UPLOAD_DIR` per car — must match your `server/uploads/*` layout. */
export const CAR_IMAGE_SUBFOLDERS = [
  "MG",
  "alcazar",
  "kia seltos",
  "creta",
  "rapid",
  "tata hexa",
  "xcent",
  "jaguar",
  "mercedese",
] as const;

export type CatalogCarSpec = {
  folder: string;
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
  description: string;
  is_featured: boolean;

  // Rich details (optional; used by the new Car Detail UI)
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
};

/** Full specs for the 9 inventory cars (WhatsApp list). Order matches `CAR_IMAGE_SUBFOLDERS`. */
export function catalogCarSpecs(): CatalogCarSpec[] {
  return [
    {
      folder: "MG",
      title: "MG Hector Sharp MT BS6",
      brand: "MG",
      model: "Hector",
      year: 2023,
      price: 1350000,
      market_price: 1500000,
      fuel_type: "Diesel",
      transmission: "Manual",
      km_driven: 85000,
      location: "Gujarat",
      variant_name: "Sharp",
      registration_year: 2022,
      registration_month: 3,
      owner_count: 1,
      color: "Starry Black",
      body_type: "SUV",
      rto_city: "Surat",
      engine_cc: 1956,
      power_bhp: 168,
      torque_nm: 350,
      drivetrain: "FWD",
      seating_capacity: 5,
      sunroof: true,
      alloy_wheels: true,
      led_headlamps: true,
      rear_camera: true,
      parking_sensors: true,
      ventilated_seats: true,
      leather_seats: true,
      digital_cluster: true,
      abs: true,
      esc: true,
      tpms: true,
      android_auto: true,
      apple_carplay: true,
      wireless_charging: true,
      cruise_control: true,
      emi_note: "EMI depends on bank, profile and downpayment.",
      description: [
        "Reg: GJ27 · Colour: Starry Black · Mfg year 2022, reg. March.",
        "1st owner · Insurance Feb 2027 (full) · 2 keys.",
        "Features: push button start, navigation, reverse & 360° cameras, cruise control, wireless charger, ventilated & electric seats, panoramic sunroof, alloy wheels, brand new tyres.",
        "Company service record available. Next-to-new condition.",
      ].join("\n"),
      is_featured: true,
    },
    {
      folder: "alcazar",
      title: "Hyundai Alcazar Platinum (O) 7-Seater",
      brand: "Hyundai",
      model: "Alcazar",
      year: 2022,
      price: 1390000,
      market_price: 1520000,
      fuel_type: "Diesel",
      transmission: "Automatic",
      km_driven: 70000,
      location: "Gujarat",
      variant_name: "Platinum (O)",
      registration_year: 2022,
      registration_month: 1,
      owner_count: 1,
      color: "White",
      body_type: "SUV",
      rto_city: "Ahmedabad",
      engine_cc: 1493,
      drivetrain: "FWD",
      seating_capacity: 7,
      sunroof: true,
      alloy_wheels: true,
      rear_camera: true,
      parking_sensors: true,
      abs: true,
      esc: true,
      android_auto: true,
      apple_carplay: true,
      wireless_charging: true,
      cruise_control: true,
      description: [
        "Reg: GJ02DM1483 · White · Jan registration.",
        "1st owner · Insurance Dec 2026 (full) · 2 keys.",
        "Push button, navigation, 360° camera, cruise control, panoramic sunroof, wireless charger, alloy wheels.",
        "Next-to-new condition.",
      ].join("\n"),
      is_featured: true,
    },
    {
      folder: "kia seltos",
      title: "Kia Seltos GTX+ Diesel AT",
      brand: "Kia",
      model: "Seltos",
      year: 2020,
      price: 1275000,
      market_price: 1400000,
      fuel_type: "Diesel",
      transmission: "Automatic",
      km_driven: 75000,
      location: "Gujarat",
      variant_name: "GTX+",
      registration_year: 2020,
      registration_month: 9,
      owner_count: 1,
      color: "White",
      body_type: "SUV",
      rto_city: "Surat",
      engine_cc: 1493,
      drivetrain: "FWD",
      seating_capacity: 5,
      sunroof: true,
      alloy_wheels: true,
      led_headlamps: true,
      rear_camera: true,
      parking_sensors: true,
      leather_seats: true,
      ambient_lighting: true,
      abs: true,
      esc: true,
      tpms: true,
      android_auto: true,
      apple_carplay: true,
      cruise_control: true,
      description: [
        "Reg: GJ-27 · White · GTX+ Auto.",
        "1st owner · Insurance valid to 22 Sep 2026 (full) · 2 keys.",
        "All new tyres. Genuine km.",
      ].join("\n"),
      is_featured: true,
    },
    {
      folder: "creta",
      title: "Hyundai Creta SX (O) Diesel MT",
      brand: "Hyundai",
      model: "Creta",
      year: 2021,
      price: 1390000,
      market_price: 1550000,
      fuel_type: "Diesel",
      transmission: "Manual",
      km_driven: 95000,
      location: "Gujarat",
      variant_name: "SX (O)",
      registration_year: 2021,
      registration_month: 9,
      owner_count: 1,
      color: "Black",
      body_type: "SUV",
      rto_city: "Surat",
      engine_cc: 1493,
      drivetrain: "FWD",
      seating_capacity: 5,
      sunroof: true,
      alloy_wheels: true,
      led_headlamps: true,
      rear_camera: true,
      parking_sensors: true,
      leather_seats: true,
      digital_cluster: true,
      airbags_count: 6,
      abs: true,
      esc: true,
      tpms: true,
      android_auto: true,
      apple_carplay: true,
      description: [
        "Reg: GJ 27 · Black · SX(O) variant.",
        "1st owner · Insurance full (19 Sep 2026).",
        "All new tyres · spare unused · 2nd key available. Genuine km.",
      ].join("\n"),
      is_featured: true,
    },
    {
      folder: "rapid",
      title: "Skoda Rapid Style Plus AT",
      brand: "Skoda",
      model: "Rapid",
      year: 2019,
      price: 835000,
      market_price: 930000,
      fuel_type: "Diesel",
      transmission: "Automatic",
      km_driven: 95000,
      location: "Gujarat",
      variant_name: "Style Plus",
      registration_year: 2019,
      registration_month: 2,
      owner_count: 1,
      color: "White",
      body_type: "Sedan",
      rto_city: "Ahmedabad",
      engine_cc: 1498,
      drivetrain: "FWD",
      seating_capacity: 5,
      rear_camera: true,
      parking_sensors: true,
      abs: true,
      description: [
        "Reg: GJ03 · White · Style Plus AT.",
        "1st owner · TP insurance 28 Feb 2027.",
        "All new tyres · 2nd key available. Genuine km.",
      ].join("\n"),
      is_featured: true,
    },
    {
      folder: "tata hexa",
      title: "Tata Hexa XT Diesel",
      brand: "Tata",
      model: "Hexa",
      year: 2017,
      price: 790000,
      market_price: 890000,
      fuel_type: "Diesel",
      transmission: "Manual",
      km_driven: 62000,
      location: "Gujarat",
      variant_name: "XT",
      registration_year: 2017,
      registration_month: 7,
      owner_count: 1,
      color: "Golden",
      body_type: "SUV",
      rto_city: "Surat",
      engine_cc: 2179,
      drivetrain: "RWD",
      seating_capacity: 7,
      alloy_wheels: true,
      rear_camera: true,
      parking_sensors: true,
      abs: true,
      description: [
        "Reg: GJ01 · Golden · XT trim.",
        "1st owner · Full insurance.",
        "All new tyres.",
      ].join("\n"),
      is_featured: true,
    },
    {
      folder: "xcent",
      title: "Hyundai Xcent S MT Petrol/CNG",
      brand: "Hyundai",
      model: "Xcent",
      year: 2019,
      price: 491000,
      market_price: 550000,
      fuel_type: "Petrol/CNG",
      transmission: "Manual",
      km_driven: 78000,
      location: "Gujarat",
      variant_name: "S",
      registration_year: 2019,
      registration_month: 8,
      owner_count: 1,
      color: "Grey",
      body_type: "Sedan",
      rto_city: "Surat",
      engine_cc: 1197,
      drivetrain: "FWD",
      seating_capacity: 5,
      rear_camera: true,
      parking_sensors: true,
      abs: true,
      android_auto: true,
      description: [
        "Reg: GJ05 · Grey · S MT · Petrol/CNG sequential.",
        "1st owner · Insurance: nil at listing · 2nd key available. Genuine km.",
      ].join("\n"),
      is_featured: true,
    },
    {
      folder: "jaguar",
      title: "Jaguar XF 2.2L Diesel",
      brand: "Jaguar",
      model: "XF",
      year: 2015,
      price: 1621000,
      market_price: 1900000,
      fuel_type: "Diesel",
      transmission: "Automatic",
      km_driven: 95500,
      location: "Gujarat",
      variant_name: "2.2L Diesel",
      registration_year: 2015,
      registration_month: 7,
      owner_count: 1,
      color: "Black",
      body_type: "Sedan",
      rto_city: "Surat",
      engine_cc: 2179,
      power_bhp: 187,
      torque_nm: 400,
      top_speed_kmph: 230,
      accel_0_100_sec: 8.5,
      drivetrain: "RWD",
      seating_capacity: 5,
      leather_seats: true,
      ambient_lighting: true,
      airbags_count: 6,
      abs: true,
      esc: true,
      rear_camera: true,
      parking_sensors: true,
      cruise_control: true,
      description: [
        "Reg: GJ05-0515 · Black · XF 2.2L · July 2015.",
        "1st owner · Insurance: nil at listing.",
        "All company service · ceramic coating · brand new tyres.",
      ].join("\n"),
      is_featured: true,
    },
    {
      folder: "mercedese",
      title: "Mercedes-Benz C220d",
      brand: "Mercedes-Benz",
      model: "C220d",
      year: 2023,
      price: 4575000,
      market_price: 5200000,
      fuel_type: "Diesel",
      transmission: "Automatic",
      km_driven: 8000,
      location: "Gujarat",
      variant_name: "C220d",
      registration_year: 2023,
      registration_month: 11,
      owner_count: 1,
      color: "Mojave Silver",
      body_type: "Sedan",
      rto_city: "Surat",
      engine_cc: 1993,
      power_bhp: 197,
      torque_nm: 440,
      top_speed_kmph: 246,
      accel_0_100_sec: 7.3,
      drivetrain: "RWD",
      seating_capacity: 5,
      boot_space_l: 455,
      sunroof: true,
      alloy_wheels: true,
      led_headlamps: true,
      rear_camera: true,
      parking_sensors: true,
      leather_seats: true,
      ambient_lighting: true,
      digital_cluster: true,
      airbags_count: 7,
      abs: true,
      esc: true,
      tpms: true,
      adas: false,
      android_auto: true,
      apple_carplay: true,
      wireless_charging: true,
      cruise_control: true,
      description: [
        "Reg: GJ05 · Mojave Silver · Nov 2023.",
        "1st owner · Insurance running.",
        "All company service · ceramic coating · brand new tyres. Genuine km.",
      ].join("\n"),
      is_featured: true,
    },
  ];
}

/** Lists image files under `dir` (recursive), returns paths relative to `dir`. Sorted. */
function listImageFilesRecursiveRel(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  const walk = (abs: string, rel: string) => {
    for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
      const name = ent.name;
      const nextAbs = path.join(abs, name);
      const nextRel = rel ? `${rel}/${name}` : name;
      if (ent.isDirectory()) {
        walk(nextAbs, nextRel);
      } else if (/\.(jpe?g|png|webp|gif)$/i.test(name)) {
        out.push(nextRel.replace(/\\/g, "/"));
      }
    }
  };
  walk(dir, "");
  return out.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

/**
 * Builds `/uploads/...` URLs for one car folder — same convention as admin disk upload
 * (`/uploads/<file>`), extended with subfolders under `UPLOAD_DIR`.
 */
export function imageUrlsForCarFolder(absUploadRoot: string, folder: string): string[] {
  const dir = path.join(absUploadRoot, folder);
  const relFiles = listImageFilesRecursiveRel(dir);
  if (relFiles.length === 0) {
    console.warn(`[inventory] No images under ${folder}/ — using placeholder.`);
    return [PLACEHOLDER];
  }
  return relFiles.map((rel) => {
    const parts = [folder, ...rel.split("/").filter(Boolean)];
    return diskUploadUrlFromParts(...parts);
  });
}

export function getUploadRootAbs(): string {
  const uploadDir = process.env.UPLOAD_DIR ?? "uploads";
  return path.resolve(process.cwd(), uploadDir);
}

/** For each catalog row, reads disk and returns `images` arrays (upload-style URLs). */
export function buildImagesFromDisk(): string[][] {
  const root = getUploadRootAbs();
  if (!fs.existsSync(root)) {
    console.warn(`[inventory] UPLOAD_DIR missing (${root}).`);
    return catalogCarSpecs().map(() => [PLACEHOLDER]);
  }
  return catalogCarSpecs().map((spec) => imageUrlsForCarFolder(root, spec.folder));
}
