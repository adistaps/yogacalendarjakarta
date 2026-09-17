"use client";

import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";

const cities = [
  { name: "Jakarta", image: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=400&q=80", count: 120 },
  { name: "Bali", image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&q=80", count: 85 },
  { name: "Bandung", image: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=400&q=80", count: 47 },
  { name: "Surabaya", image: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=400&q=80", count: 32 },
  { name: "Yogyakarta", image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=400&q=80", count: 58 },
  { name: "Kota Lainnya", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80", count: 200 },
];

export default function CityExplore() {
  return (
    <section className="py-8 md:py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <FontAwesomeIcon icon={faMapLocationDot} className="text-teal-600 text-xl md:text-2xl" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-manrope)" }}>
              Jelajahi Event di Kotamu
            </h2>
          </div>
          <Link href="/events" className="text-sm font-semibold text-primary-val hover:underline flex items-center gap-1.5">
            Lihat semua <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </Link>
        </div>

        {/* City Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {cities.map((city) => (
            <Link
              key={city.name}
              href={`/events?location=${encodeURIComponent(city.name)}`}
              className="group relative aspect-square rounded-xl overflow-hidden block shadow-sm hover:shadow-md transition-all"
            >
              <Image
                src={city.image}
                alt={city.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="font-bold text-sm">{city.name}</p>
                <p className="text-xs text-white/70">{city.count}+ Event</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
