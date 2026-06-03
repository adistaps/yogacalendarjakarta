"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex flex-col justify-center overflow-hidden bg-white p-2 md:p-3 lg:p-4">
      {/* Inner container with rounded corners */}
      <div className="relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-calmi.png"
            alt="Yoga for Body and Mind"
            fill
            priority
            className="object-cover"
          />
          {/* Subtle dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center px-8 lg:px-14">
          
          {/* Top small text info */}
          <div className="absolute top-[25%] left-8 lg:left-14 right-8 lg:right-14 flex flex-col md:flex-row justify-between items-start md:items-center text-white/90 text-[0.65rem] font-bold tracking-[0.2em] uppercase gap-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              Mindful movement, conscious living
            </div>
            <div className="hidden md:flex gap-12">
              <span>info@jakartayogacalendar.com</span>
              <span>+62 812 0000 0000</span>
            </div>
          </div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-20 md:mt-0"
          >
            <h1 
              className="text-white leading-[1.05]"
              style={{ 
                fontFamily: "var(--font-manrope)", 
                fontSize: "clamp(3.5rem, 8vw, 7.5rem)",
                fontWeight: 300,
                letterSpacing: "-0.02em"
              }}
            >
              Yoga for Body <br /> and Mind
            </h1>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
