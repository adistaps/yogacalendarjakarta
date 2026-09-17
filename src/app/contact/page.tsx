"use client";

import Image from "next/image";
import Link from "next/link";

export default function ContactPage() {
  return (
    <>
      {/* PAGE HERO BANNER */}
      <section className="relative w-full h-[45vh] min-h-[350px] flex flex-col justify-end overflow-hidden mt-[-150px]">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2070&auto=format&fit=crop"
            alt="Contact Banner"
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
            Contacts
          </h1>
          <div 
            className="flex items-center gap-2 text-white/80 uppercase tracking-widest text-[0.7rem]"
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 500 }}
          >
            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
            <span>&rarr;</span>
            <span className="text-white border-b border-white pb-0.5">CONTACTS</span>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-24 px-8 lg:px-14 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <p
              className="text-primary-val uppercase tracking-[0.15em] text-[0.7rem] font-medium mb-6 flex items-center gap-4"
            >
              <span className="w-10 h-[1px] bg-primary-val"></span>
              KAMI SIAP MEMBANTU
            </p>
            <h2
              className="text-text leading-[1.15] mb-6"
              style={{
                fontFamily: "var(--font-manrope)",
                fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                fontWeight: 400,
              }}
            >
              Hubungi Kami Kapan Saja untuk Informasi dan Bantuan
            </h2>
            <p className="text-text-muted leading-relaxed font-light mb-12">
              Punya pertanyaan tentang event, pendaftaran, atau ingin bergabung sebagai EO? Jangan ragu untuk menghubungi kami.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8">
              <div>
                <h4 className="text-dark font-medium mb-3">We are Here:</h4>
                <p className="text-text-muted font-light text-sm leading-relaxed">
                  Jl. Sudirman No.1, Jakarta Selatan,<br />
                  DKI Jakarta 12190
                </p>
              </div>
              
              <div>
                <h4 className="text-dark font-medium mb-3">Call Us:</h4>
                <p className="text-text-muted font-light text-sm leading-relaxed">
                  +62 812 0000 0000<br />
                  +62 812 0000 0001
                </p>
              </div>

              <div>
                <h4 className="text-dark font-medium mb-3">Mail Us:</h4>
                <p className="text-text-muted font-light text-sm">
                  info@jakartayogacalendar.com
                </p>
              </div>

              <div>
                <h4 className="text-dark font-medium mb-3">We are in Socials:</h4>
                <div className="flex gap-4">
                  {["FB.", "IG.", "TW.", "YT."].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="text-text-muted hover:text-primary-val transition-colors text-xs font-bold tracking-widest"
                    >
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Form */}
          <div className="w-full lg:w-1/2">
            <div className="bg-primary-bg rounded-2xl p-10 lg:p-12 h-full">
              <h3 
                className="text-dark mb-6"
                style={{ fontFamily: "var(--font-manrope)", fontSize: "2rem", fontWeight: 400 }}
              >
                Kirim Pesan
              </h3>
              
              <form className="space-y-6">
                <div>
                  <input 
                    type="text" 
                    placeholder="Nama Lengkap" 
                    className="w-full bg-transparent border-b border-primary-val/30 focus:border-primary-val outline-none py-3 text-text placeholder:text-text-muted/70 text-sm transition-colors"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full bg-transparent border-b border-primary-val/30 focus:border-primary-val outline-none py-3 text-text placeholder:text-text-muted/70 text-sm transition-colors"
                  />
                </div>
                <div>
                  <input 
                    type="tel" 
                    placeholder="Nomor WhatsApp" 
                    className="w-full bg-transparent border-b border-primary-val/30 focus:border-primary-val outline-none py-3 text-text placeholder:text-text-muted/70 text-sm transition-colors"
                  />
                </div>
                <div>
                  <textarea 
                    placeholder="Pesan" 
                    rows={3}
                    className="w-full bg-transparent border-b border-primary-val/30 focus:border-primary-val outline-none py-3 text-text placeholder:text-text-muted/70 text-sm transition-colors resize-none"
                  ></textarea>
                </div>
                
                <button 
                  type="button"
                  className="px-8 py-3.5 bg-primary-val text-white hover:opacity-90 transition-opacity uppercase tracking-widest text-xs font-medium"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="w-full h-[50vh] min-h-[400px] relative">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d126916.74075487737!2d106.73295832729905!3d-6.2435529431448835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f15c711a37c1%3A0xc3b99f368bb1e9be!2sSouth%20Jakarta%2C%20South%20Jakarta%20City%2C%20Jakarta!5e0!3m2!1sen!2sid!4v1717390000000!5m2!1sen!2sid" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={false} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale opacity-80"
        ></iframe>
      </section>
    </>
  );
}

