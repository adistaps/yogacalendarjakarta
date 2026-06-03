"use client";

import Image from "next/image";
import Link from "next/link";

const eos = [
  { name: "Dumtulaya Studio", role: "EVENT ORGANIZER YOGA", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop" },
  { name: "Seda Sejenak", role: "WELLNESS & YOGA", image: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2070&auto=format&fit=crop" },
  { name: "Somerset Studio", role: "YOGA & MINDFULNESS", image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2070&auto=format&fit=crop" },
  { name: "Serenlume", role: "YOGA RETREAT SPECIALIST", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop" },
  { name: "Bumi Yoga", role: "COMMUNITY YOGA", image: "https://images.unsplash.com/photo-1574689211272-bc1550ce1564?q=80&w=2070&auto=format&fit=crop" },
  { name: "Inner Flow Jakarta", role: "BREATHWORK & YOGA", image: "https://images.unsplash.com/photo-1593810450967-3664c1887693?q=80&w=2069&auto=format&fit=crop" }
];

export default function PartnershipPage() {
  return (
    <>
      {/* PAGE HERO BANNER */}
      <section className="relative w-full h-[45vh] min-h-[350px] flex flex-col justify-end overflow-hidden mt-[-150px]">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1545389336-eaee37b6c5fa?q=80&w=2070&auto=format&fit=crop"
            alt="Partnership Banner"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 w-full px-8 lg:px-14 pb-16 flex flex-col lg:flex-row justify-between lg:items-end gap-6 pt-32">
          <h1
            className="text-white"
            style={{
              fontFamily: "var(--font-manrope)",
              fontWeight: 400,
              fontSize: "clamp(3rem, 5vw, 4.5rem)",
              lineHeight: 1,
            }}
          >
            Partnership
          </h1>
          <div 
            className="flex items-center gap-2 text-white/80 uppercase tracking-widest text-[0.7rem]"
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 500 }}
          >
            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
            <span>&rarr;</span>
            <span className="text-white border-b border-white pb-0.5">PARTNERSHIP</span>
          </div>
        </div>
      </section>

      {/* INTRO SECTION */}
      <section className="py-24 px-8 lg:px-14 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-16">
          <div className="lg:w-1/2">
            <p
              className="text-primary-val uppercase tracking-[0.15em] text-[0.7rem] font-medium mb-6 flex items-center gap-4"
            >
              <span className="w-10 h-[1px] bg-primary-val"></span>
              BERGABUNG BERSAMA KAMI
            </p>
            <h2
              className="text-text leading-[1.15]"
              style={{
                fontFamily: "var(--font-manrope)",
                fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                fontWeight: 400,
              }}
            >
              Tim EO yang Membangun Komunitas Yoga Jakarta
            </h2>
          </div>
          
          <div className="lg:w-1/2 lg:pt-16">
            <p className="text-text-muted leading-relaxed font-light text-[1.05rem]">
              Jakarta Yoga Calendar membuka kesempatan bagi seluruh Event Organizer yoga di Jakarta dan sekitarnya untuk mempublikasikan event mereka secara gratis. Jangkau lebih banyak peserta, kelola pendaftaran dengan mudah, dan jadilah bagian dari ekosistem yoga Jakarta yang terus berkembang.
            </p>
          </div>
        </div>
        
        {/* EO CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eos.map((eo, idx) => (
            <div key={idx} className="group flex flex-col">
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-6">
                <Image 
                  src={eo.image} 
                  alt={eo.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary-val">
                    <circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                </div>
              </div>
              <h4 
                className="text-text group-hover:text-primary-val transition-colors mb-1"
                style={{ fontFamily: "var(--font-manrope)", fontSize: "1.75rem", fontWeight: 400 }}
              >
                {eo.name}
              </h4>
              <p className="text-primary-val text-[0.65rem] uppercase tracking-widest font-medium">
                {eo.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PARTNER LOGOS STRIP */}
      <section className="py-16 bg-primary-dark text-center">
        <p className="text-white/70 uppercase tracking-[0.15em] text-[0.65rem] font-medium mb-12">
          EO PARTNER KAMI
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 px-8 opacity-80">
          <span className="text-white font-medium text-xl opacity-60" style={{ fontFamily: "var(--font-manrope)" }}>Dumtulaya</span>
          <span className="text-white font-medium text-xl opacity-60" style={{ fontFamily: "var(--font-manrope)" }}>Seda Sejenak</span>
          <span className="text-white font-medium text-xl opacity-60" style={{ fontFamily: "var(--font-manrope)" }}>Somerset</span>
          <span className="text-white font-medium text-xl opacity-60" style={{ fontFamily: "var(--font-manrope)" }}>Serenlume</span>
          <span className="text-white font-medium text-xl opacity-60" style={{ fontFamily: "var(--font-manrope)" }}>Bumi Yoga</span>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 px-8 lg:px-14 bg-bg-light text-center">
        <p className="text-primary-val uppercase tracking-[0.15em] text-[0.7rem] font-medium mb-12 flex items-center justify-center gap-4">
          <span className="w-6 h-[1px] bg-primary-val"></span>
          APA KATA EO KAMI
          <span className="w-6 h-[1px] bg-primary-val"></span>
        </p>
        
        <div className="max-w-4xl mx-auto relative">
          <p 
            className="text-text leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-manrope)", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 400 }}
          >
            "Bergabung dengan Jakarta Yoga Calendar benar-benar membuka pintu ke lebih banyak peserta. Proses pendaftaran yang simpel membuat kami bisa fokus ke kualitas event."
          </p>
          <div className="text-center">
            <h5 className="text-dark font-medium text-sm">Dumtulaya Studio</h5>
          </div>

          <div className="flex justify-center gap-4 mt-12">
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary-val hover:text-primary-val transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary-val hover:text-primary-val transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-8 lg:px-14 text-center">
        <h2 
          className="text-text mb-6"
          style={{ fontFamily: "var(--font-manrope)", fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 400 }}
        >
          Siap Mempublikasikan Event Yogamu?
        </h2>
        <p className="text-text-muted leading-relaxed font-light mb-10 max-w-2xl mx-auto">
          Daftar sebagai EO sekarang dan jangkau ribuan pecinta yoga di Jakarta. Gratis, mudah, dan terpercaya.
        </p>
        <Link 
          href="/register"
          className="inline-flex items-center justify-center px-10 py-4 transition-all duration-300 hover:opacity-90 bg-primary-val text-white uppercase tracking-widest text-xs font-medium"
        >
          Daftar sebagai EO
        </Link>
      </section>
    </>
  );
}

