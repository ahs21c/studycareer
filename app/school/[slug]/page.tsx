import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SCHOOL_PIPELINES } from '@/lib/data/companies'
import { formatSalary } from '@/lib/utils'

export const revalidate = 604800

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  return {
    title: `${name} — Graduate Employment Pipeline`,
    description: `Where graduates from ${name} get hired for H1B jobs and green card sponsorship.`,
  }
}

export default async function SchoolPage({ params }: Props) {
  const { slug } = await params
  const schoolName = slug.replace(/-/g, ' ')

  // When Supabase is connected, replace with: getSchoolPipelines(schoolName)
  const pipelines = SCHOOL_PIPELINES.filter(p =>
    p.university.toLowerCase().includes(schoolName.toLowerCase())
  )

  if (pipelines.length === 0) notFound()

  const displayName = pipelines[0].university

  return (
    <div>
      <div className="mb-6">
        <div className="text-xs text-[#185FA5] font-medium mb-1">School profile</div>
        <h1 className="text-xl font-semibold mb-1">{displayName}</h1>
        <p className="text-sm text-gray-500">
          Graduate employment pipeline — based on PERM green card data FY2022–2024.
        </p>
      </div>

      <div className="mb-4 p-3.5 bg-[#E6F1FB] rounded-xl text-xs text-[#1e3a5f]">
        This data shows which employers sponsored green cards for graduates of this university,
        based on PERM filings where the foreign worker listed this institution.
      </div>

      <div className="space-y-2">
        {pipelines.map((p, i) => (
          <div
            key={p.employer}
            className="flex items-center gap-3 p-3.5 px-4 border border-gray-200 rounded-xl"
          >
            <span className="text-sm text-gray-400 w-6 shrink-0">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate mb-0.5">{p.employer}</div>
              <div className="text-xs text-gray-500">
                {p.top_major} · {p.top_degree} · {p.top_state}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-semibold">{p.perm_count}</div>
              <div className="text-[10px] text-gray-400">PERM cases</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm font-medium">{formatSalary(p.avg_wage)}</div>
              <div className="text-[10px] text-gray-400">avg wage</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
