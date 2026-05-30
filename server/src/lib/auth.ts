import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

// Fail fast: BETTER_AUTH_SECRET is required for secure session signing.
// If it is absent, Better Auth may derive an insecure fallback secret.
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error(
    "BETTER_AUTH_SECRET environment variable is required. " +
      "Generate one with: openssl rand -base64 32"
  );
}

const trustedOrigins = (process.env.TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// Fail fast: at least one trusted origin must be configured so that
// the CORS and CSRF protections built into Better Auth are effective.
if (trustedOrigins.length === 0) {
  throw new Error(
    "TRUSTED_ORIGINS environment variable is required. " +
      "Example: TRUSTED_ORIGINS=http://localhost:5173"
  );
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  trustedOrigins,
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "AGENT",
        input: false,
      },
    },
  },
});
