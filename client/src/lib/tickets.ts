export type TicketStatus = "OPEN" | "RESOLVED" | "CLOSED";
export type TicketCategory =
  | "GENERAL_QUESTION"
  | "TECHNICAL_QUESTION"
  | "REFUND_REQUEST";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  category: TicketCategory;
  createdAt: string;
  updatedAt: string;
  createdBy: { id: string; name: string; email: string };
  assignedTo: { id: string; name: string; email: string } | null;
}

export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  GENERAL_QUESTION: "General Question",
  TECHNICAL_QUESTION: "Technical Question",
  REFUND_REQUEST: "Refund Request",
};

export const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Open",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export const STATUS_COLORS: Record<TicketStatus, string> = {
  OPEN: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-green-100 text-green-700",
  CLOSED: "bg-gray-100 text-gray-600",
};
