import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Calendar, CheckCircle2, User, Clock, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { events as mockEvents, Event } from "@/lib/data/events";
import TicketSelection from "@/components/public/events/TicketSelection";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
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
    quote: dbEvent.collaboration_info || "Yoga is a journey of the self, through the self, to the self.",
    benefits: dbEvent.facilities ? dbEvent.facilities.split(',').map((t: string) => t.trim()) : []
  };
}

// Fetch helper untuk Server Component & Metadata
async function getEventData(slug: string) {
  const supabase = await createClient();

  const { data: dbEvent } = await supabase
    .from("events")
    .select(`
      id, slug, title, description, date_start, date_end, time_start, time_end, location_area, location_address, facilities, collaboration_info,
      eo_profiles (id, org_name, slug),
      event_images (id, url, order_index),
      ticket_types (id, name, price, quota, quota_sold)
    `)
    .eq("slug", slug)
    .eq("status", "approved")
    .is("deleted_at", null)
    .single();

  if (dbEvent) {
    return {
      event: mapDbEventToEvent(dbEvent),
      ticketTypes: dbEvent.ticket_types || [],
      rawEvent: dbEvent
    };
  }

  // Fallback ke mock data jika tidak ada di DB
  const mockEvent = mockEvents.find((e) => e.slug === slug);
  if (mockEvent) {
    return {
      event: mockEvent,
      ticketTypes: mockEvent.ticketTypes.map((t, idx) => ({
        id: `mock-ticket-${idx}`,
        name: t.name,
        price: t.price,
        quota: 100,
        quota_sold: 100 - mockEvent.remaining
      })),
      rawEvent: null
    };
  }

  return null;
}

// 1. GENERATE METADATA SECARA DINAMIS (SEO)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getEventData(resolvedParams.slug);

  if (!data) {
    return {
      title: "Event Tidak Ditemukan | Jakarta Yoga Calendar",
    };
  }

  const { event } = data;
  return {
    title: `${event.title} | Jakarta Yoga Calendar`,
    description: event.description.substring(0, 160),
    openGraph: {
      title: `${event.title} | Jakarta Yoga Calendar`,
      description: event.description.substring(0, 160),
      images: [{ url: event.image, width: 1200, height: 630 }],
      url: `https://yogacalendar.id/events/${event.slug}`,
      type: "website",
    },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = await getEventData(resolvedParams.slug);

  if (!data) {
    return notFound();
  }

  const { event, ticketTypes } = data;

  // Format Date ke bahasa Indonesia
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return new Date(dateStr).toLocaleDateString('id-ID', options);
  };

  // Acara serupa (related events) - Ambil dari mock jika DB kosong
  const relatedEvents = mockEvents.filter(e => e.id !== event.id).slice(0, 3);

  // 2. STRUCTURED DATA (JSON-LD) UNTUK GOOGLE RICH RESULTS
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "startDate": `${event.date}T${event.time}:00+07:00`,
    "endDate": `${event.date}T${event.endTime}:00+07:00`,
    "location": {
      "@type": "Place",
      "name": event.location,
      "address": `${event.category}, Indonesia`
    },
    "image": event.image,
    "description": event.description,
    "organizer": {
      "@type": "Organization",
      "name": event.organizer,
      "url": `https://yogacalendar.id/eo/${event.slug}`
    },
    "offers": {
      "@type": "Offer",
      "url": `https://yogacalendar.id/events/${event.slug}`,
      "priceCurrency": "IDR",
      "price": event.price,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-28 pb-20">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
          <Link href="/" className="hover:text-primary-val transition-colors">Home</Link>
          <span>&rarr;</span>
          <Link href="/events" className="hover:text-primary-val transition-colors">Events</Link>
          <span>&rarr;</span>
          <span className="text-dark truncate max-w-[200px]">{event.title}</span>
        </div>

        {/* HEADER TITLE */}
        <h1 
          className="text-dark mb-10"
          style={{ fontFamily: "var(--font-manrope)", fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 500, lineHeight: 1.1 }}
        >
          {event.title}
        </h1>

        {/* GALLERY COLLAGE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16 h-[400px]">
          <div className="md:col-span-3 relative rounded-2xl overflow-hidden h-full">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            <div className="relative flex-1 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop"
                alt="Yoga Detail 1"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative flex-1 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=800&auto=format&fit=crop"
                alt="Yoga Detail 2"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 relative">
          {/* LEFT COLUMN - CONTENT */}
          <div className="w-full lg:w-2/3 flex flex-col">
            <h2 
              className="text-dark mb-6"
              style={{ fontFamily: "var(--font-manrope)", fontSize: "clamp(1.8rem, 3vw, 2.2rem)", fontWeight: 600, lineHeight: 1.2 }}
            >
              {event.title} bersama {event.organizer}
            </h2>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-6 pb-8 mb-8 border-b border-gray-200 text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary-val" />
                <span>{event.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-val" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-val" />
                <span>{event.location}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h3 className="text-dark mb-4 text-lg font-bold">
                Tentang Event Ini
              </h3>
              <p className="text-gray-600 leading-relaxed font-light whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Blockquote */}
            {event.quote && (
              <blockquote className="bg-[#f0f6f7]/40 border-l-4 border-primary-val p-6 rounded-r-xl mb-12">
                <p className="text-dark text-lg italic leading-relaxed font-medium">
                  "{event.quote}"
                </p>
                <p className="text-gray-500 text-xs mt-3 font-bold uppercase tracking-wider">— {event.organizer}</p>
              </blockquote>
            )}

            {/* Benefits */}
            {event.benefits && event.benefits.length > 0 && (
              <div className="mb-12">
                <h3 className="text-dark mb-6 text-lg font-bold">
                  Fasilitas & Layanan
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600 font-light">
                      <CheckCircle2 className="w-5 h-5 text-primary-val shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
              {event.tags.map(tag => (
                <span key={tag} className="px-4 py-1.5 bg-[#f0f6f7] text-primary-val text-xs font-bold uppercase tracking-wider rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN - STICKY TICKET SELECTION */}
          <div className="w-full lg:w-1/3">
            <TicketSelection event={event} ticketTypes={ticketTypes} />
          </div>
        </div>

        {/* RELATED EVENTS */}
        <div className="mt-24 pt-16 border-t border-gray-200">
          <h2 className="text-center text-dark mb-12 text-2xl font-bold">
            Acara Serupa
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedEvents.map((relEvent) => (
              <Link key={relEvent.id} href={`/events/${relEvent.slug}`} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <Image 
                    src={relEvent.image} 
                    alt={relEvent.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-sm shadow-sm">
                    <span className="text-[0.65rem] font-bold tracking-wider uppercase text-dark">
                      {relEvent.category} • {new Date(relEvent.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-dark group-hover:text-primary-val transition-colors mb-2 line-clamp-1 font-bold">
                    {relEvent.title}
                  </h4>
                  <p className="text-gray-500 text-xs font-light line-clamp-2">
                    {relEvent.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
