'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SECTORS: Record<string, string> = {
  SOFTWARE_PRODUCTS: 'Software Products',
  IT_SERVICES: 'IT Services',
  INTERNET_PLATFORMS: 'Internet Platforms',
  CONSULTING: 'Consulting',
  BANKING: 'Banking & Finance',
  ACCOUNTING: 'Accounting',
  SEMICONDUCTOR_MFG: 'Semiconductor',
  ENGINEERING_SERVICES: 'Engineering Services',
  CLOUD_DATA: 'Cloud & Data',
  PHARMA_MFG: 'Pharma',
  HOSPITALS: 'Hospitals',
  UNIVERSITIES: 'Universities',
  INVESTMENT_SECURITIES: 'Investment & Securities',
  MEDIA_ENTERTAINMENT: 'Media & Entertainment',
  TELECOM: 'Telecom',
}

const JOB_OPTIONS = [
  'Software Developers',
  'Data Scientists',
  'Software Quality Assurance Analysts and Testers',
  'Computer Systems Engineers/Architects',
  'Business Intelligence Analysts',
  'Computer Systems Analysts',
  'Information Technology Project Managers',
  'Financial and Investment Analysts',
  'Accountants and Auditors',
  'Mechanical Engineers',
  'Electrical Engineers',
  'Management Analysts',
  'Market Research Analysts and Marketing Specialists',
  'Computer and Information Systems Managers',
  'Operations Research Analysts',
]

const US_STATES = [
  'CA','TX','NY','WA','IL','MA','NJ','GA','FL','VA',
  'NC','OH','PA','CO','AZ','MN','MI','MD','OR','UT',
]

export default function H1BExplorerWidget() {
  const router = useRouter()
  const [company, setCompany] = useState('')
  const [sector, setSector] = useState('')
  const [job, setJob] = useState('')
  const [state, setState] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (company) params.set('q', company)
    if (sector)  params.set('sector', sector)
    if (job)     params.set('job', job)
    if (state)   params.set('state', state)
    router.push(`/rankings?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <input
        type="text"
        placeholder="Search company..."
        value={company}
        onChange={e => setCompany(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ width: '100%', height: 32, border: '1px solid #e5e7eb', borderRadius: 6, padding: '0 10px', fontSize: 12, fontFamily: 'inherit', outline: 'none', color: '#1a1a1a' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <select value={sector} onChange={e => setSector(e.target.value)} style={{ height: 32, border: '1px solid #e5e7eb', borderRadius: 6, padding: '0 8px', fontSize: 11.5, fontFamily: 'inherit', color: sector ? '#1a1a1a' : '#9ca3af', outline: 'none', background: '#fff' }}>
          <option value="">All Industries</option>
          {Object.entries(SECTORS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={state} onChange={e => setState(e.target.value)} style={{ height: 32, border: '1px solid #e5e7eb', borderRadius: 6, padding: '0 8px', fontSize: 11.5, fontFamily: 'inherit', color: state ? '#1a1a1a' : '#9ca3af', outline: 'none', background: '#fff' }}>
          <option value="">All States</option>
          {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <select value={job} onChange={e => setJob(e.target.value)} style={{ width: '100%', height: 32, border: '1px solid #e5e7eb', borderRadius: 6, padding: '0 8px', fontSize: 11.5, fontFamily: 'inherit', color: job ? '#1a1a1a' : '#9ca3af', outline: 'none', background: '#fff' }}>
        <option value="">All Job Titles</option>
        {JOB_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
      </select>
      <button onClick={handleSearch} style={{ width: '100%', height: 32, background: '#185FA5', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', marginTop: 2 }}>
        Search →
      </button>
      <a href="/rankings" style={{ fontSize: 11, color: '#185FA5', display: 'block', paddingLeft: 2, marginTop: 2 }}>
        Browse all 94,623 companies →
      </a>
    </div>
  )
}