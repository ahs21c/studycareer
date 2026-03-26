import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: { default: 'StudyCareer | H1B & Green Card Data', template: '%s | StudyCareer' },
  description: 'Search 94,000+ US companies by H1B filings, PERM green card sponsorship, and salary data. Built for international students on OPT.',
  keywords: ['H1B visa', 'green card', 'PERM sponsorship', 'US work visa', 'OPT employer', 'international student jobs', 'H1B sponsor companies'],
  openGraph: {
    title: 'StudyCareer | H1B & Green Card Data',
    description: 'Search 94,000+ US companies by H1B filings, PERM green card sponsorship, and salary data.',
    url: 'https://studycareer-e5xr.vercel.app',
    siteName: 'StudyCareer',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StudyCareer | H1B & Green Card Data',
    description: 'Search 94,000+ US companies by H1B filings, PERM green card sponsorship, and salary data.',
  },
  robots: { index: true, follow: true },
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