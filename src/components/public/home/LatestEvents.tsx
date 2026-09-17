"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faArrowRight, faCalendarDays, faLocationDot, faStar } from "@fortawesome/free-solid-svg-icons";
import { events, Event } from "@/lib/data/events";

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

        {/* Horizontal Scroll Cards */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {latestEvents.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="group flex-shrink-0 w-52 sm:w-60 md:w-64 snap-start rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              {/* Image */}
              <div className="relative w-full h-36 overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {event.remaining < event.quota * 0.2 && event.remaining > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                    Hampir Habis
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-primary-val transition-colors">
                  {event.title}
                </h3>
                <div className="flex items-center gap-1.5 text-gray-400 text-[11px] mb-1">
                  <FontAwesomeIcon icon={faCalendarDays} className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    {new Date(event.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-[11px] mb-3">
                  <FontAwesomeIcon icon={faLocationDot} className="w-3 h-3 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                  <span className="text-xs font-bold text-primary-val">
                    {event.price === 0 ? "Gratis" : `Rp ${event.price.toLocaleString("id-ID")}`}
                  </span>
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-[11px]" />
                    <span className="text-[10px] font-bold text-gray-600">4.8</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
