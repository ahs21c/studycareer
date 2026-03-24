import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Data Methodology — StudyCareer',
  description: 'How StudyCareer collects, normalizes, and cross-references H1B and PERM data from DOL public records.',
}

const SECTIONS = [
  {
    title: 'Data sources',
    items: [
      'LCA (Labor Condition Application) — DOL OFLC FY2024–2025. CERTIFIED records only. LCA is required before an H1B petition, so volume reflects actual hiring activity.',
      'PERM — DOL OFLC FY2021–2025. CERTIFIED records only. First step in EB-2/EB-3 green card sponsorship.',
      'H1B Employer Data Hub — USCIS FY2022–2024. Approval counts by employer, used to cross-validate LCA volumes.',
      'Visa Issuance Statistics — US Dept of State FY2024. Used for nationality-level data (H1B, E-2, L-1 by country).',
    ],
  },
  {
    title: 'Company name normalization',
    items: [
      'Type 1 normalization only: standardizing punctuation, trailing commas, and period variants (INC./INC, LLC./LLC, LLP./LLP).',
      'We do not merge subsidiaries into parent groups. Amazon, Amazon Web Services, and Amazon Fulfillment are tracked separately — their hiring profiles differ meaningfully.',
    ],
  },
  {
    title: 'Sector classification',
    items: [
      'NAICS hybrid system across 60 sectors. For codes 54xx (Professional Services) and 51xx (IT/Media), we use 4-digit codes. Others use 2-digit.',
      'NAICS codes are self-reported by employers on LCA filings. Some classifications may feel counterintuitive (e.g. JPMorgan files under HOLDING_COMPANIES, not BANKING). We do not override self-reported codes.',
    ],
  },
  {
    title: 'Salary figures',
    items: [
      'AVG_SALARY_FY2025 — arithmetic mean of WAGE_RATE_OF_PAY_FROM across certified LCA records. Annual wages only.',
      'MEDIAN and P75 shown only for employers with 4+ FY2025 records, to avoid single-filing distortion.',
      'PREVAILING_WAGE_AVG — DOL-set minimum. Actual salaries typically run 10–30% above prevailing wage.',
    ],
  },
  {
    title: 'Filing trend calculation',
    items: [
      'INCREASING — FY2025 ≥ FY2024 × 1.10',
      'STABLE — within ±10% year-over-year',
      'DECREASING — FY2025 ≤ FY2024 × 0.90',
      'NEW — filed in FY2025 but not FY2024',
      'STOPPED — filed in FY2024 but not FY2025',
    ],
  },
  {
    title: 'H1B Lottery calculator',
    items: [
      'FY2027 introduced wage-weighted lottery. Registrations assigned 1–4 tickets based on wage level vs DOL prevailing wage.',
      'Level 1 (entry): ~15% · Level 2 (qualified): ~25% · Level 3 (experienced): ~40% · Level 4 (fully competent): ~61%',
      'Estimates based on DHS modeling. Actual rates depend on total registration volume. Legal challenges ongoing.',
    ],
  },
  {
    title: 'Known limitations',
    items: [
      'LCA volume ≠ H1B approvals. Not every LCA leads to a petition, and not every petition is approved.',
      'Entity fragmentation: large employers (Deloitte, PwC, IBM) file under multiple legal entities.',
      'IT outsourcing firms (Cognizant, TCS, Infosys) dominate raw counts and may distort sector averages.',
      'Data covers filings through FY2025 (ending Sept 2025). Post-cutoff hiring changes are not reflected.',
    ],
  },
]

export default function MethodologyPage() {
  return (
    <div className="max-w-[640px]">
      <h1 className="text-2xl font-semibold mb-2">Data Methodology</h1>
      <p className="text-sm text-gray-500 mb-10">How we source, clean, and present H1B and green card data.</p>

      <div className="space-y-8">
        {SECTIONS.map(s => (
          <section key={s.title}>
            <h2 className="text-xs font-semibold text-[#185FA5] uppercase tracking-wide mb-3">{s.title}</h2>
            <div className="space-y-2">
              {s.items.map((item, i) => (
                <p key={i} className="text-sm text-gray-600 leading-relaxed">· {item}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 leading-relaxed">
        Employment and visa data is sourced from U.S. Department of Labor (DOL) and USCIS public records.
        This service is not affiliated with or endorsed by any U.S. government agency.
      </div>
    </div>
  )
}
