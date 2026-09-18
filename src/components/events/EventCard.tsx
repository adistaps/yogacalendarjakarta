"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Event } from "@/lib/data/events";

interface EventCardProps {
  event: Event;
  index?: number;
  className?: string;
  aspectRatio?: string;
}

function getAreaFromLocation(location: string, category?: string): string {
  if (location && location.includes(",")) {
    const parts = location.split(",");
    const area = parts[parts.length - 1].trim();
    if (area) return area;
  }
  if (location) return location;
  if (category) return category;
  return "Jakarta";
}

export default function EventCard({
  event,
  className = "",
  aspectRatio = "aspect-[16/9]",
}: EventCardProps) {
  const area = getAreaFromLocation(event.location, event.category);
  const organizerText = event.organizer?.startsWith("Oleh ")
    ? event.organizer
    : `Oleh ${event.organizer || "Organizer"}`;
  const priceText =
    event.price === 0 ? "Gratis" : `Rp${event.price.toLocaleString("id-ID")}`;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`group block w-full bg-white text-left ${className}`}
    >
      <Link href={`/events/${event.slug}`} className="block">
        {/* Banner Image with Rounded Corners */}
        <div className={`relative w-full ${aspectRatio} overflow-hidden rounded-xl md:rounded-2xl bg-gray-100 mb-3`}>
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Event Details */}
        <div className="flex flex-col">
          {/* Location Area */}
          <span className="text-xs text-gray-500 font-normal line-clamp-1">
            {area}
          </span>

          {/* Title */}
          <h3
            className="font-bold text-gray-900 text-sm md:text-base leading-snug line-clamp-1 group-hover:text-primary-val transition-colors mt-0.5"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            {event.title}
          </h3>

          {/* Organizer */}
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            {organizerText}
          </p>

          {/* Dotted / Dashed Separator */}
          <div className="my-2.5 border-b border-dashed border-gray-200" />

          {/* Price Label */}
          <span className="text-[11px] md:text-xs text-gray-400 font-normal">
            Mulai dari
          </span>

          {/* Price */}
          <span className="font-bold text-gray-900 text-sm md:text-base mt-0.5">
            {priceText}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}


