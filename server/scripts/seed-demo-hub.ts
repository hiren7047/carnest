import "dotenv/config";
import bcrypt from "bcrypt";
import {
  demoHubSequelize,
  HubAdmin,
  TemplateCar,
  TemplateUser,
  TemplateStaffMember,
  TemplateStaffMonthlyTarget,
} from "../src/hub/models/index.js";
import { defaultSiteContent } from "../src/lib/siteContentDefaults.js";
import { buildImagesFromDisk, catalogCarSpecs, type CatalogCarSpec } from "../src/lib/inventoryCatalog.js";

const SALT_ROUNDS = 12;

type SeedCar = Record<string, unknown>;

function specToSeed(s: CatalogCarSpec, images: string[]): SeedCar {
  const { folder: _, ...rest } = s;
  return { ...rest, images };
}

function buildCatalogCars(): SeedCar[] {
  const imgs = buildImagesFromDisk();
  return catalogCarSpecs().map((s, i) => specToSeed(s, imgs[i] ?? ["/placeholder.svg"]));
}

async function seedHubAdmin() {
  const email = (process.env.HUB_ADMIN_EMAIL ?? "you@carnest.in").toLowerCase();
  const password = process.env.HUB_ADMIN_PASSWORD ?? "HubAdmin123!";
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const [row, created] = await HubAdmin.findOrCreate({
    where: { email },
    defaults: { name: "Demo Hub Admin", email, password: hash },
  });
  if (!created) {
    await row.update({ password: hash });
  }
  console.log(`Hub admin: ${email} / ${password}`);
}

async function seedTemplateUsers() {
  const users = [
    { name: "Demo Admin", email: "admin@demo.com", password: "Demo123!", role: "admin" as const },
    { name: "Demo Buyer", email: "buyer@demo.com", password: "Demo123!", role: "user" as const },
  ];
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, SALT_ROUNDS);
    const [row, created] = await TemplateUser.findOrCreate({
      where: { email: u.email },
      defaults: { name: u.name, email: u.email, password: hash, role: u.role },
    });
    if (!created) {
      await row.update({ password: hash, role: u.role, name: u.name });
    }
  }
  console.log("Template users: admin@demo.com / Demo123!, buyer@demo.com / Demo123!");
}

async function seedTemplateCars() {
  const count = await TemplateCar.count();
  if (count > 0) {
    console.log(`Template cars already present (${count}), skipping.`);
    return;
  }
  const cars = buildCatalogCars();
  await TemplateCar.bulkCreate(cars as never[]);
  console.log(`Seeded ${cars.length} template cars.`);
}

async function seedTemplateStaff() {
  const count = await TemplateStaffMember.count();
  if (count > 0) {
    console.log("Template staff already present, skipping.");
    return;
  }
  const staff = await TemplateStaffMember.bulkCreate([
    { name: "Amit Shah", phone: "9876543210", email: "amit@demo.com", color: "#3b82f6", sort_order: 1 },
    { name: "Priya Mehta", phone: "9876543211", email: "priya@demo.com", color: "#f97316", sort_order: 2 },
    { name: "Rahul Desai", phone: "9876543212", email: "rahul@demo.com", color: "#22c55e", sort_order: 3 },
  ]);
  const now = new Date();
  await TemplateStaffMonthlyTarget.bulkCreate(
    staff.map((s) => ({
      staff_id: s.id,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      target_cars: 5,
      target_revenue: 5000000,
    }))
  );
  console.log(`Seeded ${staff.length} template staff members.`);
}

async function seed() {
  await demoHubSequelize.authenticate();
  console.log("[DemoHub] Connected to demo hub database.");
  await demoHubSequelize.sync({ alter: true });

  await seedHubAdmin();
  await seedTemplateUsers();
  await seedTemplateCars();
  await seedTemplateStaff();

  // Reference default CMS for hub create-demo defaults (not stored as row — used by API)
  void defaultSiteContent();

  console.log("Demo hub seed complete.");
  await demoHubSequelize.close();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
