import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ArticleManagement from '@/components/admin/ArticleManagement'

export const metadata: Metadata = {
  title: 'Kelola Artikel — Portal Admin',
}

export default async function AdminArticlesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  const formattedArticles = (articles || []).map((art) => ({
    id: art.id,
    title: art.title,
    slug: art.slug,
    category: art.category,
    content: art.content,
    image_url: art.image_url,
    created_at: art.created_at,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-semibold text-text"
          style={{ fontFamily: 'var(--font-manrope)' }}
        >
          Kelola Artikel (Bacaan Seru)
        </h1>
        <p className="text-text-muted text-sm mt-1">
          Tambah, edit, dan hapus artikel berita atau tips yang akan ditampilkan di website publik.
        </p>
      </div>

      <ArticleManagement initialArticles={formattedArticles} />
    </div>
  )
}
