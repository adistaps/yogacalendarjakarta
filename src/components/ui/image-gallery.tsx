"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  heading?: string;
  description?: string;
  autoPlayInterval?: number;
  showHeader?: boolean;
  className?: string;
}

export default function ImageGallery({
  images,
  heading,
  description,
  autoPlayInterval = 3000,
  showHeader = true,
  className,
}: ImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [autoIdx, setAutoIdx] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setAutoIdx((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, images.length, autoPlayInterval]);

  const focusedIdx = activeIdx !== null ? activeIdx : autoIdx;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        .img-gallery-wrap * { font-family: 'Poppins', sans-serif; }
        
        /* Item tidak aktif: portrait ramping */
        .img-gallery-item {
          flex: 0 0 140px;
          transition: flex 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        }
        @media (min-width: 640px) {
          .img-gallery-item {
            flex: 0 0 180px;
          }
        }
        @media (min-width: 1024px) {
          .img-gallery-item {
            flex: 0 0 240px;
          }
        }
        
        /* Item aktif: mengisi seluruh sisa ruang horizontal (landscape memanjang) */
        .img-gallery-item.is-active {
          flex: 1 1 0%;
        }
      `}</style>

      <section className={cn("img-gallery-wrap w-full flex flex-col items-start justify-start", className)}>
        {showHeader && (heading || description) && (
          <div className="w-full text-left mb-6">
            {heading && <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{heading}</h2>}
            {description && <p className="text-sm text-slate-500 mt-1 max-w-2xl">{description}</p>}
          </div>
        )}

        {/* Full width galeri tanpa max-w pembatas */}
        <div
          className="flex items-stretch gap-3 md:gap-4 h-[280px] sm:h-[340px] md:h-[400px] w-full overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            setActiveIdx(null);
          }}
        >
          {images.map((img, idx) => {
            const isActive = idx === focusedIdx;
            return (
              <div
                key={idx}
                className={cn(
                  "img-gallery-item relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500",
                  isActive && "is-active shadow-xl"
                )}
                onMouseEnter={() => setActiveIdx(idx)}
              >
                <img
                  className="h-full w-full object-cover object-center"
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                />

                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-500",
                    isActive ? "opacity-40" : "opacity-20"
                  )}
                />
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}