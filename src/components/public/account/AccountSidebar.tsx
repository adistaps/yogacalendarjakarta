"use client";

import { User, ShoppingBag, Ticket, Calendar, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AccountSidebarProps {
  activeTab: string;
  onTabChange: (tab: "profile" | "orders" | "tickets" | "upcoming") => void;
}

const menuItems = [
  { id: "profile" as const, label: "Profil Saya", icon: User },
  { id: "orders" as const, label: "Pesanan", icon: ShoppingBag },
  { id: "tickets" as const, label: "Tiket Saya", icon: Ticket },
  { id: "upcoming" as const, label: "Event Mendatang", icon: Calendar },
];

export default function AccountSidebar({
  activeTab,
  onTabChange,
}: AccountSidebarProps) {
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <aside
      className="w-64 shrink-0 bg-white rounded-xl shadow-sm p-6 h-fit sticky top-24 hidden lg:block"
    >
      {/* Avatar & Info */}
      <div className="flex flex-col items-center mb-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-medium"
          style={{
            backgroundColor: "var(--color-primary-bg)",
            color: "var(--color-primary-val)",
            fontFamily: "var(--font-manrope)",
          }}
        >
          AD
        </div>
        <h3
          className="mt-3"
          style={{
            fontFamily: "var(--font-manrope)",
            fontWeight: 500,
            fontSize: "0.95rem",
            color: "var(--color-text)",
          }}
        >
          Alya Damar
        </h3>
        <p
          style={{
            fontFamily: "var(--font-manrope)",
            fontWeight: 300,
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
          }}
        >
          alya@email.com
        </p>
      </div>

      {/* Divider */}
      <hr className="border-gray-100 mb-4" />

      {/* Menu Items */}
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
              activeTab === item.id
                ? "font-medium"
                : "text-text-muted hover:bg-gray-50"
            }`}
            style={
              activeTab === item.id
                ? {
                    backgroundColor: "var(--color-primary-bg)",
                    color: "var(--color-primary-val)",
                    fontFamily: "var(--font-manrope)",
                    fontSize: "0.85rem",
                    borderLeft: "2px solid var(--color-primary-val)",
                  }
                : {
                    fontFamily: "var(--font-manrope)",
                    fontSize: "0.85rem",
                  }
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Divider */}
      <hr className="border-gray-100 my-4" />

      {/* Keluar */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-all text-left"
        style={{
          fontFamily: "var(--font-manrope)",
          fontSize: "0.85rem",
        }}
      >
        <LogOut size={18} />
        <span>Keluar</span>
      </button>
    </aside>
  );
}

