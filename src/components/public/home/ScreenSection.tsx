"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm } from "@fortawesome/free-solid-svg-icons";
import ImageGallery, { GalleryImage } from "@/components/ui/image-gallery";

const YOGA_GALLERY_IMAGES: GalleryImage[] = [
  {
    src: "/banner/1.webp",
    alt: "Yoga Retreat di Alam Terbuka",
  },
  {
    src: "/banner/2.webp",
    alt: "Moonverse x Primaria Yoga Land",
  },
  {
    src: "/banner/3.webp",
    alt: "Sound Bath & Meditation Fest",
  },
];

export default function ScreenSection() {
  return (
    <section className="py-10 bg-white border-t border-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header & Deskripsi di kiri */}
        <div className="w-full mb-8">

          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
            Momen Yoga Terbaik Jakarta
          </h3>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-2xl">
            Koleksi visual dari event-event yoga dan wellness eksklusif di Jakarta — setiap momen diabadikan dengan penuh semangat dan keindahan.
          </p>
        </div>

        {/* Pembatas max-w-6xl dilepas agar rata sempurna dengan kontainer utama */}
        <div className="w-full">
          <ImageGallery
            images={YOGA_GALLERY_IMAGES}
            showHeader={false}
            autoPlayInterval={3000}
            className="p-0"
          />
        </div>
      </div>
    </section>
  );
}