"use client";

import { motion } from "framer-motion";
import { UserCheck, Sparkles, Activity, Map } from "lucide-react";

const features = [
  { id: 1, title: "Classes for All Levels", icon: Sparkles },
  { id: 2, title: "Experienced Instructors", icon: UserCheck },
  { id: 3, title: "Mind-Body Focus", icon: Activity },
  { id: 4, title: "Variety of Yoga Styles", icon: Map },
];

export default function AboutBanner() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-14">
        
        {/* Banner Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                {/* Pill Shape Illustration Container */}
                <div className="w-full aspect-[2/3] max-w-[220px] rounded-t-[120px] rounded-b-[120px] bg-[#f0f6f7] flex flex-col items-center justify-center p-6 mb-6">
                  <div className="text-[#659b9e] opacity-80 scale-150 mb-8">
                    <Icon size={64} strokeWidth={0.75} />
                  </div>
                  
                  <h3 
                    className="text-dark font-medium px-4 leading-snug"
                    style={{
                      fontFamily: "var(--font-manrope)",
                      fontSize: "clamp(1rem, 2vw, 1.25rem)"
                    }}
                  >
                    {feature.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
