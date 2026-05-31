import { Router } from "express";
import { requireAuth } from "../lib/require-auth";
import prisma from "../lib/prisma";
import { TicketStatus, TicketCategory } from "@prisma/client";

const router = Router();

router.use(requireAuth);

const ticketInclude = {
  createdBy: { select: { id: true, name: true, email: true } },
  assignedTo: { select: { id: true, name: true, email: true } },
} as const;

router.get("/", async (_req, res) => {
  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
    include: ticketInclude,
  });
  res.json({ tickets });
});

router.get("/:id", async (req, res) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: req.params.id },
    include: ticketInclude,
  });
  if (!ticket) {
    res.status(404).json({ error: "Ticket not found" });
    return;
  }
  res.json({ ticket });
});

router.post("/", async (req, res) => {
  const { title, description, category } = req.body as {
    title?: string;
    description?: string;
    category?: string;
  };

  if (!title?.trim() || !description?.trim()) {
    res.status(400).json({ error: "Title and description are required" });
    return;
  }

  const validCategories = Object.values(TicketCategory) as string[];
  const ticketCategory: TicketCategory = validCategories.includes(category ?? "")
    ? (category as TicketCategory)
    : TicketCategory.GENERAL_QUESTION;

  const ticket = await prisma.ticket.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      category: ticketCategory,
      createdById: req.user!.id,
    },
    include: ticketInclude,
  });
  res.status(201).json({ ticket });
});

router.patch("/:id", async (req, res) => {
  const { status, assignedToId } = req.body as {
    status?: string;
    assignedToId?: string | null;
  };

  const validStatuses = Object.values(TicketStatus) as string[];
  if (status !== undefined && !validStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  const data: { status?: TicketStatus; assignedToId?: string | null } = {};
  if (status !== undefined) data.status = status as TicketStatus;
  if ("assignedToId" in req.body) data.assignedToId = assignedToId ?? null;

  try {
    const ticket = await prisma.ticket.update({
      where: { id: req.params.id },
      data,
      include: ticketInclude,
    });
    res.json({ ticket });
  } catch {
    res.status(404).json({ error: "Ticket not found" });
  }
});

export default router;
