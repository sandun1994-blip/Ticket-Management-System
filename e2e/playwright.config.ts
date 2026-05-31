import { defineConfig, devices } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";

// Load test env so PORT etc. are available when building this config.
dotenv.config({ path: path.resolve(__dirname, "../server/.env.test") });

const serverPort = Number(process.env.PORT) || 3001;
const clientPort = 5174;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["html", { open: "never" }]],

  use: {
    baseURL: `http://localhost:${clientPort}`,
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  globalSetup: "./global-setup.ts",
  globalTeardown: "./global-teardown.ts",

  webServer: [
    {
      command: "bun --env-file=.env.test src/index.ts",
      cwd: path.resolve(__dirname, "../server"),
      url: `http://localhost:${serverPort}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: `bunx vite --port ${clientPort} --strictPort`,
      cwd: path.resolve(__dirname, "../client"),
      url: `http://localhost:${clientPort}`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      env: {
        VITE_API_BASE_URL: `http://localhost:${serverPort}`,
        VITE_API_URL: `http://localhost:${serverPort}`,
      },
    },
  ],
});
