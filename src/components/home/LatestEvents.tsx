"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { events } from "@/lib/data/events";
import EventCard from "@/components/public/events/EventCard";

export default function LatestEvents() {
  // Use the last 3 events as "Latest"
  const latestEvents = events.slice(6, 9);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-14">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary-val text-[0.65rem] font-bold tracking-[0.2em] uppercase mb-4 block">
              Baru Saja Ditambahkan
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
              Event Yoga Terbaru
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/events"
              className="inline-flex items-center text-dark font-bold text-xs tracking-widest uppercase hover:text-primary-val transition-colors group pb-1 border-b border-transparent hover:border-primary-val"
            >
              Lihat Semua Event
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {latestEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
            >
              <EventCard event={event} index={idx} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
