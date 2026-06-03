"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-white flex w-full relative">
      
      {/* Back to Home Button */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white lg:text-white/80 hover:text-white transition-colors group"
        style={{ fontFamily: "var(--font-manrope)", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.05em" }}
      >
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-colors">
          <ArrowLeft size={18} />
        </div>
      </Link>
      {/* LEFT COLUMN - Decorative Image */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-end p-12 lg:p-20">
        <Image
          src="/images/login-bg.png"
          alt="Login Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent mix-blend-multiply" />
        
        <div className="relative z-10 text-white max-w-xl pb-10">
          <h2 
            className="mb-6 font-bold"
            style={{ fontFamily: "var(--font-manrope)", fontSize: "clamp(2.5rem, 4vw, 3.5rem)", lineHeight: 1.1 }}
          >
            Selamat Datang Kembali
          </h2>
          <p className="text-white/90 font-light" style={{ fontFamily: "var(--font-manrope)", fontSize: "1.1rem", lineHeight: 1.6 }}>
            Temukan dan ikuti event yoga terbaik di Jakarta.<br/>Akses kalender komunitas Anda dan mulai perjalanan<br/>ketenangan hari ini.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 bg-white relative">
        <div className="max-w-md w-full mx-auto py-12">
          
          {/* Logo */}
          <div className="mb-8">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 28C16 28 4 20 4 11C4 7 8 4 12 6C13.5 4 14.8 3 16 3C17.2 3 18.5 4 20 6C24 4 28 7 28 11C28 20 16 28 16 28Z"
                stroke="var(--color-primary-val)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M16 28C16 28 10 22 10 16C10 12 12.5 10 16 12C19.5 10 22 12 22 16C22 22 16 28 16 28Z"
                stroke="var(--color-primary-val)"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
            </svg>
          </div>

          <h1 
            className="text-dark mb-10"
            style={{ fontFamily: "var(--font-manrope)", fontSize: "2rem", fontWeight: 500 }}
          >
            Masuk ke Akun Anda
          </h1>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm text-dark mb-2 font-bold tracking-wide text-xs">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-primary-val rounded-[4px] px-4 py-3 outline-none transition-colors text-dark"
                placeholder="nama@email.com"
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm text-dark font-bold tracking-wide text-xs">Password</label>
                <Link href="#" className="text-[0.75rem] font-bold text-gray-500 hover:text-primary-val transition-colors tracking-wide">Lupa Password?</Link>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-gray-200 focus:border-primary-val rounded-[4px] px-4 py-3 outline-none transition-colors text-dark pr-12"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 mt-4 bg-[#325e60] text-white text-center hover:bg-[#264b4c] transition-colors rounded-[4px] font-bold text-xs tracking-widest uppercase"
            >
              Masuk
            </button>
          </form>

          <div className="my-8 flex items-center justify-center">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <span className="px-4 text-[0.7rem] font-bold text-gray-500 tracking-wider uppercase">Atau masuk dengan</span>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          <button className="w-full py-3.5 bg-white border border-gray-200 hover:bg-gray-50 transition-colors rounded-[4px] font-bold text-xs tracking-wider flex items-center justify-center gap-3 text-dark">
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Belum punya akun? <Link href="#" className="text-primary-val font-bold hover:text-dark transition-colors">Daftar sekarang</Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
