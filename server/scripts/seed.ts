import "dotenv/config";
import bcrypt from "bcrypt";
import sequelize from "../src/config/database.js";
import { User, Car, Booking, SavedCar, SiteSettings } from "../src/models/index.js";
import { defaultSiteContent } from "../src/lib/siteContentDefaults.js";
import { buildImagesFromDisk, catalogCarSpecs, type CatalogCarSpec } from "../src/lib/inventoryCatalog.js";

const SALT_ROUNDS = 12;

const forceReseed =
  process.argv.includes("--force") ||
  process.env.FORCE_RESEED_CARS === "true" ||
  process.env.FORCE_RESEED_CARS === "1";

export type SeedCar = {
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuel_type: string;
  transmission: string;
  km_driven: number;
  location: string;
  images: string[];
  description: string;
  is_featured: boolean;
};

function specToSeed(s: CatalogCarSpec, images: string[]): SeedCar {
  const { folder: _, ...rest } = s;
  return { ...rest, images };
}

function buildCatalogCars(): SeedCar[] {
  const imgs = buildImagesFromDisk();
  return catalogCarSpecs().map((s, i) => specToSeed(s, imgs[i] ?? ["/placeholder.svg"]));
}

/** Exported for tests */
export const sampleCars: SeedCar[] = buildCatalogCars();

const demoUsers: { name: string; email: string; password: string; role: "user" }[] = [
  { name: "Rahul Verma", email: "rahul@demo.com", password: "User123!", role: "user" },
  { name: "Sneha Patel", email: "sneha@demo.com", password: "User123!", role: "user" },
  { name: "Vikram Singh", email: "vikram@demo.com", password: "User123!", role: "user" },
  { name: "Ananya Iyer", email: "ananya@demo.com", password: "User123!", role: "user" },
];

async function seedDemoUsers() {
  for (const u of demoUsers) {
    const hash = await bcrypt.hash(u.password, SALT_ROUNDS);
    const [row, created] = await User.findOrCreate({
      where: { email: u.email },
      defaults: {
        name: u.name,
        email: u.email,
        password: hash,
        role: u.role,
      },
    });
    if (!created && row.role !== u.role) {
      await row.update({ role: u.role, password: hash });
    }
  }
  console.log(`Ensured ${demoUsers.length} demo user accounts (see seed output for passwords).`);
}

async function seedCars() {
  const count = await Car.count();
  if (forceReseed && count > 0) {
    console.log("FORCE_RESEED_CARS=true: removing bookings and saved cars, then cars…");
    await Booking.destroy({ where: {} });
    await SavedCar.destroy({ where: {} });
    await Car.destroy({ where: {} });
  }
  const after = await Car.count();
  if (after === 0) {
    const cars = buildCatalogCars();
    await Car.bulkCreate(cars);
    console.log(`Seeded ${cars.length} cars (images from uploads/ folders).`);
  } else {
    console.log("Cars already present, skipping car seed. Use --force or FORCE_RESEED_CARS=true to replace.");
  }
}

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  const adminEmail = "admin@carnest.com";
  const adminPass = "Admin123!";
  const hash = await bcrypt.hash(adminPass, SALT_ROUNDS);
  const [admin] = await User.findOrCreate({
    where: { email: adminEmail },
    defaults: {
      name: "Carnest Admin",
      email: adminEmail,
      password: hash,
      role: "admin",
    },
  });
  if (admin.role !== "admin") {
    await admin.update({ role: "admin", password: hash });
  }

  await seedDemoUsers();

  await seedCars();

  const siteRow = await SiteSettings.findByPk(1);
  if (!siteRow) {
    await SiteSettings.create({ id: 1, content: defaultSiteContent() });
    console.log("Seeded default site_settings (homepage CMS).");
  }

  console.log("Seed complete.");
  console.log(`Admin login: ${adminEmail} / ${adminPass} (development only)`);
  console.log("Demo users (password User123!): rahul@demo.com, sneha@demo.com, vikram@demo.com, ananya@demo.com");
  await sequelize.close();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
