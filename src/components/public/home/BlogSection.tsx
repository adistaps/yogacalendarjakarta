"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const articles = [
  {
    id: 1,
    title: "Harga Tiket Konser Kings of Jamsession Jakarta 2024",
    slug: "#",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
    date: "12 Jun 2024",
    category: "Konser",
  },
  {
    id: 2,
    title: "Cara Beli Tiket di Belakang Daftar, Tips Dapet Tiket Pertama",
    slug: "#",
    image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=80",
    date: "20 Jun 2024",
    category: "Tips",
  },
  {
    id: 3,
    title: "Panduan Lengkap: Nikmati Jakarta Art Week 2024",
    slug: "#",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=80",
    date: "25 Jun 2024",
    category: "Festival",
  },
  {
    id: 4,
    title: "5 Event Yoga Terbaik yang Wajib Kamu Datangi Tahun Ini",
    slug: "#",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
    date: "28 Jun 2024",
    category: "Yoga",
  },
];

export default function BlogSection() {
  return (
    <section className="py-8 md:py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <FontAwesomeIcon icon={faBookOpen} className="text-gray-500 text-xl" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-manrope)" }}>
              Bacaan Seru!
            </h2>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-primary-val hover:underline flex items-center gap-1.5">
            Lihat semua <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={article.slug}
              className="group block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative w-full h-44 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 text-gray-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  {article.category}
                </span>
              </div>
              <div className="p-4">
                <p className="text-[11px] text-gray-400 mb-2">{article.date}</p>
                <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-primary-val transition-colors">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
