"use client";

import { motion } from "framer-motion";

const features = [
  {
    number: "01",
    title: "Temukan Event",
    description:
      "Jelajahi ratusan event yoga dari berbagai studio dan EO di seluruh Jakarta. Filter berdasarkan lokasi, tanggal, dan jenis yoga.",
  },
  {
    number: "02",
    title: "Daftar & Bayar",
    description:
      "Proses pendaftaran yang mudah dan cepat. Upload bukti pembayaran dan dapatkan konfirmasi via email secara otomatis.",
  },
  {
    number: "03",
    title: "Ikuti Kelas",
    description:
      "Hadiri event yoga pilihan Anda. Nikmati pengalaman yoga berkualitas bersama instruktur profesional dan komunitas yang mendukung.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      className="py-28 lg:py-36"
      style={{ backgroundColor: "var(--color-bg-cream)" }}
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-14">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span
            style={{
              fontFamily: "var(--font-manrope)",
              fontWeight: 300,
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-primary-val)",
            }}
          >
            Cara Kerja
          </span>
          <h2
            className="mt-5"
            style={{
              fontFamily: "var(--font-manrope)",
              fontWeight: 400,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.15,
              color: "var(--color-dark)",
            }}
          >
            Mudah dan{" "}
            <span style={{ fontStyle: "italic" }}>Sederhana</span>
          </h2>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {features.map((feature, i) => (
            <motion.div
              key={feature.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="text-center"
            >
              {/* Number */}
              <span
                style={{
                  fontFamily: "var(--font-manrope)",
                  fontWeight: 300,
                  fontSize: "3.5rem",
                  color: "var(--color-primary-val)",
                  opacity: 0.5,
                  lineHeight: 1,
                  display: "block",
                  marginBottom: "1.2rem",
                }}
              >
                {feature.number}
              </span>

              {/* Title */}
              <h3
                style={{
                  fontFamily: "var(--font-manrope)",
                  fontWeight: 500,
                  fontSize: "1.5rem",
                  color: "var(--color-dark)",
                  marginBottom: "0.8rem",
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: "var(--font-manrope)",
                  fontWeight: 300,
                  fontSize: "0.88rem",
                  lineHeight: 1.7,
                  color: "var(--color-text-muted)",
                }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

