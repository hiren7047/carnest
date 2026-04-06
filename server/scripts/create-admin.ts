/**
 * Create or promote an admin user (bcrypt password).
 * Usage: npx tsx scripts/create-admin.ts <email> <password>
 * Example: npm run create-admin -- you@example.com YourSecurePass
 */
import "dotenv/config";
import bcrypt from "bcrypt";
import sequelize from "../src/config/database.js";
import "../src/models/index.js";
import { User } from "../src/models/index.js";

const SALT_ROUNDS = 12;

async function main() {
  const emailArg = process.argv[2];
  const passwordArg = process.argv[3];
  if (!emailArg || !passwordArg) {
    console.error("Usage: tsx scripts/create-admin.ts <email> <password>");
    process.exit(1);
  }

  const email = emailArg.trim().toLowerCase();
  const hash = await bcrypt.hash(passwordArg, SALT_ROUNDS);
  const name = email.split("@")[0] || "Admin";

  await sequelize.authenticate();

  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      password: hash,
      role: "admin",
    },
  });

  if (!created) {
    await user.update({
      password: hash,
      role: "admin",
    });
    console.log("Updated existing user to admin:", email);
  } else {
    console.log("Created admin user:", email);
  }

  await sequelize.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
