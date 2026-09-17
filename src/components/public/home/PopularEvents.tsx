"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faArrowRight, faCalendarDays, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { events, Event } from "@/lib/data/events";

interface PopularEventsProps {
  initialEvents?: Event[];
}

export default function PopularEvents({ initialEvents }: PopularEventsProps) {
  const popularEvents = initialEvents && initialEvents.length > 0
    ? initialEvents
    : events.slice(3, 6);

  return (
    <section className="py-8 md:py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faFire} className="text-orange-500 text-lg" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-manrope)" }}>
              Lagi Trending
            </h2>
          </div>
          <Link
            href="/events?sort=popular"
            className="text-sm font-semibold text-orange-500 hover:underline flex items-center gap-1.5"
          >
            Lihat semua <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </Link>
        </div>

        {/* Horizontal Scroll Cards */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {popularEvents.map((event) => {
            const soldPercent = Math.min(
              100,
              Math.round(((event.quota - event.remaining) / event.quota) * 100)
            );

            return (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="group flex-shrink-0 w-56 sm:w-64 md:w-72 snap-start rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all bg-white"
              >
                {/* Image */}
                <div className="relative w-full h-40 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 flex items-center gap-1 bg-orange-500 text-white text-[9px] font-bold uppercase px-2.5 py-1 rounded-full shadow-sm">
                    <FontAwesomeIcon icon={faFire} className="text-[9px]" /> Trending
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-3 group-hover:text-orange-500 transition-colors">
                    {event.title}
                  </h3>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                      <FontAwesomeIcon icon={faCalendarDays} className="shrink-0 text-gray-400 w-3 h-3" />
                      <span className="truncate">
                        {new Date(event.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                      <FontAwesomeIcon icon={faLocationDot} className="shrink-0 text-gray-400 w-3 h-3" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  {/* Quota progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-[9px] text-gray-500 mb-1">
                      <span>Tiket Terjual</span>
                      <span className="text-orange-500 font-bold">{soldPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                        style={{ width: `${soldPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm font-bold text-orange-500">
                      {event.price === 0 ? "Gratis" : `Rp ${event.price.toLocaleString("id-ID")}`}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-orange-600 transition-colors flex items-center gap-1">
                      Beli <FontAwesomeIcon icon={faArrowRight} className="text-[9px]" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
