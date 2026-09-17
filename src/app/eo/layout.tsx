import type { Metadata } from 'next'
import { Manrope, Playfair_Display } from 'next/font/google'
import '../(public)/globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Portal EO — Jakarta Yoga Calendar',
  description: 'Portal manajemen Event Organizer Jakarta Yoga Calendar.',
}

export default function EoLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      className={`${manrope.variable} ${playfair.variable}`}
    >
      {/* Ensure body uses only stable CSS classes; Tailwind utilities removed to avoid hydration mismatch */}
      <body className="font-sans antialiased bg-white text-primary">
        {children}
      </body>
    </html>
  )
}
