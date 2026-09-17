"use client";

import Image from "next/image";
import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="py-8 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        <Link href="/partnership" className="block relative w-full h-[120px] md:h-[180px] lg:h-[200px] rounded-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #ffffff 12.50%, transparent 12.50%, transparent 50%, #ffffff 50%, #ffffff 62.50%, transparent 62.50%, transparent 100%)', backgroundSize: '14.14px 14.14px' }}></div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-between px-8 md:px-16">
            <div className="text-white space-y-1 md:space-y-3 z-10">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black italic tracking-wider shadow-sm">
                #PASTIBISA
              </h2>
              <p className="text-sm md:text-xl font-semibold opacity-90">
                Bisa Cek, Bisa Pasti Bisa.
              </p>
            </div>
            
            <div className="hidden md:flex flex-col items-center justify-center bg-[#FF9800] rounded-xl px-6 py-4 transform rotate-3 shadow-xl group-hover:rotate-0 transition-transform">
              <span className="text-white font-bold uppercase text-xs tracking-widest">Biaya Komisi</span>
              <span className="text-white font-black text-4xl">1,2%</span>
              <span className="text-white font-semibold text-xs">Semua Event Creator</span>
            </div>
            
            <div className="md:hidden flex items-center justify-center bg-[#FF9800] rounded-lg px-4 py-2 shadow-lg">
              <span className="text-white font-black text-xl">1,2%</span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
