import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpen, faCalendar, faUser } from '@fortawesome/free-solid-svg-icons'

export const metadata: Metadata = {
  title: 'Blog & Artikel — Jakarta Yoga Calendar',
  description: 'Artikel, tips yoga, berita festival, dan informasi event terkini di Jakarta.',
}

export default async function BlogIndexPage() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="bg-gray-50/50 min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#0F2856]/5 text-[#0F2856] text-xs font-bold px-3.5 py-1.5 rounded-full mb-3">
            <FontAwesomeIcon icon={faBookOpen} className="text-xs" />
            BACAAN SERU
          </div>
          <h1
            className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight"
            style={{ fontFamily: 'var(--font-manrope)' }}
          >
            Blog & Artikel Terkini
          </h1>
          <p className="text-gray-500 text-sm md:text-base mt-2">
            Temukan panduan gaya hidup sehat, info tiket, tips yoga, dan liputan event eksklusif di Jakarta.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(articles || []).map((art) => (
            <Link
              key={art.id}
              href={`/blog/${art.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative w-full h-52 overflow-hidden bg-gray-100">
                <Image
                  src={art.image_url}
                  alt={art.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#0F2856] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  {art.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faCalendar} className="text-xs" />
                      {new Date(art.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faUser} className="text-xs" />
                      {art.author_name || 'Tim YC'}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary-val transition-colors mb-2">
                    {art.title}
                  </h2>

                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                    {art.content}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-primary-val group-hover:translate-x-1 transition-transform">
                  <span>Baca Selengkapnya</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
