"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import { Calendar, MapPin, User, UploadCloud, Building2 } from "lucide-react";
import { events } from "@/lib/data/events";

export default function BookingPage() {
  const params = useParams();
  const slug = params.slug as string;
  const event = events.find((e) => e.slug === slug);

  const [ticketCount, setTicketCount] = useState(1);
  const maxTickets = event ? event.remaining : 1;
  const ticketPrice = event ? event.price : 0;
  const serviceFee = 5000;

  if (!event) {
    return notFound();
  }

  const handleMinus = () => {
    if (ticketCount > 1) setTicketCount(ticketCount - 1);
  };

  const handlePlus = () => {
    if (ticketCount < maxTickets) setTicketCount(ticketCount + 1);
  };

  // Format IDR currency
  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format Date
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* HEADER AREA */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
            <Link href="/" className="hover:text-primary-val transition-colors">Home</Link>
            <span>&rarr;</span>
            <Link href="/events" className="hover:text-primary-val transition-colors">Events</Link>
            <span>&rarr;</span>
            <Link href={`/events/${slug}`} className="hover:text-primary-val transition-colors">{event.title}</Link>
            <span>&rarr;</span>
            <span className="text-dark">Pendaftaran</span>
          </div>

          <h1 
            className="text-dark mb-3"
            style={{ fontFamily: "var(--font-manrope)", fontSize: "clamp(2rem, 3vw, 2.5rem)", fontWeight: 500 }}
          >
            Form Pendaftaran
          </h1>
          <p className="text-gray-500 text-lg font-light">
            Lengkapi data diri Anda untuk mengikuti sesi {event.title}.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-3/5 space-y-6">
            
            {/* Detail Pendaftaran */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
              <h3 className="text-xl text-dark font-medium mb-6" style={{ fontFamily: "var(--font-manrope)" }}>
                Detail Pendaftaran
              </h3>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-gray-100">
                <div>
                  <h4 className="font-medium text-dark text-lg">Tiket Reguler</h4>
                  <p className="text-gray-500 text-sm font-light mt-1">Akses penuh ke sesi {event.title} (90 menit).</p>
                </div>
                
                <div className="flex items-center gap-6">
                  <span className="text-xl text-primary-val" style={{ fontFamily: "var(--font-manrope)", fontWeight: 500 }}>
                    {formatIDR(ticketPrice)}
                  </span>
                  
                  <div className="flex items-center gap-4 border border-gray-200 rounded-full px-2 py-1">
                    <button 
                      onClick={handleMinus}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-dark transition-colors disabled:opacity-30 disabled:hover:text-gray-500"
                      disabled={ticketCount <= 1}
                    >
                      <span className="text-xl leading-none mb-1">-</span>
                    </button>
                    <span className="w-4 text-center font-medium text-dark">{ticketCount}</span>
                    <button 
                      onClick={handlePlus}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-dark transition-colors disabled:opacity-30 disabled:hover:text-gray-500"
                      disabled={ticketCount >= maxTickets}
                    >
                      <span className="text-xl leading-none mb-1">+</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Peserta Data Cards */}
            {[...Array(ticketCount)].map((_, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-3 mb-8">
                  <User className="w-5 h-5 text-primary-val" />
                  <h3 className="text-lg text-primary-val font-bold" style={{ fontFamily: "var(--font-manrope)" }}>
                    Peserta {i + 1}
                  </h3>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[0.7rem] font-bold text-dark mb-1 tracking-wider uppercase">Nama Lengkap</label>
                      <input 
                        type="text" 
                        className="w-full bg-blue-50/50 border-b-2 border-transparent focus:border-primary-val px-4 py-3 outline-none transition-colors text-dark placeholder:text-gray-400 font-medium text-sm rounded-t-lg"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div>
                      <label className="block text-[0.7rem] font-bold text-dark mb-1 tracking-wider uppercase">Nomor WhatsApp</label>
                      <input 
                        type="tel" 
                        className="w-full bg-blue-50/50 border-b-2 border-transparent focus:border-primary-val px-4 py-3 outline-none transition-colors text-dark placeholder:text-gray-400 font-medium text-sm rounded-t-lg"
                        placeholder="08xx xxxx xxxx"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold text-dark mb-1 tracking-wider uppercase">Email</label>
                    <input 
                      type="email" 
                      className="w-full bg-blue-50/50 border-b-2 border-transparent focus:border-primary-val px-4 py-3 outline-none transition-colors text-dark placeholder:text-gray-400 font-medium text-sm rounded-t-lg"
                      placeholder="email@contoh.com"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Bukti Pembayaran */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
              <h3 className="text-xl text-dark font-medium mb-6" style={{ fontFamily: "var(--font-manrope)" }}>
                Bukti Pembayaran
              </h3>
              
              <div className="border-2 border-dashed border-gray-300 hover:border-primary-val rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                <div className="w-14 h-14 rounded-full bg-[#e2f1f1] flex items-center justify-center text-primary-val mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud size={24} />
                </div>
                <span className="text-dark font-bold mb-2">Upload Bukti Transfer</span>
                <span className="text-gray-400 text-xs mb-4">JPG, PNG, atau PDF (Max 5MB)</span>
                <button className="px-6 py-2 border border-gray-300 rounded-full text-xs font-bold uppercase tracking-wider text-dark hover:bg-gray-50 transition-colors">
                  Pilih File
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button 
                className="px-10 py-4 bg-[#325e60] text-white text-center hover:bg-[#264b4c] transition-colors rounded-full font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2"
              >
                Kirim Pendaftaran
                <span>&rarr;</span>
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN - STICKY SIDEBAR */}
          <div className="w-full lg:w-2/5">
            <div className="sticky top-32 space-y-6">
              
              {/* Summary Card */}
              <div className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
                {/* Event Summary */}
                <div className="p-8 bg-[#f1f7f7]">
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-[#325e60] text-white text-[0.65rem] font-bold uppercase tracking-wider rounded-full">
                      YOGA CLASS
                    </span>
                  </div>
                  <h4 className="text-xl text-dark mb-6" style={{ fontFamily: "var(--font-manrope)", fontWeight: 500 }}>
                    {event.title} at {event.organizer}
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                      <p className="text-sm font-light text-gray-600 leading-tight">
                        {formatDate(event.date)}<br/>{event.time} - {event.endTime} WIB
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <p className="text-sm font-light text-gray-600 leading-tight">
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="p-8">
                  <h4 className="text-dark mb-4 font-bold" style={{ fontFamily: "var(--font-manrope)" }}>
                    Ringkasan Pesanan
                  </h4>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm font-light text-gray-600">
                      <span>{ticketCount}x Tiket Reguler</span>
                      <span>{formatIDR(ticketPrice * ticketCount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-light text-gray-600">
                      <span>Biaya Layanan</span>
                      <span>{formatIDR(serviceFee)}</span>
                    </div>
                  </div>

                  <hr className="border-gray-100 mb-6" />

                  <div className="flex justify-between items-center">
                    <span className="text-dark font-bold">Total</span>
                    <span 
                      className="text-primary-val"
                      style={{ fontFamily: "var(--font-manrope)", fontSize: "1.5rem", fontWeight: 700 }}
                    >
                      {formatIDR((ticketPrice * ticketCount) + serviceFee)}
                    </span>
                  </div>
                  
                  {/* Transfer Info */}
                  <div className="mt-8 bg-[#f8fafc] p-6 rounded-2xl border border-gray-100">
                    <span className="block text-[0.65rem] uppercase tracking-widest text-gray-500 font-bold mb-4">Transfer Pembayaran Ke:</span>
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="text-primary-val w-6 h-6" />
                      <span className="text-dark font-bold text-xl" style={{ fontFamily: "var(--font-manrope)" }}>BCA</span>
                    </div>
                    <div className="text-4xl text-dark tracking-wider mb-2" style={{ fontFamily: "var(--font-manrope)", fontWeight: 500 }}>
                      1234 5678 90
                    </div>
                    <span className="text-sm text-gray-500 font-light">
                      a/n Jakarta Yoga Calendar
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
