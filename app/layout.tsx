import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: { default: 'StudyCareer — H1B & Green Card Data', template: '%s | StudyCareer' },
  description: 'Cross-referencing 94,000+ US companies — H1B filings, PERM green card sponsorship, and salary data in one place.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 8px' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
