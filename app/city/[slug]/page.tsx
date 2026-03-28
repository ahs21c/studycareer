import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { CITIES, CITY_RANKINGS } from '@/lib/data/cities'

export const revalidate = 604800

interface Props { params: Promise<{ slug: string }> }

function getCity(slug: string) {
  const city = CITIES.find(c => c.slug === slug)
  const ranking = CITY_RANKINGS.find(c => c.slug === slug)
  if (!city || !ranking) return null
  return { ...city, ...ranking }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const c = getCity(slug)
  if (!c) return { title: 'City not found' }
  return {
    title: `${c.name}, ${c.state} — Real Income & City Guide | StudyCareer`,
    description: `${c.name}: ${c.tagline}. State tax ${c.state_tax}%, avg salary $${c.avg_salary.toLocaleString()}, annual savings $${(c.annual_savings_150k / 1000).toFixed(0)}K at $150K. Walk Score ${c.walk_score}.`,
  }
}

export async function generateStaticParams() {
  return CITIES.map(c => ({ slug: c.slug }))
}

const SCORE_META: { key: keyof typeof CITY_RANKINGS[0]['scores']; icon: string; label: string; color: string }[] = [
  { key: 'employment',  icon: '💼', label: 'Jobs',       color: '#185FA5' },
  { key: 'real_income', icon: '💰', label: 'Income',     color: '#854F0B' },
  { key: 'green_card',  icon: '🟢', label: 'Green Card', color: '#3B6D11' },
  { key: 'safety',      icon: '🛡️', label: 'Safety',     color: '#6d28d9' },
  { key: 'school',      icon: '🎓', label: 'Schools',    color: '#0e7490' },
  { key: 'transit',     icon: '🚇', label: 'Transit',    color: '#475569' },
  { key: 'korean',      icon: '🏘️', label: 'Community',  color: '#be185d' },
  { key: 'weather',     icon: '☀️', label: 'Weather',    color: '#d97706' },
]

const GRADE_STYLE: Record<string, { bg: string; text: string }> = {
  'A':  { bg: '#EAF3DE', text: '#3B6D11' },
  'A-': { bg: '#EAF3DE', text: '#3B6D11' },
  'B+': { bg: '#E6F1FB', text: '#185FA5' },
  'B':  { bg: '#FAEEDA', text: '#854F0B' },
  'B-': { bg: '#FAEEDA', text: '#854F0B' },
}

export default async function CityDetailPage({ params }: Props) {
  const { slug } = await params
  const c = getCity(slug)
  if (!c) notFound()

  const gs = GRADE_STYLE[c.grade] ?? GRADE_STYLE['B']
  const total = Object.values(c.scores).reduce((a, b) => a + b, 0)

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <Link href="/" style={{ color: '#9ca3af' }}>Home</Link>
          <span>›</span>
          <Link href="/city" style={{ color: '#9ca3af' }}>Cities</Link>
          <span>›</span>
          <span style={{ color: '#1a1a1a' }}>{c.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>
              {c.name}, {c.state}
            </h1>
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              {c.best_for} · Rank #{c.rank} of 19
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{total}/40</span>
            <span style={{ fontSize: 11, fontWeight: 500, background: gs.bg, color: gs.text, padding: '4px 10px', borderRadius: 6 }}>
              {c.grade}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 14px', background: '#E6F1FB', border: '0.5px solid #B5D4F4', borderRadius: 8, marginBottom: 16, fontSize: 12.5, color: '#1e3a5f', lineHeight: 1.6 }}>
        {c.tagline}
      </div>

      <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
          City scorecard
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {SCORE_META.map(meta => {
            const score = c.scores[meta.key]
            return (
              <div key={meta.key} style={{ textAlign: 'center', padding: '10px 4px', background: '#fafafa', borderRadius: 8, border: '0.5px solid #f3f4f6' }}>
                <div style={{ fontSize: 16, marginBottom: 4 }}>{meta.icon}</div>
                <div style={{ fontSize: 10.5, color: '#9ca3af', marginBottom: 6 }}>{meta.label}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <div key={n} style={{ width: 8, height: 8, borderRadius: '50%', background: n <= score ? meta.color : '#e5e7eb' }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: meta.color, marginTop: 4 }}>{score}/5</div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
          Real purchasing power
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
          {[
            { label: 'State tax', value: c.state_tax === 0 ? '0% ✓' : `${c.state_tax}%`, highlight: c.state_tax === 0 },
            { label: 'Avg salary', value: `$${c.avg_salary.toLocaleString()}`, highlight: false },
            { label: 'Rent 1BR', value: `$${c.rent_1br.toLocaleString()}/mo`, highlight: false },
            { label: 'Annual savings*', value: `$${(c.annual_savings_150k / 1000).toFixed(0)}K`, highlight: true },
          ].map(item => (
            <div key={item.label} style={{
              padding: '10px', borderRadius: 8, textAlign: 'center',
              border: item.highlight ? '0.5px solid #b6daa0' : '0.5px solid #f3f4f6',
              background: item.highlight ? '#EAF3DE' : '#fafafa',
            }}>
              <div style={{ fontSize: 10.5, color: item.highlight ? '#3B6D11' : '#9ca3af', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: item.highlight ? '#2d5a1b' : '#1a1a1a' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>Real income by salary level</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { label: 'At $100K', value: `$${c.real_income_100k.toLocaleString()}` },
            { label: 'At $150K', value: `$${c.real_income_150k.toLocaleString()}` },
            { label: 'At $200K', value: `$${c.real_income_200k.toLocaleString()}` },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center', padding: '8px', background: '#fafafa', borderRadius: 6, border: '0.5px solid #f3f4f6' }}>
              <div style={{ fontSize: 10.5, color: '#9ca3af', marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{item.value}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 8 }}>
          * After federal + state taxes and average living expenses at $150K gross salary
        </div>
      </div>

      <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
          Livability
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { label: 'Walk Score', value: String(c.walk_score), sub: c.walk_score >= 70 ? 'Very Walkable' : c.walk_score >= 50 ? 'Somewhat Walkable' : 'Car-Dependent' },
            { label: 'Transit Score', value: String(c.transit_score), sub: c.transit_score >= 65 ? 'Excellent Transit' : c.transit_score >= 40 ? 'Some Transit' : 'Minimal Transit' },
            { label: 'Cost Index', value: String(c.cost_index), sub: c.cost_index > 150 ? 'Very Expensive' : c.cost_index > 100 ? 'Above Average' : 'Below Average' },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center', padding: '10px', background: '#fafafa', borderRadius: 8, border: '0.5px solid #f3f4f6' }}>
              <div style={{ fontSize: 10.5, color: '#9ca3af', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: '#1a1a1a' }}>{item.value}</div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
          Korean community
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 500 }}>~{(c.korean_pop / 1000).toFixed(0)}K</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>estimated Korean population</div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {c.h_mart && (
            <span style={{ fontSize: 11, background: '#EAF3DE', color: '#3B6D11', padding: '3px 10px', borderRadius: 5, fontWeight: 500 }}>H Mart available</span>
          )}
          {!c.h_mart && (
            <span style={{ fontSize: 11, background: '#f3f4f6', color: '#6b7280', padding: '3px 10px', borderRadius: 5 }}>No H Mart</span>
          )}
          <span style={{ fontSize: 11, background: '#f3f4f6', color: '#6b7280', padding: '3px 10px', borderRadius: 5 }}>
            Community: {c.scores.korean}/5
          </span>
        </div>
      </div>

      <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
          Top H1B employers
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          {c.top_sectors.map((s, i) => (
            <span key={i} style={{ fontSize: 11, background: i === 0 ? '#E6F1FB' : '#f3f4f6', color: i === 0 ? '#185FA5' : '#6b7280', padding: '3px 10px', borderRadius: 5 }}>
              {s}
            </span>
          ))}
        </div>
        {c.top_employers.map((emp, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '0.5px solid #f3f4f6' }}>
            <span style={{ fontSize: 10.5, color: '#9ca3af', width: 14 }}>{i + 1}</span>
            <span style={{ fontSize: 12, color: '#1a1a1a' }}>{emp}</span>
          </div>
        ))}
        <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 10 }}>
          Representative employers — not exhaustive. Based on H1B LCA filing volume in this metro area.
        </div>
      </div>

      <div style={{ padding: '12px 14px', background: '#f9fafb', border: '0.5px solid #f3f4f6', borderRadius: 8, marginBottom: 12, fontSize: 11.5, color: '#6b7280', lineHeight: 1.65 }}>
        Green card wait time varies by nationality: Korea/EU — 1-5 yr · China — 20-50 yr · India — 100+ yr backlog. India/China nationals should consider Canada as a parallel track.
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Link href="/city" style={{ fontSize: 12, color: '#185FA5', textDecoration: 'none', padding: '6px 12px', border: '0.5px solid #B5D4F4', borderRadius: 6 }}>
          ← All cities
        </Link>
        <Link href="/city/rankings" style={{ fontSize: 12, color: '#185FA5', textDecoration: 'none', padding: '6px 12px', border: '0.5px solid #B5D4F4', borderRadius: 6 }}>
          Full rankings (8 factors)
        </Link>
        <Link href="/calculator/real-income" style={{ fontSize: 12, color: '#185FA5', textDecoration: 'none', padding: '6px 12px', border: '0.5px solid #B5D4F4', borderRadius: 6 }}>
          Real income calculator
        </Link>
      </div>
    </div>
  )
}
