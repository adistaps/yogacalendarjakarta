"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flower, Wind, Moon, Flame, HeartPulse, Sun } from "lucide-react";

const categories = [
  { name: "Vinyasa", slug: "Vinyasa", icon: Wind },
  { name: "Ashtanga", slug: "Ashtanga", icon: Flame },
  { name: "Kundalini", slug: "Kundalini", icon: Sun },
  { name: "Restorative", slug: "Restorative", icon: HeartPulse },
  { name: "Sound Healing", slug: "Sound Healing", icon: Moon },
  { name: "Retreat", slug: "Retreat", icon: Flower },
];

export default function CategoriesSection() {
  return (
    <section className="pt-20 pb-0 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2
            style={{
              fontFamily: "var(--font-manrope)",
              fontWeight: 500,
              fontSize: "1.75rem",
              color: "var(--color-dark)",
            }}
          >
            Kategori Pilihan
          </h2>
        </motion.div>
 
        <div className="grid grid-cols-3 md:grid-cols-6 gap-y-10 gap-x-6 md:gap-12 max-w-4xl mx-auto justify-items-center">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="w-full flex justify-center"
              >
                <Link
                  href={`/events?category=${encodeURIComponent(cat.slug)}`}
                  className="group flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1 w-full max-w-[120px]"
                >
                  <Icon size={56} strokeWidth={1.0} className="mb-4 text-black group-hover:text-primary-val transition-colors duration-300" />
                  <span
                    className="text-black group-hover:text-primary-val transition-colors duration-300 text-xs md:text-sm font-medium tracking-wide"
                    style={{
                      fontFamily: "var(--font-manrope)",
                    }}
                  >
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
