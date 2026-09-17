"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Event } from "@/lib/data/events";

interface CalendarEventData {
  displayDate: string;
  event: Event;
}

interface EventToGoSectionProps {
  events: CalendarEventData[];
}

export default function EventToGoSection({ events }: EventToGoSectionProps) {
  // If no dynamic events, we provide some mock events
  const displayEvents = events.length > 0 ? events : [
    {
      displayDate: "2024-07-20",
      event: {
        id: "mock-1",
        slug: "yoga-for-body-and-mind",
        title: "Jakarta Folk Kemayoran 2026",
        category: "Festival",
        organizer: "Eventku",
        location: "JIExpo Kemayoran, Jakarta",
        date: "2024-07-20T00:00:00.000Z",
        time: "10:00",
        endTime: "22:00",
        price: 50000,
        quota: 100,
        remaining: 20,
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80",
        tags: [],
        description: "",
        ticketTypes: [],
        quote: "",
        benefits: []
      }
    },
    {
      displayDate: "2024-07-22",
      event: {
        id: "mock-2",
        slug: "mock-2",
        title: "(YOGYAKARTA) Pertunjukan Dua Dunia",
        category: "Exhibition",
        organizer: "ArtSpace",
        location: "Yogyakarta",
        date: "2024-07-22T00:00:00.000Z",
        time: "15:00",
        endTime: "21:00",
        price: 75000,
        quota: 100,
        remaining: 50,
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80",
        tags: [],
        description: "",
        ticketTypes: [],
        quote: "",
        benefits: []
      }
    },
    {
      displayDate: "2024-07-25",
      event: {
        id: "mock-3",
        slug: "mock-3",
        title: "KARD 2026 WORLD TOUR IN JAKARTA",
        category: "Concert",
        organizer: "KPOP Live",
        location: "Tennis Indoor Senayan",
        date: "2024-07-25T00:00:00.000Z",
        time: "19:00",
        endTime: "22:00",
        price: 1500000,
        quota: 500,
        remaining: 100,
        image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=500&q=80",
        tags: [],
        description: "",
        ticketTypes: [],
        quote: "",
        benefits: []
      }
    }
  ];

  return (
    <section className="py-8 md:py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Side: Sticky Banner */}
          <div className="w-full lg:w-[35%] xl:w-[30%] lg:sticky lg:top-24">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-lg group">
              <div className="absolute inset-0 bg-[#0055B8]">
                {/* A creative abstract background for the "EVENT TO GO THIS WEEK" banner */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
              </div>
              <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center">
                <div className="bg-white px-6 py-8 rounded-xl shadow-2xl transform rotate-[-5deg] group-hover:rotate-0 transition-transform duration-300 border-2 border-[#FF6B00]">
                  <h2 className="text-3xl font-black text-[#FF6B00] uppercase leading-none mb-2" style={{ fontFamily: "var(--font-manrope)" }}>
                    Event<br />2 Go
                  </h2>
                  <p className="text-sm font-bold text-gray-800 uppercase tracking-widest">This Week</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Timeline List */}
          <div className="w-full lg:w-[65%] xl:w-[70%]">
            <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-[#FF6B00] text-white flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-manrope)" }}>Event2Go</h2>
              </div>
              <Link href="/events" className="text-sm font-semibold text-primary-val hover:underline flex items-center gap-1">
                Lebih banyak Event <ChevronRight size={16} />
              </Link>
            </div>

            <div className="relative border-l-2 border-gray-100 ml-4 md:ml-8 pl-6 md:pl-10 space-y-10">
              {displayEvents.map((item, idx) => {
                const eventDate = new Date(item.event.date);
                const month = eventDate.toLocaleString('id-ID', { month: 'short' });
                const dateNum = eventDate.getDate();

                return (
                  <div key={item.event.id + idx} className="relative group">
                    {/* Timeline Dot & Date Badge */}
                    <div className="absolute -left-[54px] md:-left-[70px] top-1/2 -translate-y-1/2 flex flex-col items-center bg-white border border-gray-200 rounded-lg w-12 h-14 justify-center shadow-sm z-10 group-hover:border-primary-val group-hover:text-primary-val transition-colors">
                      <span className="text-xs font-semibold uppercase">{month}</span>
                      <span className="text-lg font-black">{dateNum}</span>
                    </div>

                    <Link href={`/events/${item.event.slug}`} className="block">
                      <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                        {/* Detail */}
                        <div className="flex-1 pr-4">
                          <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-primary-val transition-colors line-clamp-1">{item.event.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">{item.event.date ? new Date(item.event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''} • {item.event.location}</p>
                          <span className="inline-block px-2.5 py-1 bg-gray-100 text-xs font-semibold text-gray-600 rounded-md">
                            {item.event.organizer}
                          </span>
                        </div>
                        {/* Image Thumbnail */}
                        <div className="w-24 h-16 md:w-32 md:h-20 shrink-0 rounded-lg overflow-hidden relative">
                          <Image
                            src={item.event.image}
                            alt={item.event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
