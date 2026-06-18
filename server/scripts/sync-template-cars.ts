/**
 * Updates `images` on template_cars from `server/uploads/<folder>/`.
 * Run after copying production uploads or adding car photos.
 *
 *   npm run sync:template-cars
 */
import "dotenv/config";
import { demoHubSequelize } from "../src/config/demoHubDatabase.js";
import { TemplateCar } from "../src/hub/models/index.js";
import { buildImagesFromDisk, catalogCarSpecs } from "../src/lib/inventoryCatalog.js";

async function main() {
  await demoHubSequelize.authenticate();
  const specs = catalogCarSpecs();
  const allImages = buildImagesFromDisk();

  let updated = 0;
  for (let i = 0; i < specs.length; i++) {
    const s = specs[i];
    const images = allImages[i] ?? [];
    const [n] = await TemplateCar.update(
      { images },
      { where: { brand: s.brand, model: s.model } }
    );
    if (n === 0) {
      console.warn(`[sync:template] No row for ${s.brand} ${s.model} — run npm run seed:demo-hub first.`);
    } else {
      updated += n;
      console.log(`[sync:template] ${s.brand} ${s.model}: ${images.length} image(s)`);
    }
  }

  console.log(`[sync:template] Done. Updated ${updated} row(s).`);
  await demoHubSequelize.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
