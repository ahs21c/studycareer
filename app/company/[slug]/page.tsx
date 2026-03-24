import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { COMPANIES } from '@/lib/data/companies'
import { formatNumber, formatSalary } from '@/lib/utils'
import CompanyHeader from '@/components/company/CompanyHeader'
import StatCards from '@/components/company/StatCards'
import CrossAnalysisCallout from '@/components/company/CrossAnalysisCallout'
import H1BActivity from '@/components/company/H1BActivity'
import GreenCardSection from '@/components/company/GreenCardSection'

export const revalidate = 604800

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const c = COMPANIES[slug]
  if (!c) return { title: 'Company not found' }
  return {
    title: `${c.employer_name} — H1B Visa Sponsorship + Green Card Data`,
    description: `${c.employer_name} filed ${formatNumber(c.lca_total_2yr)} H1B applications (FY2024–2025), avg salary ${formatSalary(c.avg_salary_fy2025)}. ${c.has_perm ? 'Also sponsors PERM green cards.' : ''}`,
  }
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params
  const c = COMPANIES[slug]
  if (!c) notFound()

  return (
    <div>
      <CompanyHeader
        name={c.employer_name}
        sector={c.sector}
        state={c.state}
        trend={c.lca_trend}
      />
      <StatCards
        lcaTotal={c.lca_total_2yr}
        avgSalary={c.avg_salary_fy2025}
        permTotal={c.perm_total_4yr}
        prevailingWage={c.prevailing_wage_avg}
        hasPerm={c.has_perm}
        lcaFy2024={c.lca_fy2024}
        lcaFy2025={c.lca_fy2025}
      />
      <CrossAnalysisCallout hasPerm={c.has_perm} />
      <H1BActivity
        topJobs={c.top_jobs}
        topStates={c.top_states}
        avgSalary={c.avg_salary_fy2025}
        medianSalary={c.median_salary_fy2025}
        p75Salary={c.p75_salary_fy2025}
        prevailingWage={c.prevailing_wage_avg}
        lcaFy2024={c.lca_fy2024}
        lcaFy2025={c.lca_fy2025}
      />
      <GreenCardSection
        hasPerm={c.has_perm}
        permTotal={c.perm_total_4yr}
        permCertified={c.perm_certified}
        permAvgWage={c.perm_avg_wage}
        permFy2021={c.perm_fy2021}
        permFy2022={c.perm_fy2022}
        permFy2023={c.perm_fy2023}
        permFy2024={c.perm_fy2024}
      />
    </div>
  )
}
