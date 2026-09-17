"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, MapPin, Users, Ticket, Check, ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Event } from "@/lib/data/events";

interface TicketSelectionProps {
  event: Event;
  ticketTypes: {
    id: string;
    name: string;
    price: number;
    quota: number;
    quota_sold: number;
  }[];
}

export default function TicketSelection({ event, ticketTypes: initialTicketTypes }: TicketSelectionProps) {
  const router = useRouter();
  const supabase = createClient();
  
  const [ticketTypes, setTicketTypes] = useState(initialTicketTypes);
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Supabase Realtime subscription for ticket types quota updates
    const channel = supabase
      .channel(`realtime:ticket_types:${event.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ticket_types",
          filter: `event_id=eq.${event.id}`,
        },
        (payload) => {
          const updatedType = payload.new as any;
          setTicketTypes((prev) =>
            prev.map((t) =>
              t.id === updatedType.id
                ? { ...t, quota_sold: updatedType.quota_sold }
                : t
            )
          );
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [event.id, supabase]);

  // Set default selected ticket type
  useEffect(() => {
    if (ticketTypes.length > 0 && !selectedTicketId) {
      // Select the first ticket that still has quota
      const available = ticketTypes.find((t) => t.quota - t.quota_sold > 0);
      if (available) {
        setSelectedTicketId(available.id);
      } else {
        setSelectedTicketId(ticketTypes[0].id);
      }
    }
  }, [ticketTypes, selectedTicketId]);

  const selectedTicket = ticketTypes.find((t) => t.id === selectedTicketId);
  const isSoldOut = ticketTypes.every((t) => t.quota - t.quota_sold <= 0);

  const handleCheckout = () => {
    if (!selectedTicketId) return;

    if (!user) {
      // Save checkout intent to localStorage
      localStorage.setItem(
        "checkout_intent",
        JSON.stringify({ eventId: event.id, ticketTypeId: selectedTicketId, quantity })
      );
      // Redirect to Google Login
      supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/checkout`,
        },
      });
      return;
    }

    // Redirect directly to checkout page with query params
    router.push(`/checkout?eventId=${event.id}&ticketTypeId=${selectedTicketId}&quantity=${quantity}`);
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] p-8 border border-gray-100 sticky top-32">
      {/* Date & Location Info */}
      <div className="space-y-6 mb-8 pb-8 border-b border-gray-100">
        <div className="flex gap-4">
          <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
          <div>
            <span className="block text-xs font-bold uppercase text-gray-900 mb-1">Tanggal & Waktu</span>
            <span className="text-gray-500 text-sm font-light">
              {new Date(event.date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              <br />
              {event.time} - {event.endTime} WIB
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
          <div>
            <span className="block text-xs font-bold uppercase text-gray-900 mb-1">Lokasi</span>
            <span className="text-gray-500 text-sm font-light">{event.location}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Users className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
          <div>
            <span className="block text-xs font-bold uppercase text-gray-900 mb-1">Kapasitas Sisa</span>
            {isSoldOut ? (
              <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full mt-1">
                HABIS TERJUAL
              </span>
            ) : (
              <span className="inline-block px-3 py-1 bg-[#f0f6f7] text-primary-val text-xs font-bold rounded-full mt-1 uppercase">
                {selectedTicket ? `${selectedTicket.quota - selectedTicket.quota_sold} Tiket Tersisa` : "Tersedia"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Selection Options */}
      {!isSoldOut && (
        <div className="space-y-4 mb-8">
          <label className="text-xs font-bold text-[#181818] uppercase tracking-wider block">Pilih Tipe Tiket</label>
          <div className="space-y-3">
            {ticketTypes.map((ticket) => {
              const remaining = ticket.quota - ticket.quota_sold;
              const disabled = remaining <= 0;
              const isSelected = selectedTicketId === ticket.id;

              return (
                <button
                  key={ticket.id}
                  disabled={disabled}
                  onClick={() => {
                    setSelectedTicketId(ticket.id);
                    setQuantity(1);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center ${
                    disabled
                      ? "bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed"
                      : isSelected
                      ? "border-primary-val bg-[#f0f6f7]/30"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected ? "border-primary-val bg-primary-val text-white" : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#181818] block">{ticket.name}</span>
                      <span className="text-[10px] text-gray-400">
                        {disabled ? "Habis terjual" : `${remaining} tiket tersedia`}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-primary-val">
                    Rp {ticket.price.toLocaleString("id-ID")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      {!isSoldOut && selectedTicket && (
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs font-bold text-[#181818] uppercase tracking-wider">Jumlah</span>
          <div className="flex items-center border border-gray-200 rounded-full p-1 bg-gray-50">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            >
              -
            </button>
            <span className="w-12 text-center text-sm font-bold text-[#181818]">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(selectedTicket.quota - selectedTicket.quota_sold, q + 1))}
              disabled={quantity >= selectedTicket.quota - selectedTicket.quota_sold}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-white transition-colors disabled:opacity-30"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Buy Button */}
      {isSoldOut ? (
        <button
          disabled
          className="w-full py-4 bg-gray-200 text-gray-400 text-center rounded-xl font-bold text-xs tracking-widest uppercase cursor-not-allowed"
        >
          Sold Out
        </button>
      ) : (
        <button
          onClick={handleCheckout}
          className="w-full py-4 bg-primary-val hover:bg-[#264b4c] text-white text-center transition-colors rounded-xl font-bold text-xs tracking-widest uppercase cursor-pointer shadow-md shadow-primary-val/10"
        >
          {user ? "Beli Tiket Sekarang" : "Login & Beli Tiket"}
        </button>
      )}

      <p className="text-center text-[10px] text-gray-400 font-light mt-4 leading-relaxed">
        Pendaftaran online ditutup H-1 sebelum acara berlangsung. Semua penjualan tiket bersifat final.
      </p>
    </div>
  );
}
