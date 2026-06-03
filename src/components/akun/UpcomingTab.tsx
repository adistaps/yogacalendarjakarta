"use client";

import Image from "next/image";
import { Calendar, MapPin, Clock } from "lucide-react";
import { events } from "@/lib/data/events";

const upcomingEvents = events.slice(0, 4);

export default function UpcomingTab() {
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
        Event Mendatang
      </h2>

      <div className="space-y-4">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="flex flex-col sm:flex-row gap-4 border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            {/* Gambar */}
            <div className="relative w-full sm:w-32 h-24 rounded-md overflow-hidden shrink-0">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className="px-2 py-0.5 rounded-sm text-xs text-white"
                  style={{
                    backgroundColor: "var(--color-primary-val)",
                    fontFamily: "var(--font-manrope)",
                    fontSize: "0.6rem",
                  }}
                >
                  {event.category}
                </span>
              </div>
              <h3
                className="truncate"
                style={{
                  fontFamily: "var(--font-manrope)",
                  fontWeight: 500,
                  fontSize: "1.1rem",
                  color: "var(--color-text)",
                }}
              >
                {event.title}
              </h3>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Calendar size={12} />
                  <span style={{ fontFamily: "var(--font-manrope)" }}>
                    {new Date(event.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </span>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Clock size={12} />
                  <span style={{ fontFamily: "var(--font-manrope)" }}>
                    {event.time}
                  </span>
                </span>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <MapPin size={12} />
                  <span style={{ fontFamily: "var(--font-manrope)" }}>
                    {event.location}
                  </span>
                </span>
              </div>
            </div>

            {/* Harga & Button */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
              <p
                style={{
                  fontFamily: "var(--font-manrope)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "var(--color-text)",
                }}
              >
                Rp {event.price.toLocaleString("id-ID")}
              </p>
              <button
                className="px-4 py-1.5 text-white text-xs transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "var(--color-primary-val)",
                  fontFamily: "var(--font-manrope)",
                  fontWeight: 500,
                  borderRadius: "4px",
                  fontSize: "0.65rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                BELI
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

