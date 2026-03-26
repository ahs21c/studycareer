import type { Metadata } from 'next'
import Link from 'next/link'
import { CITIES } from '@/lib/data/cities'

export const metadata: Metadata = {
  title: 'US Cities Real Purchasing Power | After-Tax & Cost of Living',
  description: 'Compare real after-tax income and cost of living across 19 major US cities. Find where your salary goes furthest as an international worker on H1B or OPT.',
  keywords: ['US city cost of living', 'real income after tax', 'best cities for H1B workers', 'OPT salary comparison', 'purchasing power US cities'],
  openGraph: {
    title: 'US Cities Real Purchasing Power | StudyCareer',
    description: 'Compare real after-tax income and cost of living across 19 major US cities.',
  },
}

const GRADE_STYLE: Record<string, { bg: string; text: string }> = {
  'A':  { bg: '#EAF3DE', text: '#3B6D11' },
  'A-': { bg: '#EAF3DE', text: '#3B6D11' },
  'B+': { bg: '#E6F1FB', text: '#185FA5' },
  'B':  { bg: '#FAEEDA', text: '#854F0B' },
  'B-': { bg: '#FAEEDA', text: '#854F0B' },
}

export default function CitiesPage() {
  const sorted = [...CITIES].sort((a, b) => b.annual_savings_150k - a.annual_savings_150k)

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <a href="/" style={{ color: '#9ca3af' }}>Home</a>
          <span>›</span>
          <span style={{ color: '#6b7280' }}>Cities</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>Real purchasing power by city</h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>After-tax income vs. cost of living · 19 major US cities · Ranked by annual savings at $150K salary</p>
        <Link href="/city/rankings" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 12.5, fontWeight: 500, color: '#fff',
          background: '#185FA5',
          padding: '8px 16px', borderRadius: 7, textDecoration: 'none',
        }}>
          View comprehensive city rankings — employment · safety · schools · weather →
        </Link>
      </div>

      <div style={{ padding: '12px 14px', background: '#E6F1FB', border: '0.5px solid #B5D4F4', borderRadius: 8, marginBottom: 20, fontSize: 12, color: '#1e3a5f', lineHeight: 1.6 }}>
        <strong style={{ fontWeight: 500 }}>Why this matters:</strong> A $170K salary in SF can leave you with less savings than a $115K salary in Dallas — after state taxes and cost of living. Nominal salary ≠ real purchasing power.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr 70px 80px 80px 60px', gap: 12, padding: '0 12px 8px', fontSize: 10.5, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>
        <span>#</span>
        <span>City</span>
        <span style={{ textAlign: 'right' }}>State tax</span>
        <span style={{ textAlign: 'right' }}>Rent 1BR</span>
        <span style={{ textAlign: 'right' }}>Annual savings*</span>
        <span style={{ textAlign: 'right' }}>Grade</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {sorted.map((city, i) => {
          const gs = GRADE_STYLE[city.grade] ?? GRADE_STYLE['B']
          return (
            <Link key={city.slug} href={`/city/${city.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr 70px 80px 80px 60px', gap: 12, padding: '10px 12px', border: '0.5px solid #e5e7eb', borderRadius: 9, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>{i + 1}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 500 }}>{city.name}</span>
                    {city.state_tax === 0 && (
                      <span style={{ fontSize: 9.5, background: '#EAF3DE', color: '#3B6D11', padding: '1px 6px', borderRadius: 4, fontWeight: 500 }}>No tax</span>
                    )}
                    {city.h_mart && (
                      <span style={{ fontSize: 9.5, background: '#f3f4f6', color: '#6b7280', padding: '1px 6px', borderRadius: 4 }}>H Mart</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{city.top_sectors.join(' · ')}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12 }}>
                  {city.state_tax === 0 ? <span style={{ color: '#3B6D11', fontWeight: 500 }}>0%</span> : `${city.state_tax}%`}
                </div>
                <div style={{ textAlign: 'right', fontSize: 12 }}>${city.rent_1br.toLocaleString()}</div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>${(city.annual_savings_150k / 1000).toFixed(0)}K</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 11, fontWeight: 500, background: gs.bg, color: gs.text, padding: '3px 8px', borderRadius: 5 }}>
                    {city.grade}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div style={{ marginTop: 12, fontSize: 11, color: '#9ca3af', lineHeight: 1.6 }}>
        * Annual savings estimated at $150K gross salary after federal + state taxes and average living expenses. Actual results vary by lifestyle and household size.
      </div>
    </div>
  )
}