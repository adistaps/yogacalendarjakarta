"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { MapPin, Calendar, CheckCircle2, User, Clock, Users } from "lucide-react";
import { events } from "@/lib/data/events";

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    return notFound();
  }

  // Format IDR currency
  const formatIDR = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format Date manually
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
  };

  // Related events (excluding current)
  const relatedEvents = events.filter(e => e.id !== event.id).slice(0, 3);

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
          <Link href="/" className="hover:text-primary-val transition-colors">Home</Link>
          <span>&rarr;</span>
          <Link href="/events" className="hover:text-primary-val transition-colors">Events</Link>
          <span>&rarr;</span>
          <span className="text-dark">{event.title}</span>
        </div>

        {/* HEADER TITLE */}
        <h1 
          className="text-dark mb-10"
          style={{ fontFamily: "var(--font-manrope)", fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 500, lineHeight: 1.1 }}
        >
          {event.title}
        </h1>

        {/* GALLERY COLLAGE (Simulated with one main and two small side-by-side) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16 h-[400px]">
          <div className="md:col-span-3 relative rounded-2xl overflow-hidden h-full">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            <div className="relative flex-1 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop"
                alt="Yoga Detail 1"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative flex-1 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=800&auto=format&fit=crop"
                alt="Yoga Detail 2"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 relative">
          
          {/* LEFT COLUMN - CONTENT */}
          <div className="w-full lg:w-2/3 flex flex-col">
            <h2 
              className="text-dark mb-6"
              style={{ fontFamily: "var(--font-manrope)", fontSize: "clamp(1.8rem, 3vw, 2.2rem)", fontWeight: 600, lineHeight: 1.2 }}
            >
              {event.title} with {event.organizer}
            </h2>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-6 pb-8 mb-8 border-b border-gray-200 text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary-val" />
                <span>{event.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-val" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-val" />
                <span>{event.location}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h3 
                className="text-dark mb-4"
                style={{ fontFamily: "var(--font-manrope)", fontSize: "1.25rem", fontWeight: 700 }}
              >
                Tentang Event Ini
              </h3>
              <p className="text-gray-600 leading-relaxed font-light whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Blockquote */}
            {event.quote && (
              <blockquote className="bg-teal-50 border-l-4 border-primary-val p-6 rounded-r-xl mb-12">
                <p 
                  className="text-dark text-lg italic leading-relaxed font-medium"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  "{event.quote}"
                </p>
                <p className="text-gray-500 text-sm mt-3 font-bold uppercase tracking-wider">— {event.organizer}</p>
              </blockquote>
            )}

            {/* Benefits */}
            {event.benefits && event.benefits.length > 0 && (
              <div className="mb-12">
                <h3 
                  className="text-dark mb-6"
                  style={{ fontFamily: "var(--font-manrope)", fontSize: "1.25rem", fontWeight: 700 }}
                >
                  Apa yang Akan Kamu Dapatkan
                </h3>
                <ul className="space-y-4">
                  {event.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600 font-light">
                      <CheckCircle2 className="w-5 h-5 text-primary-val shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
              {event.tags.map(tag => (
                <span key={tag} className="px-4 py-1.5 bg-[#e2f1f1] text-primary-val text-xs font-bold uppercase tracking-wider rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN - STICKY SIDEBAR */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-32 bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] p-8 border border-gray-100">
              
              {/* Price */}
              <div className="mb-8">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-2">Harga Tiket</span>
                <div className="flex items-end gap-1 text-primary-val">
                  <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-manrope)" }}>
                    {formatIDR(event.price)}
                  </span>
                  <span className="text-sm font-medium mb-1 text-dark">/pax</span>
                </div>
              </div>

              {/* Info Details */}
              <div className="space-y-6 mb-8">
                <div className="flex gap-4">
                  <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold uppercase text-gray-900 mb-1">Tanggal & Waktu</span>
                    <span className="text-gray-500 text-sm font-light">{formatDate(event.date)}<br/>{event.time} - {event.endTime} WIB</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold uppercase text-gray-900 mb-1">Lokasi</span>
                    <span className="text-gray-500 text-sm font-light">{event.location}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Users className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold uppercase text-gray-900 mb-1">Kapasitas Tersisa</span>
                    <span className="inline-block px-3 py-1 bg-red-50 text-red-500 text-xs font-bold rounded-full mt-1">
                      {event.remaining} TERSISA
                    </span>
                  </div>
                </div>
              </div>

              <Link 
                href={`/events/${slug}/booking`}
                className="w-full block py-4 bg-[#325e60] text-white text-center hover:bg-[#264b4c] transition-colors rounded-[4px] font-bold text-xs tracking-widest uppercase mb-4"
              >
                Daftar Sekarang
              </Link>
              
              <p className="text-center text-xs text-gray-400 font-light">
                Pendaftaran akan ditutup 1 hari sebelum acara
              </p>
            </div>
          </div>

        </div>

        {/* RELATED EVENTS */}
        <div className="mt-24 pt-16 border-t border-gray-200">
          <h2 
            className="text-center text-dark mb-12"
            style={{ fontFamily: "var(--font-manrope)", fontSize: "2rem", fontWeight: 700 }}
          >
            Acara Serupa
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedEvents.map((relEvent) => (
              <Link key={relEvent.id} href={`/events/${relEvent.slug}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <Image 
                    src={relEvent.image} 
                    alt={relEvent.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm shadow-sm">
                    <span className="text-[0.65rem] font-bold tracking-wider uppercase text-dark">
                      {relEvent.category} • {new Date(relEvent.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 
                    style={{ fontFamily: "var(--font-manrope)", fontSize: "1.25rem", fontWeight: 700 }} 
                    className="text-dark group-hover:text-primary-val transition-colors mb-2 line-clamp-1"
                  >
                    {relEvent.title}
                  </h4>
                  <p className="text-gray-500 text-sm font-light line-clamp-2">
                    {relEvent.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
