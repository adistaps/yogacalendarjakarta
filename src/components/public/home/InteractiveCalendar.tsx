"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faCalendarDays,
  faLocationDot,
  faClock,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";
import { Event } from "@/lib/data/events";

interface CalendarEventItem {
  displayDate: string; // YYYY-MM-DD format
  event: Event;
}

interface InteractiveCalendarProps {
  events: CalendarEventItem[];
}

export default function InteractiveCalendar({ events }: InteractiveCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Format Date to YYYY-MM-DD string for comparison
  const formatDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const [selectedDateStr, setSelectedDateStr] = useState<string>(formatDateString(new Date()));

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // Days in month
  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  // First day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = useMemo(() => {
    return new Date(year, month, 1).getDay();
  }, [year, month]);

  // Pre-calculate curated dates map for fast lookup
  const eventsByDate = useMemo(() => {
    const map: Record<string, Event[]> = {};
    events.forEach((item) => {
      const dateKey = item.displayDate;
      if (!map[dateKey]) {
        map[dateKey] = [];
      }
      map[dateKey].push(item.event);
    });
    return map;
  }, [events]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate calendar cells (blanks + days)
  const calendarCells = useMemo(() => {
    const cells = [];
    // Blank days for the start of the week
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(null);
    }
    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(year, month, d));
    }
    return cells;
  }, [year, month, firstDayOfMonth, daysInMonth]);

  const selectedDateEvents = useMemo(() => {
    return eventsByDate[selectedDateStr] || [];
  }, [eventsByDate, selectedDateStr]);

  const selectedDateFormatted = useMemo(() => {
    const d = new Date(selectedDateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }, [selectedDateStr]);

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-14">
        
        {/* Title Section */}
        <div className="mb-16">
          <span className="text-primary-val text-[0.65rem] font-bold tracking-[0.2em] uppercase mb-4 block">
            Jadwal Harian
          </span>
          <h2
            style={{
              fontFamily: "var(--font-manrope)",
              fontWeight: 500,
              fontSize: "clamp(2rem, 3vw, 2.75rem)",
              color: "var(--color-dark)",
              lineHeight: 1.2,
            }}
          >
            Kalender Interaktif
          </h2>
          <p className="text-gray-500 mt-3 text-lg font-light">
            Temukan dan ikuti aktivitas yoga harian yang terkurasi oleh admin kami.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: The Calendar Widget */}
          <div className="lg:col-span-6 bg-white border border-black/5 rounded-3xl p-6 md:p-8 shadow-sm">
            
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-base font-bold text-[#181818] uppercase tracking-wider font-mono">
                {monthNames[month]} {year}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center text-gray-500 hover:text-primary-val hover:bg-gray-50 transition-colors"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" />
                </button>
                <button
                  onClick={nextMonth}
                  className="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center text-gray-500 hover:text-primary-val hover:bg-gray-50 transition-colors"
                >
                  <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Week Days Headers */}
            <div className="grid grid-cols-7 text-center mb-4">
              {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day, idx) => (
                <span 
                  key={day} 
                  className={`text-[10px] font-bold uppercase tracking-widest pb-2 ${
                    idx === 0 || idx === 6 ? "text-primary-val/60" : "text-gray-400"
                  }`}
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar Grid Days */}
            <div className="grid grid-cols-7 gap-y-2 gap-x-1">
              {calendarCells.map((cell, idx) => {
                if (!cell) {
                  return <div key={`empty-${idx}`} className="aspect-square" />;
                }

                const dateStr = formatDateString(cell);
                const hasEvents = !!eventsByDate[dateStr];
                const isSelected = dateStr === selectedDateStr;
                const isToday = formatDateString(new Date()) === dateStr;

                return (
                  <button
                    key={`day-${cell.getDate()}`}
                    onClick={() => setSelectedDateStr(dateStr)}
                    className={`relative aspect-square rounded-full flex flex-col items-center justify-center text-xs transition-all ${
                      isSelected 
                        ? "bg-primary-val text-white font-bold shadow-md shadow-primary-val/10" 
                        : isToday
                          ? "bg-[#f0f6f7] text-primary-val font-bold border border-primary-val/20"
                          : "text-text hover:bg-gray-50"
                    }`}
                  >
                    <span>{cell.getDate()}</span>
                    {hasEvents && !isSelected && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary-val" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Selected Date Events Details */}
          <div className="lg:col-span-6 bg-white border border-black/5 rounded-3xl p-6 md:p-8 shadow-sm min-h-[400px] flex flex-col">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <span className="text-[10px] font-bold text-primary-val uppercase tracking-widest mb-1 block">
                Detail Event Pada
              </span>
              <h3 className="text-base font-bold text-[#181818] flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarDays} className="text-gray-400 shrink-0 w-4 h-4" />
                {selectedDateFormatted}
              </h3>
            </div>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                {selectedDateEvents.length > 0 ? (
                  <motion.div
                    key={selectedDateStr}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {selectedDateEvents.map((event) => (
                      <div 
                        key={event.id}
                        className="group flex gap-4 p-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-black/5 transition-all"
                      >
                        {/* Event Thumbnail */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-black/5">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <span className="text-[9px] font-bold text-primary-val uppercase tracking-wider block mb-1">
                              {event.category}
                            </span>
                            <h4 className="text-sm font-bold text-[#181818] truncate group-hover:text-primary-val transition-colors">
                              {event.title}
                            </h4>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                              <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                              <span>{event.time} - {event.endTime} WIB</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                              <FontAwesomeIcon icon={faLocationDot} className="w-3 h-3 shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* CTA Arrow */}
                        <div className="flex items-center justify-center shrink-0">
                          <Link
                            href={`/events/${event.slug}`}
                            className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-primary-val text-gray-400 group-hover:text-white flex items-center justify-center transition-colors"
                          >
                            <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center py-16 px-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#f0f6f7] text-primary-val flex items-center justify-center mb-4">
                      <FontAwesomeIcon icon={faCalendarDays} className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-[#181818] mb-1">Tidak Ada Event Kurasi</h4>
                    <p className="text-gray-400 text-xs max-w-[260px] font-light leading-relaxed">
                      Belum ada event yoga yang dijadwalkan oleh admin pada tanggal ini. Silakan pilih tanggal lainnya.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
