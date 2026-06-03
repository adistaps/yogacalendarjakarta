"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Partnership", href: "/partnership" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLogin = pathname?.startsWith("/login") || pathname?.startsWith("/register");
  const isHome = pathname === "/";

  // Dynamic navbar positioning and background classes
  const headerPosition = isHome 
    ? scrolled ? "fixed top-0 left-0 right-0 z-50" : "absolute top-0 left-0 right-0 z-50" 
    : "sticky top-0 left-0 right-0 z-50";
  
  const headerBg = isHome
    ? scrolled
      ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-black/5"
      : "bg-transparent border-b border-white/20"
    : "bg-white shadow-sm border-b border-black/5";

  // Text, Logo, and Button colors based on page and scroll status
  const textColor = isHome && !scrolled ? "text-white" : "text-[#181818]";
  const logoColor = isHome && !scrolled ? "white" : "var(--color-primary-val)";
  const logoTextClass = isHome && !scrolled ? "text-white" : "text-primary-val";

  if (isLogin) {
    return null;
  }

  return (
    <>
      <header className={`${headerPosition} ${headerBg} transition-all duration-500 flex flex-col`}>
        {/* Top Info Bar - Only on inner pages */}
        {!isHome && (
          <div 
            className={`px-8 lg:px-14 flex items-center justify-between border-b transition-all duration-500 ${
              scrolled
                ? "h-0 opacity-0 overflow-hidden border-none py-0"
                : "h-[45px] opacity-100 py-2 bg-white border-black/5 text-[#181818]"
            }`}
          >
            <div className="flex items-center gap-4">
              {["FB.", "IG.", "TW.", "YT."].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-[0.68rem] font-bold tracking-widest hover:text-primary-val transition-colors text-[#181818]/80"
                >
                  {social}
                </a>
              ))}
            </div>
            
            <div className="flex items-center gap-6">
              <a 
                href="mailto:info@jakartayogacalendar.com" 
                className="text-[0.68rem] font-bold tracking-widest transition-colors uppercase text-[#181818]/80 hover:text-primary-val"
              >
                info@jakartayogacalendar.com
              </a>
              <a 
                href="tel:+6281200000000" 
                className="text-[0.68rem] font-bold tracking-widest transition-colors text-[#181818]/80 hover:text-primary-val"
              >
                +62 812 0000 0000
              </a>
            </div>
          </div>
        )}

        {/* Main Navbar */}
        <nav className={`flex items-center justify-between px-8 lg:px-14 transition-all duration-500 ${scrolled ? "h-[75px]" : "h-[90px] lg:h-[110px]"}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 28C16 28 4 20 4 11C4 7 8 4 12 6C13.5 4 14.8 3 16 3C17.2 3 18.5 4 20 6C24 4 28 7 28 11C28 20 16 28 16 28Z"
                stroke={logoColor}
                strokeWidth="1.5"
                fill="none"
                className="transition-colors duration-500"
              />
              <path
                d="M16 28C16 28 10 22 10 16C10 12 12.5 10 16 12C19.5 10 22 12 22 16C22 22 16 28 16 28Z"
                stroke={logoColor}
                strokeWidth="1.5"
                fill="none"
                opacity="0.6"
                className="transition-colors duration-500"
              />
            </svg>
            <span
              className={`transition-colors duration-500 font-bold ${logoTextClass}`}
              style={{
                fontFamily: "var(--font-manrope)",
                fontSize: "1.3rem",
                letterSpacing: "-0.015em",
              }}
            >
              Jakarta Yoga Calendar
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname?.startsWith('/events') && item.href === '/events');
              
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`relative transition-colors duration-300 group flex items-center gap-1 ${
                      isActive 
                        ? isHome && !scrolled 
                          ? "text-white" 
                          : "text-primary-val" 
                        : isHome && !scrolled 
                          ? "text-white/80 hover:text-white" 
                          : "text-[#181818]/80 hover:text-primary-val"
                    }`}
                    style={{
                      fontFamily: "var(--font-manrope)",
                      fontWeight: 700,
                      fontSize: "13px",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {item.label}
                    {/* Tiny arrow down for some links just to mimic design */}
                    {["Events", "About Us"].includes(item.label) && (
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-y-0.5">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-6 shrink-0">
            <button className={`p-1 transition-colors ${
              isHome && !scrolled ? "text-white/80 hover:text-white" : "text-[#181818]/80 hover:text-primary-val"
            }`}>
              <Search size={18} strokeWidth={2} />
            </button>

            <Link
              href="/login"
              className="hidden lg:inline-flex items-center justify-center px-6 py-2.5 rounded-full transition-all duration-300 font-bold text-xs uppercase tracking-wider bg-primary-val text-white hover:opacity-90"
              style={{
                fontFamily: "var(--font-manrope)",
              }}
            >
              Login
            </Link>

            <button
              className={`lg:hidden p-1 ${
                isHome && !scrolled ? "text-white" : "text-[#181818]"
              }`}
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative ml-auto w-80 h-full flex flex-col py-10 px-10 bg-white">
            <button
              className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <X size={24} />
            </button>
            
            <div className="mt-4 mb-10 flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 28C16 28 4 20 4 11C4 7 8 4 12 6C13.5 4 14.8 3 16 3C17.2 3 18.5 4 20 6C24 4 28 7 28 11C28 20 16 28 16 28Z" stroke="var(--color-primary-val)" strokeWidth="1.5" fill="none"/>
                <path d="M16 28C16 28 10 22 10 16C10 12 12.5 10 16 12C19.5 10 22 12 22 16C22 22 16 28 16 28Z" stroke="var(--color-primary-val)" strokeWidth="1.5" fill="none" opacity="0.6"/>
              </svg>
              <span
                style={{
                  fontFamily: "var(--font-manrope)",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: "var(--color-primary-val)",
                }}
              >
                Jakarta Yoga
              </span>
            </div>
            
            <ul className="space-y-6">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="block text-[#181818] hover:text-primary-val font-bold transition-colors duration-300"
                    style={{
                      fontFamily: "var(--font-manrope)",
                      fontSize: "0.85rem",
                      letterSpacing: "normal",
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-auto space-y-4">
              <Link
                href="/login"
                className="block text-center py-3 rounded-full transition-all duration-300 w-full font-bold text-xs uppercase tracking-wider bg-primary-val text-white hover:opacity-90"
                style={{
                  fontFamily: "var(--font-manrope)",
                }}
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
