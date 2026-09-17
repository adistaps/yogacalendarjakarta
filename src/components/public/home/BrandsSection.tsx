"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmileWink, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const partners = [
  { name: "UP at Thamrin Nine", location: "Jakarta Pusat", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&q=80" },
  { name: "Science Show", location: "Jakarta Selatan", image: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400&q=80" },
  { name: "Ancol, Jakarta Utara", location: "Jakarta Utara", image: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=400&q=80" },
  { name: "Jakarta Bird Land", location: "Jakarta", image: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?w=400&q=80" },
];

export default function BrandsSection() {
  return (
    <section className="py-8 md:py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <FontAwesomeIcon icon={faFaceSmileWink} className="text-amber-500 text-xl md:text-2xl" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-manrope)" }}>
              Siap Seru-seruan?
            </h2>
          </div>
          <Link href="/events" className="text-sm font-semibold text-primary-val hover:underline flex items-center gap-1.5">
            Lihat semua <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </Link>
        </div>

        {/* Partner / Venue Cards - horizontal scroll on mobile */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {partners.map((partner, idx) => (
            <Link
              href={`/events?location=${encodeURIComponent(partner.location)}`}
              key={idx}
              className="group flex-shrink-0 w-56 md:w-64 snap-start rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative w-full h-40 overflow-hidden">
                <Image
                  src={partner.image}
                  alt={partner.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-primary-val transition-colors">
                  {partner.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{partner.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
