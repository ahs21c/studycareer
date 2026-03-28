'use client'

import SearchBar from '@/components/layout/SearchBar'

const HINTS = ['Google', 'Software Engineer', 'California', 'Amazon', 'Data Scientist']

export default function Hero() {
  return (
    <section style={{ textAlign: 'center', padding: '44px 0 36px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.3, letterSpacing: '-.4px', marginBottom: 10 }}>
        Study. Career. Life. — All connected.<br />
        <span style={{ fontSize: 16, color: '#3B6D11' }}>Universities, Working Visas, Green Cards - in one place </span>
      </h1>

      
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
    </section>
  )
}