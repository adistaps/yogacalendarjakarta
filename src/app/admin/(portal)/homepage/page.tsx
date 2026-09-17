import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import HomepageCuration from '@/components/admin/HomepageCuration'

export const metadata: Metadata = {
  title: 'Kurasi Homepage — Portal Admin',
}

export default async function AdminHomepageCurationPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // 1. Fetch Hero Banner Ads (Paid/Verified)
  const { data: heroAds } = await supabase
    .from('ad_slots')
    .select('id, slot_type, date_start, date_end, is_active, eo_profiles(org_name), events(title)')
    .eq('slot_type', 'hero')
    .eq('status', 'paid')
    .order('created_at', { ascending: false })

  // 2. Fetch Featured Section Ads (Paid/Verified)
  const { data: featuredAds } = await supabase
    .from('ad_slots')
    .select('id, slot_type, date_start, date_end, is_active, eo_profiles(org_name), events(title)')
    .eq('slot_type', 'featured')
    .eq('status', 'paid')
    .order('created_at', { ascending: false })

  // 3. Fetch Curated Calendar Events
  const { data: calendarEvents } = await supabase
    .from('calendar_events')
    .select('id, display_date, events(id, title, eo_profiles(org_name))')
    .order('display_date', { ascending: true })

  // 4. Fetch Approved Events for Calendar Picker
  const { data: approvedEvents } = await supabase
    .from('events')
    .select('id, title, eo_profiles(org_name)')
    .eq('status', 'approved')
    .is('deleted_at', null)
    .order('title', { ascending: true })

  const formattedHeroAds = (heroAds || []).map((ad) => ({
    id: ad.id,
    slot_type: ad.slot_type as 'hero' | 'featured',
    date_start: ad.date_start,
    date_end: ad.date_end,
    is_active: ad.is_active || false,
    eo_profiles: Array.isArray(ad.eo_profiles) ? ad.eo_profiles[0] : ad.eo_profiles,
    events: Array.isArray(ad.events) ? ad.events[0] : ad.events,
  }))

  const formattedFeaturedAds = (featuredAds || []).map((ad) => ({
    id: ad.id,
    slot_type: ad.slot_type as 'hero' | 'featured',
    date_start: ad.date_start,
    date_end: ad.date_end,
    is_active: ad.is_active || false,
    eo_profiles: Array.isArray(ad.eo_profiles) ? ad.eo_profiles[0] : ad.eo_profiles,
    events: Array.isArray(ad.events) ? ad.events[0] : ad.events,
  }))

  const formattedCalendarEvents = (calendarEvents || []).map((item) => ({
    id: item.id,
    display_date: item.display_date,
    events: Array.isArray(item.events) ? item.events[0] : item.events,
  }))

  const formattedApprovedEvents = (approvedEvents || []).map((ev) => ({
    id: ev.id,
    title: ev.title,
    eo_profiles: Array.isArray(ev.eo_profiles) ? ev.eo_profiles[0] : ev.eo_profiles,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-semibold text-text"
          style={{ fontFamily: 'var(--font-manrope)' }}
        >
          Kurasi Homepage
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Kelola banner utama slider, grid event unggulan, dan kurasi event harian kalender interaktif
        </p>
      </div>

      <HomepageCuration
        heroAds={formattedHeroAds}
        featuredAds={formattedFeaturedAds}
        calendarEvents={formattedCalendarEvents}
        approvedEvents={formattedApprovedEvents}
      />
    </div>
  )
}
