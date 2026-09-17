import Link from "next/link";
import { Clock, Info, ArrowRight, RefreshCw } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menunggu Pembayaran | Jakarta Yoga Calendar",
  description: "Pembayaran Anda sedang dalam proses verifikasi. Selesaikan pembayaran sebelum waktu kedaluwarsa.",
  robots: "noindex, nofollow",
};

export default function PaymentPendingPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen pt-32 pb-24 flex flex-col justify-center items-center">
      <div className="max-w-md w-full px-6">
        {/* Pending Card */}
        <div className="bg-white rounded-3xl border border-black/5 shadow-xl p-8 lg:p-10 text-center flex flex-col items-center relative overflow-hidden">
          {/* Decorative Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-amber-400"></div>

          {/* Pending Icon */}
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-6 shadow-sm">
            <Clock size={36} />
          </div>

          <h1 
            className="text-dark mb-3 leading-tight"
            style={{ fontFamily: "var(--font-manrope)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 500 }}
          >
            Menunggu Pembayaran
          </h1>
          <p className="text-gray-400 text-sm font-light mb-8 leading-relaxed">
            Instruksi pembayaran telah dibuat. Silakan selesaikan transaksi Anda menggunakan metode pembayaran yang telah Anda pilih di halaman Xendit.
          </p>

          {/* Warning notice */}
          <div className="w-full flex items-start gap-4 p-5 bg-amber-50/50 rounded-2xl border border-amber-100 text-gray-600 text-xs font-light leading-relaxed text-left mb-8">
            <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p>
              Batas waktu pembayaran adalah **24 jam** sejak pemesanan dibuat. Jika pembayaran tidak dilakukan dalam jangka waktu tersebut, pesanan Anda akan otomatis dibatalkan oleh sistem dan kuota tiket akan dikembalikan ke pool.
            </p>
          </div>

          {/* Action buttons */}
          <div className="w-full space-y-4">
            {/* Refresh Status Button */}
            <Link
              href="/account"
              className="w-full py-3.5 bg-primary-val hover:bg-[#264b4c] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md shadow-primary-val/10 cursor-pointer"
            >
              <RefreshCw size={14} />
              Cek Status Pembayaran
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
