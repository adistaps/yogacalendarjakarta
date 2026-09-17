"use client";

import { events } from "@/lib/data/events";

const orders = [
  {
    id: "ORD-001",
    event: events[0],
    date: "2026-06-01",
    status: "Selesai",
    total: 300000,
    quantity: 2,
  },
  {
    id: "ORD-002",
    event: events[2],
    date: "2026-06-05",
    status: "Aktif",
    total: 400000,
    quantity: 2,
  },
  {
    id: "ORD-003",
    event: events[4],
    date: "2026-06-08",
    status: "Menunggu Pembayaran",
    total: 175000,
    quantity: 1,
  },
];

const statusColors: Record<string, string> = {
  Selesai: "#10B981",
  Aktif: "var(--color-primary-val)",
  "Menunggu Pembayaran": "#F59E0B",
};

export default function OrdersTab() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2
        style={{
          fontFamily: "var(--font-manrope)",
          fontWeight: 500,
          fontSize: "1.5rem",
          color: "var(--color-text)",
          marginBottom: "1.5rem",
        }}
      >
        Riwayat Pesanan
      </h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-gray-100 rounded-lg p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="text-xs font-medium"
                    style={{
                      fontFamily: "var(--font-manrope)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {order.id}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs text-white"
                    style={{
                      backgroundColor: statusColors[order.status] || "#6B7280",
                      fontFamily: "var(--font-manrope)",
                      fontSize: "0.65rem",
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-manrope)",
                    fontWeight: 500,
                    fontSize: "1rem",
                    color: "var(--color-text)",
                  }}
                >
                  {order.event.title}
                </h3>
                <p
                  className="mt-1"
                  style={{
                    fontFamily: "var(--font-manrope)",
                    fontWeight: 300,
                    fontSize: "0.8rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {new Date(order.event.date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  &bull; {order.event.time}
                </p>
                <p
                  className="mt-1"
                  style={{
                    fontFamily: "var(--font-manrope)",
                    fontWeight: 300,
                    fontSize: "0.8rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {order.quantity} tiket &bull; {order.event.location}
                </p>
              </div>
              <div className="text-right">
                <p
                  style={{
                    fontFamily: "var(--font-manrope)",
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "var(--color-text)",
                  }}
                >
                  Rp {order.total.toLocaleString("id-ID")}
                </p>
                <p
                  className="mt-1"
                  style={{
                    fontFamily: "var(--font-manrope)",
                    fontWeight: 300,
                    fontSize: "0.7rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {new Date(order.date).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

