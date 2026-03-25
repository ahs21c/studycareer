import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSectorCompanies } from '@/lib/supabase/queries'
import { formatNumber, formatSalary } from '@/lib/utils'

export const revalidate = 604800

interface Props { params: Promise<{ slug: string }> }

const SECTOR_LABELS: Record<string, string> = {
  IT_SERVICES: 'IT Services',
  ENGINEERING_SERVICES: 'Engineering Services',
  UNIVERSITIES: 'Universities',
  CONSULTING: 'Management Consulting',
  INVESTMENT_SECURITIES: 'Investment & Securities',
  HOSPITALS: 'Hospitals',
  SCIENTIFIC_RD: 'Scientific R&D',
  INDUSTRIAL_MFG: 'Industrial Manufacturing',
  K12_SCHOOLS: 'K-12 Schools',
  WHOLESALE: 'Wholesale',
  ACCOUNTING: 'Accounting & Audit',
  BANKING: 'Banking',
  INTERNET_PLATFORMS: 'Internet & Software',
  SEMICONDUCTOR_MFG: 'Semiconductor Mfg',
  HEALTHCARE: 'Healthcare',
  CLOUD_DATA: 'Cloud & Data',
  AI_DIGITAL_PLATFORMS: 'AI & Digital Platforms',
  RETAIL: 'E-Commerce & Retail',
  ADMIN_SUPPORT: 'Administrative Support',
  CONSTRUCTION: 'Construction',
  ADVERTISING_PR: 'Advertising & PR',
  AEROSPACE_MFG: 'Aerospace Mfg',
  AUTOMOTIVE_MFG: 'Automotive Mfg',
  CHEMICAL_MFG: 'Chemical Mfg',
  COMPUTER_ELECTRONICS_MFG: 'Computer & Electronics',
  DIGITAL_CONTENT: 'Digital Content',
  ECOMMERCE: 'E-Commerce',
  ENERGY_MINING: 'Energy & Mining',
  FOOD_BEVERAGE: 'Food & Beverage',
  GOVERNMENT: 'Government',
  INSURANCE: 'Insurance',
  LEGAL: 'Legal Services',
  LOGISTICS: 'Logistics & Supply Chain',
  MEDIA: 'Media & Publishing',
  MEDICAL_DEVICES: 'Medical Devices',
  PHARMA_BIOTECH: 'Pharma & Biotech',
  REAL_ESTATE: 'Real Estate',
  TELECOM: 'Telecom',
}

function toLabel(sector: string) {
  return SECTOR_LABELS[sector] ?? sector.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function toTitle(s: string) {
  return s.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

const TREND_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  INCREASING: { bg: '#dcfce7', text: '#166534', label: '↑' },
  STABLE:     { bg: '#dbeafe', text: '#1e40af', label: '→' },
  DECREASING: { bg: '#fee2e2', text: '#991b1b', label: '↓' },
  NEW:        { bg: '#f3e8ff', text: '#6b21a8', label: '✦' },
  STOPPED:    { bg: '#f3f4f6', text: '#6b7280', label: '—' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const sector = slug.toUpperCase().replace(/-/g, '_')
  const label = toLabel(sector)
  return {
    title: `${label} — H1B Visa Sponsors`,
    description: `Top companies sponsoring H1B visas in the ${label} sector. FY2024-2025 data.`,
  }
}

export default async function SectorPage({ params }: Props) {
  const { slug } = await params
  const sector = slug.toUpperCase().replace(/-/g, '_')
  const label = toLabel(sector)

  const companies = await getSectorCompanies(sector)
  if (companies.length === 0) notFound()

  const totalFilings = companies.reduce((s, c) => s + c.lca_total_2yr, 0)
  const salaries = companies.filter(c => c.avg_salary_fy2025).map(c => c.avg_salary_fy2025!)
  const avgSalary = salaries.length > 0 ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) : null

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <a href="/" style={{ color: '#9ca3af' }}>Home</a>
          <span>›</span>
          <a href="/sector" style={{ color: '#9ca3af' }}>Sectors</a>
          <span>›</span>
          <span style={{ color: '#1a1a1a' }}>{label}</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>{label}</h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          Top {companies.length} companies · {formatNumber(totalFilings)} total filings · {formatSalary(avgSalary)} avg salary
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 80px 90px 36px', gap: 12, padding: '0 12px 8px', fontSize: 10.5, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>
        <span>#</span>
        <span>Company</span>
        <span style={{ textAlign: 'right' }}>Filings</span>
        <span style={{ textAlign: 'right' }}>Avg salary</span>
        <span />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {companies.map((c, i) => {
          const t = TREND_STYLE[c.lca_trend ?? ''] ?? TREND_STYLE.STABLE
          const slug = c.employer_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
          return (
            <Link key={i} href={`/company/${slug}`} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 80px 90px 36px', gap: 12, padding: '10px 12px', border: '0.5px solid #e5e7eb', borderRadius: 9, alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{i + 1}</span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 2 }}>{toTitle(c.employer_name)}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{c.top_worksite_state}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{formatNumber(c.lca_total_2yr)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12.5, color: '#6b7280' }}>{formatSalary(c.avg_salary_fy2025)}</div>
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