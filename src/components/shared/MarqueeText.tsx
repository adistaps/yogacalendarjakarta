"use client";

import { useEffect, useState } from "react";

export default function MarqueeText() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="w-full overflow-hidden bg-bg-cream py-12 border-y border-primary-val/20">
      <div className="relative flex whitespace-nowrap">
        <div className="animate-marquee flex items-center">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center mx-4">
              <span 
                className="mx-6 text-primary-val"
                style={{
                  fontFamily: "var(--font-manrope)",
                  fontSize: "clamp(2rem, 3vw, 2.5rem)",
                  fontWeight: 400,
                  fontStyle: "italic",
                }}
              >
                Jakarta Yoga Calendar
              </span>
              <span className="w-2 h-2 rounded-full bg-primary-val/40 mx-4"></span>
              <span 
                className="mx-6 text-text"
                style={{
                  fontFamily: "var(--font-manrope)",
                  fontSize: "clamp(2rem, 3vw, 2.5rem)",
                  fontWeight: 300,
                }}
              >
                Temukan Event Yoga
              </span>
              <span className="w-2 h-2 rounded-full bg-primary-val/40 mx-4"></span>
              <span 
                className="mx-6 text-primary-val"
                style={{
                  fontFamily: "var(--font-manrope)",
                  fontSize: "clamp(2rem, 3vw, 2.5rem)",
                  fontWeight: 400,
                  fontStyle: "italic",
                }}
              >
                Daftar Sekarang
              </span>
              <span className="w-2 h-2 rounded-full bg-primary-val/40 mx-4"></span>
              <span 
                className="mx-6 text-text"
                style={{
                  fontFamily: "var(--font-manrope)",
                  fontSize: "clamp(2rem, 3vw, 2.5rem)",
                  fontWeight: 300,
                }}
              >
                Mindful Movement
              </span>
              <span className="w-2 h-2 rounded-full bg-primary-val/40 mx-4"></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

