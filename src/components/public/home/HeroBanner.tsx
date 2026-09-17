"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, MapPin, ArrowRight } from "lucide-react";
import { Event } from "@/lib/data/events";

interface HeroBannerProps {
  initialHeroEvents?: Event[];
}

const fallbackHeroEvents: Event[] = [
  {
    id: "hero-1",
    slug: "yoga-for-body-and-mind",
    title: "Yoga for Body and Mind",
    category: "Special Event",
    organizer: "Jakarta Yoga Calendar",
    location: "Jakarta",
    date: new Date().toISOString(),
    time: "08:00",
    endTime: "10:00",
    price: 0,
    quota: 100,
    remaining: 100,
    image: "/images/hero-calmi.png",
    tags: ["Yoga", "Mindfulness"],
    description: "Mindful movement, conscious living",
    ticketTypes: [],
    quote: "Yoga is a journey of the self, through the self, to the self.",
    benefits: []
  },
  {
    id: "hero-2",
    slug: "find-your-inner-peace",
    title: "Find Your Inner Peace",
    category: "Retreat",
    organizer: "Yoga Studio",
    location: "Bali",
    date: new Date(Date.now() + 86400000 * 7).toISOString(),
    time: "07:00",
    endTime: "09:00",
    price: 0,
    quota: 50,
    remaining: 50,
    image: "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=1600&q=80",
    tags: ["Meditation", "Peace"],
    description: "Discover a deeper connection with your true self.",
    ticketTypes: [],
    quote: "Peace comes from within. Do not seek it without.",
    benefits: []
  }
];

export default function HeroBanner({ initialHeroEvents }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Use dynamic events if available and length > 0, otherwise use fallback slides
  const displayEvents = initialHeroEvents && initialHeroEvents.length > 0 
    ? initialHeroEvents 
    : fallbackHeroEvents;

  // Autoplay functionality
  useEffect(() => {
    if (displayEvents.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayEvents.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [displayEvents.length, isHovered]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? displayEvents.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % displayEvents.length);
  };

  const currentEvent = displayEvents[currentIndex];

  return (
    <section 
      className="relative w-full h-screen min-h-[600px] flex flex-col justify-center overflow-hidden bg-white p-2 md:p-3 lg:p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden bg-gray-900">
        
        {/* Animated Slide Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentEvent.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={currentEvent.image}
              alt={currentEvent.title}
              fill
              priority
              className="object-cover"
            />
            {/* Elegant dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Top bar social info */}
        <div className="absolute top-[18%] left-8 lg:left-14 right-8 lg:right-14 z-10 flex justify-between items-center text-white/90 text-[0.65rem] font-bold tracking-[0.2em] uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary-val rounded-full animate-ping"></span>
            Featured Yoga Event
          </div>
          {displayEvents.length > 1 && (
            <span className="font-mono">
              0{currentIndex + 1} / 0{displayEvents.length}
            </span>
          )}
        </div>

        {/* Animated Slide Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-end pb-24 md:pb-28 px-8 lg:px-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvent.id}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl space-y-6"
            >
              {/* Event Category & Organizer */}
              <span className="inline-block px-3 py-1.5 bg-primary-val text-white text-[9px] font-bold uppercase tracking-widest rounded-full">
                {currentEvent.category} // {currentEvent.organizer}
              </span>

              {/* Event Title */}
              <h1 
                className="text-white leading-[1.1] mb-2 font-light"
                style={{ 
                  fontFamily: "var(--font-manrope)", 
                  fontSize: "clamp(2rem, 5vw, 4.5rem)",
                  letterSpacing: "-0.01em"
                }}
              >
                {currentEvent.title}
              </h1>

              {/* Date & Location */}
              <div className="flex flex-wrap items-center gap-6 text-white/80 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-primary-val shrink-0" />
                  <span>{new Date(currentEvent.date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary-val shrink-0" />
                  <span>{currentEvent.location}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Link
                  href={`/events/${currentEvent.slug}`}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-[#181818] rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary-val hover:text-white transition-all shadow-md group"
                >
                  Dapatkan Tiket
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows */}
        {displayEvents.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/10 border border-white/10 hover:bg-primary-val text-white flex items-center justify-center transition-all hover:scale-105"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/10 border border-white/10 hover:bg-primary-val text-white flex items-center justify-center transition-all hover:scale-105"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Dot indicators at the bottom */}
        {displayEvents.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {displayEvents.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "w-8 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

