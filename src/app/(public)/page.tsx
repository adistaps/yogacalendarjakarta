import HeroBanner from "@/components/public/home/HeroBanner";
import CategoriesSection from "@/components/public/home/CategoriesSection";
import InteractiveCalendar from "@/components/public/home/InteractiveCalendar";
import StatsSection from "@/components/public/home/StatsSection";
import FeaturedEvents from "@/components/public/home/FeaturedEvents";
import LatestEvents from "@/components/public/home/LatestEvents";
import PopularEvents from "@/components/public/home/PopularEvents";
import EventToGoSection from "@/components/public/home/EventToGoSection";
import PromoBanner from "@/components/public/home/PromoBanner";
import ScreenSection from "@/components/public/home/ScreenSection";
import BrandsSection from "@/components/public/home/BrandsSection";
import CityExplore from "@/components/public/home/CityExplore";
import BlogSection from "@/components/public/home/BlogSection";

import { createClient } from "@/lib/supabase/server";
import { Event } from "@/lib/data/events";

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

export default async function HomePage() {
  const supabase = await createClient();

  // 1. Fetch Iklan Hero Banner yang Aktif
  const { data: heroAds } = await supabase
    .from('ad_slots')
    .select(`
      event_id,
      events (
        id, slug, title, description, date_start, date_end, time_start, time_end, location_area, location_address, facilities,
        eo_profiles (org_name),
        event_images (url, order_index),
        ticket_types (price, quota, quota_sold)
      )
    `)
    .eq('slot_type', 'hero')
    .eq('status', 'paid')
    .eq('is_active', true)
    .limit(5);

  const mappedHero: Event[] = heroAds
    ? heroAds
      .map((ad: any) => ad.events)
      .filter(Boolean)
      .map(mapDbEventToEvent)
    : [];

  // 2. Fetch Iklan Featured ("Event Pilihan Minggu Ini") yang Aktif
  const { data: featuredAds } = await supabase
    .from('ad_slots')
    .select(`
      event_id,
      events (
        id, slug, title, description, date_start, date_end, time_start, time_end, location_area, location_address, facilities,
        eo_profiles (org_name),
        event_images (url, order_index),
        ticket_types (price, quota, quota_sold)
      )
    `)
    .eq('slot_type', 'featured')
    .eq('status', 'paid')
    .eq('is_active', true)
    .limit(6);

  const mappedFeatured: Event[] = featuredAds
    ? featuredAds
      .map((ad: any) => ad.events)
      .filter(Boolean)
      .map(mapDbEventToEvent)
    : [];

  // 3. Fetch Event Kurasi Kalender Harian
  const { data: calendarDbEvents } = await supabase
    .from('calendar_events')
    .select(`
      display_date,
      events (
        id, slug, title, description, date_start, date_end, time_start, time_end, location_area, location_address, facilities,
        eo_profiles (org_name),
        event_images (url, order_index),
        ticket_types (price, quota, quota_sold)
      )
    `);

  const mappedCalendar = calendarDbEvents
    ? calendarDbEvents
      .filter((ce: any) => ce.events)
      .map((ce: any) => ({
        displayDate: ce.display_date,
        event: mapDbEventToEvent(ce.events)
      }))
    : [];

  // 4. Fetch Event Terpopuler
  const { data: popularDbEvents } = await supabase
    .from('events')
    .select(`
      id, slug, title, description, date_start, date_end, time_start, time_end, location_area, location_address, facilities,
      eo_profiles (org_name),
      event_images (url, order_index),
      ticket_types (price, quota, quota_sold)
    `)
    .eq('status', 'approved')
    .is('deleted_at', null);

  const mappedPopular: Event[] = popularDbEvents
    ? popularDbEvents
      .map(mapDbEventToEvent)
      .sort((a, b) => {
        const soldA = a.quota - a.remaining;
        const soldB = b.quota - b.remaining;
        return soldB - soldA;
      })
      .slice(0, 6)
    : [];

  // 5. Fetch Event Terbaru yang sudah Approved
  const { data: latestDbEvents } = await supabase
    .from('events')
    .select(`
      id, slug, title, description, date_start, date_end, time_start, time_end, location_area, location_address, facilities,
      eo_profiles (org_name),
      event_images (url, order_index),
      ticket_types (price, quota, quota_sold)
    `)
    .eq('status', 'approved')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(6);

  const mappedLatest: Event[] = latestDbEvents
    ? latestDbEvents.map(mapDbEventToEvent)
    : [];

  // 6. Fetch Artikel (Bacaan Seru) dari Database
  const { data: dbArticles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  const mappedArticles = dbArticles
    ? dbArticles.map((art) => ({
        id: art.id,
        title: art.title,
        slug: art.slug,
        image: art.image_url,
        category: art.category,
        date: new Date(art.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      }))
    : undefined;

  return (
    <>
      {/* 1. Hero Banner Slider — tetap seperti desain existing, dengan autoslide */}
      <HeroBanner initialHeroEvents={mappedHero} />

      {/* 3. "Event Baru Untukmu" — horizontal scroll cards */}
      <LatestEvents initialEvents={mappedLatest} />

      {/* 4. "Calendario Interaktif" — menampilkan kalender dengan event harian */}
      <InteractiveCalendar events={mappedCalendar} />

      {/* 5. "Lagi Trending" — dark horizontal scroll cards */}
      <PopularEvents initialEvents={mappedPopular} />

      {/* 6. Event2Go (Featured Split Layout) — replaces InteractiveCalendar */}
      <EventToGoSection events={mappedCalendar} />

      {/* 7. "Event Minggu Ini" / Featured — masonry or wide cards */}
      <FeaturedEvents initialEvents={mappedFeatured} />

      {/* 8. Promo Banner — wide banner à la Loket */}
      <PromoBanner />

      {/* 9. YOGA Screen — vertical poster section */}
      <ScreenSection />
      {/* 2. Kategori Navigasi — pill horizontal scroll */}
      <CategoriesSection />

      {/* 10. "Siap Seru-seruan?" — partner venue cards */}
      <BrandsSection />

      {/* 11. "Jelajahi Event di Kotamu" — city cards */}
      <CityExplore />

      {/* 12. "Bacaan Seru!" — blog/article cards (CRUD dari Admin) */}
      <BlogSection initialArticles={mappedArticles} />

      {/* 13. Statistik Platform */}
      <StatsSection />
    </>
  );
}
