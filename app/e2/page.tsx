import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'E2 Treaty Investor Visa — Country List & Sponsor Companies',
  description: 'E2 visa treaty countries, issuance statistics, and top sponsor companies. No lottery required.',
}

const E2_COUNTRIES = [
  { name: 'Canada', issued: 99790, flag: '🇨🇦' },
  { name: 'Japan', issued: 94390, flag: '🇯🇵' },
  { name: 'Mexico', issued: 54080, flag: '🇲🇽' },
  { name: 'Korea', issued: 25550, flag: '🇰🇷' },
  { name: 'Germany', issued: 23740, flag: '🇩🇪' },
  { name: 'United Kingdom', issued: 20000, flag: '🇬🇧' },
  { name: 'France', issued: 19430, flag: '🇫🇷' },
  { name: 'Spain', issued: 11880, flag: '🇪🇸' },
  { name: 'Italy', issued: 11590, flag: '🇮🇹' },
  { name: 'Taiwan', issued: 10280, flag: '🇹🇼' },
  { name: 'Argentina', issued: 5100, flag: '🇦🇷' },
  { name: 'Colombia', issued: 2410, flag: '🇨🇴' },
  { name: 'Austria', issued: 2340, flag: '🇦🇹' },
  { name: 'Netherlands', issued: 2340, flag: '🇳🇱' },
  { name: 'Australia', issued: 2290, flag: '🇦🇺' },
  { name: 'Denmark', issued: 1960, flag: '🇩🇰' },
  { name: 'Turkey', issued: 1880, flag: '🇹🇷' },
  { name: 'Israel', issued: 1830, flag: '🇮🇱' },
  { name: 'Switzerland', issued: 1820, flag: '🇨🇭' },
  { name: 'Belgium', issued: 1770, flag: '🇧🇪' },
  { name: 'Ireland', issued: 1700, flag: '🇮🇪' },
  { name: 'Sweden', issued: 1680, flag: '🇸🇪' },
  { name: 'Chile', issued: 1040, flag: '🇨🇱' },
  { name: 'Norway', issued: 840, flag: '🇳🇴' },
  { name: 'Thailand', issued: 500, flag: '🇹🇭' },
  { name: 'New Zealand', issued: 440, flag: '🇳🇿' },
  { name: 'Philippines', issued: 430, flag: '🇵🇭' },
  { name: 'Poland', issued: 410, flag: '🇵🇱' },
  { name: 'Singapore', issued: 230, flag: '🇸🇬' },
  { name: 'Portugal', issued: 80, flag: '🇵🇹' },
]

const NOT_ELIGIBLE = [
  { name: 'India', flag: '🇮🇳' },
  { name: 'China', flag: '🇨🇳' },
  { name: 'Vietnam', flag: '🇻🇳' },
  { name: 'Indonesia', flag: '🇮🇩' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'Russia', flag: '🇷🇺' },
  { name: 'Nigeria', flag: '🇳🇬' },
  { name: 'Pakistan', flag: '🇵🇰' },
  { name: 'Bangladesh', flag: '🇧🇩' },
  { name: 'Nepal', flag: '🇳🇵' },
]

const maxIssued = E2_COUNTRIES[0].issued

export default function E2Page() {
  return (
    <div>
      {/* Header */}
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <a href="/" style={{ color: '#9ca3af' }}>Home</a>
          <span>›</span>
          <span style={{ color: '#6b7280' }}>E2 Visa</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>E2 Treaty Investor Visa</h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>No lottery · Unlimited renewals · Spouse work authorization · 80+ treaty countries</p>
      </div>

      {/* Key facts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Total E2 issued (FY2024)', value: '412,200', sub: 'All treaty countries' },
          { label: 'Japan (ranked #1)', value: '94,390', sub: 'Largest E2 user' },
          { label: 'Korea (ranked #4)', value: '25,550', sub: 'H1B의 3배 규모' },
          { label: 'Lottery required', value: 'None', sub: 'vs H1B ~25% chance' },
        ].map(item => (
          <div key={item.label} style={{ padding: '12px', borderRadius: 9, border: '0.5px solid #e5e7eb' }}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 5 }}>{item.label}</div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>{item.value}</div>
            <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 2 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* What is E2 */}
      <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>What is E2?</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 12.5, color: '#374151', lineHeight: 1.7 }}>
          <div>
            <div style={{ fontWeight: 500, marginBottom: 6, color: '#1a1a1a' }}>✓ Advantages</div>
            <div>No lottery — available year-round</div>
            <div>Unlimited renewals (no 6-year cap)</div>
            <div>Spouse automatically authorized to work</div>
            <div>Faster processing than H1B</div>
            <div>Available from outside the US</div>
          </div>
          <div>
            <div style={{ fontWeight: 500, marginBottom: 6, color: '#1a1a1a' }}>⚠ Limitations</div>
            <div>Only for treaty country nationals</div>
            <div>Must work for a treaty-country employer</div>
            <div>Does not directly lead to green card</div>
            <div>Tied to the sponsoring company</div>
            <div>India, China, Vietnam — not eligible</div>
          </div>
        </div>
      </div>

      {/* H1B vs E2 comparison */}
      <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>H1B vs E2 comparison</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
          {[
            { label: '', h1b: 'H1B', e2: 'E2' },
            { label: 'Lottery', h1b: '~25% chance', e2: 'No lottery ✓' },
            { label: 'Nationality', h1b: 'Any', e2: 'Treaty countries only' },
            { label: 'Duration', h1b: '6 years max', e2: 'Unlimited renewals' },
            { label: 'Spouse work', h1b: 'Conditional', e2: 'Automatic ✓' },
            { label: 'Green card path', h1b: 'Direct (PERM)', e2: 'Indirect only' },
            { label: 'Employer', h1b: 'Any US employer', e2: 'Treaty-country only' },
            { label: 'Processing', h1b: '2-4 months', e2: '2-4 months' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'contents' }}>
              <div style={{ padding: '8px 0', borderBottom: '0.5px solid #f3f4f6', fontSize: i === 0 ? 10.5 : 12, fontWeight: i === 0 ? 500 : 400, color: i === 0 ? '#9ca3af' : '#374151' }}>{row.label}</div>
              <div style={{ padding: '8px 12px', borderBottom: '0.5px solid #f3f4f6', fontSize: i === 0 ? 10.5 : 12, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? '#185FA5' : '#374151', background: i === 0 ? '#E6F1FB' : undefined, borderRadius: i === 0 ? '6px 0 0 0' : undefined }}>{row.h1b}</div>
              <div style={{ padding: '8px 12px', borderBottom: '0.5px solid #f3f4f6', fontSize: i === 0 ? 10.5 : 12, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? '#3B6D11' : row.e2.includes('✓') ? '#3B6D11' : '#374151', background: i === 0 ? '#EAF3DE' : undefined, borderRadius: i === 0 ? '0 6px 0 0' : undefined }}>{row.e2}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Treaty countries */}
      <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>Treaty countries — E2 visas issued (FY2024)</div>
          <span style={{ fontSize: 11, color: '#9ca3af' }}>Top 30 shown</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {E2_COUNTRIES.map((c, i) => (
            <div key={c.name} style={{ display: 'grid', gridTemplateColumns: '24px 24px 1fr 80px', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{i + 1}</span>
              <span style={{ fontSize: 16 }}>{c.flag}</span>
              <div>
                <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: i < 3 ? '#185FA5' : '#93C5FD', borderRadius: 3, width: `${Math.round((c.issued / maxIssued) * 100)}%` }} />
                </div>
                <div style={{ fontSize: 11, color: '#374151', marginTop: 3 }}>{c.name}</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 12, fontWeight: 500 }}>{c.issued.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Not eligible */}
      <div style={{ padding: '14px 16px', border: '0.5px solid #fee2e2', borderRadius: 10, marginBottom: 12, background: '#fff' }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>Not eligible for E2</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          {NOT_ELIGIBLE.map(c => (
            <span key={c.name} style={{ fontSize: 12, background: '#fef2f2', color: '#991b1b', padding: '4px 12px', borderRadius: 6 }}>
              {c.flag} {c.name}
            </span>
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>
          Nationals of non-treaty countries can still pursue H1B or L1 visas. India and China nationals should consider Canada as a faster path to permanent residency (1.5-2 years vs 15-20 years in the US).
        </div>
      </div>

      {/* Find E2 sponsors */}
      <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>Find E2 sponsor companies</div>
        <div style={{ fontSize: 12.5, color: '#374151', lineHeight: 1.7, marginBottom: 14 }}>
          E2 sponsorship requires working for a company that is at least 51% owned by nationals of the same treaty country. Search our database of 93,000+ companies to find active H1B filers — many of which also sponsor E2 visas.
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/search" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 500, color: '#fff', background: '#185FA5', padding: '8px 16px', borderRadius: 7, textDecoration: 'none' }}>
            Search companies →
          </Link>
          <Link href="/sector" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 500, color: '#185FA5', background: '#E6F1FB', padding: '8px 16px', borderRadius: 7, textDecoration: 'none' }}>
            Browse by sector
          </Link>
        </div>
      </div>

      <div style={{ padding: '12px 14px', background: '#f9fafb', border: '0.5px solid #f3f4f6', borderRadius: 8, fontSize: 11, color: '#9ca3af', lineHeight: 1.65 }}>
        E2 visa data from U.S. Department of State FY2024. Issuance counts include both principal applicants and derivatives. E2 eligibility requires nationality of a treaty country — not just residency. Consult an immigration attorney for case-specific advice.
      </div>
    </div>
  )
}