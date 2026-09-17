'use client'

import { useState } from 'react'
import {
  Calendar as CalendarIcon,
  LayoutGrid,
  Image as ImageIcon,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from 'lucide-react'
import {
  addCalendarEventAction,
  deleteCalendarEventAction,
  toggleAdActiveAction,
} from '@/app/admin/actions'

interface AdSlot {
  id: string
  slot_type: 'hero' | 'featured'
  date_start: string
  date_end: string
  is_active: boolean
  eo_profiles: { org_name: string } | null
  events: { title: string } | null
}

interface CalendarEventItem {
  id: string
  display_date: string
  events: {
    id: string
    title: string
    eo_profiles: { org_name: string } | null
  } | null
}

interface ApprovedEventItem {
  id: string
  title: string
  eo_profiles: { org_name: string } | null
}

interface HomepageCurationProps {
  heroAds: AdSlot[]
  featuredAds: AdSlot[]
  calendarEvents: CalendarEventItem[]
  approvedEvents: ApprovedEventItem[]
}

export default function HomepageCuration({
  heroAds: initialHeroAds,
  featuredAds: initialFeaturedAds,
  calendarEvents: initialCalendarEvents,
  approvedEvents,
}: HomepageCurationProps) {
  const [heroAds, setHeroAds] = useState<AdSlot[]>(initialHeroAds)
  const [featuredAds, setFeaturedAds] = useState<AdSlot[]>(initialFeaturedAds)
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>(initialCalendarEvents)

  // Actions states
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [selectedEventId, setSelectedEventId] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleToggleAd = async (adId: string, currentStatus: boolean, type: 'hero' | 'featured') => {
    setLoadingId(adId)
    setError(null)
    const newStatus = !currentStatus
    const res = await toggleAdActiveAction(adId, newStatus)
    if (res.success) {
      const updateList = (prev: AdSlot[]) =>
        prev.map((ad) => (ad.id === adId ? { ...ad, is_active: newStatus } : ad))
      if (type === 'hero') {
        setHeroAds(updateList)
      } else {
        setFeaturedAds(updateList)
      }
    } else {
      setError(res.error || 'Gagal mengubah status aktif iklan.')
    }
    setLoadingId(null)
  }

  const handleAddCalendarEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEventId || !selectedDate) {
      setError('Pilih event dan tanggal terlebih dahulu.')
      return
    }

    setLoadingId('add-calendar')
    setError(null)
    const res = await addCalendarEventAction(selectedEventId, selectedDate)
    if (res.success) {
      // Find the event details locally to append to UI state
      const evObj = approvedEvents.find((e) => e.id === selectedEventId)
      const newItem: CalendarEventItem = {
        id: Math.random().toString(), // Will be refreshed on page reload, temporary ID for UI list
        display_date: selectedDate,
        events: evObj ? { id: evObj.id, title: evObj.title, eo_profiles: evObj.eo_profiles } : null,
      }
      setCalendarEvents((prev) => [...prev, newItem].sort((a, b) => a.display_date.localeCompare(b.display_date)))
      setSelectedEventId('')
      setSelectedDate('')
    } else {
      setError(res.error || 'Gagal menambah event kalender.')
    }
    setLoadingId(null)
  }

  const handleDeleteCalendarEvent = async (id: string) => {
    setLoadingId(id)
    setError(null)
    const res = await deleteCalendarEventAction(id)
    if (res.success) {
      setCalendarEvents((prev) => prev.filter((item) => item.id !== id))
    } else {
      setError(res.error || 'Gagal menghapus event kalender.')
    }
    setLoadingId(null)
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Grid for Hero & Featured Ads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section Banner Curation */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <ImageIcon className="text-pink-500" size={20} />
            <h2 className="text-lg font-bold text-text" style={{ fontFamily: 'var(--font-manrope)' }}>
              Curated Hero Banner Slots
            </h2>
          </div>
          <p className="text-xs text-text-muted">
            Aktifkan atau nonaktifkan iklan tipe Hero Banner yang tayang di slider utama halaman depan.
          </p>

          {heroAds.length === 0 ? (
            <p className="text-xs text-text-muted italic py-4">Tidak ada iklan Hero Banner yang terverifikasi.</p>
          ) : (
            <div className="space-y-3">
              {heroAds.map((ad) => (
                <div
                  key={ad.id}
                  className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-xs text-text truncate">
                      Event: {ad.events?.title || 'Iklan Non-Event'}
                    </h4>
                    <p className="text-[10px] text-pink-600 font-semibold mt-0.5">
                      EO: {ad.eo_profiles?.org_name || 'Event Organizer'}
                    </p>
                    <p className="text-[10px] text-text-muted mt-1">
                      Periode: {new Date(ad.date_start).toLocaleDateString('id-ID')} - {new Date(ad.date_end).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleAd(ad.id, ad.is_active, 'hero')}
                    disabled={loadingId !== null}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
                      ad.is_active
                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                        : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {loadingId === ad.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : ad.is_active ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {ad.is_active ? 'Aktif' : 'Nonaktif'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured Section Curation */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <LayoutGrid className="text-pink-500" size={20} />
            <h2 className="text-lg font-bold text-text" style={{ fontFamily: 'var(--font-manrope)' }}>
              Curated Featured Section Slots
            </h2>
          </div>
          <p className="text-xs text-text-muted">
            Aktifkan atau nonaktifkan iklan tipe Featured Event yang tayang di baris grid halaman depan.
          </p>

          {featuredAds.length === 0 ? (
            <p className="text-xs text-text-muted italic py-4">Tidak ada iklan Featured Event yang terverifikasi.</p>
          ) : (
            <div className="space-y-3">
              {featuredAds.map((ad) => (
                <div
                  key={ad.id}
                  className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-xs text-text truncate">
                      Event: {ad.events?.title || 'Iklan Non-Event'}
                    </h4>
                    <p className="text-[10px] text-pink-600 font-semibold mt-0.5">
                      EO: {ad.eo_profiles?.org_name || 'Event Organizer'}
                    </p>
                    <p className="text-[10px] text-text-muted mt-1">
                      Periode: {new Date(ad.date_start).toLocaleDateString('id-ID')} - {new Date(ad.date_end).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleAd(ad.id, ad.is_active, 'featured')}
                    disabled={loadingId !== null}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border ${
                      ad.is_active
                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                        : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {loadingId === ad.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : ad.is_active ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <XCircle size={12} />
                    )}
                    {ad.is_active ? 'Aktif' : 'Nonaktif'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Calendar Curations */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="text-pink-500" size={20} />
          <h2 className="text-lg font-bold text-text" style={{ fontFamily: 'var(--font-manrope)' }}>
            Curated Interactive Calendar
          </h2>
        </div>
        <p className="text-xs text-text-muted">
          Tambahkan event yang disetujui (Approved) ke kalender harian publik untuk mempermudah pencarian per tanggal oleh user.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form to Add to Calendar */}
          <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
            <h3 className="text-xs font-semibold text-text uppercase tracking-wider">
              Tambah Event ke Kalender
            </h3>
            <form onSubmit={handleAddCalendarEvent} className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold text-text-muted block mb-1">
                  Pilih Event (Approved)
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:ring-2 focus:ring-pink-200"
                  required
                >
                  <option value="">-- Pilih Event --</option>
                  {approvedEvents.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} ({ev.eo_profiles?.org_name || 'EO'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-text-muted block mb-1">
                  Pilih Tanggal Tayang Kalender
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:ring-2 focus:ring-pink-200"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loadingId !== null || !selectedEventId || !selectedDate}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {loadingId === 'add-calendar' ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Plus size={12} />
                )}
                Tambah ke Kalender
              </button>
            </form>
          </div>

          {/* Curated Calendar Events List */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold text-text uppercase tracking-wider">
              Daftar Event Kalender Curated
            </h3>

            {calendarEvents.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-gray-200 rounded-2xl bg-gray-50/20">
                <Clock size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-xs text-text-muted font-medium">Belum ada event yang dikurasi ke kalender.</p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {calendarEvents.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-xl border border-gray-100 flex items-center justify-between text-xs gap-4 shadow-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="inline-block px-2 py-0.5 bg-pink-50 text-pink-700 rounded text-[9px] font-bold mb-1">
                        {new Date(item.display_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <h4 className="font-semibold text-text truncate">
                        {item.events?.title || 'Event tidak dikenal'}
                      </h4>
                      <p className="text-[10px] text-text-muted mt-0.5">
                        Penyelenggara: {item.events?.eo_profiles?.org_name || 'EO'}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteCalendarEvent(item.id)}
                      disabled={loadingId !== null}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Hapus dari kalender"
                    >
                      {loadingId === item.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
