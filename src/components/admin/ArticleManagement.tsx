'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, BookOpen, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { createArticleAction, updateArticleAction, deleteArticleAction } from '@/app/admin/actions'

export interface Article {
  id: string
  title: string
  slug: string
  category: string
  content: string
  image_url: string
  created_at: string
}

interface ArticleManagementProps {
  initialArticles: Article[]
}

export default function ArticleManagement({ initialArticles }: ArticleManagementProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Konser',
    content: '',
    image_url: '',
  })
  
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const openCreateModal = () => {
    setEditingArticle(null)
    setFormData({
      title: '',
      category: 'Konser',
      content: '',
      image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80',
    })
    setErrorMsg('')
    setIsModalOpen(true)
  }

  const openEditModal = (article: Article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      category: article.category,
      content: article.content,
      image_url: article.image_url,
    })
    setErrorMsg('')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    if (editingArticle) {
      const res = await updateArticleAction(editingArticle.id, formData)
      if (res.success) {
        setArticles((prev) =>
          prev.map((a) =>
            a.id === editingArticle.id
              ? { ...a, ...formData }
              : a
          )
        )
        setIsModalOpen(false)
      } else {
        setErrorMsg(res.error || 'Gagal mengubah artikel')
      }
    } else {
      const res = await createArticleAction(formData)
      if (res.success) {
        setIsModalOpen(false)
        window.location.reload()
      } else {
        setErrorMsg(res.error || 'Gagal membuat artikel')
      }
    }
    setLoading(false)
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) return

    const res = await deleteArticleAction(id)
    if (res.success) {
      setArticles((prev) => prev.filter((a) => a.id !== id))
    } else {
      alert(res.error || 'Gagal menghapus artikel')
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-val" />
            Daftar Artikel & Bacaan Seru ({articles.length})
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Artikel ini ditampilkan langsung pada section "Bacaan Seru!" di Homepage Publik.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 bg-[#0F2856] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-opacity-90 transition-all shadow-sm"
        >
          <Plus size={16} />
          Tambah Artikel Baru
        </button>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow"
          >
            <div>
              <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-gray-800 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/50">
                  {article.category}
                </span>
              </div>
              <div className="p-5">
                <p className="text-[11px] text-gray-400 font-medium mb-1.5">
                  {new Date(article.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 mb-2">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {article.content}
                </p>
              </div>
            </div>

            {/* Card Actions Footer */}
            <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-2">
              <span className="text-[11px] text-gray-400 truncate font-mono">
                /{article.slug}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(article)}
                  className="p-2 text-gray-600 hover:text-primary-val hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                  title="Edit Artikel"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(article.id, article.title)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                  title="Hapus Artikel"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Belum ada artikel</p>
          <p className="text-xs text-gray-400 mt-1">Klik tombol "+ Tambah Artikel Baru" untuk membuat artikel pertama Anda.</p>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
              {editingArticle ? 'Edit Artikel' : 'Tambah Artikel Baru'}
            </h3>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Judul Artikel
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: 5 Event Yoga Terbaik..."
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F2856]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F2856]"
                >
                  <option value="Yoga">Yoga</option>
                  <option value="Konser">Konser</option>
                  <option value="Tips">Tips</option>
                  <option value="Festival">Festival</option>
                  <option value="Wellness">Wellness</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  URL Gambar (Unsplash / Storage)
                </label>
                <input
                  type="url"
                  required
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F2856]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Isi / Konten Artikel
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tulis rangkuman atau isi lengkap artikel di sini..."
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F2856]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#0F2856] rounded-xl hover:bg-opacity-90 transition-all shadow-sm"
                >
                  {loading ? 'Menyimpan...' : editingArticle ? 'Update Artikel' : 'Simpan Artikel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
