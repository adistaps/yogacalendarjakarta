"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const faqs = [
  {
    q: "Apakah saya perlu pengalaman yoga sebelumnya untuk mendaftar event?",
    a: "Tidak perlu. Setiap event memiliki keterangan level (pemula/menengah/lanjutan). Pilih yang sesuai kemampuanmu."
  },
  {
    q: "Bagaimana cara mendaftar event di Jakarta Yoga Calendar?",
    a: "Pilih event, klik Daftar, isi data diri, lakukan transfer pembayaran, upload bukti transfer, dan tunggu konfirmasi dari admin."
  },
  {
    q: "Berapa lama proses verifikasi pembayaran?",
    a: "Verifikasi dilakukan dalam 1x24 jam di hari kerja. Kamu akan mendapat email konfirmasi setelah pembayaran terverifikasi."
  },
  {
    q: "Apakah bisa refund jika saya tidak bisa hadir?",
    a: "Kebijakan refund ditentukan oleh masing-masing EO. Silakan cek detail event atau hubungi EO terkait."
  },
  {
    q: "Apa yang harus saya bawa ke event yoga?",
    a: "Matras (beberapa event menyediakan), pakaian olahraga nyaman, air minum, dan semangat yang terbuka."
  },
  {
    q: "Bagaimana jika event dibatalkan oleh EO?",
    a: "Kamu akan mendapat notifikasi email dan refund penuh akan diproses dalam 3-5 hari kerja."
  },
  {
    q: "Bagaimana cara mendaftarkan event sebagai EO?",
    a: "Kunjungi halaman Partnership kami dan isi form pendaftaran EO. Tim kami akan menghubungimu dalam 1x24 jam."
  },
  {
    q: "Apakah ada biaya untuk mendaftarkan event sebagai EO?",
    a: "Saat ini pendaftaran EO gratis. Kami hanya mengambil persentase kecil dari setiap tiket terjual."
  },
  {
    q: "Apakah Jakarta Yoga Calendar hanya untuk event di Jakarta?",
    a: "Tidak. Kami juga menampilkan event di Bogor, Depok, Tangerang, dan Bekasi (Jabodetabek)."
  },
  {
    q: "Bagaimana cara menghubungi tim Jakarta Yoga Calendar?",
    a: "Kamu bisa menghubungi kami melalui form di halaman Contact Us atau via Instagram @jakartayogacalendar."
  }
];

export default function FaqPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
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
            alt="FAQ Banner"
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
            FAQ's
          </h1>
          <div 
            className="flex items-center gap-2 text-white/80 uppercase tracking-widest text-[0.7rem]"
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 500 }}
          >
            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
            <span>&rarr;</span>
            <span className="text-white border-b border-white pb-0.5">FAQ</span>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 px-8 lg:px-14 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-1/3 flex flex-col">
            <div className="sticky top-32">
              <p
                className="text-primary-val uppercase tracking-[0.15em] text-[0.7rem] font-medium mb-6 flex items-center gap-4"
              >
                <span className="w-10 h-[1px] bg-primary-val"></span>
                PERTANYAAN UMUM
              </p>
              <h2
                className="text-text leading-[1.15] mb-10"
                style={{
                  fontFamily: "var(--font-manrope)",
                  fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                  fontWeight: 400,
                }}
              >
                Semua yang Perlu Kamu Tahu dalam Satu Halaman
              </h2>
              
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-10 py-4 bg-primary-val text-white hover:opacity-90 transition-opacity self-start"
                style={{ fontFamily: "var(--font-manrope)", fontWeight: 500, fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase" }}
              >
                Hubungi Kami
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN - Accordion */}
          <div className="w-full lg:w-2/3">
            <div className="flex flex-col">
              {faqs.map((faq, idx) => {
                const isActive = activeFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="border-b border-gray-200 py-6 cursor-pointer group"
                    onClick={() => setActiveFaq(idx === activeFaq ? null : idx)}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <h3 
                        className={`transition-colors duration-300 pr-8 ${isActive ? "text-primary-val" : "text-text group-hover:text-primary-val"}`}
                        style={{
                          fontFamily: "var(--font-manrope)",
                          fontSize: "clamp(1.2rem, 2vw, 1.5rem)",
                          fontWeight: 500,
                          lineHeight: 1.4,
                        }}
                      >
                        {faq.q}
                      </h3>
                      <div className="shrink-0 mt-1">
                        <svg 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="1.5"
                          className={`text-gray-400 transition-transform duration-300 ${isActive ? "rotate-90 text-primary-val" : "rotate-0"}`}
                        >
                          <path d="m9 18 6-6-6-6"/>
                        </svg>
                      </div>
                    </div>
                    
                    <div 
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive ? "max-h-[300px] mt-4 opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <p className="text-text-muted leading-relaxed font-light text-[0.95rem] pr-12">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </section>

      {/* MARQUEE TEXT STRIP */}
      {isClient && (
        <div className="w-full overflow-hidden bg-bg-cream py-12 border-t border-primary-val/20 mt-10">
          <div className="relative flex whitespace-nowrap">
            <div className="animate-marquee flex items-center">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center mx-4">
                  <span className="mx-6 text-text" style={{ fontFamily: "var(--font-manrope)", fontSize: "2rem", fontWeight: 300 }}>
                    Jakarta Yoga Calendar
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-val mx-4"></span>
                  <span className="mx-6 text-primary-val" style={{ fontFamily: "var(--font-manrope)", fontSize: "2rem", fontWeight: 400, fontStyle: "italic" }}>
                    Temukan Event Yoga
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-val mx-4"></span>
                  <span className="mx-6 text-text" style={{ fontFamily: "var(--font-manrope)", fontSize: "2rem", fontWeight: 300 }}>
                    Daftar Sekarang
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-val mx-4"></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

