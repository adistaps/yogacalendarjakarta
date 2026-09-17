"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full p-1 lg:p-1.5 bg-white">
      <div className="relative w-full h-[calc(100vh-0.5rem)] lg:h-[calc(100vh-0.75rem)] min-h-[600px] flex flex-col justify-center rounded-xl lg:rounded-2xl overflow-hidden bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2070&auto=format&fit=crop"
            alt="Yoga Practitioner"
            fill
            priority
            className="object-cover object-center opacity-90"
          />
          {/* Dark overlay to ensure readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 lg:px-14 flex flex-col pt-20">
          {/* Subheading row (replaces the top info bar on homepage) */}
          <div className="w-full flex justify-between items-center mb-10">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              <p
                className="text-white font-bold tracking-widest text-[11px] uppercase"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
              </p>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="mailto:info@jakartayogacalendar.com" className="text-white font-bold tracking-widest text-[11px] uppercase hover:text-white/80 transition-colors" style={{ fontFamily: "var(--font-manrope)" }}>
              </a>
              <a href="tel:+6281200000000" className="text-white font-bold tracking-widest text-[11px] uppercase hover:text-white/80 transition-colors" style={{ fontFamily: "var(--font-manrope)" }}>
              </a>
            </div>
          </div>

          {/* Large Heading */}
          <h1
            className="text-white max-w-5xl font-medium text-6xl md:text-8xl lg:text-[110px] leading-[1.0] tracking-[-0.03em]"
            style={{
              fontFamily: "var(--font-manrope)",
            }}
          >
            Yoga for Body <br />
            and Mind
          </h1>
        </div>
      </div>
    </section>
  );
}
