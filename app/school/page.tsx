'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { searchSchools } from '@/lib/supabase/queries'
import { formatNumber, formatSalary } from '@/lib/utils'

function SchoolSearch() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') ?? ''
  const [input, setInput] = useState(query)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setInput(query)
    if (!query || query.length < 2) { setResults([]); return }
    setLoading(true)
    searchSchools(query).then(data => {
      setResults(data)
      setLoading(false)
    })
  }, [query])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input.trim().length >= 2) router.push(`/school?q=${encodeURIComponent(input.trim())}`)
  }

  const POPULAR = [
    'University of Illinois',
    'Carnegie Mellon',
    'University of Southern California',
    'New York University',
    'Purdue University',
    'University of Texas',
    'Columbia University',
    'Georgia Tech',
  ]

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <a href="/" style={{ color: '#9ca3af' }}>Home</a>
          <span>›</span>
          <span style={{ color: '#6b7280' }}>School pipeline</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>School → Company pipeline</h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Where do graduates get hired? Real employment outcomes based on PERM data FY2021–2024.</p>
      </div>

      <div style={{ padding: '12px 14px', background: '#E6F1FB', border: '0.5px solid #B5D4F4', borderRadius: 8, marginBottom: 20, fontSize: 12, color: '#1e3a5f', lineHeight: 1.6 }}>
        Data extracted from PERM green card filings submitted to the U.S. Department of Labor, where employers listed the foreign worker's institution of education. FY2021–2024 cases only.
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: 520 }}>
          <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}
            width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Search your university..."
            style={{
              width: '100%', padding: '10px 110px 10px 36px',
              border: '0.5px solid #d1d5db', borderRadius: 10,
              fontSize: 13, outline: 'none', color: '#1a1a1a',
            }}
          />
          <button type="submit" style={{
            position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)',
            background: '#185FA5', color: '#fff', border: 'none',
            borderRadius: 7, padding: '7px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
          }}>
            Search
          </button>
        </div>
      </form>

      {!query && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>
            Popular searches
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {POPULAR.map(name => (
              <button key={name} onClick={() => router.push(`/school?q=${encodeURIComponent(name)}`)} style={{
                fontSize: 12, background: '#f3f4f6', color: '#6b7280',
                padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
              }}>
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && <div style={{ fontSize: 13, color: '#9ca3af' }}>Searching...</div>}

      {!loading && query && results.length === 0 && (
        <div style={{ fontSize: 13, color: '#6b7280' }}>
          No results for <strong>"{query}"</strong>. Try a different spelling.
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
            {results.length} result{results.length !== 1 ? 's' : ''} for <strong style={{ color: '#1a1a1a' }}>"{query}"</strong>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {results.map((s) => (
              <Link key={s.slug} href={`/school/${s.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: '0.5px solid #e5e7eb', borderRadius: 9 }}>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 2 }}>{s.university_std}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>Avg PERM wage: {formatSalary(s.avg_wage)}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500 }}>{formatNumber(s.perm_total)}</div>
                    <div style={{ fontSize: 10.5, color: '#9ca3af' }}>PERM cases</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function SchoolPage() {
  return (
    <Suspense fallback={<div style={{ fontSize: 13, color: '#9ca3af' }}>Loading...</div>}>
      <SchoolSearch />
    </Suspense>
  )
}