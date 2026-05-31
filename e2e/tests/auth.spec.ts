import { test, expect } from "@playwright/test";

// Set in globalSetup via dotenv — available to test files via process.env.
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD!;

test.describe("Login page", () => {
  test("renders the sign-in form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("Ticket Management")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("redirects unauthenticated users to /login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("shows error with invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("wrong@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });

  test("admin can sign in and reach the home page", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(ADMIN_EMAIL);
    await page.getByLabel("Password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL("/");
  });
});
