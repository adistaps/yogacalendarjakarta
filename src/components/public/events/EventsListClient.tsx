"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Event } from "@/lib/data/events";

const categories = ["Semua", "Vinyasa", "Kundalini", "Ashtanga", "Restorative", "Retreat", "Sound Healing"];

const regions = [
  "Semua Wilayah",
  "Jakarta Pusat",
  "Jakarta Selatan",
  "Jakarta Utara",
  "Jakarta Barat",
  "Jakarta Timur",
  "Bogor",
  "Depok",
  "Tangerang",
  "Bekasi",
];

interface EventsListClientProps {
  initialEvents: Event[];
}

export default function EventsListClient({ initialEvents }: EventsListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Read current filters from URL
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "Semua";
  const currentRegion = searchParams.get("region") || "Semua Wilayah";
  const currentDate = searchParams.get("date") || "";

  // Local input state for search to avoid triggering request on every keystroke
  const [searchInput, setSearchInput] = useState(currentSearch);

  const updateFilters = (updates: {
    search?: string;
    category?: string;
    region?: string;
    date?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (updates.search !== undefined) {
      if (updates.search) params.set("search", updates.search);
      else params.delete("search");
    }
    if (updates.category !== undefined) {
      if (updates.category && updates.category !== "Semua") params.set("category", updates.category);
      else params.delete("category");
    }
    if (updates.region !== undefined) {
      if (updates.region && updates.region !== "Semua Wilayah") params.set("region", updates.region);
      else params.delete("region");
    }
    if (updates.date !== undefined) {
      if (updates.date) params.set("date", updates.date);
      else params.delete("date");
    }

    startTransition(() => {
      router.push(`/events?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput });
  };

  return (
    <div className="w-full">
      {/* Search & Advanced Filters Bar */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 lg:p-8 mb-16 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="md:col-span-4 flex flex-col gap-2">
          <label className="text-xs font-bold text-[#181818] uppercase tracking-wider">Cari Event</label>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Nama event atau EO..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full border border-gray-200 rounded-full px-5 py-3 pl-12 text-sm outline-none focus:border-primary-val transition-colors"
            />
            <Search className="absolute left-4 text-gray-400" size={18} />
          </div>
        </form>

        {/* Region Filter */}
        <div className="md:col-span-3 flex flex-col gap-2">
          <label className="text-xs font-bold text-[#181818] uppercase tracking-wider">Wilayah</label>
          <div className="relative flex items-center">
            <select
              value={currentRegion}
              onChange={(e) => updateFilters({ region: e.target.value })}
              className="w-full border border-gray-200 rounded-full px-5 py-3 pl-12 text-sm outline-none focus:border-primary-val transition-colors appearance-none bg-white cursor-pointer"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <MapPin className="absolute left-4 text-gray-400 pointer-events-none" size={18} />
          </div>
        </div>

        {/* Date Filter */}
        <div className="md:col-span-3 flex flex-col gap-2">
          <label className="text-xs font-bold text-[#181818] uppercase tracking-wider">Tanggal</label>
          <div className="relative flex items-center">
            <input
              type="date"
              value={currentDate}
              onChange={(e) => updateFilters({ date: e.target.value })}
              className="w-full border border-gray-200 rounded-full px-5 py-3 pl-12 text-sm outline-none focus:border-primary-val transition-colors cursor-pointer"
            />
            <Calendar className="absolute left-4 text-gray-400 pointer-events-none" size={18} />
          </div>
        </div>

        {/* Reset/Submit Button */}
        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            onClick={handleSearchSubmit}
            className="flex-1 bg-primary-val text-white rounded-full py-3 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer text-center"
          >
            Cari
          </button>
          {(currentSearch || currentCategory !== "Semua" || currentRegion !== "Semua Wilayah" || currentDate) && (
            <button
              onClick={() => {
                setSearchInput("");
                startTransition(() => {
                  router.push("/events");
                });
              }}
              className="px-4 border border-gray-200 hover:border-red-300 hover:text-red-500 rounded-full py-3 text-xs font-bold transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-3 mb-16 pb-8 border-b border-gray-100">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => updateFilters({ category: cat })}
            className={`px-6 py-2.5 rounded-full transition-all duration-300 font-bold text-xs tracking-wider uppercase cursor-pointer ${
              currentCategory === cat
                ? "bg-[#f0f6f7] text-primary-val border border-primary-val/20 shadow-sm"
                : "bg-transparent text-gray-400 border border-gray-200 hover:border-gray-300 hover:text-[#181818]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading state indicator */}
      {isPending && (
        <div className="w-full flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-val"></div>
        </div>
      )}

      {/* Events Listing */}
      {!isPending && (
        <>
          {initialEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-6">
                <Calendar size={32} />
              </div>
              <h3 className="text-lg font-bold text-[#181818] mb-2">Tidak Ada Event Ditemukan</h3>
              <p className="text-gray-400 text-sm max-w-md text-center px-6">
                Kami tidak dapat menemukan event yang sesuai dengan kriteria pencarian Anda. Coba ubah filter atau atur ulang pencarian.
              </p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {initialEvents.map((event, idx) => (
                <div key={event.id} className="break-inside-avoid">
                  <Link
                    href={`/events/${event.slug}`}
                    className="group block relative overflow-hidden rounded-2xl border border-black/5 shadow-sm transition-all duration-300"
                  >
                    <Image
                      src={event.image}
                      alt={event.title}
                      width={800}
                      height={idx % 2 === 0 ? 900 : 750}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-white/60 text-[10px] font-bold tracking-widest uppercase mb-2">
                        {event.organizer}
                      </span>
                      <h3
                        className="text-white mb-4"
                        style={{
                          fontFamily: "var(--font-manrope)",
                          fontSize: "1.6rem",
                          fontWeight: 400,
                          lineHeight: 1.2,
                        }}
                      >
                        {event.title}
                      </h3>

                      {/* Hover Info */}
                      <div className="flex flex-col gap-2 text-white/70 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <div className="flex items-center gap-2">
                          <MapPin size={12} className="text-primary-val" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={12} className="text-primary-val" />
                          <span>
                            {new Date(event.date).toLocaleDateString("id-ID", {
                              weekday: "long",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                          <span className="text-white font-bold text-sm">
                            {event.price > 0 ? `Rp ${event.price.toLocaleString("id-ID")}` : "Gratis"}
                          </span>
                          <span className="inline-flex items-center text-xs font-bold text-primary-val gap-1">
                            Beli Tiket <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
