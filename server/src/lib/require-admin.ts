import type { RequestHandler } from "express";

/**
 * Server-side admin role enforcement middleware.
 *
 * Must be composed AFTER requireAuth so that req.user is already populated.
 * Returns 403 Forbidden for any authenticated user whose role is not ADMIN.
 *
 * Usage:
 *   app.use("/api/users", requireAuth, requireAdmin, usersRouter);
 *   app.get("/api/admin/stats", requireAuth, requireAdmin, handler);
 */
export const requireAdmin: RequestHandler = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
};
