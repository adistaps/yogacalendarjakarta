"use client";

import { AnimatePresence, motion } from "framer-motion";
import EventCard from "./EventCard";
import type { Event } from "@/lib/data/events";

interface EventMasonryGridProps {
  events: Event[];
}

export default function EventMasonryGrid({ events }: EventMasonryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <AnimatePresence>
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <EventCard event={event} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}


