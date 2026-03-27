import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { formatNumber, formatSalary } from '@/lib/utils'
import BookmarkButton from '@/components/company/BookmarkButton'
import { getCompanyBySlug, getTopSchoolsByCompany } from '@/lib/supabase/queries'

export const revalidate = 604800

interface Props { params: Promise<{ slug: string }> }

function toTitle(s: string) {
  return s.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const c = await getCompanyBySlug(slug)
  if (!c) return { title: 'Company not found' }
  return {
    title: `${c.employer_name} — H1B & Green Card Data`,
    description: `${c.employer_name} filed ${formatNumber(c.lca_total_2yr)} H1B applications (FY2024-2025), avg salary ${formatSalary(c.avg_salary_fy2025)}. ${c.has_perm ? 'Also sponsors PERM green cards.' : ''}`,
  }
}

const TREND_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  INCREASING: { bg: '#dcfce7', text: '#166534', label: '↑ Increasing' },
  STABLE:     { bg: '#dbeafe', text: '#1e40af', label: '→ Stable' },
  DECREASING: { bg: '#fee2e2', text: '#991b1b', label: '↓ Declining' },
  NEW:        { bg: '#f3e8ff', text: '#6b21a8', label: '✦ New' },
  STOPPED:    { bg: '#f3f4f6', text: '#6b7280', label: '— Stopped' },
}

const SECTOR_LABELS: Record<string, string> = {
  IT_SERVICES: 'IT Services',
  ACCOUNTING: 'Accounting & Audit',
  RETAIL: 'E-Commerce & Retail',
  INTERNET_PLATFORMS: 'Internet & Software',
  CONSULTING: 'Management Consulting',
  SEMICONDUCTOR_MFG: 'Semiconductor Mfg',
  HOLDING_COMPANIES: 'Diversified Holdings',
  AI_DIGITAL_PLATFORMS: 'AI & Digital Platforms',
  COMPUTER_ELECTRONICS_MFG: 'Computer & Electronics',
  CLOUD_DATA: 'Cloud & Data Services',
  IT_SOFTWARE: 'IT & Software',
  PROFESSIONAL_SERVICES: 'Professional Services',
  FINANCE: 'Finance & Banking',
  HEALTHCARE: 'Healthcare',
  EDUCATION: 'Education',
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params
  const c = await getCompanyBySlug(slug)
  if (!c) notFound()

  const topSchools = await getTopSchoolsByCompany(c.employer_name)

  const t = TREND_STYLE[c.lca_trend] ?? TREND_STYLE.STABLE
  const yoy = c.lca_fy2024 > 0
    ? Math.round(((c.lca_fy2025 - c.lca_fy2024) / c.lca_fy2024) * 100)
    : 0
  const permApprovalRate = c.perm_total_5yr > 0
    ? Math.round((c.perm_certified / c.perm_total_5yr) * 100)
    : 0
  const salaryVsPrevailing = c.avg_salary_fy2025 && c.prevailing_wage_avg
    ? Math.round(((c.avg_salary_fy2025 - c.prevailing_wage_avg) / c.prevailing_wage_avg) * 100)
    : null
  const topJobs = c.top3_job_titles ? c.top3_job_titles.split('|') : []
  const topStates = c.top3_worksite_states ? c.top3_worksite_states.split('|') : []

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <a href="/" style={{ color: '#9ca3af' }}>Home</a>
          <span>›</span>
          <a href="/rankings/top-100" style={{ color: '#9ca3af' }}>Companies</a>
          <span>›</span>
          <span style={{ color: '#6b7280' }}>{SECTOR_LABELS[c.sector] ?? c.sector}</span>
          <span>›</span>
          <span style={{ color: '#1a1a1a' }}>{toTitle(c.employer_name)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>
              {toTitle(c.employer_name)}
            </h1>
            <div style={{ fontSize: 12, color: '#6b7280' }}>
              {SECTOR_LABELS[c.sector] ?? c.sector} · {c.employer_state}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <BookmarkButton slug={c.slug} employerName={c.employer_name} />
            <span style={{ fontSize: 11, fontWeight: 500, background: t.bg, color: t.text, padding: '4px 10px', borderRadius: 6 }}>
              {t.label}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'H1B filings (2yr)', value: formatNumber(c.lca_total_2yr), sub: `${yoy >= 0 ? '+' : ''}${yoy}% vs FY2024`, highlight: true },
          { label: 'Avg salary (FY2025)', value: formatSalary(c.avg_salary_fy2025), sub: `Prevailing: ${formatSalary(c.prevailing_wage_avg)}`, highlight: false },
          { label: 'Green card filings', value: c.has_perm ? formatNumber(c.perm_total_5yr) : '—', sub: c.has_perm ? 'PERM FY2021–2025' : 'No filings found', highlight: false },
          { label: 'Prevailing wage', value: formatSalary(c.prevailing_wage_avg), sub: 'DOL minimum', highlight: false },
        ].map(item => (
          <div key={item.label} style={{
            padding: '12px', borderRadius: 9,
            border: item.highlight ? '0.5px solid #B5D4F4' : '0.5px solid #e5e7eb',
            background: item.highlight ? '#E6F1FB' : '#fff',
          }}>
            <div style={{ fontSize: 11, color: item.highlight ? '#185FA5' : '#6b7280', marginBottom: 5 }}>{item.label}</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: item.highlight ? '#0C447C' : '#1a1a1a' }}>{item.value}</div>
            <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 2 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {c.has_perm && (
        <div style={{ padding: '12px 14px', background: '#EAF3DE', border: '0.5px solid #b6daa0', borderRadius: 8, marginBottom: 16, fontSize: 12.5, color: '#2d5a1b' }}>
          This company sponsors both H1B work visas and PERM green cards. Dual sponsorship significantly reduces long-term immigration risk.
        </div>
      )}

      <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>H1B activity</div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>Salary distribution (FY2025)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6 }}>
            {[
              { label: 'P25 estimate', value: c.avg_salary_fy2025 ? formatSalary(c.avg_salary_fy2025 * 0.84) : 'N/A' },
              { label: 'Median', value: formatSalary(c.median_salary_fy2025) },
              { label: 'Average', value: formatSalary(c.avg_salary_fy2025) },
              { label: 'P75', value: formatSalary(c.p75_salary_fy2025) },
              { label: 'Prevailing', value: formatSalary(c.prevailing_wage_avg) },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center', padding: '8px 4px', background: '#fafafa', borderRadius: 6, border: '0.5px solid #f3f4f6' }}>
                <div style={{ fontSize: 10, color: '#9ca3af', marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 11.5, fontWeight: 500 }}>{item.value}</div>
              </div>
            ))}
          </div>
          {salaryVsPrevailing !== null && (
            <div style={{ fontSize: 11, color: '#3B6D11', marginTop: 8 }}>
              Avg salary is {salaryVsPrevailing >= 0 ? '+' : ''}{salaryVsPrevailing}% {salaryVsPrevailing >= 0 ? 'above' : 'below'} DOL prevailing wage
            </div>
          )}
        </div>
        {topJobs.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>Top job titles</div>
            {topJobs.map((job, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '0.5px solid #f3f4f6' }}>
                <span style={{ fontSize: 10.5, color: '#9ca3af', width: 14 }}>{i + 1}</span>
                <span style={{ fontSize: 12 }}>{job}</span>
              </div>
            ))}
          </div>
        )}
        {topStates.length > 0 && (
          <div>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>Work locations</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
              {topStates.map((state, i) => (
                <span key={i} style={{ fontSize: 11, background: i === 0 ? '#E6F1FB' : '#f3f4f6', color: i === 0 ? '#185FA5' : '#6b7280', padding: '3px 10px', borderRadius: 5 }}>
                  {state}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>Green card sponsorship</div>
        {!c.has_perm ? (
          <div style={{ fontSize: 12.5, color: '#6b7280', lineHeight: 1.6 }}>
            No PERM green card filings found for this employer name. The company may file under a different legal entity.
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 500, background: '#EAF3DE', color: '#3B6D11', padding: '3px 8px', borderRadius: 5 }}>Active PERM sponsor</span>
              <span style={{ fontSize: 11, color: '#9ca3af' }}>5-year data</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
              {[
                { label: 'Total filings', value: formatNumber(c.perm_total_5yr) },
                { label: 'Approval rate', value: permApprovalRate + '%' },
                { label: 'Avg PERM wage', value: formatSalary(c.perm_avg_wage) },
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center', padding: '10px', background: '#fafafa', borderRadius: 8, border: '0.5px solid #f3f4f6' }}>
                  <div style={{ fontSize: 10.5, color: '#9ca3af', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>Annual filings</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6, marginBottom: 12 }}>
              {[
                { yr: '2021', val: c.perm_fy2021 },
                { yr: '2022', val: c.perm_fy2022 },
                { yr: '2023', val: c.perm_fy2023 },
                { yr: '2024', val: c.perm_fy2024 },
                { yr: '2025', val: c.perm_fy2025 },
              ].map(item => (
                <div key={item.yr} style={{ textAlign: 'center', padding: '8px', background: '#fafafa', borderRadius: 6, border: '0.5px solid #f3f4f6' }}>
                  <div style={{ fontSize: 10.5, color: '#9ca3af', marginBottom: 3 }}>{item.yr}</div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{formatNumber(item.val)}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: '8px 12px', background: '#f9fafb', border: '0.5px solid #f3f4f6', borderRadius: 7, fontSize: 11, color: '#9ca3af', lineHeight: 1.5 }}>
              PERM data is based on the exact legal entity name as filed with the U.S. Department of Labor.
            </div>
          </div>
        )}
      </div>

      {topSchools.length > 0 && (
        <div style={{ padding: '14px 16px', border: '0.5px solid #e5e7eb', borderRadius: 10, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
            Top hiring schools
          </div>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 12 }}>
            Universities most represented in PERM filings · FY2021–2024
          </div>
          {topSchools.map((s, i) => {
            const schoolSlug = s.university_std.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
            return (
              <a
                key={i}
                href={'/school/' + schoolSlug}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '0.5px solid #f3f4f6', textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10.5, color: '#9ca3af', width: 14 }}>{i + 1}</span>
                  <div>
                    <div style={{ fontSize: 12, color: '#1a1a1a' }}>
                      {s.university_std.toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </div>
                    {s.top_major && (
                      <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 1 }}>{s.top_major}</div>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 500, color: '#1a1a1a' }}>{s.perm_count} cases</div>
                  {s.avg_annual_wage && (
                    <div style={{ fontSize: 10.5, color: '#9ca3af' }}>${Math.round(s.avg_annual_wage).toLocaleString()} avg</div>
                  )}
                </div>
              </a>
            )
          })}
          <div style={{ fontSize: 10.5, color: '#9ca3af', marginTop: 10, lineHeight: 1.5 }}>
            Based on PERM green card filings. Reflects universities where employees obtained degrees before sponsorship.
          </div>
        </div>
      )}

      <div style={{ padding: '12px 14px', background: '#f9fafb', border: '0.5px solid #f3f4f6', borderRadius: 8, fontSize: 11.5, color: '#6b7280', lineHeight: 1.65 }}>
        Green card wait time varies by nationality: Korea / EU — 1-5 yr · China — 20-50 yr · India — 100+ yr. India/China nationals should consider Canada as a parallel track.
      </div>
    </div>
  )
}