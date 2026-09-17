"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { createClient } from "@/lib/supabase/client";
import { events as mockEvents, Event } from "@/lib/data/events";
import { ArrowLeft, CreditCard, ShieldCheck, Ticket, User, Phone, Mail } from "lucide-react";

// Zod Schema for Checkout Validation
const checkoutSchema = zod.object({
  buyerName: zod.string().min(3, "Nama lengkap pembeli minimal 3 karakter"),
  buyerEmail: zod.string().email("Format email tidak valid"),
  buyerPhone: zod.string().min(10, "Nomor HP minimal 10 digit").regex(/^[0-9]+$/, "Nomor HP hanya boleh berisi angka"),
  attendees: zod.array(
    zod.object({
      name: zod.string().min(3, "Nama lengkap peserta minimal 3 karakter"),
      phone: zod.string().min(10, "Nomor HP minimal 10 digit").regex(/^[0-9]+$/, "Nomor HP hanya boleh berisi angka"),
    })
  ),
});

type CheckoutFormValues = zod.infer<typeof checkoutSchema>;

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const eventId = searchParams.get("eventId");
  const ticketTypeId = searchParams.get("ticketTypeId");
  const quantity = parseInt(searchParams.get("quantity") || "1", 10);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [ticketType, setTicketType] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Initialize Form
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      buyerName: "",
      buyerEmail: "",
      buyerPhone: "",
      attendees: Array.from({ length: Math.max(0, quantity - 1) }, () => ({ name: "", phone: "" })),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "attendees",
  });

  useEffect(() => {
    async function initCheckout() {
      // 1. Get user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Save redirect intent and go to login
        localStorage.setItem(
          "checkout_intent",
          JSON.stringify({ eventId, ticketTypeId, quantity })
        );
        router.push("/events");
        return;
      }
      setUser(session.user);
      setValue("buyerName", session.user.user_metadata.full_name || "");
      setValue("buyerEmail", session.user.email || "");

      // 2. Fetch Event and Ticket details from Supabase or Fallback
      if (eventId && ticketTypeId) {
        const { data: dbEvent } = await supabase
          .from("events")
          .select(`
            id, slug, title, date_start, location_area,
            event_images (url, order_index),
            ticket_types (id, name, price, quota, quota_sold)
          `)
          .eq("id", eventId)
          .single();

        if (dbEvent) {
          const matchedTicket = dbEvent.ticket_types?.find((t) => t.id === ticketTypeId);
          const primaryImage = dbEvent.event_images?.find((img: any) => img.order_index === 0)?.url 
            || dbEvent.event_images?.[0]?.url 
            || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80";

          setEvent({
            id: dbEvent.id,
            slug: dbEvent.slug,
            title: dbEvent.title,
            category: dbEvent.location_area,
            organizer: "Event Organizer",
            location: dbEvent.location_area,
            date: dbEvent.date_start,
            time: "00:00",
            endTime: "00:00",
            price: matchedTicket ? Number(matchedTicket.price) : 0,
            quota: matchedTicket ? matchedTicket.quota : 0,
            remaining: matchedTicket ? matchedTicket.quota - matchedTicket.quota_sold : 0,
            image: primaryImage,
            tags: [],
            description: "",
            ticketTypes: [],
            quote: "",
            benefits: [],
          });
          setTicketType(matchedTicket);
        } else {
          // Fallback to mock events
          const mock = mockEvents.find((e) => e.id === eventId);
          if (mock) {
            setEvent(mock);
            // Mock ticket type
            const matchedMockTicket = mock.ticketTypes.find((_, idx) => `mock-ticket-${idx}` === ticketTypeId)
              || mock.ticketTypes[0];
            setTicketType({
              id: ticketTypeId,
              name: matchedMockTicket?.name || "Regular",
              price: matchedMockTicket?.price || mock.price,
            });
          }
        }
      }
      setLoading(false);
    }

    initCheckout();
  }, [eventId, ticketTypeId, quantity, supabase, router, setValue]);

  const onSubmit = async (data: CheckoutFormValues) => {
    setSubmitting(true);
    try {
      // Stub checkout action: In Phase 5 we will make a real request to /api/checkout.
      // For now, we simulate success after a delay.
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate a redirect to success page
      router.push(`/payment/success?eventId=${eventId}&ticketTypeId=${ticketTypeId}&qty=${quantity}`);
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-val mb-4"></div>
        <p className="text-gray-400 text-sm">Menyiapkan halaman checkout...</p>
      </div>
    );
  }

  if (!event || !ticketType) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col justify-center items-center text-center px-6">
        <h3 className="text-lg font-bold text-[#181818] mb-2">Checkout Gagal</h3>
        <p className="text-gray-400 text-sm mb-6">Data event atau tipe tiket tidak valid.</p>
        <button onClick={() => router.push("/events")} className="bg-primary-val text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider">
          Kembali ke Events
        </button>
      </div>
    );
  }

  const totalPrice = ticketType.price * quantity;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-14 py-32 grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* LEFT COLUMN - FORMS */}
      <div className="lg:col-span-8 space-y-8">
        {/* Back Button */}
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-primary-val transition-colors">
          <ArrowLeft size={14} />
          Kembali ke Detail Event
        </button>

        <h1 
          className="text-[#181818] mb-8"
          style={{ fontFamily: "var(--font-manrope)", fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 500 }}
        >
          Formulir Pemesanan
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Buyer Info */}
          <div className="bg-white rounded-3xl border border-black/5 p-8 shadow-sm">
            <h2 className="text-base font-bold text-[#181818] mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#f0f6f7] text-primary-val flex items-center justify-center font-bold text-sm">1</span>
              Informasi Kontak Pembeli
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#181818] uppercase tracking-wider">Nama Lengkap</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    {...register("buyerName")}
                    className={`w-full border rounded-xl px-5 py-3 pl-12 text-sm outline-none transition-colors ${
                      errors.buyerName ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-primary-val"
                    }`}
                    placeholder="Sesuai KTP / Paspor"
                  />
                  <User className="absolute left-4 text-gray-400" size={18} />
                </div>
                {errors.buyerName && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.buyerName.message}</p>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[#181818] uppercase tracking-wider">Alamat Email</label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    readOnly
                    {...register("buyerEmail")}
                    className="w-full border border-gray-100 bg-gray-50 rounded-xl px-5 py-3 pl-12 text-sm outline-none text-gray-400 cursor-not-allowed"
                  />
                  <Mail className="absolute left-4 text-gray-400" size={18} />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold text-[#181818] uppercase tracking-wider">Nomor Handphone</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    {...register("buyerPhone")}
                    className={`w-full border rounded-xl px-5 py-3 pl-12 text-sm outline-none transition-colors ${
                      errors.buyerPhone ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-primary-val"
                    }`}
                    placeholder="Contoh: 081234567890"
                  />
                  <Phone className="absolute left-4 text-gray-400" size={18} />
                </div>
                {errors.buyerPhone && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.buyerPhone.message}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Additional Attendees Info */}
          {fields.length > 0 && (
            <div className="bg-white rounded-3xl border border-black/5 p-8 shadow-sm space-y-8">
              <h2 className="text-base font-bold text-[#181818] mb-2 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#f0f6f7] text-primary-val flex items-center justify-center font-bold text-sm">2</span>
                Informasi Peserta Tambahan
              </h2>
              <p className="text-gray-400 text-xs font-light leading-relaxed mb-6 border-b border-gray-100 pb-4">
                Silakan isi nama lengkap dan nomor handphone masing-masing peserta tambahan sesuai tiket yang dipesan.
              </p>

              {fields.map((field, index) => (
                <div key={field.id} className="space-y-6 pt-6 first:pt-0 border-t first:border-none border-gray-100">
                  <h3 className="text-xs font-bold text-primary-val uppercase tracking-widest">Peserta #{index + 2}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Attendee Name */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-[#181818] uppercase tracking-wider">Nama Lengkap Peserta</label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          {...register(`attendees.${index}.name`)}
                          className={`w-full border rounded-xl px-5 py-3 pl-12 text-sm outline-none transition-colors ${
                            errors.attendees?.[index]?.name ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-primary-val"
                          }`}
                          placeholder="Nama lengkap peserta"
                        />
                        <User className="absolute left-4 text-gray-400" size={18} />
                      </div>
                      {errors.attendees?.[index]?.name && (
                        <p className="text-red-500 text-[10px] font-bold mt-1">{errors.attendees[index]?.name?.message}</p>
                      )}
                    </div>

                    {/* Attendee Phone */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-[#181818] uppercase tracking-wider">Nomor Handphone Peserta</label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          {...register(`attendees.${index}.phone`)}
                          className={`w-full border rounded-xl px-5 py-3 pl-12 text-sm outline-none transition-colors ${
                            errors.attendees?.[index]?.phone ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-primary-val"
                          }`}
                          placeholder="Nomor HP peserta"
                        />
                        <Phone className="absolute left-4 text-gray-400" size={18} />
                      </div>
                      {errors.attendees?.[index]?.phone && (
                        <p className="text-red-500 text-[10px] font-bold mt-1">{errors.attendees[index]?.phone?.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Secure Info Disclaimer */}
          <div className="flex items-start gap-4 p-5 bg-teal-50/50 rounded-2xl border border-[#f0f6f7]/40 text-gray-500 text-xs font-light leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-primary-val shrink-0 mt-0.5" />
            <p>
              Semua data diri Anda dienkripsi dan diamankan dengan standar privasi tinggi. Data peserta akan digunakan oleh Event Organizer hanya untuk keperluan pendaftaran, check-in, dan koordinasi acara.
            </p>
          </div>
        </form>
      </div>

      {/* RIGHT COLUMN - ORDER SUMMARY */}
      <div className="lg:col-span-4">
        <div className="sticky top-32 bg-white rounded-3xl border border-black/5 shadow-sm p-8 space-y-8">
          <h2 className="text-sm font-bold text-[#181818] uppercase tracking-wider border-b border-gray-100 pb-4">
            Ringkasan Pesanan
          </h2>

          {/* Event Card */}
          <div className="flex gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-black/5">
              <Image src={event.image} alt={event.title} fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#181818] line-clamp-2 leading-snug mb-1">{event.title}</h3>
              <p className="text-[10px] text-gray-400">{event.location}</p>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="space-y-4 pt-4 border-t border-gray-100 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500 font-light flex items-center gap-1.5">
                <Ticket size={14} className="text-primary-val" />
                {ticketType.name}
              </span>
              <span className="font-bold text-[#181818]">
                {quantity}x
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-light">Harga Satuan</span>
              <span className="font-bold text-[#181818]">
                Rp {ticketType.price.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Price Summary */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-[#181818] uppercase tracking-wider">Total Bayar</span>
              <span className="text-xl font-bold text-primary-val" style={{ fontFamily: "var(--font-manrope)" }}>
                Rp {totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Checkout Submit Trigger */}
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={submitting}
            className="w-full py-4 bg-primary-val hover:bg-[#264b4c] text-white text-center transition-colors rounded-xl font-bold text-xs tracking-widest uppercase cursor-pointer shadow-md shadow-primary-val/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Memproses Pembayaran...
              </>
            ) : (
              <>
                <CreditCard size={14} />
                Lanjutkan Ke Pembayaran
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
