"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = [
  { label: "Beranda", href: "/" },
  { label: "Events", href: "/events" },
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Partnership", href: "/partnership" },
  { label: "Contact Us", href: "/contact" },
];

export default function Footer() {
  const pathname = usePathname();

  // Do not render footer on login/register page
  if (pathname?.startsWith("/login") || pathname?.startsWith("/register")) return null;

  return (
    <footer className="bg-dark text-white relative overflow-hidden mt-auto pt-20">
      <div className="max-w-7xl mx-auto px-8 lg:px-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16">
          
          {/* Halaman */}
          <div>
            <h4 className="text-white mb-6 font-medium tracking-wide text-sm">
              Halaman
            </h4>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-[0.85rem] font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-white mb-6 font-medium tracking-wide text-sm">
              Kontak
            </h4>
            <div className="space-y-4 text-white/60 text-[0.85rem] font-light leading-relaxed">
              <p>
                Jl. Sudirman No.1, Jakarta Selatan,<br />
                DKI Jakarta 12190
              </p>
              <p>+62 812 0000 0000</p>
              <p>info@jakartayogacalendar.com</p>
            </div>
          </div>

          {/* Subscribe */}
          <div>
            <h4 className="text-white mb-6 font-medium tracking-wide text-sm">
              Subscribe
            </h4>
            <form className="space-y-4">
              <div className="border-b border-white/20 pb-2">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full bg-transparent outline-none text-white text-[0.85rem] placeholder:text-white/40"
                />
              </div>
              <button 
                type="button"
                className="bg-white text-dark px-6 py-2.5 text-[0.75rem] font-medium tracking-wider uppercase mt-4 hover:bg-primary-val hover:text-white transition-colors"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>

          {/* Sosial Media */}
          <div>
            <h4 className="text-white mb-6 font-medium tracking-wide text-sm">
              In Socials
            </h4>
            <div className="flex gap-4">
              {["FB.", "IG.", "TW.", "YT."].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-white/60 hover:text-white transition-colors text-[0.75rem] font-medium tracking-wider"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-[0.75rem] font-light">
            Copyright &copy; 2026 Jakarta Yoga Calendar. All Rights Reserved
          </p>
        </div>
      </div>

      {/* Large Watermark */}
      <div className="absolute -bottom-12 left-0 right-0 w-full text-center pointer-events-none z-0 overflow-hidden px-4">
        <h1 
          className="whitespace-nowrap opacity-100"
          style={{
            fontFamily: "var(--font-manrope)",
            fontSize: "clamp(8rem, 20vw, 22rem)",
            fontWeight: 400,
            lineHeight: 0.8,
            color: "var(--color-watermark)",
            letterSpacing: "-0.02em"
          }}
        >
          Jakarta Yoga
        </h1>
      </div>
    </footer>
  );
}

