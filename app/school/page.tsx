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
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)

  // 검색 결과 로드
  useEffect(() => {
    setInput(query)
    if (!query || query.length < 2) { setResults([]); return }
    setLoading(true)
    searchSchools(query).then(data => {
      setResults(data)
      setLoading(false)
    })
  }, [query])

  // 자동완성 드롭다운
  useEffect(() => {
    if (input.length < 2) { setSuggestions([]); setShowSuggestions(false); return }
    const timer = setTimeout(async () => {
      const res = await searchSchools(input)
      setSuggestions(res.map((s: any) => s.university_std).slice(0, 8))
      setShowSuggestions(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [input])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed.length < 2) return
    setShowSuggestions(false)
    router.push(`/school?q=${encodeURIComponent(trimmed)}`)
  }

  function toTitle(s: string) {
    return s.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const POPULAR = [
    'Carnegie Mellon',
    'University of Southern California',
    'New York University',
    'Purdue University',
    'Northeastern University',
    'Arizona State University',
    'Columbia University',
    'Georgia Institute of Technology',
  ]

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <a href="/" style={{ color: '#9ca3af' }}>Home</a>
          <span>›</span>
          <span style={{ color: '#6b7280' }}>School pipeline</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>Where do graduates get hired?</h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Real employment outcomes based on U.S. green card (PERM) filing data FY2021-2024.</p>
      </div>

      <div style={{ padding: '12px 14px', background: '#E6F1FB', border: '0.5px solid #B5D4F4', borderRadius: 8, marginBottom: 20, fontSize: 12, color: '#1e3a5f', lineHeight: 1.6 }}>
        Data is extracted from PERM green card filings submitted to the U.S. Department of Labor, where employers listed the foreign worker's institution of education. FY2021-2024 certified cases only.
      </div>

      {/* 검색창 */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: 520 }}>
          <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}
            width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={input}
            onChange={e => { setInput(e.target.value); setShowSuggestions(true) }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="Type your university name..."
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

          {/* 자동완성 드롭다운 */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute', zIndex: 50, top: '100%', marginTop: 4,
              width: '100%', background: '#fff',
              border: '0.5px solid #e5e7eb', borderRadius: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,.08)', overflow: 'hidden',
            }}>
              {suggestions.map((s, i) => (
                <button key={i} onMouseDown={() => {
                  setInput(s)
                  setShowSuggestions(false)
                  router.push(`/school?q=${encodeURIComponent(s)}`)
                }} style={{
                  width: '100%', display: 'block', padding: '9px 14px',
                  fontSize: 12.5, textAlign: 'left',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  borderBottom: i < suggestions.length - 1 ? '0.5px solid #f3f4f6' : 'none',
                  color: '#1a1a1a',
                }}>
                  {toTitle(s)}
                </button>
              ))}
            </div>
          )}
        </div>
      </form>

      {/* 인기 검색 */}
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
                    <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 2 }}>{toTitle(s.university_std)}</div>
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