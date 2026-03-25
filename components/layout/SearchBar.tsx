'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { searchCompanies } from '@/lib/supabase/queries'

interface SearchBarProps {
  large?: boolean
  placeholder?: string
}

export default function SearchBar({ large = false, placeholder }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Array<{ slug: string; employer_name: string; lca_total_2yr: number; has_perm: boolean }>>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const ph = placeholder ?? (large ? 'Search companies, job titles, or states...' : 'Search companies...')

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (query.length < 2) { setResults([]); setIsOpen(false); return }
    const timer = setTimeout(async () => {
      const matches = await searchCompanies(query, 8)
      setResults(matches)
      setIsOpen(matches.length > 0)
      setSelectedIndex(-1)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  function navigate(slug: string) {
    setIsOpen(false); setQuery(''); router.push(`/company/${slug}`)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter' && selectedIndex >= 0) navigate(results[selectedIndex].slug)
    else if (e.key === 'Escape') setIsOpen(false)
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <svg style={{ position: 'absolute', left: large ? 12 : 9, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}
          width={large ? 14 : 12} height={large ? 14 : 12}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={ph}
          style={{
            width: '100%',
            border: '0.5px solid #d1d5db',
            borderRadius: large ? 10 : 7,
            outline: 'none',
            fontSize: large ? 13 : 12,
            padding: large ? '10px 100px 10px 36px' : '6px 80px 6px 28px',
            color: '#1a1a1a',
            background: '#fff',
          }}
        />
        <button
          onClick={() => { if (results.length > 0) navigate(results[0].slug) }}
          style={{
            position: 'absolute', right: large ? 4 : 3, top: '50%', transform: 'translateY(-50%)',
            background: '#185FA5', color: '#fff', border: 'none',
            borderRadius: large ? 7 : 5,
            padding: large ? '7px 14px' : '4px 10px',
            fontSize: large ? 12 : 11, fontWeight: 500, cursor: 'pointer',
          }}
        >
          Search
        </button>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute', zIndex: 50, top: '100%', marginTop: 4,
          width: '100%', background: '#fff',
          border: '0.5px solid #e5e7eb', borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,.08)', overflow: 'hidden',
        }}>
          {results.map((r, i) => (
            <button key={r.slug} onClick={() => navigate(r.slug)} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '9px 12px', fontSize: 12.5,
              background: i === selectedIndex ? '#f9fafb' : 'transparent',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              borderBottom: i < results.length - 1 ? '0.5px solid #f3f4f6' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 500 }}>{r.employer_name}</span>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>{r.lca_total_2yr.toLocaleString()}</span>
              </div>
              {r.has_perm && (
                <span style={{ fontSize: 9.5, background: '#EAF3DE', color: '#3B6D11', padding: '2px 7px', borderRadius: 4, fontWeight: 500 }}>
                  Green card
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}