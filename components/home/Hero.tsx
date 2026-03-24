'use client'

import { useRouter } from 'next/navigation'
import SearchBar from '@/components/layout/SearchBar'

const HINTS = ['Google', 'Software Engineer', 'California', 'Amazon', 'Data Scientist']

const QUICK_NATIONS = [
  { key: 'south_korea', flag: '🇰🇷', name: 'Korea' },
  { key: 'india',       flag: '🇮🇳', name: 'India' },
  { key: 'china',       flag: '🇨🇳', name: 'China' },
  { key: 'japan',       flag: '🇯🇵', name: 'Japan' },
  { key: 'vietnam',     flag: '🇻🇳', name: 'Vietnam' },
  { key: 'canada',      flag: '🇨🇦', name: 'Canada' },
]

export default function Hero() {
  const router = useRouter()

  return (
    <section style={{ textAlign: 'center', padding: '44px 0 36px' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: '#E6F1FB', color: '#185FA5',
        fontSize: 11, fontWeight: 500,
        padding: '4px 10px', borderRadius: 20, marginBottom: 16,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#185FA5', opacity: .55, display: 'inline-block' }} />
        FY2025 data · 94,623 companies
      </div>

      <h1 style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.3, letterSpacing: '-.4px', marginBottom: 10 }}>
        H1B &amp; green card data<br />for <em style={{ fontStyle: 'normal', color: '#185FA5' }}>every</em> US employer
      </h1>

      <p style={{ fontSize: 13, color: '#6b7280', maxWidth: 420, margin: '0 auto 24px', lineHeight: 1.65 }}>
        Cross-referencing DOL filings, PERM sponsorship records, and salary benchmarks — in one place.
      </p>

      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <SearchBar large />
      </div>

      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
        {HINTS.map(hint => (
          <span key={hint} style={{
            fontSize: 11, color: '#6b7280',
            background: '#f9fafb', border: '0.5px solid #e5e7eb',
            padding: '3px 9px', borderRadius: 12, cursor: 'pointer',
          }}>
            {hint}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 500, margin: '20px auto 0' }}>
        <div style={{ flex: 1, height: '0.5px', background: '#e5e7eb' }} />
        <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>or find by nationality</span>
        <div style={{ flex: 1, height: '0.5px', background: '#e5e7eb' }} />
      </div>

      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
        {QUICK_NATIONS.map(n => (
          <button
            key={n.key}
            onClick={() => router.push(`/by-nationality?nation=${n.key}`)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 11px', borderRadius: 8, cursor: 'pointer',
              fontSize: 11.5, border: '0.5px solid #e5e7eb',
              background: '#fff', color: '#374151',
            }}
          >
            <span style={{ fontSize: 15 }}>{n.flag}</span>
            {n.name}
          </button>
        ))}
        <button
          onClick={() => router.push('/by-nationality')}
          style={{
            padding: '5px 11px', borderRadius: 8, cursor: 'pointer',
            fontSize: 11.5, color: '#185FA5', fontWeight: 500,
            border: '0.5px solid #B5D4F4', background: '#E6F1FB',
          }}
        >
          All countries →
        </button>
      </div>
    </section>
  )
}