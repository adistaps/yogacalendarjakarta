import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { events as mockEvents, Event } from "@/lib/data/events";
import EventsListClient from "@/components/public/events/EventsListClient";

// Interface for Next.js App Router Page searchParams
interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    region?: string;
    date?: string;
  }>;
}

// Mapper untuk mengubah data relasional Supabase menjadi format UI Event
function mapDbEventToEvent(dbEvent: any): Event {
  const primaryImage = dbEvent.event_images?.find((img: any) => img.order_index === 0)?.url 
    || dbEvent.event_images?.[0]?.url 
    || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80";

  const prices = dbEvent.ticket_types?.map((t: any) => Number(t.price)) || [];
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;

  const totalQuota = dbEvent.ticket_types?.reduce((acc: number, t: any) => acc + t.quota, 0) || 0;
  const totalSold = dbEvent.ticket_types?.reduce((acc: number, t: any) => acc + (t.quota_sold || 0), 0) || 0;
  const remaining = totalQuota - totalSold;

  return {
    id: dbEvent.id,
    slug: dbEvent.slug,
    title: dbEvent.title,
    category: dbEvent.location_area,
    organizer: dbEvent.eo_profiles?.org_name || "Event Organizer",
    location: `${dbEvent.location_area}, Jakarta`,
    date: dbEvent.date_start,
    time: dbEvent.time_start?.substring(0, 5) || "00:00",
    endTime: dbEvent.time_end?.substring(0, 5) || "00:00",
    price: lowestPrice,
    quota: totalQuota,
    remaining: remaining,
    image: primaryImage,
    tags: dbEvent.facilities ? dbEvent.facilities.split(',').map((t: string) => t.trim()) : [],
    description: dbEvent.description,
    ticketTypes: dbEvent.ticket_types?.map((t: any) => ({
      name: t.name,
      price: Number(t.price),
      description: `Kuota: ${t.quota - t.quota_sold} tersisa`
    })) || [],
    quote: "Yoga is a journey of the self, through the self, to the self.",
    benefits: dbEvent.facilities ? dbEvent.facilities.split(',').map((t: string) => t.trim()) : []
  };
}

export default async function EventsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const category = resolvedParams.category || "Semua";
  const region = resolvedParams.region || "Semua Wilayah";
  const date = resolvedParams.date || "";

  const supabase = await createClient();

  // 1. Cek total event approved di DB untuk menentukan apakah DB kosong
  const { count } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved")
    .is("deleted_at", null);

  const isDbEmpty = !count || count === 0;
  let finalEvents: Event[] = [];

  if (!isDbEmpty) {
    // Bangun query filter dinamis di Supabase
    let query = supabase
      .from("events")
      .select(`
        id, slug, title, description, date_start, date_end, time_start, time_end, location_area, location_address, facilities,
        eo_profiles (org_name),
        event_images (url, order_index),
        ticket_types (price, quota, quota_sold)
      `)
      .eq("status", "approved")
      .is("deleted_at", null);

    if (category && category !== "Semua") {
      query = query.ilike("description", `%${category}%`);
    }
    if (region && region !== "Semua Wilayah") {
      query = query.eq("location_area", region);
    }
    if (date) {
      query = query.eq("date_start", date);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: dbEvents } = await query.order("date_start", { ascending: true });
    finalEvents = dbEvents ? dbEvents.map(mapDbEventToEvent) : [];
  } else {
    // FALLBACK: Filter data mock jika database kosong
    finalEvents = mockEvents.filter((event) => {
      const matchSearch =
        !search ||
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase()) ||
        event.organizer.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        category === "Semua" ||
        event.category.toLowerCase().includes(category.toLowerCase()) ||
        event.title.toLowerCase().includes(category.toLowerCase());

      const matchRegion =
        region === "Semua Wilayah" ||
        event.location.toLowerCase().includes(region.toLowerCase());

      const matchDate = !date || event.date === date;

      return matchSearch && matchCategory && matchRegion && matchDate;
    });
  }

  return (
    <>
      {/* PAGE HERO BANNER */}
      <section className="relative w-full h-[45vh] min-h-[350px] flex flex-col justify-end overflow-hidden mt-[-150px]">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1574689211272-bc1550ce1564?q=80&w=2070&auto=format&fit=crop"
            alt="Events Banner"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
        <div className="relative z-10 w-full px-8 lg:px-14 pb-16 flex flex-col lg:flex-row justify-between lg:items-end gap-6 pt-32">
          <h1
            className="text-white"
            style={{
              fontFamily: "var(--font-manrope)",
              fontWeight: 400,
              fontSize: "clamp(3rem, 5vw, 4.5rem)",
              lineHeight: 1,
            }}
          >
            Semua Event
          </h1>
          <div 
            className="flex items-center gap-2 text-white/80 uppercase tracking-widest text-[0.7rem]"
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 500 }}
          >
            <Link href="/" className="hover:text-white transition-colors">HOME</Link>
            <span>&rarr;</span>
            <span className="text-white border-b border-white pb-0.5">EVENTS</span>
          </div>
        </div>
      </section>

      {/* FILTER, SEARCH, & LIST */}
      <section className="py-20 px-8 lg:px-14">
        <p className="text-primary-val uppercase tracking-[0.15em] text-[0.7rem] font-medium mb-4 flex items-center gap-4">
          <span className="w-6 h-[1px] bg-primary-val"></span>
          TEMUKAN EVENT YANG TEPAT UNTUKMU
        </p>
        <h2
          className="text-text leading-[1.15] mb-12"
          style={{
            fontFamily: "var(--font-manrope)",
            fontSize: "clamp(2rem, 3.5vw, 3rem)",
            fontWeight: 400,
          }}
        >
          Ratusan Event Yoga Menunggumu di Jakarta
        </h2>

        <Suspense fallback={
          <div className="w-full py-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-val"></div>
          </div>
        }>
          <EventsListClient initialEvents={finalEvents} />
        </Suspense>
      </section>
    </>
  );
}
