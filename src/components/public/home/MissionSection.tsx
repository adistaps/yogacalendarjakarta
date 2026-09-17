"use client";

import Image from "next/image";

export default function MissionSection() {
  return (
    <section className="py-24 lg:py-32 px-8 lg:px-14">
      {/* Top row */}
      <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-20 mb-24">
        {/* Left Column */}
        <div className="lg:w-1/2">
          <p
            className="text-primary-val uppercase tracking-[0.15em] text-[0.7rem] font-medium mb-6 flex items-center gap-4"
          >
            <span className="w-10 h-[1px] bg-primary-val"></span>
            TENTANG KAMI
          </p>
          <h2
            className="text-text leading-[1.15]"
            style={{
              fontFamily: "var(--font-manrope)",
              fontSize: "clamp(2.5rem, 4vw, 3.8rem)",
              fontWeight: 400,
            }}
          >
            Menghubungkan Peserta dan Penyelenggara Yoga dalam Satu Platform
          </h2>
        </div>

        {/* Right Column */}
        <div className="lg:w-1/2 lg:pt-16">
          <p
            className="text-text-muted leading-[1.8] text-[1.05rem]"
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 300 }}
          >
            Jakarta Yoga Calendar adalah platform digital yang memudahkan kamu menemukan, mendaftar, dan mengikuti event yoga di Jakarta. Kami hadir untuk menjembatani peserta dan Event Organizer yoga dalam satu ekosistem yang simpel, modern, dan terpercaya.
          </p>
        </div>
      </div>

      {/* Grid Photos */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 h-[450px] relative rounded-2xl overflow-hidden group">
          <Image
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop"
            alt="Yoga Practice"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="md:col-span-4 h-[450px] relative rounded-2xl overflow-hidden group">
          <Image
            src="https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2070&auto=format&fit=crop"
            alt="Meditation"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="md:col-span-3 h-[450px] relative rounded-2xl overflow-hidden group">
          <Image
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop"
            alt="Stretching"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}

