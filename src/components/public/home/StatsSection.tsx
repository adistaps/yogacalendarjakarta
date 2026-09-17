"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Flower2, Users, PlayCircle, Heart } from "lucide-react";

const stats = [
  { value: "15+", label: "CERTIFIED AND EXPERIENCED INSTRUCTORS", icon: Flower2 },
  { value: "1000+", label: "CLASSES THOUGHTFULLY GUIDED", icon: PlayCircle },
  { value: "12000+", label: "STUDENTS ON THEIR YOGA JOURNEY", icon: Users },
  { value: "98%", label: "POSITIVE FEEDBACKS FROM OUR STUDENTS", icon: Heart },
];

export default function StatsSection() {
  return (
    <section className="relative w-full py-24 lg:py-32 flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-calmi.png" // Reusing the high-quality image
          alt="Yoga Background"
          fill
          className="object-cover object-center"
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-14 w-full flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2"
        >
          <p className="flex items-center gap-3 text-white text-[0.65rem] font-bold tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            THE HEART OF OUR PRACTICE
          </p>
          <h2
            className="text-white mb-10 leading-[1.15]"
            style={{
              fontFamily: "var(--font-manrope)",
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              fontWeight: 400,
            }}
          >
            A Mindful Yoga Practice for Balance, Strength & Calm
          </h2>
          <Link
            href="/events"
            className="inline-flex bg-[#e8dad0] text-dark px-8 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-white"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Make an Appointment
          </Link>
        </motion.div>

        {/* Right Content - 2x2 Grid */}
        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-8 text-white flex flex-col shadow-sm transition-transform hover:-translate-y-1"
              >
                <div className="bg-white text-[#659b9e] w-12 h-12 rounded-xl flex items-center justify-center mb-12 shadow-sm">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 
                  className="mb-2"
                  style={{
                    fontFamily: "var(--font-manrope)",
                    fontSize: "2.75rem",
                    fontWeight: 400,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </h3>
                <p 
                  className="text-white text-[0.65rem] font-bold tracking-wider uppercase leading-relaxed max-w-[200px]"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
