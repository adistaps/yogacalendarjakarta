"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AboutPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {/* PAGE HERO BANNER */}
      <section className="relative w-full h-[45vh] min-h-[350px] flex flex-col justify-end overflow-hidden mt-[-150px]">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop"
            alt="About Us Banner"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
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
            About Us
          </h1>
          <div 
            className="flex items-center gap-2 text-white/80 uppercase tracking-widest text-[0.7rem]"
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 500 }}
          >
            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
            <span>&rarr;</span>
            <span className="text-white border-b border-white pb-0.5">ABOUT US</span>
          </div>
        </div>
      </section>

      {/* MISSION SECTION */}
      <section className="py-24 px-8 lg:px-14">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-24">
          {/* Left Column */}
          <div className="lg:w-1/2">
            <p
              className="text-primary-val uppercase tracking-[0.15em] text-[0.7rem] font-medium mb-6 flex items-center gap-4"
            >
              <span className="w-10 h-[1px] bg-primary-val"></span>
              PLATFORM YOGA JAKARTA
            </p>
            <h2
              className="text-text leading-[1.15] mb-8"
              style={{
                fontFamily: "var(--font-manrope)",
                fontSize: "clamp(2.5rem, 4vw, 3.8rem)",
                fontWeight: 400,
              }}
            >
              Misi Kami: Menghubungkan Komunitas Yoga Jakarta
            </h2>
            <p 
              className="text-text text-lg leading-relaxed"
              style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
            >
              Kami membangun platform yang simpel namun powerful untuk komunitas yoga Jakarta.
            </p>
          </div>

          {/* Right Column */}
          <div className="lg:w-1/2 lg:pt-16">
            <p
              className="text-text-muted leading-[1.8] text-[1.05rem]"
              style={{ fontFamily: "var(--font-manrope)", fontWeight: 300 }}
            >
              Jakarta Yoga Calendar lahir dari keresahan yang sederhana — sulitnya menemukan informasi event yoga yang terpusat, terpercaya, dan mudah diakses. Kami hadir sebagai jembatan antara peserta yang ingin berkembang dalam praktik yoga mereka dengan para Event Organizer yang berdedikasi menghadirkan pengalaman yoga terbaik. Platform kami bukan sekadar listing event — ini adalah rumah bagi komunitas yoga Jakarta.
            </p>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto relative bg-primary-bg">
            <Image 
              src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2070&auto=format&fit=crop" 
              alt="Yoga Community" 
              fill 
              className="object-cover" 
            />
          </div>
          
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-6">
            {[
              { value: "50+", label: "Event Aktif", icon: "activity" },
              { value: "200+", label: "EO Terdaftar", icon: "users" },
              { value: "5000+", label: "Peserta Terdaftar", icon: "user-check" },
              { value: "98%", label: "Kepuasan Pengguna", icon: "smile" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-primary-bg p-8 lg:p-12 rounded-2xl flex flex-col justify-center border border-primary-val/10">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-val shadow-sm mb-6">
                  {stat.icon === 'activity' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>}
                  {stat.icon === 'users' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
                  {stat.icon === 'user-check' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>}
                  {stat.icon === 'smile' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>}
                </div>
                <h3 
                  className="text-text mb-2"
                  style={{ fontFamily: "var(--font-manrope)", fontSize: "clamp(2rem, 3vw, 2.5rem)", fontWeight: 400, lineHeight: 1 }}
                >
                  {stat.value}
                </h3>
                <p className="text-text-muted text-[0.85rem] uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE TEXT STRIP */}
      {isClient && (
        <div className="w-full overflow-hidden bg-bg-cream py-12 border-y border-primary-val/20">
          <div className="relative flex whitespace-nowrap">
            <div className="animate-marquee flex items-center">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center mx-4">
                  <span className="mx-6 text-text" style={{ fontFamily: "var(--font-manrope)", fontSize: "2rem", fontWeight: 300 }}>
                    Jakarta Yoga Calendar
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-val mx-4"></span>
                  <span className="mx-6 text-primary-val" style={{ fontFamily: "var(--font-manrope)", fontSize: "2rem", fontWeight: 400, fontStyle: "italic" }}>
                    Komunitas Yoga Jakarta
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-val mx-4"></span>
                  <span className="mx-6 text-text" style={{ fontFamily: "var(--font-manrope)", fontSize: "2rem", fontWeight: 300 }}>
                    Event Yoga Terbaik
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-val mx-4"></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VALUE PROPOSITION */}
      <section className="py-24 lg:py-32 px-8 lg:px-14 bg-bg-light">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div className="lg:w-1/2">
            <p className="text-primary-val uppercase tracking-[0.15em] text-[0.7rem] font-medium mb-6 flex items-center gap-4">
              <span className="w-10 h-[1px] bg-primary-val"></span>
              MENGAPA MEMILIH KAMI
            </p>
            <h2 className="text-text leading-[1.15]" style={{ fontFamily: "var(--font-manrope)", fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 400 }}>
              Platform yang Dibangun untuk Komunitas Yoga
            </h2>
            
            {/* Visual element or illustration could go here */}
            <div className="mt-12 hidden lg:block">
              <svg width="150" height="150" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200C155.228 200 200 155.228 200 100" stroke="var(--color-primary-val)" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="100" cy="100" r="60" fill="var(--color-primary-bg)" />
                <path d="M100 70V130M70 100H130" stroke="var(--color-primary-val)" strokeWidth="2" />
              </svg>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex flex-col justify-center gap-10">
            {[
              { title: "Mudah Digunakan", desc: "Temukan dan daftar event dalam hitungan menit", icon: "check" },
              { title: "Terpercaya", desc: "Semua EO terverifikasi oleh tim kami", icon: "shield" },
              { title: "Terpusat", desc: "Semua event yoga Jakarta dalam satu tempat", icon: "map-pin" },
              { title: "Komunitas", desc: "Bergabung dengan ribuan pecinta yoga di Jakarta", icon: "heart" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-full border border-primary-val/30 flex items-center justify-center shrink-0 group-hover:bg-primary-val group-hover:text-white transition-colors text-primary-val">
                  {item.icon === 'check' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                  {item.icon === 'shield' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>}
                  {item.icon === 'map-pin' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>}
                  {item.icon === 'heart' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>}
                </div>
                <div>
                  <h4 className="text-text text-xl font-medium mb-1" style={{ fontFamily: "var(--font-manrope)" }}>{item.title}</h4>
                  <p className="text-text-muted font-light">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EO HIGHLIGHT (4-photo collage grid) */}
      <section className="py-0 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-auto lg:h-[400px]">
          <div className="relative h-[300px] lg:h-full">
            <Image src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop" alt="Yoga 1" fill className="object-cover" />
          </div>
          <div className="relative h-[300px] lg:h-full">
            <Image src="https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2070&auto=format&fit=crop" alt="Yoga 2" fill className="object-cover" />
          </div>
          {/* Action Card */}
          <div className="relative h-[300px] lg:h-full bg-dark flex flex-col items-center justify-center p-8 text-center group">
            <div className="absolute inset-0 opacity-20">
              <Image src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2070&auto=format&fit=crop" alt="Action BG" fill className="object-cover grayscale" />
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <h3 className="text-white mb-6" style={{ fontFamily: "var(--font-manrope)", fontSize: "2rem", lineHeight: 1.2 }}>
                Jadilah Bagian dari<br/><span className="text-primary-val italic">Platform Kami</span>
              </h3>
              <Link 
                href="/partnership"
                className="px-8 py-3 bg-white text-dark hover:bg-primary-val hover:text-white transition-colors uppercase tracking-widest text-xs font-medium"
              >
                Daftar sebagai EO
              </Link>
            </div>
          </div>
          <div className="relative h-[300px] lg:h-full">
            <Image src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop" alt="Yoga 4" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 lg:py-32 px-8 lg:px-14 bg-white text-center">
        <p className="text-primary-val uppercase tracking-[0.15em] text-[0.7rem] font-medium mb-12 flex items-center justify-center gap-4">
          <span className="w-6 h-[1px] bg-primary-val"></span>
          APA KATA PESERTA KAMI
          <span className="w-6 h-[1px] bg-primary-val"></span>
        </p>
        
        <div className="max-w-4xl mx-auto">
          <svg className="w-12 h-12 text-primary-bg mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          
          <p 
            className="text-text leading-relaxed mb-8"
            style={{ fontFamily: "var(--font-manrope)", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 400 }}
          >
            "Platform ini benar-benar memudahkan saya menemukan event yoga yang sesuai jadwal dan budget. Highly recommended!"
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden relative">
              <Image src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop" alt="User" fill className="object-cover" />
            </div>
            <div className="text-left">
              <h5 className="text-dark font-medium text-sm">Sari W.</h5>
              <p className="text-primary-val text-xs uppercase tracking-widest">Peserta</p>
            </div>
          </div>
          
          {/* Simple Pagination Dots */}
          <div className="flex justify-center gap-2 mt-12">
            <button className="w-2.5 h-2.5 rounded-full bg-primary-val"></button>
            <button className="w-2.5 h-2.5 rounded-full bg-gray-200"></button>
            <button className="w-2.5 h-2.5 rounded-full bg-gray-200"></button>
          </div>
        </div>
      </section>
    </>
  );
}

