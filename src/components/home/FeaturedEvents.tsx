"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { events } from "@/lib/data/events";

export default function FeaturedEvents() {
  const featuredEvents = events.slice(0, 6);

  return (
    <section className="pt-10 pb-24 lg:pb-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-14">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              style={{
                fontFamily: "var(--font-manrope)",
                fontWeight: 500,
                fontSize: "clamp(2rem, 3vw, 2.75rem)",
                color: "var(--color-dark)",
                lineHeight: 1.2,
              }}
            >
              Event Pilihan Minggu Ini
            </h2>
            <p className="text-gray-500 mt-3 text-lg font-light">
              Jangan lewatkan event yoga terbaik kurasi kami.
            </p>
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

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {featuredEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.08 }}
              className="break-inside-avoid"
            >
              <Link
                href={`/events/${event.slug}`}
                className="group block relative overflow-hidden rounded-xl"
              >
                <Image
                  src={event.image}
                  alt={event.title}
                  width={800}
                  height={idx % 2 === 0 ? 1000 : 800}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
