"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { events } from "@/lib/data/events";

const tickets = [
  {
    id: "TIX-001",
    event: events[0],
    type: "Regular",
    attendee: "Alya Damar",
  },
  {
    id: "TIX-002",
    event: events[2],
    type: "VIP",
    attendee: "Alya Damar",
  },
];

export default function TicketsTab() {
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
        Tiket Saya
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="border rounded-xl overflow-hidden shadow-sm"
          >
            {/* Gambar Event */}
            <div className="relative aspect-video">
              <Image
                src={ticket.event.image}
                alt={ticket.event.title}
                fill
                className="object-cover"
              />
              <span
                className="absolute top-3 right-3 px-2 py-1 rounded-sm text-xs text-white"
                style={{
                  backgroundColor: "var(--color-primary-val)",
                  fontFamily: "var(--font-manrope)",
                  fontSize: "0.65rem",
                }}
              >
                {ticket.type}
              </span>
            </div>

            {/* Konten */}
            <div className="p-6">
              <h3
                style={{
                  fontFamily: "var(--font-manrope)",
                  fontWeight: 500,
                  fontSize: "1.25rem",
                  color: "var(--color-text)",
                }}
              >
                {ticket.event.title}
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
                {new Date(ticket.event.date).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                &bull; {ticket.event.time}
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
                {ticket.event.location}
              </p>
              <p
                className="mt-2"
                style={{
                  fontFamily: "var(--font-manrope)",
                  fontWeight: 400,
                  fontSize: "0.8rem",
                  color: "var(--color-text)",
                }}
              >
                Peserta: {ticket.attendee}
              </p>

              {/* Divider */}
              <hr className="my-4 border-gray-100" />

              {/* QR Placeholder */}
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-20 h-20">
                    <rect x="10" y="10" width="25" height="25" fill="#1A1A1A" />
                    <rect x="65" y="10" width="25" height="25" fill="#1A1A1A" />
                    <rect x="10" y="65" width="25" height="25" fill="#1A1A1A" />
                    <rect x="40" y="10" width="5" height="5" fill="#1A1A1A" />
                    <rect x="50" y="10" width="5" height="5" fill="#1A1A1A" />
                    <rect x="40" y="20" width="5" height="5" fill="#1A1A1A" />
                    <rect x="45" y="25" width="5" height="5" fill="#1A1A1A" />
                    <rect x="55" y="20" width="5" height="5" fill="#1A1A1A" />
                    <rect x="10" y="40" width="5" height="5" fill="#1A1A1A" />
                    <rect x="20" y="45" width="5" height="5" fill="#1A1A1A" />
                    <rect x="30" y="40" width="5" height="5" fill="#1A1A1A" />
                    <rect x="40" y="40" width="20" height="20" fill="#1A1A1A" />
                    <rect x="65" y="40" width="5" height="5" fill="#1A1A1A" />
                    <rect x="75" y="45" width="5" height="5" fill="#1A1A1A" />
                    <rect x="85" y="40" width="5" height="5" fill="#1A1A1A" />
                    <rect x="65" y="55" width="5" height="5" fill="#1A1A1A" />
                    <rect x="75" y="60" width="5" height="5" fill="#1A1A1A" />
                    <rect x="85" y="55" width="5" height="5" fill="#1A1A1A" />
                    <rect x="40" y="65" width="5" height="5" fill="#1A1A1A" />
                    <rect x="50" y="70" width="5" height="5" fill="#1A1A1A" />
                    <rect x="55" y="65" width="5" height="5" fill="#1A1A1A" />
                    <rect x="65" y="65" width="25" height="25" fill="#1A1A1A" />
                    <rect x="45" y="80" width="5" height="5" fill="#1A1A1A" />
                    <rect x="55" y="85" width="5" height="5" fill="#1A1A1A" />
                  </svg>
                </div>
                <p
                  className="mt-2"
                  style={{
                    fontFamily: "var(--font-manrope)",
                    fontWeight: 300,
                    fontSize: "0.7rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {ticket.id}
                </p>
              </div>

              {/* Download Button */}
              <button
                className="w-full mt-4 py-2.5 border border-gray-200 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                style={{
                  fontFamily: "var(--font-manrope)",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  color: "var(--color-text)",
                }}
              >
                <Download size={14} />
                Download Tiket
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

