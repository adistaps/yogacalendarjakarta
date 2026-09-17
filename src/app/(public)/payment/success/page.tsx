import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Calendar, MapPin, Users, Ticket, MessageCircle, ArrowRight, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { events as mockEvents } from "@/lib/data/events";
import type { Metadata } from "next";

interface PageProps {
  searchParams: Promise<{
    eventId?: string;
    ticketTypeId?: string;
    qty?: string;
    orderId?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Pembayaran Berhasil | Jakarta Yoga Calendar",
  description: "Terima kasih! Pembayaran tiket event yoga Anda telah berhasil dikonfirmasi.",
  robots: "noindex, nofollow",
};

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const eventId = resolvedParams.eventId;
  const ticketTypeId = resolvedParams.ticketTypeId;
  const qtyString = resolvedParams.qty || "1";
  const quantity = parseInt(qtyString, 10);

  const supabase = await createClient();
  let event: any = null;
  let ticketType: any = null;

  // Fetch event and ticket info
  if (eventId && ticketTypeId) {
    const { data: dbEvent } = await supabase
      .from("events")
      .select(`
        id, slug, title, date_start, location_area, location_address, whatsapp_group_link,
        event_images (url, order_index),
        ticket_types (id, name, price)
      `)
      .eq("id", eventId)
      .single();

    if (dbEvent) {
      event = {
        title: dbEvent.title,
        location: `${dbEvent.location_area}, Jakarta`,
        date: dbEvent.date_start,
        whatsappGroup: dbEvent.whatsapp_group_link || "#",
        image: dbEvent.event_images?.find((img: any) => img.order_index === 0)?.url 
          || dbEvent.event_images?.[0]?.url 
          || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
      };
      ticketType = dbEvent.ticket_types?.find((t) => t.id === ticketTypeId);
    } else {
      // Fallback
      const mock = mockEvents.find((e) => e.id === eventId);
      if (mock) {
        event = {
          title: mock.title,
          location: mock.location,
          date: mock.date,
          whatsappGroup: "https://chat.whatsapp.com/mock-group",
          image: mock.image,
        };
        const matchedMockTicket = mock.ticketTypes.find((_, idx) => `mock-ticket-${idx}` === ticketTypeId)
          || mock.ticketTypes[0];
        ticketType = {
          name: matchedMockTicket?.name || "Regular",
          price: matchedMockTicket?.price || mock.price,
        };
      }
    }
  }

  // Fallback default values if not resolved
  if (!event || !ticketType) {
    event = {
      title: "Yoga & Mindfulness Session",
      location: "Senopati, Jakarta Selatan",
      date: "2026-06-30",
      whatsappGroup: "https://chat.whatsapp.com/mock-group",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    };
    ticketType = {
      name: "Regular Ticket",
      price: 150000,
    };
  }

  const totalPrice = ticketType.price * quantity;

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-32 pb-24 flex flex-col justify-center items-center">
      <div className="max-w-xl w-full px-6">
        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-black/5 shadow-xl p-8 lg:p-10 text-center flex flex-col items-center relative overflow-hidden">
          {/* Decorative Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-primary-val"></div>

          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-[#f0f6f7] text-primary-val flex items-center justify-center mb-6 shadow-sm shadow-primary-val/5">
            <CheckCircle size={36} strokeWidth={2.5} />
          </div>

          <h1 
            className="text-dark mb-3 leading-tight"
            style={{ fontFamily: "var(--font-manrope)", fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 500 }}
          >
            Pembayaran Berhasil!
          </h1>
          <p className="text-gray-400 text-sm font-light max-w-sm mb-10 leading-relaxed">
            Terima kasih! Tiket Anda telah dikonfirmasi. E-tiket dan faktur pembayaran juga telah kami kirimkan ke email Anda.
          </p>

          {/* Event Details Summary */}
          <div className="w-full bg-gray-50 rounded-2xl p-6 text-left space-y-5 border border-gray-100 mb-8">
            <div className="flex gap-4 border-b border-gray-200 pb-4">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-black/5">
                <Image src={event.image} alt={event.title} fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#181818] line-clamp-1 leading-snug mb-1">{event.title}</h3>
                <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                  <MapPin size={10} /> {event.location}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 font-light block mb-1">Tipe Tiket</span>
                <span className="font-bold text-[#181818] flex items-center gap-1">
                  <Ticket size={12} className="text-primary-val" />
                  {ticketType.name}
                </span>
              </div>
              <div>
                <span className="text-gray-400 font-light block mb-1">Jumlah Tiket</span>
                <span className="font-bold text-[#181818] uppercase">
                  {quantity} Pax
                </span>
              </div>
              <div className="col-span-2 pt-2 border-t border-gray-100 flex justify-between items-end">
                <span className="text-gray-400 font-light">Total Pembayaran</span>
                <span className="font-bold text-primary-val text-base">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="w-full space-y-4">
            {/* Join WA Group Button */}
            <a
              href={event.whatsappGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md shadow-green-500/10 cursor-pointer"
            >
              <MessageCircle size={16} />
              Gabung WhatsApp Group Event
            </a>

            {/* Download Ticket PDF */}
            <button
              className="w-full py-3.5 border border-gray-200 hover:border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 bg-white cursor-pointer"
            >
              <Download size={16} />
              Unduh E-Tiket (PDF)
            </button>

            {/* Account Dashboard redirect */}
            <Link
              href="/account"
              className="w-full py-3.5 text-primary-val hover:text-[#264b4c] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer mt-4"
            >
              Lihat Tiket Saya di Akun <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
