"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm } from "@fortawesome/free-solid-svg-icons";

export default function ScreenSection() {
  const posters = [
    { id: 1, title: "Meditasi Alam", image: "https://images.unsplash.com/photo-1528319725582-ddc096101511?w=400&q=80" },
    { id: 2, title: "Yoga Retreat", image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&q=80" },
    { id: 3, title: "Chakra Healing", image: "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=400&q=80" }
  ];

  return (
    <section className="py-8 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        
        <div className="flex items-center gap-2.5 mb-6">
          <FontAwesomeIcon icon={faFilm} className="text-[#0F2856] text-xl" />
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-manrope)" }}>YOGA Screen</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Posters */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
            {posters.map((poster) => (
              <Link href="#" key={poster.id} className="relative aspect-[2/3] rounded-xl overflow-hidden group shadow-sm block hover:shadow-md transition-shadow">
                <Image
                  src={poster.image}
                  alt={poster.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <h3 className="absolute bottom-4 left-4 right-4 text-white font-bold text-sm md:text-lg leading-tight">
                  {poster.title}
                </h3>
              </Link>
            ))}
          </div>

          {/* Right Action Box */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 bg-[#0F2856] rounded-xl overflow-hidden relative group p-6 md:p-8 flex flex-col items-center text-center justify-center min-h-[250px]">
             {/* Diagonal lines pattern */}
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>
             
             <h3 className="relative z-10 text-white font-bold text-lg md:text-xl mb-4 leading-snug">
               Temukan tontonan berikutnya di layar lebar.
             </h3>
             <p className="relative z-10 text-[#FFB800] text-sm font-semibold mb-6">
               Nikmati film & event eksklusif.
             </p>
             <button className="relative z-10 bg-[#FFB800] text-gray-900 font-bold px-6 py-2.5 rounded hover:bg-[#ffaa00] transition-colors w-full">
               Beli Tiket
             </button>

             {/* Mascot illustration (mock) */}
             <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-contain bg-no-repeat bg-bottom opacity-80" style={{ backgroundImage: "url('/images/mascot-popcorn.svg')" }} />
          </div>

        </div>
      </div>
    </section>
  );
}
