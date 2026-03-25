import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CITIES } from '@/lib/data/cities'
import { formatSalary } from '@/lib/utils'

export const revalidate = 604800

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const city = CITIES.find(c => c.slug === slug)
  if (!city) return { title: 'City not found' }
  return {
    title: `${city.name} — Real Purchasing Power for International Workers`,
    description: `${city.tagline}. After-tax income, cost of living, and savings potential in ${city.name}.`,
  }
}

const GRADE_STYLE: Record<string, { bg: string; text: string }> = {
  'A':  { bg: '#EAF3DE', text: '#3B6D11' },
  'A-': { bg: '#EAF3DE', text: '#3B6D11' },
  'B+': { bg: '#E6F1FB', text: '#185FA5' },
  'B':  { bg: '#FAEEDA', text: '#854F0B' },
  'B-': { bg: '#FAEEDA', text: '#854F0B' },
}

export default async function CityPage({ params }: Props) {
  const { slug } = await params
  const city = CITIES.find(c => c.slug === slug)
  if (!city) notFound()

  const gs = GRADE_STYLE[city.grade] ?? GRADE_STYLE['B']

  return (
    <div>
      {/* Header */}
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <a href="/" style={{ color: '#9ca3af' }}>Home</a>
          <span>›</span>
          <a href="/city" style={{ color: '#9ca3af' }}>Cities</a>
          <span>›</span>
          <span style={{ color: '#1a1a1a' }}>{city.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>{city.name}</h1>
            <p style={{ fontSize: 13, color: '#6b7280' }}>{city.tagline}</p>
          </div>
          <span style={{ fontSize: 12, fontWeight: 500, background: gs.bg, color: gs.text, padding: '4px 12px', borderRadius: 6, flexShrink: 0 }}>
            {city.grade}
          </span>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'State income tax', value: city.state_tax === 0 ? '0% ✓' : `${city.state_tax}%`, sub: city.state_tax === 0 ? 'No state tax!' : 'State tax applies', highlight: city.state_tax === 0 },
          { label: 'Rent (1BR)', value: `$${city.rent_1br.toLocaleString()}`, sub: 'Monthly average' },
          { label: 'Annual savings', value: `$${(city.annual_savings_150k/1000).toFixed(0)}K`, sub: 'At $150K salary' },
          { label: 'Avg H1B salary', value: formatSalary(city.avg_salary), sub: 'LCA FY2024-2025' },
        ].map(item => (
          <div key={item.label} style={{
            padding: '12px', borderRadius: 9,
            border: item.highlight ? '0.5px solid #b6daa0' : '0.5px solid #e5e7eb',
            background: item.highlight ? '#EAF3DE' : '#fff',
          }}>
            <div style={{ fontSize: 11, color: item.highlight ? '#3B6D11' : '#6b7280', marginBottom: 5 }}>{item.label}</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: item.highlight ? '#2d5a1b' : '#1a1a1a' }}>{item.value}</div>
            <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 2 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Real Income Table */}
      <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
          Real purchasing power (after tax + cost of living)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
          {[
            { label: 'Gross $100K', after: city.real_income_100k },
            { label: 'Gross $150K', after: city.real_income_150k },
            { label: 'Gross $200K', after: city.real_income_200k },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center', padding: '12px', background: '#fafafa', borderRadius: 8, border: '0.5px solid #f3f4f6' }}>
              <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontSize: 20, fontWeight: 500, color: '#1a1a1a' }}>${(item.after/1000).toFixed(0)}K</div>
              <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 2 }}>real purchasing power</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#9ca3af', lineHeight: 1.6 }}>
          Calculated after federal + state income tax, adjusted for local cost of living index ({city.cost_index}/100 vs national average).
        </div>
      </div>

      {/* Top Employers */}
      <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
          Top H1B employers
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {city.top_employers.map(emp => (
            <span key={emp} style={{ fontSize: 12, background: '#f3f4f6', color: '#1a1a1a', padding: '5px 12px', borderRadius: 6 }}>
              {emp}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {city.top_sectors.map((s, i) => (
            <span key={s} style={{ fontSize: 11, background: i === 0 ? '#E6F1FB' : '#f3f4f6', color: i === 0 ? '#185FA5' : '#6b7280', padding: '3px 10px', borderRadius: 5 }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Livability */}
      <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
          Livability
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Walk Score', value: city.walk_score, max: 100, color: '#185FA5' },
            { label: 'Transit Score', value: city.transit_score, max: 100, color: '#378ADD' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: '#6b7280', width: 100, flexShrink: 0 }}>{item.label}</span>
              <div style={{ flex: 1, height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: item.color, borderRadius: 3, width: `${item.value}%` }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, width: 30, textAlign: 'right', flexShrink: 0 }}>{item.value}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          {city.h_mart && (
            <span style={{ fontSize: 11.5, background: '#EAF3DE', color: '#3B6D11', padding: '4px 12px', borderRadius: 6 }}>
              ✓ H Mart nearby
            </span>
          )}
          {city.korean_pop >= 50000 && (
            <span style={{ fontSize: 11.5, background: '#E6F1FB', color: '#185FA5', padding: '4px 12px', borderRadius: 6 }}>
              🇰🇷 {(city.korean_pop/1000).toFixed(0)}K+ Korean community
            </span>
          )}
          {city.korean_pop >= 10000 && city.korean_pop < 50000 && (
            <span style={{ fontSize: 11.5, background: '#f3f4f6', color: '#6b7280', padding: '4px 12px', borderRadius: 6 }}>
              🇰🇷 {(city.korean_pop/1000).toFixed(0)}K+ Korean community
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '12px 14px', background: '#f9fafb', border: '0.5px solid #f3f4f6', borderRadius: 8, fontSize: 11, color: '#9ca3af', lineHeight: 1.65 }}>
        Real purchasing power estimates are based on federal + state tax calculations and cost of living indices. Actual results vary by filing status, deductions, and lifestyle. H1B salary data from DOL LCA filings FY2024-2025.
      </div>
    </div>
  )
}