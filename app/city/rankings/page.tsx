import type { Metadata } from 'next'
import Link from 'next/link'
import { CITY_RANKINGS } from '@/lib/data/cities'

export const metadata: Metadata = {
  title: 'Best US Cities for International Workers — Rankings',
  description: 'Comprehensive city rankings for international workers: employment, real income, green card, safety, schools, Korean community and more.',
}

const GRADE_STYLE: Record<string, { bg: string; text: string }> = {
  'A':  { bg: '#EAF3DE', text: '#3B6D11' },
  'A-': { bg: '#EAF3DE', text: '#3B6D11' },
  'B+': { bg: '#E6F1FB', text: '#185FA5' },
  'B':  { bg: '#FAEEDA', text: '#854F0B' },
  'B-': { bg: '#FAEEDA', text: '#854F0B' },
}

const SCORE_LABELS = [
  { key: 'employment',  label: 'Jobs',       emoji: '💼' },
  { key: 'real_income', label: 'Income',     emoji: '💰' },
  { key: 'green_card',  label: 'Green Card', emoji: '🟢' },
  { key: 'safety',      label: 'Safety',     emoji: '🛡️' },
  { key: 'school',      label: 'Schools',    emoji: '🎓' },
  { key: 'transit',     label: 'Transit',    emoji: '🚇' },
  { key: 'korean',      label: 'Korean',     emoji: '🇰🇷' },
  { key: 'weather',     label: 'Weather',    emoji: '☀️' },
]

function ScoreDots({ score }: { score: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: i <= score ? '#185FA5' : '#e5e7eb',
        }} />
      ))}
    </div>
  )
}

export default function CityRankingsPage() {
  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <a href="/" style={{ color: '#9ca3af' }}>Home</a>
          <span>›</span>
          <a href="/city" style={{ color: '#9ca3af' }}>Cities</a>
          <span>›</span>
          <span style={{ color: '#6b7280' }}>Rankings</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>Best cities for international workers</h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Ranked across 8 dimensions · Employment, income, green card, safety, schools, transit, Korean community, weather</p>
      </div>

      <div style={{ padding: '12px 14px', background: '#E6F1FB', border: '0.5px solid #B5D4F4', borderRadius: 8, marginBottom: 20, fontSize: 12, color: '#1e3a5f', lineHeight: 1.6 }}>
        <strong style={{ fontWeight: 500 }}>How rankings work:</strong> Each city is scored 1-5 across 8 dimensions based on H1B/PERM data, cost of living, Niche safety/school ratings, Walk Score, and Korean community size. Rankings reflect the perspective of international job seekers, not general livability.
      </div>

      {/* 범례 */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {SCORE_LABELS.map(s => (
          <span key={s.key} style={{ fontSize: 11, background: '#f3f4f6', color: '#6b7280', padding: '3px 10px', borderRadius: 5 }}>
            {s.emoji} {s.label}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {CITY_RANKINGS.map((city) => {
          const gs = GRADE_STYLE[city.grade] ?? GRADE_STYLE['B']
          const total = Object.values(city.scores).reduce((a, b) => a + b, 0)
          return (
            <Link key={city.slug} href={`/city/${city.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ padding: '12px 14px', border: '0.5px solid #e5e7eb', borderRadius: 10 }}>

                {/* 상단: 순위 + 도시명 + 등급 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#9ca3af', width: 22 }}>#{city.rank}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{city.name}</span>
                        <span style={{ fontSize: 10.5, color: '#9ca3af' }}>{city.state}</span>
                      </div>
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>{city.best_for}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{total}/40</span>
                    <span style={{ fontSize: 11, fontWeight: 500, background: gs.bg, color: gs.text, padding: '3px 10px', borderRadius: 5 }}>
                      {city.grade}
                    </span>
                  </div>
                </div>

                {/* 점수 그리드 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 6 }}>
                  {SCORE_LABELS.map(s => (
                    <div key={s.key} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 9.5, color: '#9ca3af', marginBottom: 4 }}>{s.emoji}</div>
                      <ScoreDots score={city.scores[s.key as keyof typeof city.scores]} />
                    </div>
                  ))}
                </div>

              </div>
            </Link>
          )
        })}
      </div>

      <div style={{ marginTop: 14, fontSize: 11, color: '#9ca3af', lineHeight: 1.65 }}>
        Scores based on H1B LCA FY2024-2025, PERM FY2021-2024, Niche 2025, Walk Score 2024, U.S. Census ACS 2023. Rankings reflect international worker perspective — not general livability rankings.
      </div>
    </div>
  )
}