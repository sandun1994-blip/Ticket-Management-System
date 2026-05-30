import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Role } from "@prisma/client";
import prisma from "../src/lib/prisma";

const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;

if (!email || !password) {
  console.error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set");
  process.exit(1);
}

// Enforce a minimum password length to prevent weak defaults (e.g. "password123")
// from being committed as the admin credential.
if (password.length < 16) {
  console.error(
    "SEED_ADMIN_PASSWORD must be at least 16 characters. " +
      "Use a strong, unique password for the admin account."
  );
  process.exit(1);
}

const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
});

const existing = await prisma.user.findUnique({ where: { email } });
if (existing) {
  console.log(`Admin user already exists: ${email}`);
  await prisma.$disconnect();
  process.exit(0);
}

const result = await auth.api.signUpEmail({
  body: { email, password, name: "Admin" },
});

if (!result) {
  console.error("Failed to create admin user");
  await prisma.$disconnect();
  process.exit(1);
}

await prisma.user.update({
  where: { email },
  data: { role: Role.ADMIN },
});

console.log(`Admin user created: ${email}`);
await prisma.$disconnect();
