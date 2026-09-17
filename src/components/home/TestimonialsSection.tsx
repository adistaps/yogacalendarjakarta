"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
import { testimonials } from "@/lib/data/testimonials";

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () =>
    setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <SectionLabel text="TESTIMONI KOMUNITAS" />
      </motion.div>

      <div className="relative max-w-3xl mx-auto mt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <p
              style={{
                fontFamily: "var(--font-manrope)",
                fontWeight: 400,
                fontSize: "clamp(1.25rem, 3vw, 2rem)",
                lineHeight: 1.4,
                color: "var(--color-text)",
              }}
            >
              &ldquo;{testimonials[current].quote}&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={testimonials[current].avatar}
                  alt={testimonials[current].name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <p
                  style={{
                    fontFamily: "var(--font-manrope)",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    color: "var(--color-text)",
                  }}
                >
                  {testimonials[current].name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-manrope)",
                    fontWeight: 300,
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {testimonials[current].role}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            className="p-2 border border-gray-200 rounded-full hover:border-primary-val hover:text-primary-val transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="p-2 border border-gray-200 rounded-full hover:border-primary-val hover:text-primary-val transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

