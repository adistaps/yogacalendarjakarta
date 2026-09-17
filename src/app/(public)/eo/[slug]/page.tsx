import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, MessageCircle, Calendar, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { organizers as mockOrganizers } from "@/lib/data/organizers";
import { events as mockEvents, Event } from "@/lib/data/events";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Helper untuk generate slug sederhana
function getSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// Mapper untuk mengubah data relasional Supabase menjadi format UI Event
function mapDbEventToEvent(dbEvent: any, eoName: string): Event {
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
    organizer: eoName,
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

async function getEOProfile(slug: string) {
  const supabase = await createClient();

  // Query EO dari database
  const { data: dbEo } = await supabase
    .from("eo_profiles")
    .select("*, users(*)")
    .eq("slug", slug)
    .eq("status", "approved")
    .single();

  if (dbEo) {
    // Ambil event-event aktif untuk EO ini
    const { data: dbEvents } = await supabase
      .from("events")
      .select(`
        id, slug, title, description, date_start, date_end, time_start, time_end, location_area, location_address, facilities,
        event_images (url, order_index),
        ticket_types (price, quota, quota_sold)
      `)
      .eq("eo_id", dbEo.id)
      .eq("status", "approved")
      .is("deleted_at", null)
      .order("date_start", { ascending: true });

    const activeEvents = dbEvents ? dbEvents.map((e) => mapDbEventToEvent(e, dbEo.org_name)) : [];

    return {
      name: dbEo.org_name,
      bio: dbEo.bio || "Event Organizer Yoga & Wellness di Jabodetabek.",
      logo: dbEo.logo_url || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&q=80",
      whatsapp: dbEo.whatsapp || "",
      email: dbEo.contact_email || "",
      events: activeEvents,
    };
  }

  // Fallback ke mock data jika database kosong atau EO tidak ditemukan di DB
  const mockEo = mockOrganizers.find((org) => getSlug(org.name) === slug);
  if (mockEo) {
    // Filter mock events yang diselenggarakan oleh EO ini
    const associatedEvents = mockEvents.filter(
      (e) => e.organizer.toLowerCase() === mockEo.name.toLowerCase()
    );

    return {
      name: mockEo.name,
      bio: mockEo.description,
      logo: mockEo.image,
      whatsapp: "6281200000000",
      email: "info@example.com",
      events: associatedEvents,
    };
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const eo = await getEOProfile(resolvedParams.slug);

  if (!eo) {
    return {
      title: "EO Tidak Ditemukan | Jakarta Yoga Calendar",
    };
  }

  return {
    title: `${eo.name} | Jakarta Yoga Calendar`,
    description: eo.bio.substring(0, 160),
  };
}

export default async function EOProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const eo = await getEOProfile(resolvedParams.slug);

  if (!eo) {
    return notFound();
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-14">
        
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-8 lg:p-12 mb-16 flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12 relative overflow-hidden">
          {/* Decorative background shape */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f0f6f7] rounded-full translate-x-20 -translate-y-20 pointer-events-none z-0"></div>

          {/* Logo */}
          <div className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-2xl overflow-hidden border border-black/5 shrink-0 z-10 bg-gray-50">
            <Image
              src={eo.logo}
              alt={eo.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-grow flex flex-col items-center md:items-start text-center md:text-left z-10 relative">
            <h1 
              className="text-[#181818] mb-4 leading-tight"
              style={{
                fontFamily: "var(--font-manrope)",
                fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                fontWeight: 500
              }}
            >
              {eo.name}
            </h1>
            <p className="text-gray-500 font-light text-base max-w-2xl leading-relaxed mb-6">
              {eo.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              {eo.whatsapp && (
                <a
                  href={`https://wa.me/${eo.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <MessageCircle size={14} />
                  Hubungi via WA
                </a>
              )}
              {eo.email && (
                <a
                  href={`mailto:${eo.email}`}
                  className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-700 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors bg-white"
                >
                  Email Kontak
                </a>
              )}
            </div>
          </div>
        </div>

        {/* EO EVENTS SECTION */}
        <div>
          <h2 
            className="text-[#181818] mb-10"
            style={{
              fontFamily: "var(--font-manrope)",
              fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
              fontWeight: 500
            }}
          >
            Event Aktif oleh {eo.name}
          </h2>

          {eo.events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-black/5 p-8 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-6">
                <Calendar size={28} />
              </div>
              <h3 className="text-base font-bold text-[#181818] mb-2">Belum Ada Event Aktif</h3>
              <p className="text-gray-400 text-xs max-w-sm font-light">
                Event Organizer ini belum memiliki event aktif atau mendatang yang terdaftar saat ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eo.events.map((event, idx) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group block relative overflow-hidden rounded-2xl border border-black/5 shadow-sm transition-all duration-300 bg-white aspect-[4/5]"
                >
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-85 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3
                      className="text-white mb-4"
                      style={{
                        fontFamily: "var(--font-manrope)",
                        fontSize: "1.5rem",
                        fontWeight: 400,
                        lineHeight: 1.2,
                      }}
                    >
                      {event.title}
                    </h3>

                    {/* Details on Hover */}
                    <div className="flex flex-col gap-2 text-white/70 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-primary-val" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-primary-val" />
                        <span>
                          {new Date(event.date).toLocaleDateString("id-ID", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="text-white font-bold text-sm">
                          {event.price > 0 ? `Rp ${event.price.toLocaleString("id-ID")}` : "Gratis"}
                        </span>
                        <span className="inline-flex items-center text-xs font-bold text-primary-val gap-1">
                          Lihat Detail <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
