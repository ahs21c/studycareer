import type { Metadata } from 'next'
import { getCapExempt } from '@/lib/supabase/queries'

export const metadata: Metadata = {
  title: 'Cap-Exempt H1B Institutions',
  description: '2,585 universities, nonprofits, and government research orgs that can hire H1B workers outside the annual cap.',
}
export const revalidate = 2592000

const TYPE_LABELS: Record<string, string> = {
  '대학교': 'University',
  '비영리': 'Nonprofit',
  '정부연구기관': 'Gov Research',
  '병원': 'Hospital',
  '연구소': 'Research Inst',
  '비영리병원': 'Nonprofit Hospital',
  '비영리연구소': 'Nonprofit Research',
  '정부기관': 'Gov Agency',
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
 '대학교': { bg: '#E6F1FB', text: '#185FA5' },
  '비영리': { bg: '#EAF3DE', text: '#3B6D11' },
  '정부연구기관': { bg: '#FAEEDA', text: '#854F0B' },
  '병원': { bg: '#FCEBEB', text: '#A32D2D' },
  '연구소': { bg: '#F3E8FF', text: '#6B21A8' },
  '비영리병원': { bg: '#FCEBEB', text: '#A32D2D' },
  '비영리연구소': { bg: '#F3E8FF', text: '#6B21A8' },
  '정부기관': { bg: '#FAEEDA', text: '#854F0B' },
}

export default async function CapExemptPage() {
  const institutions = await getCapExempt()

  const totalH1B = institutions.reduce((s, i) => s + i.h1b_total_3yr, 0)
  const byType = institutions.reduce((acc, i) => {
    acc[i.institution_type] = (acc[i.institution_type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <a href="/" style={{ color: '#9ca3af' }}>Home</a>
          <span>›</span>
          <span style={{ color: '#6b7280' }}>Cap-exempt institutions</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>Cap-exempt institutions</h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>
          2,585 universities, nonprofits, and research orgs exempt from the annual H1B cap. No lottery required.
        </p>
      </div>

      <div style={{ padding: '12px 14px', background: '#E6F1FB', border: '0.5px solid #B5D4F4', borderRadius: 8, marginBottom: 16, fontSize: 12.5, color: '#1e3a5f', lineHeight: 1.6 }}>
        <strong style={{ fontWeight: 500 }}>What cap-exempt means:</strong> These institutions can hire H1B workers at any time of year, bypassing the April lottery. Ideal for international students who missed the regular cap or want year-round opportunities.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Total institutions', value: '2,585', sub: 'Cap-exempt' },
          { label: 'H1B filings (3yr)', value: totalH1B.toLocaleString(), sub: 'FY2022-2024' },
          { label: 'Universities', value: (byType['대학교'] || 0).toLocaleString(), sub: 'Showing top 100' },
          { label: 'Nonprofits', value: (byType['비영리'] || 0).toLocaleString(), sub: 'Showing top 100' },
        ].map(item => (
          <div key={item.label} style={{ padding: '12px', borderRadius: 9, border: '0.5px solid #e5e7eb' }}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 5 }}>{item.label}</div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>{item.value}</div>
            <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 2 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 60px 80px 60px 60px 60px', gap: 12, padding: '0 12px 8px', fontSize: 10.5, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em' }}>
        <span>#</span>
        <span>Institution</span>
        <span style={{ textAlign: 'right' }}>Type</span>
        <span style={{ textAlign: 'right' }}>3yr H1B</span>
        <span style={{ textAlign: 'right' }}>FY22</span>
        <span style={{ textAlign: 'right' }}>FY23</span>
        <span style={{ textAlign: 'right' }}>FY24</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {institutions.map((inst, i) => {
          const typeColor = TYPE_COLORS[inst.institution_type] ?? { bg: '#f3f4f6', text: '#6b7280' }
          const typeLabel = TYPE_LABELS[inst.institution_type] ?? inst.institution_type
          return (
            <div key={inst.id} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 60px 80px 60px 60px 60px', gap: 12, padding: '10px 12px', border: '0.5px solid #e5e7eb', borderRadius: 9, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{i + 1}</span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 2 }}>{inst.employer_name}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{inst.primary_state}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 10, fontWeight: 500, background: typeColor.bg, color: typeColor.text, padding: '2px 6px', borderRadius: 4 }}>
                  {typeLabel}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{inst.h1b_total_3yr.toLocaleString()}</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 11.5, color: '#6b7280' }}>{inst.fy2022}</div>
              <div style={{ textAlign: 'right', fontSize: 11.5, color: '#6b7280' }}>{inst.fy2023}</div>
              <div style={{ textAlign: 'right', fontSize: 11.5, color: '#6b7280' }}>{inst.fy2024}</div>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 12, fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>
        Showing top 100 by H1B volume · 2,585 total institutions in database
      </div>
    </div>
  )
}