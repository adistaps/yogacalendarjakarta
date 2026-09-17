"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import SectionLabel from "@/components/shared/SectionLabel";
import { blogPosts } from "@/lib/data/blog-posts";

export default function BlogPreview() {
  return (
    <section
      style={{ backgroundColor: "var(--color-bg-cream)" }}
      className="py-24 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel text="ARTIKEL YOGA TERBARU" />
          <h2
            style={{
              fontFamily: "var(--font-manrope)",
              fontWeight: 400,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.15,
              color: "var(--color-text)",
            }}
          >
            Reflections, Stories, and Insights
            <br />
            from Our Yoga Practice
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href="#" className="group block">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs mb-3"
                  style={{
                    backgroundColor: "var(--color-primary-bg)",
                    color: "var(--color-primary-val)",
                    fontFamily: "var(--font-manrope)",
                    fontWeight: 500,
                    fontSize: "0.65rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {post.category}
                </span>
                <p
                  className="text-xs text-text-muted mb-2"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  {post.date}
                </p>
                <h3
                  className="group-hover:text-primary-val transition-colors"
                  style={{
                    fontFamily: "var(--font-manrope)",
                    fontWeight: 500,
                    fontSize: "1rem",
                    lineHeight: 1.4,
                    color: "var(--color-text)",
                  }}
                >
                  {post.title}
                </h3>
                <div className="flex items-center gap-1 mt-3 text-primary-val">
                  <span
                    style={{
                      fontFamily: "var(--font-manrope)",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}
                  >
                    Read More
                  </span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

