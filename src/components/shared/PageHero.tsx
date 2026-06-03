"use client";

import Image from "next/image";
import Link from "next/link";

interface PageHeroProps {
  title: string;
  breadcrumb: string;
  imageSrc?: string;
}

export default function PageHero({
  title,
  breadcrumb,
  imageSrc = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&q=85",
}: PageHeroProps) {
  return (
    <section className="relative w-full overflow-hidden h-64 lg:h-80">
      <Image
        src={imageSrc}
        alt={title}
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex items-end justify-between px-8 lg:px-14 pb-8">
        <h1
          className="text-white"
          style={{
            fontFamily: "var(--font-manrope)",
            fontWeight: 300,
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
          }}
        >
          {title}
        </h1>
        <div className="hidden lg:flex items-center gap-2 text-white/70">
          <Link
            href="/"
            className="text-xs uppercase tracking-wider hover:text-white transition-colors"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            HOME
          </Link>
          <span className="text-xs">&rarr;</span>
          <span
            className="text-xs uppercase tracking-wider"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            {breadcrumb}
          </span>
        </div>
      </div>
    </section>
  );
}

