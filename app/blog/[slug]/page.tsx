import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BLOG_POSTS } from '@/lib/data/companies'

export const revalidate = 3600

interface Props { params: Promise<{ slug: string }> }

const POST_CONTENT: Record<string, { title: string; category: string; date: string; body: string }> = {
  'top-50-gc-sponsors-2026': {
    title: 'Top 50 companies sponsoring green cards in 2026',
    category: 'RANKINGS',
    date: 'Mar 18, 2026',
    body: `Amazon leads all employers with 21,426 PERM filings across FY2021–2024, followed by Microsoft (12,540) and Google (10,622). These three companies alone account for nearly 15% of all certified PERM cases in the dataset.

The data comes from DOL PERM certified records — only cases where the employer successfully completed the labor market test. Pending or denied cases are excluded.

Key findings from the FY2021–2024 PERM data:
- IT and tech sectors dominate, representing 60%+ of all certified cases
- Average PERM wage offer: $119,000 across all certified cases
- Certification rate varies: large employers typically see 40–60% certification rates
- FY2023 saw a spike in filings as employers front-loaded applications ahead of potential policy changes

For international students on F-1 OPT, finding an employer on this list dramatically improves long-term immigration stability. H1B sponsorship alone is not enough — PERM sponsorship signals the employer's willingness to invest in permanent residency.`,
  },
  'sf-vs-austin-take-home': {
    title: 'H1B salary: San Francisco vs Austin real take-home',
    category: 'SALARY',
    date: 'Mar 15, 2026',
    body: `A $180,000 offer in San Francisco and a $150,000 offer in Austin produce nearly identical real purchasing power — once you account for California state income tax and Bay Area cost of living.

Here's the breakdown for a single filer in 2025:

San Francisco — $180,000 gross:
- Federal tax: ~$38,000
- California state tax: ~$16,500
- FICA: ~$12,600
- Net: ~$112,900
- After rent ($3,200/mo studio): ~$74,500/yr disposable

Austin — $150,000 gross:
- Federal tax: ~$28,500
- Texas state tax: $0
- FICA: ~$11,000
- Net: ~$110,500
- After rent ($1,800/mo studio): ~$89,900/yr disposable

Austin actually leaves you with ~$15,000 more per year in disposable income despite the lower nominal salary. This gap widens significantly for families, where California's tax brackets hit harder.

For H1B workers, Austin also offers strategic advantages: lower prevailing wages mean employers face less pressure to hit Level 3/4 thresholds under the FY2027 wage-weighted lottery.`,
  },
  'fy2027-wage-weighted-lottery': {
    title: 'FY2027 wage-weighted H1B lottery: what changed',
    category: 'POLICY',
    date: 'Mar 10, 2026',
    body: `Starting with FY2027 registrations (March 2026), USCIS replaced the random lottery with a wage-weighted system. Each registration is assigned 1 to 4 "tickets" based on the offered wage relative to the DOL prevailing wage for that occupation and location.

The four wage levels and estimated selection rates:
- Level 1 (entry, below median): ~15% selection rate
- Level 2 (qualified, at median): ~25% selection rate  
- Level 3 (experienced, above median): ~40% selection rate
- Level 4 (fully competent, top of range): ~61% selection rate

What this means in practice:

For employers: Offering Level 4 wages gives roughly 4x better odds than Level 1. Companies that consistently offered minimum prevailing wages now face a structural disadvantage — IT outsourcing firms in particular.

For applicants: Negotiating a higher salary is no longer just about compensation — it directly affects H1B lottery odds. A $10,000 salary increase that pushes you from Level 2 to Level 3 could increase your selection probability from 25% to 40%.

For international students on OPT: The wage-weighted system applies to cap-subject registrations only. Students converting from F-1 OPT to H1B are still subject to the lottery but may benefit from OPT STEM extension (3 chances total).

Note: Legal challenges to the wage-weighted rule are ongoing. The rule is currently in effect for FY2027 but could be modified.`,
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = POST_CONTENT[slug]
  if (!post) return { title: 'Post not found' }
  return { title: post.title, description: post.body.slice(0, 150) + '...' }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = POST_CONTENT[slug]
  if (!post) notFound()

  return (
    <div className="max-w-[620px]">
      <Link href="/blog" className="text-xs text-[#185FA5] hover:underline mb-6 inline-block">
        ← Blog
      </Link>
      <div className="text-[11px] text-[#185FA5] font-medium mb-2">{post.category}</div>
      <h1 className="text-xl font-semibold leading-snug mb-2">{post.title}</h1>
      <div className="text-xs text-gray-400 mb-8">{post.date}</div>
      <div className="space-y-4">
        {post.body.split('\n\n').map((para, i) => (
          <p key={i} className="text-sm text-gray-700 leading-relaxed">{para}</p>
        ))}
      </div>
      <div className="mt-10 pt-6 border-t border-gray-100 text-xs text-gray-400">
        Data sourced from DOL OFLC public records. Not legal or financial advice.
      </div>
    </div>
  )
}
