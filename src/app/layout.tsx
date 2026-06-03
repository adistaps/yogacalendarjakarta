import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jakarta Yoga Calendar - Temukan & Ikuti Event Yoga Terbaik di Jakarta",
  description:
    "Platform digital yang memudahkan kamu menemukan, mendaftar, dan mengikuti event yoga di Jakarta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${manrope.variable} ${playfair.variable} scroll-smooth`}
    >
      <body className="font-sans antialiased flex flex-col min-h-screen text-text bg-white">
        <Navbar />
        <main className="flex-grow w-full flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

