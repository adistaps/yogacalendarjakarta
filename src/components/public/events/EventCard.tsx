"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Event } from "@/lib/data/events";

interface EventCardProps {
  event: Event;
  index: number;
}

export default function EventCard({ event, index }: EventCardProps) {
  const aspectRatio = index % 3 === 0 ? "aspect-[3/4]" : "aspect-square";

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="break-inside-avoid mb-4"
    >
      <Link href={`/events/${event.slug}`} className="block relative overflow-hidden rounded-lg cursor-pointer group">
        <div className={`relative ${aspectRatio}`}>
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Badge kategori */}
          <span
            className="absolute top-3 left-3 text-white text-xs px-2 py-1 rounded-sm"
            style={{ backgroundColor: "var(--color-primary-val)" }}
          >
            {event.category}
          </span>

          {/* Badge tanggal */}
          <span className="absolute top-3 right-3 bg-white/90 text-xs px-2 py-1 rounded-sm"
            style={{
              color: "var(--color-text)",
              fontFamily: "var(--font-manrope)",
              fontSize: "0.7rem",
            }}
          >
            {new Date(event.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
            })}
          </span>

          {/* Konten bawah */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p
              className="text-white/60 text-xs uppercase tracking-wide"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {event.organizer}
            </p>
            <h3
              className="text-white leading-tight mt-1"
              style={{
                fontFamily: "var(--font-manrope)",
                fontWeight: 500,
                fontSize: "1.25rem",
              }}
            >
              {event.title}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

