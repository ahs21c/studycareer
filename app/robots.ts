import { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://studycareer-e5xr.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/login', '/bookmarks', '/api/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}