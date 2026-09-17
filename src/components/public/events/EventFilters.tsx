"use client";

import { useState } from "react";
import { categories } from "@/lib/data/events";
import type { Event } from "@/lib/data/events";

interface EventFiltersProps {
  events: Event[];
  onFilter: (filtered: Event[]) => void;
}

export default function EventFilters({ events, onFilter }: EventFiltersProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [location, setLocation] = useState("Semua");
  const [priceFilter, setPriceFilter] = useState("Semua");
  const [sort, setSort] = useState("Terbaru");

  const locations = [
    "Semua",
    "Jakarta Selatan",
    "Jakarta Pusat",
    "Jakarta Barat",
    "Jakarta Utara",
    "Online",
  ];

  const applyFilters = (
    cat: string,
    loc: string,
    price: string,
    s: string
  ) => {
    let result = [...events];

    if (cat !== "Semua") {
      result = result.filter((e) => e.category === cat);
    }
    if (loc !== "Semua") {
      result = result.filter((e) => e.location.includes(loc));
    }
    if (price === "Gratis") {
      result = result.filter((e) => e.price === 0);
    } else if (price === "Berbayar") {
      result = result.filter((e) => e.price > 0);
    }
    if (s === "Terbaru") {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (s === "Terpopuler") {
      result.sort((a, b) => b.quota - b.quota);
    }

    onFilter(result);
  };

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    applyFilters(cat, location, priceFilter, sort);
  };

  const handleLocation = (loc: string) => {
    setLocation(loc);
    applyFilters(activeCategory, loc, priceFilter, sort);
  };

  const handlePrice = (p: string) => {
    setPriceFilter(p);
    applyFilters(activeCategory, location, p, sort);
  };

  const handleSort = (s: string) => {
    setSort(s);
    applyFilters(activeCategory, location, priceFilter, s);
  };

  return (
    <div className="mb-8">
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
              activeCategory === cat
                ? "text-white border-transparent"
                : "border-gray-200 hover:border-primary-val"
            }`}
            style={{
              backgroundColor:
                activeCategory === cat ? "var(--color-primary-val)" : "transparent",
              fontFamily: "var(--font-manrope)",
              fontSize: "0.8rem",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Additional filters */}
      <div className="flex flex-wrap gap-4 mt-4 items-center">
        {/* Location */}
        <select
          value={location}
          onChange={(e) => handleLocation(e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-md text-sm bg-white"
          style={{ fontFamily: "var(--font-manrope)", fontSize: "0.8rem" }}
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc === "Semua" ? "Semua Lokasi" : loc}
            </option>
          ))}
        </select>

        {/* Price */}
        <div className="flex gap-2">
          {["Semua", "Gratis", "Berbayar"].map((p) => (
            <button
              key={p}
              onClick={() => handlePrice(p)}
              className={`px-3 py-1.5 rounded-md text-sm border transition-all ${
                priceFilter === p
                  ? "border-primary-val text-primary-val"
                  : "border-gray-200"
              }`}
              style={{ fontFamily: "var(--font-manrope)", fontSize: "0.8rem" }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-md text-sm bg-white ml-auto"
          style={{ fontFamily: "var(--font-manrope)", fontSize: "0.8rem" }}
        >
          <option>Terbaru</option>
          <option>Terpopuler</option>
        </select>
      </div>
    </div>
  );
}

