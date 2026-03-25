import type { Metadata } from 'next'
import Link from 'next/link'
import { getSectors } from '@/lib/supabase/queries'
import { formatNumber, formatSalary } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'H1B by Industry Sector',
  description: 'Compare H1B visa activity and salaries across 60 industry sectors.',
}
export const revalidate = 604800

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

function toSlug(sector: string) {
  return sector.toLowerCase()
}

export default async function SectorsPage() {
  const sectors = await getSectors()
  const maxTotal = sectors[0]?.lca_total ?? 1

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <a href="/" style={{ color: '#9ca3af' }}>Home</a>
          <span>›</span>
          <span style={{ color: '#6b7280' }}>Sectors</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>H1B by industry sector</h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>{sectors.length} sectors · FY2024-2025 LCA filings</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 100px 90px 20px', gap: 12, padding: '0 12px 8px', fontSize: 10.5, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>
       <span>#</span>
       <span>Sector</span>
       <span style={{ textAlign: 'right' }}>H1B filings</span>
       <span style={{ textAlign: 'right' }}>Avg salary</span>
       <span />
     </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {sectors.map((s, i) => (
        <Link key={s.sector} href={`/sector/${toSlug(s.sector)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ padding: '10px 12px', border: '0.5px solid #e5e7eb', borderRadius: 9 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 100px 90px 20px', gap: 12, alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: '#9ca3af' }}>{i + 1}</span>
      <div>
        <span style={{ fontSize: 12.5, fontWeight: 500 }}>{toLabel(s.sector)}</span>
        <span style={{ fontSize: 10.5, color: '#9ca3af', marginLeft: 8 }}>View companies →</span>
      </div>
        <span style={{ fontSize: 12.5, fontWeight: 500, textAlign: 'right' }}>{formatNumber(s.lca_total)}</span>
        <span style={{ fontSize: 12.5, textAlign: 'right', color: '#6b7280' }}>{formatSalary(s.avg_salary)}</span>
        <span style={{ fontSize: 12, color: '#9ca3af', textAlign: 'right' }}>›</span>
      </div>
              <div style={{ marginLeft: 40 }}>
                <div style={{ height: 4, background: '#f3f4f6', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#185FA5', borderRadius: 2, width: `${Math.round((s.lca_total / maxTotal) * 100)}%` }} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}