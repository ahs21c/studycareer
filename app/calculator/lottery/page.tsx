'use client'

import { useState } from 'react'

const LEVEL_DIST = { L1: 0.144, L2: 0.399, L3: 0.246, L4: 0.211 }
const AVG_WEIGHT = 1 * LEVEL_DIST.L1 + 2 * LEVEL_DIST.L2 + 3 * LEVEL_DIST.L3 + 4 * LEVEL_DIST.L4

const WAGE_LEVELS = [
  { level: 1, label: 'Level 1 — Entry',          desc: 'Below median · 1 ticket', weight: 1, bg: '#FCEBEB', text: '#A32D2D', barColor: '#E24B4A' },
  { level: 2, label: 'Level 2 — Qualified',       desc: 'Near median · 2 tickets', weight: 2, bg: '#FAEEDA', text: '#854F0B', barColor: '#EF9F27' },
  { level: 3, label: 'Level 3 — Experienced',     desc: 'Above median · 3 tickets', weight: 3, bg: '#E6F1FB', text: '#185FA5', barColor: '#378ADD' },
  { level: 4, label: 'Level 4 — Fully Competent', desc: 'Top of range · 4 tickets', weight: 4, bg: '#EAF3DE', text: '#3B6D11', barColor: '#639922' },
]

const OCCUPATIONS = [
  { group: 'IT / Software', items: [
    { value: 'software',     label: 'Software Developer / Engineer',         thresholds: [110000, 140000, 175000] },
    { value: 'systems',      label: 'Computer Systems Engineer / Architect',  thresholds: [115000, 145000, 180000] },
    { value: 'programmer',   label: 'Computer Programmer',                    thresholds: [95000, 125000, 160000] },
    { value: 'data',         label: 'Data Scientist',                         thresholds: [110000, 145000, 180000] },
    { value: 'bi',           label: 'Business Intelligence Analyst',          thresholds: [95000, 125000, 155000] },
    { value: 'ml',           label: 'Machine Learning Engineer / AI',         thresholds: [130000, 165000, 200000] },
    { value: 'it_pm',        label: 'IT Project Manager',                     thresholds: [105000, 135000, 165000] },
    { value: 'sqa',          label: 'Software QA Analyst / Tester',           thresholds: [90000, 115000, 145000] },
    { value: 'sys_analyst',  label: 'Computer Systems Analyst',               thresholds: [85000, 110000, 140000] },
    { value: 'it_manager',   label: 'IT Manager / CIO',                       thresholds: [125000, 160000, 200000] },
    { value: 'ops_research', label: 'Operations Research Analyst',            thresholds: [85000, 110000, 140000] },
    { value: 'stats',        label: 'Statistician',                           thresholds: [90000, 115000, 145000] },
  ]},
  { group: 'Engineering', items: [
    { value: 'mechanical',   label: 'Mechanical Engineer',   thresholds: [80000, 105000, 135000] },
    { value: 'electrical',   label: 'Electrical Engineer',   thresholds: [85000, 110000, 140000] },
    { value: 'electronics',  label: 'Electronics Engineer',  thresholds: [90000, 115000, 145000] },
    { value: 'civil',        label: 'Civil Engineer',        thresholds: [75000, 98000, 125000] },
    { value: 'industrial',   label: 'Industrial Engineer',   thresholds: [78000, 100000, 128000] },
    { value: 'validation',   label: 'Validation Engineer',   thresholds: [85000, 110000, 138000] },
    { value: 'architect',    label: 'Architect',             thresholds: [72000, 95000, 120000] },
  ]},
  { group: 'Finance / Business', items: [
    { value: 'finance',      label: 'Financial / Investment Analyst',      thresholds: [90000, 120000, 160000] },
    { value: 'quant',        label: 'Quantitative Analyst (Quant)',        thresholds: [130000, 170000, 220000] },
    { value: 'accounting',   label: 'Accountant / Auditor',                thresholds: [65000, 85000, 115000] },
    { value: 'management',   label: 'Management Analyst / Consultant',     thresholds: [75000, 100000, 135000] },
    { value: 'marketing',    label: 'Market Research / Marketing Analyst', thresholds: [65000, 85000, 110000] },
    { value: 'gen_manager',  label: 'General / Operations Manager',        thresholds: [85000, 115000, 155000] },
    { value: 'lawyer',       label: 'Lawyer / Attorney',                   thresholds: [100000, 140000, 190000] },
  ]},
  { group: 'Healthcare / Science', items: [
    { value: 'physician',    label: 'Physician / Doctor',                  thresholds: [180000, 240000, 300000] },
    { value: 'pt',           label: 'Physical Therapist',                  thresholds: [70000, 90000, 115000] },
    { value: 'med_lab',      label: 'Medical / Clinical Lab Technologist', thresholds: [55000, 72000, 92000] },
    { value: 'med_sci',      label: 'Medical Scientist',                   thresholds: [75000, 100000, 135000] },
    { value: 'biochem',      label: 'Biochemist / Biophysicist',           thresholds: [75000, 100000, 130000] },
    { value: 'mol_bio',      label: 'Molecular / Cellular Biologist',      thresholds: [70000, 95000, 125000] },
    { value: 'chemist',      label: 'Chemist',                             thresholds: [65000, 88000, 115000] },
    { value: 'physicist',    label: 'Physicist',                           thresholds: [85000, 115000, 150000] },
  ]},
  { group: 'Education', items: [
    { value: 'prof',         label: 'University Professor / Researcher', thresholds: [65000, 85000, 115000] },
    { value: 'teacher',      label: 'K-12 Teacher',                     thresholds: [45000, 60000, 80000] },
  ]},
]

const ALL_OCCUPATIONS = OCCUPATIONS.flatMap(g => g.items)

function guessWageLevel(salary: number, occupation: string): number {
  const occ = ALL_OCCUPATIONS.find(o => o.value === occupation)
  if (!occ) return 2
  const [t1, t2, t3] = occ.thresholds
  if (salary < t1) return 1
  if (salary < t2) return 2
  if (salary < t3) return 3
  return 4
}

function calcRate(weight: number, baseRate: number): number {
  return Math.round((weight / AVG_WEIGHT) * baseRate)
}

export default function LotteryPage() {
  const [salary, setSalary] = useState(130000)
  const [occupation, setOccupation] = useState('software')
  const [yearsOPT, setYearsOPT] = useState(1)
  const [baseRate, setBaseRate] = useState(35)

  const levelIdx = guessWageLevel(salary, occupation) - 1
  const wl = WAGE_LEVELS[levelIdx]
  const myRate = calcRate(wl.weight, baseRate)
  const attempts = Math.min(yearsOPT + 1, 3)
  const oddsTotal = yearsOPT > 0
    ? Math.round((1 - Math.pow(1 - myRate / 100, attempts)) * 100)
    : myRate

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>
            Offered salary: <span style={{ color: '#1a1a1a', textTransform: 'none', fontWeight: 600 }}>${salary.toLocaleString()}</span>
          </div>
          <input type="range" min={40000} max={350000} step={5000}
            value={salary} onChange={e => setSalary(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#185FA5' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#9ca3af', marginTop: 4 }}>
            <span>$40K</span><span>$350K</span>
          </div>
        </div>

        <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Occupation</div>
            <select value={occupation} onChange={e => setOccupation(e.target.value)}
              style={{ width: '100%', fontSize: 12.5, border: '0.5px solid #e5e7eb', borderRadius: 7, padding: '7px 10px', background: '#fff', color: '#1a1a1a', outline: 'none' }}>
              {OCCUPATIONS.map(g => (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </optgroup>
              ))}
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

      <div style={{ padding: '12px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
          Overall selection rate: <span style={{ color: '#1a1a1a', textTransform: 'none', fontWeight: 600 }}>{baseRate}%</span>
          <span style={{ fontWeight: 400, marginLeft: 8 }}>
            {baseRate >= 33 ? '(FY2026 est. ~35%)' : baseRate >= 23 ? '(FY2027 est. ~25%)' : '(conservative)'}
          </span>
        </div>
        <input type="range" min={15} max={45} step={1}
          value={baseRate} onChange={e => setBaseRate(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#185FA5' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#9ca3af', marginTop: 4, marginBottom: 10 }}>
          <span>15% (conservative)</span>
          <span>35% (FY2026 actual)</span>
          <span>45%</span>
        </div>
        <div style={{ padding: '10px 12px', background: '#f9fafb', border: '0.5px solid #f3f4f6', borderRadius: 7, fontSize: 11, color: '#6b7280', lineHeight: 1.65 }}>
          <strong style={{ fontWeight: 500, color: '#1a1a1a' }}>How this rate is estimated:</strong> Based on (1) USCIS historical data — FY2026 saw 343,981 registrations, down 27% YoY, pushing actual selection to ~35%; (2) AI displacement research from 11 institutions (Goldman Sachs, McKinsey, MIT, Oxford, etc.) projecting shifts in H1B-eligible tech roles; (3) proposed FY2027 wage-weighted rules changing applicant composition. Adjust the slider to model different scenarios.
        </div>
      </div>

      <div style={{ padding: '20px', background: wl.bg, border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: wl.text, marginBottom: 3 }}>{wl.label}</div>
            <div style={{ fontSize: 11.5, color: wl.text, opacity: .75 }}>{wl.desc}</div>
          </div>
          <div style={{ fontSize: 36, fontWeight: 500, color: wl.text, letterSpacing: '-1px' }}>{myRate}%</div>
        </div>
        <div style={{ height: 8, background: '#fff', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: wl.barColor, borderRadius: 4, width: `${Math.min(myRate, 100)}%`, transition: 'width .3s' }} />
        </div>
        <div style={{ fontSize: 11, color: wl.text, opacity: .7, marginTop: 6 }}>Single-year selection probability</div>
      </div>

      {yearsOPT > 0 && (
        <div style={{ padding: '14px 16px', border: '0.5px solid #B5D4F4', background: '#E6F1FB', borderRadius: 10, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#185FA5', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
            Cumulative odds · {attempts} attempt{attempts > 1 ? 's' : ''} on OPT/STEM OPT
          </div>
          <div style={{ fontSize: 28, fontWeight: 500, color: '#0C447C', letterSpacing: '-0.5px' }}>{oddsTotal}%</div>
          <div style={{ fontSize: 11.5, color: '#185FA5', marginTop: 4, opacity: .8 }}>
            F-1 students get up to 3 lottery attempts. $100K employer fee waived for F-1 students on OPT.
          </div>
        </div>
      )}

      <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
          All wage levels at {baseRate}% overall rate
        </div>
        {WAGE_LEVELS.map(w => {
          const rate = calcRate(w.weight, baseRate)
          return (
            <div key={w.level} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 10.5, fontWeight: 500, background: w.bg, color: w.text, padding: '3px 8px', borderRadius: 5, width: 24, textAlign: 'center', flexShrink: 0 }}>
                L{w.level}
              </span>
              <div style={{ flex: 1, height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: w.barColor, borderRadius: 3, width: `${Math.min(rate, 100)}%`, opacity: w.level === levelIdx + 1 ? 1 : 0.4, transition: 'width .3s' }} />
              </div>
              <span style={{ fontSize: 11.5, fontWeight: w.level === levelIdx + 1 ? 600 : 400, color: w.level === levelIdx + 1 ? w.text : '#9ca3af', width: 32, textAlign: 'right' }}>
                {rate}%
              </span>
            </div>
          )
        })}
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 8, lineHeight: 1.5 }}>
          Formula: P(Lx) = (weight_x / weighted_avg) × overall_rate · Based on FY2024 distribution: L1=14.4%, L2=39.9%, L3=24.6%, L4=21.1%
        </div>
      </div>

      <div style={{ padding: '12px 14px', background: '#FAEEDA', borderRadius: 8, fontSize: 11.5, color: '#633806', lineHeight: 1.65 }}>
        <strong style={{ fontWeight: 500 }}>Important disclaimer:</strong> All estimates on this page are for informational purposes only and do not constitute legal or immigration advice.
        FY2027 wage-weighted lottery rules are <strong style={{ fontWeight: 500 }}>not yet finalized</strong> as of March 2026 and are subject to ongoing legal challenges.
        The overall selection rate reflects our analysis of USCIS registration trends and AI labor market research from third-party institutions — it is <strong style={{ fontWeight: 500 }}>not an official government figure</strong> and actual rates will vary based on total registration volume, final USCIS rulemaking, and macroeconomic conditions.
        Always consult a qualified immigration attorney before making visa-related decisions.
      </div>
    </div>
  )
}