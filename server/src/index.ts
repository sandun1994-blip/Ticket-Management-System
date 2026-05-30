import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { requireAuth } from "./lib/require-auth";
import { requireAdmin } from "./lib/require-admin";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(helmet());

// CORS: origins are driven by the same TRUSTED_ORIGINS env var used by Better Auth.
// auth.ts already validates that this list is non-empty at startup.
const allowedOrigins = (process.env.TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server requests (no Origin header) and listed origins.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS policy`));
      }
    },
    credentials: true,
  })
);

// Rate limit authentication endpoints to mitigate brute-force attacks.
// Applied before the Better Auth handler so it covers all auth routes.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts, please try again later." },
});
app.use("/api/auth/sign-in", authLimiter);

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Return only the fields the client needs — do not expose session token,
// IP address, or userAgent from the session object.
app.get("/api/me", requireAuth, (req, res) => {
  const { id, name, email, role } = req.user!;
  res.json({ user: { id, name, email, role } });
});

// Export requireAdmin for use in future admin-only route files.
// Example usage:
//   import { requireAdmin } from "./lib/require-admin";
//   app.use("/api/users", requireAuth, requireAdmin, usersRouter);
export { requireAdmin };

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
