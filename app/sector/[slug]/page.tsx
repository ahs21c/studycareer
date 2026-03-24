import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { COMPANIES } from '@/lib/data/companies'
import { SECTOR_LABELS } from '@/lib/constants'
import { formatNumber, formatSalary, trendColor, trendLabel } from '@/lib/utils'

export const revalidate = 604800

interface Props { params: Promise<{ slug: string }> }

function sectorFromSlug(slug: string) {
  return slug.toUpperCase().replace(/-/g, '_')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const sector = sectorFromSlug(slug)
  const label = SECTOR_LABELS[sector]
  if (!label) return { title: 'Sector not found' }
  return {
    title: `${label} — H1B & Green Card Sponsors`,
    description: `Top companies sponsoring H1B visas and green cards in the ${label} sector.`,
  }
}

export default async function SectorPage({ params }: Props) {
  const { slug } = await params
  const sector = sectorFromSlug(slug)
  const label = SECTOR_LABELS[sector]
  if (!label) notFound()

  // When Supabase is connected, replace with: getSectorCompanies(sector, 50)
  const companies = Object.values(COMPANIES)
    .filter(c => c.sector === sector)
    .sort((a, b) => b.lca_total_2yr - a.lca_total_2yr)

  return (
    <div>
      <div className="mb-6">
        <div className="text-xs text-[#185FA5] font-medium mb-1">Sector</div>
        <h1 className="text-xl font-semibold mb-1">{label}</h1>
        <p className="text-sm text-gray-500">
          {companies.length} companies · ranked by H1B filings FY2024–2025
        </p>
      </div>

      {companies.length === 0 ? (
        <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
          No companies found in this sector yet. Data expands with Supabase connection.
        </p>
      ) : (
        <div className="space-y-2">
          {companies.map((c, i) => (
            <Link
              key={c.slug}
              href={`/company/${c.slug}`}
              className="flex items-center gap-3 p-3.5 px-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <span className="text-sm text-gray-400 w-6 shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium truncate">{c.employer_name}</span>
                  {c.has_perm && (
                    <span className="text-[10px] bg-[#EAF3DE] text-[#3B6D11] px-2 py-0.5 rounded-md font-medium shrink-0">
                      Green card
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">{c.state}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-medium">{formatNumber(c.lca_total_2yr)}</div>
                <div className="text-xs text-gray-400">{formatSalary(c.avg_salary_fy2025)}</div>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-md font-medium shrink-0 ${trendColor(c.lca_trend)}`}>
                {trendLabel(c.lca_trend)}
              </span>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Link href="/rankings/top-100" className="text-xs text-[#185FA5] hover:underline">
          ← View all companies
        </Link>
      </div>
    </div>
  )
}
