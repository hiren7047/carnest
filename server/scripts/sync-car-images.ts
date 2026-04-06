/**
 * Updates `images` for the 9 inventory cars from `server/uploads/<folder>/`
 * (same paths as admin disk upload: `/uploads/...`). Run after adding/reordering photos.
 *
 *   npm run sync:cars
 */
import "dotenv/config";
import sequelize from "../src/config/database.js";
import { Car } from "../src/models/index.js";
import { buildImagesFromDisk, catalogCarSpecs } from "../src/lib/inventoryCatalog.js";

async function main() {
  await sequelize.authenticate();
  const specs = catalogCarSpecs();
  const allImages = buildImagesFromDisk();

  let updated = 0;
  for (let i = 0; i < specs.length; i++) {
    const s = specs[i];
    const images = allImages[i] ?? [];
    const [n] = await Car.update(
      { images },
      { where: { brand: s.brand, model: s.model } }
    );
    if (n === 0) {
      console.warn(`[sync] No row for ${s.brand} ${s.model} — run npm run seed:refresh first.`);
    } else {
      updated += n;
      console.log(`[sync] ${s.brand} ${s.model}: ${images.length} image(s)`);
    }
  }

  console.log(`[sync] Done. Updated ${updated} row(s).`);
  await sequelize.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
