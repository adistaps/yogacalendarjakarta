import type { Metadata } from 'next'
import CreateEventForm from '@/components/eo/CreateEventForm'

export const metadata: Metadata = {
  title: 'Upload Event Baru — Portal EO',
}

export default function NewEventPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold text-text"
          style={{ fontFamily: 'var(--font-manrope)' }}
        >
          Upload Event Baru
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Isi detail event Anda. Setelah submit, tim admin akan melakukan review dalam 1–2 hari kerja.
        </p>
      </div>
      <CreateEventForm />
    </div>
  )
}
