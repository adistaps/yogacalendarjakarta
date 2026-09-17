"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWind,
  faFire,
  faSun,
  faHeartPulse,
  faMusic,
  faSpa,
  faMoon,
  faBookOpen,
  faDumbbell,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";

const categories = [
  { name: "Vinyasa",       slug: "Vinyasa",       icon: faWind },
  { name: "Ashtanga",      slug: "Ashtanga",      icon: faFire },
  { name: "Kundalini",     slug: "Kundalini",     icon: faSun },
  { name: "Restorative",   slug: "Restorative",   icon: faHeartPulse },
  { name: "Sound Healing", slug: "Sound Healing", icon: faMusic },
  { name: "Retreat",       slug: "Retreat",       icon: faSpa },
  { name: "Meditation",    slug: "Meditation",    icon: faMoon },
  { name: "Workshop",      slug: "Workshop",      icon: faBookOpen },
  { name: "Pilates",       slug: "Pilates",       icon: faDumbbell },
  { name: "Art & Craft",   slug: "Art",           icon: faPalette },
];

export default function CategoriesSection() {
  return (
    <section className="py-5 bg-white border-t border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-1 px-4 sm:px-6 lg:px-8">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/events?category=${encodeURIComponent(cat.slug)}`}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-800 border border-slate-200/80 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all text-xs sm:text-sm font-medium whitespace-nowrap shadow-2xs"
            >
              <FontAwesomeIcon icon={cat.icon} className="w-3.5 h-3.5" />
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
