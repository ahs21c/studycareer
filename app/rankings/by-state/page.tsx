import type { Metadata } from 'next'
import Link from 'next/link'
import { H1B_BY_STATE } from '@/lib/data/companies'

export const metadata: Metadata = {
  title: 'H1B by State',
  description: 'H1B visa sponsorship by US state - total approvals and number of sponsoring companies.',
}
export const revalidate = 604800

export default function ByStatePage() {
  const max = H1B_BY_STATE[0].approvals

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <Link href="/" style={{ color: '#9ca3af' }}>Home</Link>
          <span>›</span>
          <Link href="/rankings/top-100" style={{ color: '#9ca3af' }}>Rankings</Link>
          <span>›</span>
          <span style={{ color: '#6b7280' }}>By state</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>H1B by state</h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Total H1B approvals by state · FY2022-2024</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 80px 80px 120px', gap: 12, padding: '0 12px 8px', fontSize: 10.5, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>
        <span>#</span><span>State</span>
        <span style={{ textAlign: 'right' }}>Approvals</span>
        <span style={{ textAlign: 'right' }}>Companies</span>
        <span />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {H1B_BY_STATE.map((s, i) => {
          const pct = Math.round((s.approvals / max) * 100)
          return (
            <div key={s.state} style={{
              display: 'grid', gridTemplateColumns: '28px 1fr 80px 80px 120px',
              gap: 12, padding: '10px 12px',
              border: '0.5px solid #e5e7eb', borderRadius: 9, alignItems: 'center',
            }}>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{i + 1}</span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{s.state}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{s.code}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{s.approvals.toLocaleString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12.5, color: '#6b7280' }}>{s.companies.toLocaleString()}</div>
              </div>
              <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#185FA5', borderRadius: 3, width: `${pct}%`, opacity: .7 }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}