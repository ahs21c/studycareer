'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { searchCompanies } from '@/lib/supabase/queries'
import { formatNumber, formatSalary } from '@/lib/utils'
import SearchBar from '@/components/layout/SearchBar'

const SECTOR_LABELS: Record<string, string> = {
  IT_SERVICES: 'IT Services',
  ACCOUNTING: 'Accounting',
  RETAIL: 'E-Commerce',
  INTERNET_PLATFORMS: 'Internet & Software',
  CONSULTING: 'Consulting',
  SEMICONDUCTOR_MFG: 'Semiconductor',
  HOLDING_COMPANIES: 'Holdings',
  AI_DIGITAL_PLATFORMS: 'AI & Digital',
  COMPUTER_ELECTRONICS_MFG: 'Electronics Mfg',
  CLOUD_DATA: 'Cloud & Data',
  IT_SOFTWARE: 'IT & Software',
}

const TREND_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  INCREASING: { bg: '#dcfce7', text: '#166534', label: '↑' },
  STABLE:     { bg: '#dbeafe', text: '#1e40af', label: '→' },
  DECREASING: { bg: '#fee2e2', text: '#991b1b', label: '↓' },
  NEW:        { bg: '#f3e8ff', text: '#6b21a8', label: '✦' },
}

function toTitle(s: string) {
  return s.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') ?? ''
  const [results, setResults] = useState<any[]>([])
  const [input, setInput] = useState(query)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setInput(query)
    if (!query || query.length < 2) { setResults([]); return }
    setLoading(true)
    searchCompanies(query, 20).then(data => {
      setResults(data)
      setLoading(false)
    })
  }, [query])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input.trim().length >= 2) router.push(`/search?q=${encodeURIComponent(input.trim())}`)
  }

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>Company search</h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Search 93,955 companies by H1B filings and green card sponsorship.</p>
      </div>

      <div style={{ marginBottom: 24, maxWidth: 520 }}>
        <SearchBar large placeholder="Search any company..." />
      </div>

      {loading && <div style={{ fontSize: 13, color: '#9ca3af' }}>Searching...</div>}

      {!loading && query && results.length === 0 && (
        <div style={{ fontSize: 13, color: '#6b7280' }}>
          No results found for <strong>"{query}"</strong>.
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
            {results.length} result{results.length !== 1 ? 's' : ''} for <strong style={{ color: '#1a1a1a' }}>"{query}"</strong>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {results.map((c: any) => {
              const t = TREND_STYLE[c.lca_trend] ?? TREND_STYLE.STABLE
              return (
                <Link key={c.slug} href={`/company/${c.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: '0.5px solid #e5e7eb', borderRadius: 9 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 500 }}>{toTitle(c.employer_name)}</span>
                        {c.has_perm && (
                          <span style={{ fontSize: 9.5, background: '#EAF3DE', color: '#3B6D11', padding: '2px 6px', borderRadius: 4, fontWeight: 500 }}>GC</span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>
                        {formatNumber(c.lca_total_2yr)} filings
                      </div>
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 500, background: t.bg, color: t.text, padding: '3px 7px', borderRadius: 4 }}>
                      {t.label}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      )}

      {!query && (
        <div style={{ fontSize: 13, color: '#9ca3af' }}>Enter a company name to search.</div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ fontSize: 13, color: '#9ca3af' }}>Loading...</div>}>
      <SearchResults />
    </Suspense>
  )
}