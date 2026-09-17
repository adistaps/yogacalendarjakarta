import CheckoutClient from "@/components/public/checkout/CheckoutClient";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout Tiket | Jakarta Yoga Calendar",
  description: "Isi data diri Anda untuk menyelesaikan pemesanan tiket event yoga pilihan Anda.",
  robots: "noindex, nofollow", // Halaman checkout tidak perlu di-index oleh search engine
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-[60vh] flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-val mb-4"></div>
        <p className="text-gray-400 text-sm">Menyiapkan halaman checkout...</p>
      </div>
    }>
      <CheckoutClient />
    </Suspense>
  );
}

