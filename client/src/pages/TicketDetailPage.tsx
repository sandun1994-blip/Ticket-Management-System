import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  type Ticket,
  type TicketStatus,
  CATEGORY_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
} from "@/lib/tickets";

const STATUS_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ["RESOLVED"],
  RESOLVED: ["CLOSED", "OPEN"],
  CLOSED: [],
};

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/tickets/${id}`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => setTicket(data.ticket))
      .catch(() => setError("Ticket not found."))
      .finally(() => setLoading(false));
  }, [id]);

  async function changeStatus(status: TicketStatus) {
    if (!ticket) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        setTicket(data.ticket);
      }
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <main className="p-8 max-w-3xl mx-auto">
        <p className="text-gray-400">Loading…</p>
      </main>
    );
  }

  if (error || !ticket) {
    return (
      <main className="p-8 max-w-3xl mx-auto">
        <p className="text-destructive text-sm mb-4">{error || "Ticket not found."}</p>
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to tickets
        </Link>
      </main>
    );
  }

  const nextStatuses = STATUS_TRANSITIONS[ticket.status];

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 transition">
          ← Back to tickets
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
        <span
          className={`shrink-0 mt-1 inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[ticket.status]}`}
        >
          {STATUS_LABELS[ticket.status]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm mb-8 text-gray-600">
        <div>
          <span className="font-medium text-gray-500">Category</span>
          <p className="mt-0.5 text-gray-800">{CATEGORY_LABELS[ticket.category]}</p>
        </div>
        <div>
          <span className="font-medium text-gray-500">Created by</span>
          <p className="mt-0.5 text-gray-800">{ticket.createdBy.name}</p>
        </div>
        <div>
          <span className="font-medium text-gray-500">Opened</span>
          <p className="mt-0.5 text-gray-800">
            {new Date(ticket.createdAt).toLocaleString()}
          </p>
        </div>
        <div>
          <span className="font-medium text-gray-500">Assigned to</span>
          <p className="mt-0.5 text-gray-800">
            {ticket.assignedTo?.name ?? "Unassigned"}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-medium text-gray-500 mb-2">Description</h2>
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
          {ticket.description}
        </p>
      </div>

      {nextStatuses.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-sm font-medium text-gray-500 mb-3">Actions</h2>
          <div className="flex gap-2">
            {nextStatuses.map((status) => (
              <Button
                key={status}
                variant={status === "OPEN" ? "outline" : "default"}
                size="sm"
                disabled={updating}
                onClick={() => changeStatus(status)}
              >
                {updating ? "Updating…" : `Mark as ${STATUS_LABELS[status]}`}
              </Button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
