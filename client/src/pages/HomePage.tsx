import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import {
  type Ticket,
  CATEGORY_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
} from "@/lib/tickets";

export default function HomePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/tickets", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setTickets(data.tickets ?? []))
      .catch(() => setError("Failed to load tickets."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
        <Link to="/tickets/new" className={buttonVariants()}>
          New Ticket
        </Link>
      </div>

      {loading && <p className="text-gray-400">Loading…</p>}
      {error && <p className="text-destructive text-sm">{error}</p>}

      {!loading && !error && tickets.length === 0 && (
        <p className="text-gray-500">No tickets yet. Create one to get started.</p>
      )}

      {!loading && tickets.length > 0 && (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Created</th>
                <th className="px-4 py-3 text-left font-medium">Created by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {ticket.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {CATEGORY_LABELS[ticket.category]}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[ticket.status]}`}
                    >
                      {STATUS_LABELS[ticket.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {ticket.createdBy.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
