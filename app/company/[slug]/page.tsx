import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCompanyBySlug } from '@/lib/supabase/queries'
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
  const c = await getCompanyBySlug(slug)
  if (!c) return { title: 'Company not found' }
  return {
    title: `${c.employer_name} — H1B Visa Sponsorship + Green Card Data`,
    description: `${c.employer_name} filed ${formatNumber(c.h1b_total_3yr)} H1B applications, avg salary ${formatSalary(c.h1b_avg_salary)}. ${c.has_perm ? 'Also sponsors PERM green cards.' : ''}`,
  }
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params
  const c = await getCompanyBySlug(slug)
  if (!c) notFound()

  return (
    <div>
      <CompanyHeader
        name={c.employer_name}
        sector={c.sponsor_type ?? ''}
        state={''}
        trend={c.h1b_trend}
      />
      <StatCards
        lcaTotal={c.h1b_total_3yr}
        avgSalary={c.h1b_avg_salary}
        permTotal={c.perm_total_3yr}
        prevailingWage={null}
        hasPerm={c.has_perm}
        lcaFy2024={c.h1b_fy2024}
        lcaFy2025={c.h1b_fy2024}
      />
      <CrossAnalysisCallout hasPerm={c.has_perm} />
      <H1BActivity
        topJobs={[]}
        topStates={[]}
        avgSalary={c.h1b_avg_salary}
        medianSalary={c.h1b_avg_salary}
        p75Salary={null}
        prevailingWage={null}
        lcaFy2024={c.h1b_fy2024}
        lcaFy2025={c.h1b_fy2024}
      />
      <GreenCardSection
        hasPerm={c.has_perm}
        permTotal={c.perm_total_3yr}
        permCertified={c.perm_certified_3yr}
        permAvgWage={null}
        permFy2021={c.perm_fy2021}
        permFy2022={c.perm_fy2022}
        permFy2023={c.perm_fy2023}
        permFy2024={0}
      />
    </div>
  )
}