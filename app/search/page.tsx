'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { COMPANIES } from '@/lib/data/companies'
import { formatNumber, formatSalary, trendColor, trendLabel } from '@/lib/utils'
import { SECTOR_LABELS } from '@/lib/constants'

function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') ?? ''
  const [results, setResults] = useState<typeof import('@/lib/data/companies').TOP_COMPANIES>([])
  const [input, setInput] = useState(query)

  useEffect(() => {
    setInput(query)
    if (!query || query.length < 2) { setResults([]); return }
    const q = query.toLowerCase()
    const matches = Object.values(COMPANIES)
      .filter(c => c.employer_name.toLowerCase().includes(q))
      .sort((a, b) => b.lca_total_2yr - a.lca_total_2yr)
      .slice(0, 20)
    setResults(matches)
  }, [query])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input.trim().length >= 2) router.push(`/search?q=${encodeURIComponent(input.trim())}`)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative max-w-[520px]">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Search any company..."
            className="w-full px-4 py-3 pr-24 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#185FA5]"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#185FA5] text-white px-4 py-1.5 rounded-lg text-sm font-medium"
          >
            Search
          </button>
        </div>
      </form>

      {query && results.length === 0 && (
        <div className="text-sm text-gray-500">
          No results found for <span className="font-medium text-gray-800">"{query}"</span>.
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="text-sm text-gray-500 mb-4">
            {results.length} result{results.length !== 1 ? 's' : ''} for{' '}
            <span className="font-medium text-gray-800">"{query}"</span>
          </div>
          <div className="space-y-2">
            {results.map(c => (
              <Link
                key={c.slug}
                href={`/company/${c.slug}`}
                className="flex items-center justify-between p-3.5 px-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium">{c.employer_name}</span>
                    {c.has_perm && (
                      <span className="text-[10px] bg-[#EAF3DE] text-[#3B6D11] px-2 py-0.5 rounded-md font-medium">
                        Green card
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {SECTOR_LABELS[c.sector] ?? c.sector} · {formatNumber(c.lca_total_2yr)} filings · {formatSalary(c.avg_salary_fy2025)} avg
                  </div>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${trendColor(c.lca_trend)}`}>
                  {trendLabel(c.lca_trend)}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}

      {!query && (
        <div className="text-sm text-gray-400">Enter a company name to search.</div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-400">Loading...</div>}>
      <SearchResults />
    </Suspense>
  )
}
