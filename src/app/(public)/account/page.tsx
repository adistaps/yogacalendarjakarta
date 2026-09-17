"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AccountSidebar from "@/components/public/account/AccountSidebar";
import ProfileTab from "@/components/public/account/ProfileTab";
import OrdersTab from "@/components/public/account/OrdersTab";
import TicketsTab from "@/components/public/account/TicketsTab";
import UpcomingTab from "@/components/public/account/UpcomingTab";

type Tab = "profile" | "orders" | "tickets" | "upcoming";

export default function AkunPage() {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Jika tidak terautentikasi, kembalikan ke beranda
        router.push("/");
        return;
      }
      setLoading(false);
    }
    checkAuth();
  }, [supabase.auth, router]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col justify-center items-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-val mb-4"></div>
        <p className="text-gray-400 text-sm font-light">Memuat profil Anda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-32 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-grow min-w-0 z-10">
          {/* Mobile Tab Selector */}
          <div className="lg:hidden mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: "profile" as const, label: "Profil" },
                { id: "orders" as const, label: "Pesanan" },
                { id: "tickets" as const, label: "Tiket" },
                { id: "upcoming" as const, label: "Mendatang" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-primary-val text-white shadow-md shadow-primary-val/10"
                      : "bg-white text-gray-400 border border-gray-100 hover:text-[#181818]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "tickets" && <TicketsTab />}
          {activeTab === "upcoming" && <UpcomingTab />}
        </main>
      </div>
    </div>
  );
}
