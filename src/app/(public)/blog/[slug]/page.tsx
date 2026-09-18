import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCalendar, faUser, faFolderOpen, faShareNodes } from '@fortawesome/free-solid-svg-icons'

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: article } = await supabase
    .from('articles')
    .select('title, content')
    .eq('slug', slug)
    .single()

  if (!article) return { title: 'Artikel Tidak Ditemukan' }

  return {
    title: `${article.title} — Jakarta Yoga Calendar`,
    description: article.content.substring(0, 160),
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!article) {
    notFound()
  }

  // Related Articles
  const { data: relatedArticles } = await supabase
    .from('articles')
    .select('*')
    .neq('id', article.id)
    .limit(3)

  return (
    <article className="bg-white min-h-screen py-10 md:py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-primary-val transition-colors mb-6"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
          Kembali ke Semua Artikel
        </Link>

        {/* Category & Title */}
        <div className="space-y-3 mb-6">
          <span className="inline-block bg-[#0F2856]/10 text-[#0F2856] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
            {article.category}
          </span>
          <h1
            className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight"
            style={{ fontFamily: 'var(--font-manrope)' }}
          >
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-b border-gray-100 pb-6">
            <span className="flex items-center gap-1.5 font-medium">
              <FontAwesomeIcon icon={faUser} className="text-gray-400" />
              {article.author_name || 'Tim Jakarta Yoga Calendar'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
              {new Date(article.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative w-full h-[320px] md:h-[480px] rounded-2xl overflow-hidden mb-10 shadow-lg bg-gray-100">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="prose max-w-none text-gray-700 text-base md:text-lg leading-relaxed space-y-6">
          {article.content.split('\n\n').map((paragraph: string, idx: number) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-12 p-6 md:p-8 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Tertarik Mengikuti Event Yoga?</h3>
            <p className="text-xs text-gray-500 mt-1">Jelajahi ratusan event yoga dan wellness terbaik di Jakarta.</p>
          </div>
          <Link
            href="/events"
            className="bg-[#0F2856] text-white font-semibold text-xs md:text-sm px-6 py-3 rounded-xl hover:bg-opacity-90 transition-all shadow-md whitespace-nowrap"
          >
            Lihat Semua Event
          </Link>
        </div>

        {/* Related Articles */}
        {relatedArticles && relatedArticles.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Artikel Lainnya</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all bg-white"
                >
                  <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={rel.image_url}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-val">
                      {rel.category}
                    </span>
                    <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mt-1 group-hover:text-primary-val transition-colors">
                      {rel.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
