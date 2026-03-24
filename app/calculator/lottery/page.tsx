'use client'

import { useState } from 'react'

const WAGE_LEVELS = [
  { level: 1, label: 'Level 1 - Entry',          desc: 'Below median for occupation/location', tickets: 1, rate: 15, bg: '#FCEBEB', text: '#A32D2D', barColor: '#E24B4A' },
  { level: 2, label: 'Level 2 - Qualified',       desc: 'At or near median',                   tickets: 2, rate: 25, bg: '#FAEEDA', text: '#854F0B', barColor: '#EF9F27' },
  { level: 3, label: 'Level 3 - Experienced',     desc: 'Above median',                        tickets: 3, rate: 40, bg: '#E6F1FB', text: '#185FA5', barColor: '#378ADD' },
  { level: 4, label: 'Level 4 - Fully Competent', desc: 'Top of prevailing wage range',        tickets: 4, rate: 61, bg: '#EAF3DE', text: '#3B6D11', barColor: '#639922' },
]

const OCCUPATIONS = [
  { value: 'software', label: 'Software Developer / Engineer' },
  { value: 'data',     label: 'Data Scientist / Analyst' },
  { value: 'ml',       label: 'Machine Learning Engineer' },
  { value: 'finance',  label: 'Financial Analyst' },
  { value: 'business', label: 'Business / Management Analyst' },
  { value: 'other',    label: 'Other' },
]

function guessWageLevel(salary: number, occupation: string): number {
  const isHighPay = ['software', 'data', 'ml'].includes(occupation)
  if (isHighPay) {
    if (salary < 110000) return 1
    if (salary < 140000) return 2
    if (salary < 175000) return 3
    return 4
  }
  if (salary < 75000) return 1
  if (salary < 100000) return 2
  if (salary < 130000) return 3
  return 4
}

export default function LotteryPage() {
  const [salary, setSalary] = useState(130000)
  const [occupation, setOccupation] = useState('software')
  const [yearsOPT, setYearsOPT] = useState(1)

  const levelIdx = guessWageLevel(salary, occupation) - 1
  const wl = WAGE_LEVELS[levelIdx]
  const oddsOnce = wl.rate / 100
  const attempts = Math.min(yearsOPT + 1, 3)
  const oddsTotal = yearsOPT > 0
    ? Math.round((1 - Math.pow(1 - oddsOnce, attempts)) * 100)
    : wl.rate

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <a href="/" style={{ color: '#9ca3af' }}>Home</a>
          <span>&rsaquo;</span>
          <span style={{ color: '#6b7280' }}>H1B lottery calculator</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>H1B lottery calculator</h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Estimate your FY2027+ selection odds under the wage-weighted lottery system.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
            Offered salary: <span style={{ color: '#1a1a1a', textTransform: 'none', fontWeight: 600 }}>${salary.toLocaleString()}</span>
          </div>
          <input type="range" min={60000} max={300000} step={5000}
            value={salary} onChange={e => setSalary(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#185FA5' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#9ca3af', marginTop: 4 }}>
            <span>$60K</span><span>$300K</span>
          </div>
        </div>
        <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Occupation</div>
            <select value={occupation} onChange={e => setOccupation(e.target.value)}
              style={{ width: '100%', fontSize: 12.5, border: '0.5px solid #e5e7eb', borderRadius: 7, padding: '7px 10px', background: '#fff', color: '#1a1a1a', outline: 'none' }}>
              {OCCUPATIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>OPT years remaining</div>
            <select value={yearsOPT} onChange={e => setYearsOPT(Number(e.target.value))}
              style={{ width: '100%', fontSize: 12.5, border: '0.5px solid #e5e7eb', borderRadius: 7, padding: '7px 10px', background: '#fff', color: '#1a1a1a', outline: 'none' }}>
              <option value={0}>Not on OPT / abroad</option>
              <option value={1}>1 year (OPT)</option>
              <option value={2}>2 years (OPT + STEM yr 1)</option>
              <option value={3}>3 years (OPT + STEM 2yr)</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px', background: wl.bg, border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: wl.text, marginBottom: 3 }}>{wl.label}</div>
            <div style={{ fontSize: 11.5, color: wl.text, opacity: .75 }}>{wl.desc} - {wl.tickets} ticket{wl.tickets > 1 ? 's' : ''} in lottery pool</div>
          </div>
          <div style={{ fontSize: 36, fontWeight: 500, color: wl.text, letterSpacing: '-1px' }}>{wl.rate}%</div>
        </div>
        <div style={{ height: 8, background: '#fff', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: wl.barColor, borderRadius: 4, width: `${wl.rate}%`, transition: 'width .3s' }} />
        </div>
        <div style={{ fontSize: 11, color: wl.text, opacity: .7, marginTop: 6 }}>Single-year selection probability</div>
      </div>

      {yearsOPT > 0 && (
        <div style={{ padding: '14px 16px', border: '0.5px solid #B5D4F4', background: '#E6F1FB', borderRadius: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#185FA5', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
            Cumulative odds - {attempts} attempt{attempts > 1 ? 's' : ''} on OPT/STEM OPT
          </div>
          <div style={{ fontSize: 28, fontWeight: 500, color: '#0C447C', letterSpacing: '-0.5px' }}>{oddsTotal}%</div>
          <div style={{ fontSize: 11.5, color: '#185FA5', marginTop: 4, opacity: .8 }}>
            F-1 students get up to 3 lottery attempts. Assumes same wage level each year.
          </div>
        </div>
      )}

      <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
          All wage levels - FY2027 estimated rates
        </div>
        {WAGE_LEVELS.map(w => (
          <div key={w.level} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 10.5, fontWeight: 500, background: w.bg, color: w.text, padding: '3px 8px', borderRadius: 5, width: 24, textAlign: 'center', flexShrink: 0 }}>
              L{w.level}
            </span>
            <div style={{ flex: 1, height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: w.barColor, borderRadius: 3, width: `${w.rate}%`, opacity: w.level === levelIdx + 1 ? 1 : 0.4 }} />
            </div>
            <span style={{ fontSize: 11.5, fontWeight: w.level === levelIdx + 1 ? 600 : 400, color: w.level === levelIdx + 1 ? w.text : '#9ca3af', width: 32, textAlign: 'right' }}>
              {w.rate}%
            </span>
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 14px', background: '#FAEEDA', borderRadius: 8, fontSize: 11.5, color: '#633806', lineHeight: 1.65 }}>
        <strong style={{ fontWeight: 500 }}>Disclaimer:</strong> Selection rates are DHS modeling estimates for FY2027 and are not guaranteed.
        Actual rates depend on total registration volume and may change.
        Wage level determination is based on DOL prevailing wage for your occupation and location - confirm with your employer or immigration attorney.
        Legal challenges to the wage-weighted lottery rule are ongoing. Not legal or immigration advice.
      </div>
    </div>
  )
}