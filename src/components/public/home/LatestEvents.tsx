"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { events, Event } from "@/lib/data/events";
import EventCard from "@/components/public/events/EventCard";

interface LatestEventsProps {
  initialEvents?: Event[];
}

export default function LatestEvents({ initialEvents }: LatestEventsProps) {
  const latestEvents = initialEvents && initialEvents.length > 0
    ? initialEvents
    : events.slice(6, 9);

  return (
    <section className="py-8 md:py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <FontAwesomeIcon icon={faFire} className="text-orange-500 text-xl" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-manrope)" }}>
              Event Baru Untukmu
            </h2>
          </div>
          <Link
            href="/events"
            className="text-sm font-semibold text-primary-val hover:underline flex items-center gap-1.5"
          >
            Lihat semua <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </Link>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {latestEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
