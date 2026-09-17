"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

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
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

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

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 focus:outline-none py-1">
                  {user.user_metadata.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt={user.user_metadata.full_name || "User"} 
                      className="w-9 h-9 rounded-full border-2 border-primary-val transition-all duration-300"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary-val text-white flex items-center justify-center font-bold text-sm border border-black/10">
                      {user.user_metadata.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-black/5 rounded-xl shadow-lg py-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="px-4 py-2 border-b border-black/5">
                    <p className="text-xs font-bold text-[#181818] truncate">{user.user_metadata.full_name || 'User'}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                  </div>
                  <Link href="/account" className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-bold transition-colors">
                    <UserIcon size={14} />
                    Akun Saya
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-xs text-red-600 hover:bg-gray-50 font-bold transition-colors"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="hidden lg:inline-flex items-center justify-center px-6 py-2.5 rounded-full transition-all duration-300 font-bold text-xs uppercase tracking-wider bg-primary-val text-white hover:opacity-90 cursor-pointer"
                style={{
                  fontFamily: "var(--font-manrope)",
                }}
              >
                Login
              </button>
            )}

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
          <div className="relative ml-auto w-80 h-full flex flex-col py-10 px-10 bg-white shadow-2xl">
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
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 py-2 border-b border-black/5">
                    {user.user_metadata.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="User" className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary-val text-white flex items-center justify-center font-bold">
                        {user.user_metadata.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-[#181818] truncate">{user.user_metadata.full_name || 'User'}</p>
                      <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/account"
                    className="flex items-center justify-center gap-2 py-3 rounded-full border border-black/10 w-full font-bold text-xs uppercase tracking-wider text-[#181818] hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <UserIcon size={14} />
                    Akun Saya
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 py-3 rounded-full bg-red-50 text-red-600 w-full font-bold text-xs uppercase tracking-wider hover:bg-red-100 transition-colors"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleLogin();
                    setMobileOpen(false);
                  }}
                  className="block text-center py-3 rounded-full transition-all duration-300 w-full font-bold text-xs uppercase tracking-wider bg-primary-val text-white hover:opacity-90 cursor-pointer"
                  style={{
                    fontFamily: "var(--font-manrope)",
                  }}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
