'use client'

import { useState } from 'react'
import Link from 'next/link'

const NATIONALITY_DATA: Record<string, {
  name: string; flag: string
  visas: { e2: boolean; h1b: boolean; l1: boolean; e3: boolean; h1b1: boolean; tn: boolean }
  h1b_count?: number; e2_count?: number
  gc: { eb1: string; eb2: string; eb3: string; total: string; risk: 'low' | 'medium' | 'high' }
  insight: string
}> = {
  south_korea: { name: 'South Korea', flag: '🇰🇷', visas: { e2: true, h1b: true, l1: true, e3: false, h1b1: false, tn: false }, h1b_count: 2382, e2_count: 6778, gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', total: '1–3 years', risk: 'low' }, insight: 'E-2 visas issued 3× more than H1B. Korean-invested companies are a strong route with no lottery.' },
  india:       { name: 'India',       flag: '🇮🇳', visas: { e2: false, h1b: true, l1: true, e3: false, h1b1: false, tn: false }, h1b_count: 80449, e2_count: 0, gc: { eb1: '2–3 years', eb2: '12–13 years', eb3: '10–12 years', total: '15–20 years', risk: 'high' }, insight: 'Green card wait is extremely long (EB-2: 12+ years). Canada PR is a strong parallel strategy.' },
  china:       { name: 'China',       flag: '🇨🇳', visas: { e2: false, h1b: true, l1: true, e3: false, h1b1: false, tn: false }, h1b_count: 19608, e2_count: 0, gc: { eb1: '2–3 years', eb2: '5–6 years', eb3: '5–7 years', total: '5–10 years', risk: 'medium' }, insight: 'No E-2 option. Green card wait is shorter than India but still significant.' },
  japan:       { name: 'Japan',       flag: '🇯🇵', visas: { e2: true, h1b: true, l1: true, e3: false, h1b1: false, tn: false }, h1b_count: 552, e2_count: 14366, gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', total: '1–3 years', risk: 'low' }, insight: 'Highest E-2 issuance worldwide (14,366). Japanese-invested companies are the strongest route.' },
  australia:   { name: 'Australia',   flag: '🇦🇺', visas: { e2: true, h1b: true, l1: true, e3: true, h1b1: false, tn: false }, gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', total: '1–3 years', risk: 'low' }, insight: 'E-3 visa is exclusive to Australians — no lottery, 10,500 annual cap, spouse works automatically.' },
  canada:      { name: 'Canada',      flag: '🇨🇦', visas: { e2: true, h1b: true, l1: true, e3: false, h1b1: false, tn: true }, h1b_count: 2262, gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', total: '1–3 years', risk: 'low' }, insight: 'TN visa — 60+ professional categories, no lottery, no annual cap.' },
  mexico:      { name: 'Mexico',      flag: '🇲🇽', visas: { e2: true, h1b: true, l1: true, e3: false, h1b1: false, tn: true }, h1b_count: 1903, gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', total: '1–3 years', risk: 'low' }, insight: 'TN visa available via USMCA. Combined with H1B and E-2, strong flexibility.' },
  vietnam:     { name: 'Vietnam',     flag: '🇻🇳', visas: { e2: false, h1b: true, l1: true, e3: false, h1b1: false, tn: false }, h1b_count: 732, gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', total: '1–3 years', risk: 'low' }, insight: 'No E-2 treaty. H1B is the primary route. Green card wait is short — file early.' },
  philippines: { name: 'Philippines', flag: '🇵🇭', visas: { e2: true, h1b: true, l1: true, e3: false, h1b1: false, tn: false }, h1b_count: 3456, gc: { eb1: 'Current', eb2: '1–2 years', eb3: '2–3 years', total: '3–5 years', risk: 'low' }, insight: 'Strong in healthcare — nurses and medical professionals have multiple pathways.' },
  chile:       { name: 'Chile',       flag: '🇨🇱', visas: { e2: true, h1b: true, l1: true, e3: false, h1b1: true, tn: false }, gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', total: '1–3 years', risk: 'low' }, insight: 'H1B1 visa available — no lottery, 1,400 annual allocation. Use before standard H1B.' },
  singapore:   { name: 'Singapore',   flag: '🇸🇬', visas: { e2: false, h1b: true, l1: true, e3: false, h1b1: true, tn: false }, gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', total: '1–3 years', risk: 'low' }, insight: 'H1B1 visa available — no lottery, 5,400 annual allocation. Not an E-2 treaty country.' },
  brazil:      { name: 'Brazil',      flag: '🇧🇷', visas: { e2: false, h1b: true, l1: true, e3: false, h1b1: false, tn: false }, h1b_count: 1820, gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', total: '1–3 years', risk: 'low' }, insight: 'No E-2 treaty. H1B is primary route. Green card wait is short for Brazilian nationals.' },
  uk:          { name: 'United Kingdom', flag: '🇬🇧', visas: { e2: true, h1b: true, l1: true, e3: false, h1b1: false, tn: false }, gc: { eb1: 'Current', eb2: 'Current', eb3: 'Current', total: '1–3 years', risk: 'low' }, insight: 'E-2 treaty country. L-1 is strong if working for a UK-US multinational.' },
}

const VISA_INFO: Record<string, { label: string; desc: string; bg: string; color: string }> = {
  e2:   { label: 'E-2 Treaty Investor',     desc: 'No lottery. Invest in a US business. Requires treaty country.',        bg: '#E1F5EE', color: '#0F6E56' },
  h1b:  { label: 'H-1B Specialty',          desc: 'Annual lottery (Apr). 65K cap + 20K masters. Employer-sponsored.',     bg: '#E6F1FB', color: '#185FA5' },
  l1:   { label: 'L-1 Intracompany',        desc: 'No lottery. Transfer from overseas office. 1yr+ employment required.', bg: '#FAEEDA', color: '#854F0B' },
  e3:   { label: 'E-3 (Australia only)',     desc: 'No lottery. 10,500 annual cap. Specialty occupation. Spouse works.',   bg: '#E1F5EE', color: '#0F6E56' },
  h1b1: { label: 'H-1B1 (Chile/Singapore)', desc: 'No lottery. 1,400/5,400 annual cap. Specialty occupation.',           bg: '#E6F1FB', color: '#185FA5' },
  tn:   { label: 'TN (Canada/Mexico)',       desc: 'No lottery, no cap. 60+ professions. Annual renewal, no limit.',      bg: '#F3E8FF', color: '#6B21A8' },
}

const RISK_STYLE = {
  low:    { bg: '#EAF3DE', text: '#3B6D11', label: 'Short wait' },
  medium: { bg: '#FAEEDA', text: '#854F0B', label: 'Medium wait' },
  high:   { bg: '#FCEBEB', text: '#A32D2D', label: 'Long wait' },
}

export default function VisaCheckPage() {
  const [nationality, setNationality] = useState('')
  const data = nationality ? NATIONALITY_DATA[nationality] : null

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <a href="/" style={{ color: '#9ca3af' }}>Home</a>
          <span>›</span>
          <span style={{ color: '#6b7280' }}>Visa eligibility checker</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>Visa eligibility checker</h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Select your nationality to see available visa routes and green card wait times.</p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Your nationality</div>
        <select value={nationality} onChange={e => setNationality(e.target.value)}
          style={{ fontSize: 13, border: '0.5px solid #e5e7eb', borderRadius: 8, padding: '9px 12px', background: '#fff', color: '#1a1a1a', outline: 'none', minWidth: 240 }}>
          <option value="">Select a country…</option>
          {Object.entries(NATIONALITY_DATA).map(([key, val]) => (
            <option key={key} value={key}>{val.flag} {val.name}</option>
          ))}
        </select>
      </div>

      {!data && (
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
          Select your nationality to see visa options
        </div>
      )}

      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ padding: '14px 16px', background: '#E6F1FB', border: '0.5px solid #B5D4F4', borderRadius: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#0C447C', marginBottom: 4 }}>{data.flag} {data.name}</div>
            <p style={{ fontSize: 12.5, color: '#1e3a5f', lineHeight: 1.65, margin: 0 }}>{data.insight}</p>
            {(data.h1b_count || data.e2_count) && (
              <div style={{ marginTop: 10, display: 'flex', gap: 12, fontSize: 11, color: '#185FA5', borderTop: '0.5px solid #B5D4F4', paddingTop: 8 }}>
                {data.h1b_count ? <span>{data.h1b_count.toLocaleString()} H1B approvals FY2024</span> : null}
                {data.e2_count ? <span>{data.e2_count.toLocaleString()} E-2 visas FY2024</span> : null}
              </div>
            )}
          </div>

          <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>Available visa routes</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(data.visas).map(([key, eligible]) => {
                const info = VISA_INFO[key]
                return (
                  <div key={key} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '10px 12px', borderRadius: 8,
                    border: eligible ? `0.5px solid ${info.color}30` : '0.5px solid #f3f4f6',
                    background: eligible ? info.bg : '#fafafa',
                    opacity: eligible ? 1 : 0.45,
                  }}>
                    <span style={{ fontSize: 13, color: eligible ? info.color : '#9ca3af', marginTop: 1, flexShrink: 0 }}>
                      {eligible ? '✓' : '✗'}
                    </span>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 500, color: eligible ? info.color : '#9ca3af' }}>{info.label}</div>
                      <div style={{ fontSize: 11.5, color: eligible ? `${info.color}CC` : '#9ca3af', marginTop: 2 }}>{info.desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>Green card wait times</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 500, background: RISK_STYLE[data.gc.risk].bg, color: RISK_STYLE[data.gc.risk].text, padding: '3px 8px', borderRadius: 5 }}>
                {RISK_STYLE[data.gc.risk].label}
              </span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{data.gc.total} overall</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {[{ label: 'EB-1', value: data.gc.eb1 }, { label: 'EB-2', value: data.gc.eb2 }, { label: 'EB-3', value: data.gc.eb3 }].map(item => (
                <div key={item.label} style={{ textAlign: 'center', padding: '10px 8px', background: '#fafafa', borderRadius: 8, border: '0.5px solid #f3f4f6' }}>
                  <div style={{ fontSize: 10.5, color: '#9ca3af', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '12px 14px', background: '#f9fafb', border: '0.5px solid #f3f4f6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: '#6b7280' }}>See top employers for your nationality</span>
            <Link href={`/by-nationality?nation=${nationality}`} style={{ fontSize: 12, color: '#185FA5', fontWeight: 500 }}>
              View full guide →
            </Link>
          </div>
          <div style={{ padding: '12px 14px', background: '#FAEEDA', borderRadius: 8, fontSize: 11.5, color: '#633806', lineHeight: 1.65 }}>
          <strong style={{ fontWeight: 500 }}>Disclaimer:</strong> Visa eligibility and green card wait times are based on publicly available data as of 2025. 
          Wait times reflect DOS Visa Bulletin estimates and change monthly. 
          E-2 and H1B approval counts are from USCIS/State Dept FY2024 data. 
          This tool is for informational purposes only. Not legal or immigration advice — consult a licensed immigration attorney.
        </div>
        </div>
      )}
    </div>
  )
}