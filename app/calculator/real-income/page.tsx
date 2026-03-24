'use client'

import { useState } from 'react'

const CITIES = [
  { name: 'San Francisco, CA', stateTax: 0.093, col: 1.87, rent: 3200 },
  { name: 'New York, NY',      stateTax: 0.0685, col: 1.68, rent: 3100 },
  { name: 'Seattle, WA',       stateTax: 0,      col: 1.42, rent: 2400 },
  { name: 'Boston, MA',        stateTax: 0.05,   col: 1.52, rent: 2700 },
  { name: 'Austin, TX',        stateTax: 0,      col: 1.12, rent: 1800 },
  { name: 'Chicago, IL',       stateTax: 0.0495, col: 1.07, rent: 1900 },
  { name: 'Los Angeles, CA',   stateTax: 0.093,  col: 1.56, rent: 2600 },
  { name: 'Washington, DC',    stateTax: 0.085,  col: 1.48, rent: 2500 },
  { name: 'Denver, CO',        stateTax: 0.044,  col: 1.18, rent: 1900 },
  { name: 'Atlanta, GA',       stateTax: 0.055,  col: 0.97, rent: 1700 },
  { name: 'Dallas, TX',        stateTax: 0,      col: 1.04, rent: 1700 },
  { name: 'Miami, FL',         stateTax: 0,      col: 1.15, rent: 2200 },
  { name: 'Phoenix, AZ',       stateTax: 0.025,  col: 0.96, rent: 1600 },
  { name: 'Minneapolis, MN',   stateTax: 0.0985, col: 1.08, rent: 1800 },
  { name: 'Raleigh, NC',       stateTax: 0.0475, col: 0.95, rent: 1500 },
  { name: 'Portland, OR',      stateTax: 0.099,  col: 1.22, rent: 1900 },
  { name: 'Detroit, MI',       stateTax: 0.0425, col: 0.82, rent: 1200 },
  { name: 'Houston, TX',       stateTax: 0,      col: 1.0,  rent: 1600 },
  { name: 'San Diego, CA',     stateTax: 0.093,  col: 1.44, rent: 2500 },
  { name: 'Charlotte, NC',     stateTax: 0.0475, col: 0.94, rent: 1500 },
]

function calcFederalTax(income: number): number {
  const brackets = [
    [11600, 0.10], [47150, 0.12], [100525, 0.22],
    [191950, 0.24], [243725, 0.32], [609350, 0.35], [Infinity, 0.37],
  ]
  let tax = 0; let prev = 0
  for (const [limit, rate] of brackets) {
    if (income <= prev) break
    tax += (Math.min(income, limit as number) - prev) * (rate as number)
    prev = limit as number
  }
  return tax
}

function fmt(n: number) { return '$' + Math.round(n).toLocaleString() }

export default function RealIncomePage() {
  const [salary, setSalary] = useState(120000)
  const [cityIdx, setCityIdx] = useState(0)

  const city = CITIES[cityIdx]
  const federal = calcFederalTax(salary)
  const state = salary * city.stateTax
  const fica = Math.min(salary, 160200) * 0.0765
  const netIncome = salary - federal - state - fica
  const annualRent = city.rent * 12
  const disposable = netIncome - annualRent
  const totalTax = federal + state + fica
  const effectiveTaxRate = Math.round((totalTax / salary) * 100)

  const taxItems = [
    { label: 'Federal income tax', value: federal },
    { label: `${city.name.split(',')[1]?.trim() ?? 'State'} state tax`, value: state },
    { label: 'FICA (SS + Medicare)', value: fica },
  ]

  const bars = [
    { label: 'Gross salary', value: salary,     color: '#B5D4F4', pct: 100 },
    { label: 'Take-home',    value: netIncome,  color: '#185FA5', pct: Math.round((netIncome / salary) * 100) },
    { label: 'After rent',   value: disposable, color: disposable > 0 ? '#3B6D11' : '#A32D2D', pct: Math.round((Math.max(disposable, 0) / salary) * 100) },
  ]

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <a href="/" style={{ color: '#9ca3af' }}>Home</a>
          <span>›</span>
          <span style={{ color: '#6b7280' }}>Real income calculator</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>Real income calculator</h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Compare take-home pay after taxes and cost of living across 20 US cities.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
            Annual salary: <span style={{ color: '#1a1a1a', textTransform: 'none', fontWeight: 600 }}>{fmt(salary)}</span>
          </div>
          <input type="range" min={50000} max={400000} step={5000}
            value={salary} onChange={e => setSalary(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#185FA5' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#9ca3af', marginTop: 4 }}>
            <span>$50K</span><span>$400K</span>
          </div>
        </div>
        <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>City</div>
          <select value={cityIdx} onChange={e => setCityIdx(Number(e.target.value))}
            style={{ width: '100%', fontSize: 12.5, border: '0.5px solid #e5e7eb', borderRadius: 7, padding: '8px 10px', background: '#fff', color: '#1a1a1a', outline: 'none' }}>
            {CITIES.map((c, i) => <option key={c.name} value={i}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div style={{ padding: '16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 16 }}>Income breakdown</div>
        {bars.map(b => (
          <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: '#6b7280', width: 90, flexShrink: 0 }}>{b.label}</span>
            <div style={{ flex: 1, height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 4, background: b.color, width: `${b.pct}%`, transition: 'width .3s' }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, width: 80, textAlign: 'right', flexShrink: 0, color: b.value < 0 ? '#A32D2D' : '#1a1a1a' }}>
              {fmt(b.value)}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
        {[
          { label: 'Gross salary', value: fmt(salary),          sub: 'before tax',                          highlight: false },
          { label: 'Take-home',    value: fmt(netIncome),       sub: 'after all taxes',                     highlight: true  },
          { label: 'After rent',   value: fmt(disposable),      sub: `$${city.rent.toLocaleString()}/mo est.`, highlight: false },
          { label: 'Effective tax',value: `${effectiveTaxRate}%`, sub: 'fed + state + FICA',                highlight: false },
        ].map(item => (
          <div key={item.label} style={{
            padding: '12px', borderRadius: 9,
            border: item.highlight ? '0.5px solid #B5D4F4' : '0.5px solid #e5e7eb',
            background: item.highlight ? '#E6F1FB' : '#fff',
          }}>
            <div style={{ fontSize: 11, color: item.highlight ? '#185FA5' : '#6b7280', marginBottom: 5 }}>{item.label}</div>
            <div style={{ fontSize: 17, fontWeight: 500, color: item.highlight ? '#0C447C' : '#1a1a1a' }}>{item.value}</div>
            <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 2 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>Tax breakdown</div>
        {taxItems.map(t => (
          <div key={t.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '5px 0', borderBottom: '0.5px solid #f3f4f6' }}>
            <span style={{ color: '#6b7280' }}>{t.label}</span>
            <span style={{ fontWeight: 500 }}>{fmt(t.value)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 500, paddingTop: 8, marginTop: 4 }}>
          <span>Total taxes</span><span>{fmt(totalTax)}</span>
        </div>
      </div>

      <div style={{ padding: '12px 14px', background: '#E6F1FB', borderRadius: 8, fontSize: 11.5, color: '#1e3a5f', lineHeight: 1.65 }}>
  <strong style={{ fontWeight: 500 }}>Disclaimer:</strong> Estimates based on 2025 IRS tax brackets, single filer, standard deduction. 
  Rent figures are median 1BR estimates as of 2024 (Zillow/Apartments.com). 
  Does not include 401k, health insurance, HSA, or other pre-tax deductions. 
  Actual take-home pay may vary. Not financial or tax advice.
  </div>
    </div>
  )
}