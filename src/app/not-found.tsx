import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halaman Tidak Ditemukan | Jakarta Yoga Calendar",
  description: "Maaf, halaman yang Anda cari tidak dapat ditemukan. Mari kembali ke beranda dan temukan ketenangan Anda.",
};

export default function NotFound() {
  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col justify-center items-center px-6 py-24 text-center">
      {/* Yoga Lotus Pose Illustration in Vector */}
      <div className="w-64 h-64 relative mb-10 text-primary-val flex items-center justify-center">
        <svg
          width="200"
          height="200"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-pulse duration-3000"
        >
          {/* Lotus Petals */}
          <path
            d="M50 85C60 75 75 75 80 65C85 55 75 45 70 50C65 55 60 70 50 85Z"
            fill="currentColor"
            opacity="0.15"
          />
          <path
            d="M50 85C40 75 25 75 20 65C15 55 25 45 30 50C35 55 40 70 50 85Z"
            fill="currentColor"
            opacity="0.15"
          />
          {/* Main Body meditating pose */}
          <circle cx="50" cy="35" r="8" stroke="currentColor" strokeWidth="2" />
          <path
            d="M50 43C42 45 35 50 35 60C35 70 45 78 50 78C55 78 65 70 65 60C65 50 58 45 50 43Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          {/* Meditating Arms */}
          <path
            d="M38 52C32 55 26 62 28 68C30 74 38 72 42 67"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M62 52C68 55 74 62 72 68C70 74 62 72 58 67"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Floor / Ground */}
          <path
            d="M20 85H80"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* 404 Typography */}
      <span className="text-primary-val text-[0.7rem] font-bold tracking-[0.25em] uppercase mb-4 block">
        Error 404
      </span>
      
      <h1 
        className="text-dark mb-4 leading-tight"
        style={{
          fontFamily: "var(--font-manrope)",
          fontSize: "clamp(2rem, 4vw, 2.75rem)",
          fontWeight: 500,
        }}
      >
        Halaman ini sedang meditasi...
      </h1>
      
      <p className="text-gray-500 text-sm font-light max-w-sm mb-12 leading-relaxed">
        Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan. Tarik napas dalam-dalam, dan mari kembali ke jalur ketenangan.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-primary-val hover:bg-[#264b4c] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-primary-val/10 cursor-pointer"
        >
          Kembali ke Beranda
        </Link>
        <Link
          href="/events"
          className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-gray-200 hover:border-gray-300 text-gray-700 bg-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Lihat Semua Event
        </Link>
      </div>
    </div>
  );
}
