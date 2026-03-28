'use client'

import SearchBar from '@/components/layout/SearchBar'


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

    </section>
  )
}