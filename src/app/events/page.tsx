"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const filters = ["Semua", "Vinyasa", "Hatha", "Restorative", "Kundalini", "Prenatal", "Retreat"];

const events = [
  {
    title: "Morning Flow Yoga",
    category: "Vinyasa",
    location: "Jakarta",
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2070&auto=format&fit=crop",
    slug: "morning-flow-yoga"
  },
  {
    title: "Heart Awakening with Mery",
    category: "Hatha",
    location: "Jakarta",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop",
    slug: "heart-awakening"
  },
  {
    title: "Zen & Zinc Yoga",
    category: "Restorative",
    location: "Jakarta",
    image: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?q=80&w=2070&auto=format&fit=crop",
    slug: "zen-zinc-yoga"
  },
  {
    title: "Yoga Retreat Puncak",
    category: "Retreat",
    location: "Bogor",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
    slug: "yoga-retreat-puncak"
  },
  {
    title: "Prenatal Yoga Session",
    category: "Gentle",
    location: "Jakarta",
    image: "https://images.unsplash.com/photo-1574689211272-bc1550ce1564?q=80&w=2070&auto=format&fit=crop",
    slug: "prenatal-yoga"
  },
  {
    title: "Breathwork & Yoga",
    category: "Breathwork",
    location: "Jakarta",
    image: "https://images.unsplash.com/photo-1593810450967-3664c1887693?q=80&w=2069&auto=format&fit=crop",
    slug: "breathwork-yoga"
  },
  {
    title: "Kundalini Rising",
    category: "Kundalini",
    location: "Jakarta",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2199&auto=format&fit=crop",
    slug: "kundalini-rising"
  },
  {
    title: "Sunset Yoga Ancol",
    category: "Vinyasa",
    location: "Jakarta",
    image: "https://images.unsplash.com/photo-1522845015757-50bce044e5da?q=80&w=2070&auto=format&fit=crop",
    slug: "sunset-yoga-ancol"
  },
  {
    title: "Yoga for Anxiety",
    category: "Hatha",
    location: "Jakarta",
    image: "https://images.unsplash.com/photo-1545389336-eaee37b6c5fa?q=80&w=2070&auto=format&fit=crop",
    slug: "yoga-for-anxiety"
  }
];

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("Semua");

  const filteredEvents = activeFilter === "Semua" 
    ? events 
    : events.filter(e => e.category.toLowerCase().includes(activeFilter.toLowerCase()) || activeFilter.toLowerCase().includes(e.category.toLowerCase()));

  return (
    <>
      {/* PAGE HERO BANNER */}
      <section className="relative w-full h-[45vh] min-h-[350px] flex flex-col justify-end overflow-hidden mt-[-150px]">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1574689211272-bc1550ce1564?q=80&w=2070&auto=format&fit=crop"
            alt="Events Banner"
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
            Semua Event
          </h1>
          <div 
            className="flex items-center gap-2 text-white/80 uppercase tracking-widest text-[0.7rem]"
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 500 }}
          >
            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
            <span>&rarr;</span>
            <span className="text-white border-b border-white pb-0.5">EVENTS</span>
          </div>
        </div>
      </section>

      {/* FILTER & SEARCH SECTION */}
      <section className="py-20 px-8 lg:px-14">
        <p
          className="text-primary-val uppercase tracking-[0.15em] text-[0.7rem] font-medium mb-4 flex items-center gap-4"
        >
          <span className="w-6 h-[1px] bg-primary-val"></span>
          TEMUKAN EVENT YANG TEPAT UNTUKMU
        </p>
        <h2
          className="text-text leading-[1.15] mb-12"
          style={{
            fontFamily: "var(--font-manrope)",
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            fontWeight: 400,
          }}
        >
          Ratusan Event Yoga Menunggumu di Jakarta
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 border-t border-primary-bg pt-8">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 transition-all duration-300 ${
                activeFilter === filter 
                  ? "bg-primary-bg text-dark" 
                  : "bg-transparent text-text-muted border border-gray-200 hover:border-gray-300"
              }`}
              style={{
                fontFamily: "var(--font-manrope)",
                fontWeight: 500,
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* EVENT GRID (Masonry-like Style) */}
      <section className="px-8 lg:px-14 pb-24">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredEvents.map((event, idx) => (
            <Link 
              href={`/events/${event.slug}`} 
              key={idx} 
              className="group block relative overflow-hidden rounded-xl break-inside-avoid"
            >
              <Image 
                src={event.image} 
                alt={event.title}
                width={800}
                height={idx % 2 === 0 ? 1000 : 800}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Gradient Overlay bottom to top */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 
                  className="text-white mb-2"
                  style={{
                    fontFamily: "var(--font-manrope)",
                    fontSize: "1.75rem",
                    fontWeight: 400,
                    lineHeight: 1.2,
                  }}
                >
                  {event.title}
                </h3>
                <div 
                  className="flex items-center gap-2 text-white/70 uppercase tracking-widest text-[0.65rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"
                  style={{ fontFamily: "var(--font-manrope)", fontWeight: 500 }}
                >
                  <span>{event.category}</span>
                  <span className="italic normal-case">//</span>
                  <span>{event.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* LOAD MORE */}
        <div className="mt-16 flex justify-center">
          <button 
            className="inline-flex items-center justify-center px-10 py-4 transition-all duration-300 hover:opacity-90 bg-primary-light text-white"
            style={{
              fontFamily: "var(--font-manrope)",
              fontWeight: 500,
              fontSize: "0.8rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            LOAD MORE
          </button>
        </div>
      </section>
    </>
  );
}

