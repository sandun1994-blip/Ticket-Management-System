import { execSync } from "child_process";
import path from "path";
import dotenv from "dotenv";

const serverDir = path.resolve(__dirname, "../server");

export default async function globalSetup() {
  dotenv.config({ path: path.resolve(serverDir, ".env.test") });

  const env = { ...process.env };

  console.log("[setup] Resetting test database...");
  execSync("bunx prisma migrate reset --force --skip-seed", {
    cwd: serverDir,
    stdio: "inherit",
    env,
  });

  console.log("[setup] Seeding test admin user...");
  execSync("bun prisma/seed.ts", {
    cwd: serverDir,
    stdio: "inherit",
    env,
  });

  console.log("[setup] Done.");
}
