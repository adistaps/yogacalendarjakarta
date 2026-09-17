import Link from "next/link";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pembayaran Gagal | Jakarta Yoga Calendar",
  description: "Maaf, transaksi pembayaran tiket Anda gagal atau telah kedaluwarsa.",
  robots: "noindex, nofollow",
};

export default function PaymentFailedPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen pt-32 pb-24 flex flex-col justify-center items-center">
      <div className="max-w-md w-full px-6">
        {/* Failed Card */}
        <div className="bg-white rounded-3xl border border-black/5 shadow-xl p-8 lg:p-10 text-center flex flex-col items-center relative overflow-hidden">
          {/* Decorative Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-red-500"></div>

          {/* Failed Icon */}
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-6 shadow-sm">
            <XCircle size={36} />
          </div>

          <h1 
            className="text-dark mb-3 leading-tight"
            style={{ fontFamily: "var(--font-manrope)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 500 }}
          >
            Pembayaran Gagal / Expired
          </h1>
          <p className="text-gray-400 text-sm font-light mb-8 leading-relaxed">
            Maaf, proses transaksi pembayaran Anda tidak berhasil atau telah melewati batas waktu pembayaran yang ditentukan. Kuota tiket Anda telah dikembalikan ke sistem.
          </p>

          {/* Action buttons */}
          <div className="w-full space-y-4">
            {/* Try Again Button */}
            <Link
              href="/events"
              className="w-full py-3.5 bg-primary-val hover:bg-[#264b4c] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md shadow-primary-val/10 cursor-pointer"
            >
              <RefreshCw size={14} />
              Coba Cari Event Lain
            </Link>

            {/* Back to Home */}
            <Link
              href="/"
              className="w-full py-3.5 border border-gray-200 hover:border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 bg-white cursor-pointer"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
