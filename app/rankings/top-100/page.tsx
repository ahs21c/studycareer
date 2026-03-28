import type { Metadata } from 'next'
import Link from 'next/link'
import { getTopCompanies } from '@/lib/supabase/queries'
import { formatNumber, formatSalary } from '@/lib/utils'
import SearchBar from '@/components/layout/SearchBar'

export const metadata: Metadata = {
  title: 'Top 100 H1B Sponsor Companies | FY2024-2025',
  description: 'Top 100 US companies ranked by H1B visa filings. See LCA filing counts, average salaries, and green card sponsorship status for the biggest H1B employers.',
  keywords: ['top H1B sponsors', 'H1B companies list', 'best companies for H1B', 'H1B sponsor ranking', 'OPT employer list'],
  openGraph: {
    title: 'Top 100 H1B Sponsor Companies | StudyCareer',
    description: 'Top 100 US companies ranked by H1B visa filings, salaries, and green card sponsorship.',
  },
}

export const revalidate = 604800

const TREND_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  INCREASING: { bg: '#dcfce7', text: '#166534', label: '↑' },
  STABLE:     { bg: '#dbeafe', text: '#1e40af', label: '→' },
  DECREASING: { bg: '#fee2e2', text: '#991b1b', label: '↓' },
  NEW:        { bg: '#f3e8ff', text: '#6b21a8', label: '✦' },
  STOPPED:    { bg: '#f3f4f6', text: '#6b7280', label: '—' },
}

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
}

function toTitle(s: string) {
  return s.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

export default async function Top100Page() {
  const companies = await getTopCompanies(100)

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <Link href="/" style={{ color: '#9ca3af' }}>Home</Link>
          <span>›</span>
          <span style={{ color: '#6b7280' }}>Top H1B sponsors</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>Top H1B sponsors</h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>Ranked by total LCA filings · FY2024-2025 · {companies.length} companies</p>
        <SearchBar placeholder="Search 94,623 companies..." />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 80px 80px 40px', gap: 12, padding: '0 12px 8px', fontSize: 10.5, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>
        <span>#</span>
        <span>Company</span>
        <span style={{ textAlign: 'right' }}>Filings</span>
        <span style={{ textAlign: 'right' }}>Avg salary</span>
        <span />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {companies.map((c, i) => {
          const t = TREND_STYLE[c.lca_trend] ?? TREND_STYLE.STABLE
          return (
            <Link key={c.slug} href={`/company/${c.slug}`} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 80px 80px 40px', gap: 12, padding: '10px 12px', border: '0.5px solid #e5e7eb', borderRadius: 9, alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{i + 1}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {toTitle(c.employer_name)}
                  </span>
                  {c.has_perm && (
                    <span style={{ fontSize: 9.5, background: '#EAF3DE', color: '#3B6D11', padding: '2px 6px', borderRadius: 4, fontWeight: 500, flexShrink: 0 }}>GC</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>
                  {SECTOR_LABELS[c.sector] ?? c.sector} · {c.employer_state}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{formatNumber(c.lca_total_2yr)}</div>
                <div style={{ fontSize: 10.5, color: '#9ca3af' }}>filings</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{formatSalary(c.avg_salary_fy2025)}</div>
                <div style={{ fontSize: 10.5, color: '#9ca3af' }}>avg</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 11, fontWeight: 500, background: t.bg, color: t.text, padding: '3px 6px', borderRadius: 4 }}>
                  {t.label}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}