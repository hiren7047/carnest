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
  fuel_type: string;
  transmission: string;
  km_driven: number;
  location: string;
  description: string;
  is_featured: boolean;
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
      fuel_type: "Diesel",
      transmission: "Manual",
      km_driven: 85000,
      location: "Gujarat",
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
      fuel_type: "Diesel",
      transmission: "Automatic",
      km_driven: 70000,
      location: "Gujarat",
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
      fuel_type: "Diesel",
      transmission: "Automatic",
      km_driven: 75000,
      location: "Gujarat",
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
      fuel_type: "Diesel",
      transmission: "Manual",
      km_driven: 95000,
      location: "Gujarat",
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
      fuel_type: "Diesel",
      transmission: "Automatic",
      km_driven: 95000,
      location: "Gujarat",
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
      fuel_type: "Diesel",
      transmission: "Manual",
      km_driven: 62000,
      location: "Gujarat",
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
      fuel_type: "Petrol/CNG",
      transmission: "Manual",
      km_driven: 78000,
      location: "Gujarat",
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
      fuel_type: "Diesel",
      transmission: "Automatic",
      km_driven: 95500,
      location: "Gujarat",
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
      fuel_type: "Diesel",
      transmission: "Automatic",
      km_driven: 8000,
      location: "Gujarat",
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
