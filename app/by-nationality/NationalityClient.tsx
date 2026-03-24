'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TOP_COMPANIES } from '@/lib/data/companies'
import { formatNumber } from '@/lib/utils'
import { SECTOR_LABELS } from '@/lib/constants'

const NATIONALITIES = [
  { key: 'south_korea', flag: '🇰🇷', name: 'South Korea',
    visas: { h1b: true, e2: true, l1: true, tn: false, e3: false, h1b1: false },
    gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', wait: '1–3 years', risk: 'low' as const },
    h1b_count: 2382, e2_count: 6778,
    insight: 'E-2 visas issued 3× more than H1B. Korean-invested companies offer a strong route with no lottery.',
    strategy: 'Apply to E-2 treaty companies first. H1B lottery as parallel track. Green card wait is short — file early.',
  },
  { key: 'india', flag: '🇮🇳', name: 'India',
    visas: { h1b: true, e2: false, l1: true, tn: false, e3: false, h1b1: false },
    gc: { eb1: '2–3 years', eb2: '12–13 years', eb3: '10–12 years', wait: '15–20 years', risk: 'high' as const },
    h1b_count: 80449, e2_count: 0,
    insight: 'Highest H1B volume worldwide. EB-2 green card wait exceeds 12 years.',
    strategy: 'Prioritize EB-1 eligible roles. Start Canada PR in parallel — 1.5–2 year timeline.',
  },
  { key: 'china', flag: '🇨🇳', name: 'China',
    visas: { h1b: true, e2: false, l1: true, tn: false, e3: false, h1b1: false },
    gc: { eb1: '2–3 years', eb2: '5–6 years', eb3: '5–7 years', wait: '5–10 years', risk: 'medium' as const },
    h1b_count: 19608, e2_count: 0,
    insight: 'No E-2 treaty. Green card wait shorter than India but still significant.',
    strategy: 'Target EB-1A/EB-1B roles. L-1A → EB-1C is a viable fast track.',
  },
  { key: 'japan', flag: '🇯🇵', name: 'Japan',
    visas: { h1b: true, e2: true, l1: true, tn: false, e3: false, h1b1: false },
    gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', wait: '1–3 years', risk: 'low' as const },
    h1b_count: 552, e2_count: 14366,
    insight: 'Highest E-2 issuance globally (14,366). Japanese-invested US companies are the strongest route.',
    strategy: 'E-2 via Japanese parent company is fastest. H1B lottery as backup. Green card wait is minimal.',
  },
  { key: 'vietnam', flag: '🇻🇳', name: 'Vietnam',
    visas: { h1b: true, e2: false, l1: true, tn: false, e3: false, h1b1: false },
    gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', wait: '1–3 years', risk: 'low' as const },
    h1b_count: 732, e2_count: 0,
    insight: 'No E-2 treaty. H1B is the primary route. Green card wait is short.',
    strategy: 'Focus on H1B-sponsoring employers. File green card as soon as eligible.',
  },
  { key: 'canada', flag: '🇨🇦', name: 'Canada',
    visas: { h1b: true, e2: true, l1: true, tn: true, e3: false, h1b1: false },
    gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', wait: '1–3 years', risk: 'low' as const },
    h1b_count: 2262, e2_count: 0,
    insight: 'TN visa — 60+ professions, no lottery, no cap. Strongest non-immigrant option available.',
    strategy: 'Start with TN visa (immediate). Use H1B lottery simultaneously.',
  },
  { key: 'australia', flag: '🇦🇺', name: 'Australia',
    visas: { h1b: true, e2: true, l1: true, tn: false, e3: true, h1b1: false },
    gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', wait: '1–3 years', risk: 'low' as const },
    h1b_count: 0, e2_count: 0,
    insight: 'E-3 visa is exclusive to Australians — no lottery, 10,500 annual cap.',
    strategy: 'Use E-3 first (no lottery). H1B as backup. Green card path is straightforward.',
  },
  { key: 'mexico', flag: '🇲🇽', name: 'Mexico',
    visas: { h1b: true, e2: true, l1: true, tn: true, e3: false, h1b1: false },
    gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', wait: '1–3 years', risk: 'low' as const },
    h1b_count: 1903, e2_count: 0,
    insight: 'TN visa via USMCA + E-2 option. Strong flexibility for Mexican nationals.',
    strategy: 'TN visa is fastest route. E-2 if investing in a US business.',
  },
  { key: 'philippines', flag: '🇵🇭', name: 'Philippines',
    visas: { h1b: true, e2: true, l1: true, tn: false, e3: false, h1b1: false },
    gc: { eb1: 'Current', eb2: '1–2 years', eb3: '2–3 years', wait: '3–5 years', risk: 'low' as const },
    h1b_count: 3456, e2_count: 0,
    insight: 'Strong in healthcare — nurses and medical professionals have multiple pathways.',
    strategy: 'Healthcare route (EB-3) is fastest. E-2 available. Green card wait is manageable.',
  },
  { key: 'brazil', flag: '🇧🇷', name: 'Brazil',
    visas: { h1b: true, e2: false, l1: true, tn: false, e3: false, h1b1: false },
    gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', wait: '1–3 years', risk: 'low' as const },
    h1b_count: 1820, e2_count: 0,
    insight: 'No E-2 treaty. H1B is primary route. Green card wait is short for Brazilians.',
    strategy: 'Focus on H1B sponsoring companies. File PERM early.',
  },
  { key: 'uk', flag: '🇬🇧', name: 'United Kingdom',
    visas: { h1b: true, e2: true, l1: true, tn: false, e3: false, h1b1: false },
    gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', wait: '1–3 years', risk: 'low' as const },
    h1b_count: 0, e2_count: 0,
    insight: 'E-2 treaty country. L-1 is strong if working for a UK-US multinational.',
    strategy: 'L-1 via UK parent company is fastest. E-2 if investing.',
  },
  { key: 'chile', flag: '🇨🇱', name: 'Chile',
    visas: { h1b: true, e2: true, l1: true, tn: false, e3: false, h1b1: true },
    gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', wait: '1–3 years', risk: 'low' as const },
    h1b_count: 0, e2_count: 0,
    insight: 'H1B1 visa — no lottery, 1,400 annual cap.',
    strategy: 'H1B1 first (no lottery). Standard H1B as backup.',
  },
  { key: 'singapore', flag: '🇸🇬', name: 'Singapore',
    visas: { h1b: true, e2: false, l1: true, tn: false, e3: false, h1b1: true },
    gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', wait: '1–3 years', risk: 'low' as const },
    h1b_count: 0, e2_count: 0,
    insight: 'H1B1 visa — no lottery, 5,400 annual cap.',
    strategy: 'H1B1 is the best option. L-1 if transferring within a multinational.',
  },
]

const VISA_LABELS: Record<string, { short: string; bg: string; color: string }> = {
  h1b:  { short: 'H-1B',  bg: '#E6F1FB', color: '#185FA5' },
  e2:   { short: 'E-2',   bg: '#E1F5EE', color: '#0F6E56' },
  l1:   { short: 'L-1',   bg: '#FAEEDA', color: '#854F0B' },
  tn:   { short: 'TN',    bg: '#F3E8FF', color: '#6B21A8' },
  e3:   { short: 'E-3',   bg: '#E1F5EE', color: '#0F6E56' },
  h1b1: { short: 'H-1B1', bg: '#E6F1FB', color: '#185FA5' },
}

const RISK_STYLE = {
  low:    { bg: '#EAF3DE', text: '#3B6D11', label: 'Short wait' },
  medium: { bg: '#FAEEDA', text: '#854F0B', label: 'Medium wait' },
  high:   { bg: '#FCEBEB', text: '#A32D2D', label: 'Long wait' },
}

function toTitle(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

export default function NationalityClient() {
  const searchParams = useSearchParams()
  const [selected, setSelected] = useState(searchParams.get('nation') ?? '')

  useEffect(() => {
    const n = searchParams.get('nation')
    if (n) setSelected(n)
  }, [searchParams])

  const data = NATIONALITIES.find(n => n.key === selected) ?? null

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <a href="/" style={{ color: '#9ca3af' }}>Home</a>
          <span>›</span>
          <span style={{ color: '#6b7280' }}>By nationality</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 6 }}>Find jobs by nationality</h1>
        <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
          Visa routes, green card wait times, and top employers — tailored to your passport.
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10.5, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>
          Select your nationality
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {NATIONALITIES.map(n => (
            <button key={n.key} onClick={() => setSelected(n.key)} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
              fontSize: 12, fontWeight: selected === n.key ? 500 : 400,
              border: selected === n.key ? '0.5px solid #185FA5' : '0.5px solid #e5e7eb',
              background: selected === n.key ? '#E6F1FB' : '#fff',
              color: selected === n.key ? '#185FA5' : '#374151',
              transition: 'all .1s',
            }}>
              <span style={{ fontSize: 16 }}>{n.flag}</span>
              {n.name}
            </button>
          ))}
        </div>
      </div>

      {!data && (
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
          Select your nationality above to see personalized results
        </div>
      )}

      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: '14px 16px', background: '#E6F1FB', border: '0.5px solid #B5D4F4', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>{data.flag}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#0C447C' }}>{data.name} — recommended strategy</span>
            </div>
            <p style={{ fontSize: 12.5, color: '#1e3a5f', lineHeight: 1.65, margin: 0 }}>{data.strategy}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
                Available visa routes
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {Object.entries(data.visas).map(([key, eligible]) => {
                  const v = VISA_LABELS[key]
                  return eligible ? (
                    <span key={key} style={{ fontSize: 11, fontWeight: 500, background: v.bg, color: v.color, padding: '4px 10px', borderRadius: 6 }}>
                      ✓ {v.short}
                    </span>
                  ) : (
                    <span key={key} style={{ fontSize: 11, color: '#d1d5db', padding: '4px 10px', borderRadius: 6, border: '0.5px solid #f3f4f6', textDecoration: 'line-through' }}>
                      {v.short}
                    </span>
                  )
                })}
              </div>
              {(data.h1b_count > 0 || data.e2_count > 0) && (
                <div style={{ marginTop: 12, fontSize: 11, color: '#6b7280', borderTop: '0.5px solid #f3f4f6', paddingTop: 10 }}>
                  {data.h1b_count > 0 && `${data.h1b_count.toLocaleString()} H1B approvals in FY2024`}
                  {data.e2_count > 0 && ` · ${data.e2_count.toLocaleString()} E-2 visas`}
                </div>
              )}
            </div>

            <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
                Green card wait time
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 500, background: RISK_STYLE[data.gc.risk].bg, color: RISK_STYLE[data.gc.risk].text, padding: '3px 8px', borderRadius: 5 }}>
                  {RISK_STYLE[data.gc.risk].label}
                </span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{data.gc.wait}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                {[{ label: 'EB-1', value: data.gc.eb1 }, { label: 'EB-2', value: data.gc.eb2 }, { label: 'EB-3', value: data.gc.eb3 }].map(item => (
                  <div key={item.label} style={{ textAlign: 'center', padding: '8px 4px', background: '#fafafa', borderRadius: 6, border: '0.5px solid #f3f4f6' }}>
                    <div style={{ fontSize: 10.5, color: '#9ca3af', marginBottom: 3 }}>{item.label}</div>
                    <div style={{ fontSize: 11, fontWeight: 500 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 500, paddingBottom: 12, borderBottom: '0.5px solid #e5e7eb', marginBottom: 14 }}>
              Top H1B sponsors to target
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {TOP_COMPANIES.filter(c => c.has_perm || c.lca_total_2yr > 5000).slice(0, 8).map((c, i) => (
                <Link key={c.slug} href={`/company/${c.slug}`} style={{ display: 'block' }}>
                  <div className="sc-row" style={{ display: 'grid', gridTemplateColumns: '24px 1fr 70px 50px', gap: 10 }}>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{i + 1}</span>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 500 }}>{toTitle(c.employer_name)}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>{SECTOR_LABELS[c.sector] ?? c.sector}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{formatNumber(c.lca_total_2yr)}</div>
                      <div style={{ fontSize: 10.5, color: '#9ca3af' }}>filings</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {c.has_perm && (
                        <span style={{ fontSize: 9.5, background: '#EAF3DE', color: '#3B6D11', padding: '2px 6px', borderRadius: 4, fontWeight: 500 }}>GC</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/rankings/top-100" style={{ fontSize: 11, color: '#185FA5', marginTop: 10, display: 'block' }}>
              View full rankings →
            </Link>
          </div>

          <div style={{ padding: '12px 14px', background: '#fafafa', border: '0.5px solid #f3f4f6', borderRadius: 8 }}>
            <p style={{ fontSize: 11.5, color: '#6b7280', lineHeight: 1.65, margin: 0 }}>💡 {data.insight}</p>
          </div>
        </div>
      )}
    </div>
  )
}