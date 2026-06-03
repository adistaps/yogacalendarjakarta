"use client";

import { useState } from "react";
import AccountSidebar from "@/components/akun/AccountSidebar";
import ProfileTab from "@/components/akun/ProfileTab";
import OrdersTab from "@/components/akun/OrdersTab";
import TicketsTab from "@/components/akun/TicketsTab";
import UpcomingTab from "@/components/akun/UpcomingTab";
import PageWrapper from "@/components/shared/PageWrapper";

type Tab = "profile" | "orders" | "tickets" | "upcoming";

export default function AkunPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <PageWrapper>
      <div
        className="min-h-screen px-6 py-12"
        style={{ backgroundColor: "var(--color-bg-cream)" }}
      >
        <div className="max-w-7xl mx-auto flex gap-8">
          <AccountSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 min-w-0">
            {/* Mobile Tab Selector */}
            <div className="lg:hidden mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                  { id: "profile" as const, label: "Profil" },
                  { id: "orders" as const, label: "Pesanan" },
                  { id: "tickets" as const, label: "Tiket" },
                  { id: "upcoming" as const, label: "Mendatang" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "text-white"
                        : "bg-white text-text-muted"
                    }`}
                    style={
                      activeTab === tab.id
                        ? {
                            backgroundColor: "var(--color-primary-val)",
                            fontFamily: "var(--font-manrope)",
                          }
                        : {
                            fontFamily: "var(--font-manrope)",
                          }
                    }
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
    </PageWrapper>
  );
}

