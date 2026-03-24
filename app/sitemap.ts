import { MetadataRoute } from 'next'
import { TOP_COMPANIES, COMPANIES } from '@/lib/data/companies'
import { SECTOR_LABELS } from '@/lib/constants'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://studycareer.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${BASE}/rankings/top-100`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${BASE}/rankings/by-state`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE}/rankings/by-industry`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE}/cap-exempt`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${BASE}/calculator/real-income`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${BASE}/calculator/lottery`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${BASE}/calculator/visa-check`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${BASE}/blog`, priority: 0.7, changeFrequency: 'weekly' as const },
    { url: `${BASE}/about`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${BASE}/methodology`, priority: 0.5, changeFrequency: 'monthly' as const },
  ]

  const companyPages = Object.values(COMPANIES).map(c => ({
    url: `${BASE}/company/${c.slug}`,
    priority: 0.7,
    changeFrequency: 'weekly' as const,
  }))

  const sectorPages = Object.keys(SECTOR_LABELS).map(s => ({
    url: `${BASE}/sector/${s.toLowerCase().replace(/_/g, '-')}`,
    priority: 0.6,
    changeFrequency: 'weekly' as const,
  }))

  return [...staticPages, ...companyPages, ...sectorPages]
}
