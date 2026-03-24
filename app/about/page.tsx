import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About StudyCareer',
  description: 'StudyCareer cross-references 94,000+ US employers — H1B filings, PERM green card data, and salary benchmarks sourced from DOL public records.',
}

export default function AboutPage() {
  return (
    <div className="max-w-[640px]">
      <h1 className="text-2xl font-semibold mb-2">About StudyCareer</h1>
      <p className="text-sm text-gray-500 mb-10">Data-driven H1B and green card research for international job seekers.</p>

      <section className="mb-10">
        <h2 className="text-base font-semibold mb-3">What we do</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          StudyCareer cross-references 94,623 US employers using public data from the Department of Labor —
          combining H1B Labor Condition Applications (LCA), PERM green card filings, and prevailing wage data
          into one searchable platform.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          The raw government data exists but is scattered, inconsistent, and hard to interpret.
          We normalize company names, calculate filing trends, and surface the numbers that matter for your job search.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-base font-semibold mb-3">What makes this different</h2>
        <div className="space-y-3">
          {[
            { title: 'H1B + Green card in one view', desc: 'Most tools show H1B or PERM separately. We join them so you can see both sponsorship tracks for every employer.' },
            { title: 'Real salary benchmarks', desc: 'We use LCA FY2024–2025 certified filings — not job postings, which are often inflated or outdated.' },
            { title: 'Trend signals', desc: 'Year-over-year filing trends tell you whether a company is actively hiring H1B workers right now.' },
            { title: 'School-to-company pipelines', desc: 'PERM data includes the foreign worker\'s institution. We map which universities feed into which employers.' },
          ].map(item => (
            <div key={item.title} className="p-4 bg-gray-50 rounded-xl">
              <div className="text-sm font-medium mb-1">{item.title}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-base font-semibold mb-3">Data sources</h2>
        <ul className="space-y-1.5 text-sm text-gray-600">
          <li>· DOL OFLC — LCA FY2024–2025 (Labor Condition Applications)</li>
          <li>· DOL OFLC — PERM FY2021–2025 (Permanent Labor Certifications)</li>
          <li>· USCIS — H1B Employer Data Hub (FY2022–2024)</li>
          <li>· DOS — Visa Issuance Statistics FY2024</li>
        </ul>
        <p className="text-sm text-gray-500 mt-3">
          See our <Link href="/methodology" className="text-[#185FA5] hover:underline">methodology page</Link> for
          full details on normalization and scoring.
        </p>
      </section>

      <div className="p-4 bg-[#E6F1FB] rounded-xl text-xs text-gray-600 leading-relaxed">
        Employment and visa data is sourced from U.S. Department of Labor (DOL) and USCIS public records.
        This service is not affiliated with or endorsed by any U.S. government agency.
      </div>
    </div>
  )
}
