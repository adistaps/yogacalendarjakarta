'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, QrCode, AlertCircle } from 'lucide-react'

interface QrCodeDisplayProps {
  eventId: string
  eventTitle: string
  publicUrl: string
  savedQrUrl: string | null
  isApproved: boolean
}

export default function QrCodeDisplay({
  eventTitle,
  publicUrl,
  savedQrUrl,
  isApproved,
}: QrCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [qrGenerated, setQrGenerated] = useState(false)

  useEffect(() => {
    if (!isApproved) return

    // Dynamically import qrcode to avoid SSR issues
    import('qrcode').then((QRCode) => {
      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, publicUrl, {
          width: 256,
          margin: 2,
          color: { dark: '#1a1a2e', light: '#ffffff' },
        })
        setQrGenerated(true)
      }
    })
  }, [publicUrl, isApproved])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `qrcode-${eventTitle.replace(/\s+/g, '-').toLowerCase()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  if (!isApproved) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <AlertCircle size={40} className="mx-auto text-amber-400 mb-4" />
        <p className="font-medium text-text mb-2">QR Code Belum Tersedia</p>
        <p className="text-text-muted text-sm">
          QR Code akan dibuat otomatis setelah event disetujui oleh admin.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
      <div className="flex justify-center mb-6">
        {savedQrUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={savedQrUrl}
            alt="QR Code"
            className="w-64 h-64 object-contain"
          />
        ) : (
          <canvas ref={canvasRef} className="rounded-lg" />
        )}
      </div>

      <div className="mb-6">
        <p className="text-xs text-text-muted mb-1">URL Event:</p>
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium hover:underline break-all"
          style={{ color: 'var(--color-primary-val)' }}
        >
          {publicUrl}
        </a>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleDownload}
          disabled={!qrGenerated && !savedQrUrl}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, var(--color-primary-val), var(--color-accent))' }}
        >
          <Download size={16} />
          Download QR Code PNG
        </button>
        {savedQrUrl && (
          <a
            href={savedQrUrl}
            download
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-lg text-sm font-medium text-text hover:bg-gray-50 transition-colors"
          >
            <QrCode size={16} />
            Download Versi Admin
          </a>
        )}
      </div>

      <p className="text-xs text-text-muted mt-4">
        QR Code ini mengarah ke halaman publik event. Aman untuk dibagikan.
      </p>
    </div>
  )
}
