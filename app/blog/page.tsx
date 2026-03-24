import type { Metadata } from 'next'
import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/data/companies'

export const metadata: Metadata = {
  title: 'Blog — H1B & Immigration Guides',
  description: 'Data-driven guides on H1B visa strategy, green card sponsorship, salary benchmarks, and US immigration policy.',
}

export const revalidate = 3600

const ALL_POSTS = [
  ...BLOG_POSTS,
  {
    slug: 'h1b-cap-exempt-guide-2026',
    category: 'GUIDE',
    title: 'Cap-exempt H1B: universities and nonprofits that bypass the lottery',
    date: 'Mar 5, 2026',
  },
  {
    slug: 'india-green-card-wait-times',
    category: 'GREEN CARD',
    title: 'India EB-2/EB-3 wait times in 2026: what the data actually shows',
    date: 'Feb 28, 2026',
  },
  {
    slug: 'e2-visa-korean-investors',
    category: 'VISA',
    title: 'E-2 visa for Korean investors: 6,778 issued in FY2024',
    date: 'Feb 20, 2026',
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  RANKINGS: 'text-[#185FA5]',
  SALARY: 'text-[#854F0B]',
  POLICY: 'text-[#166534]',
  GUIDE: 'text-[#6b21a8]',
  'GREEN CARD': 'text-[#3B6D11]',
  VISA: 'text-[#0F6E56]',
}

export default function BlogPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold mb-1">Blog</h1>
        <p className="text-sm text-gray-500">H1B strategy, salary data, and immigration guides.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ALL_POSTS.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className={`text-[11px] font-medium mb-1.5 ${CATEGORY_COLORS[post.category] ?? 'text-[#185FA5]'}`}>
              {post.category}
            </div>
            <div className="text-sm font-medium leading-snug mb-2">{post.title}</div>
            <div className="text-xs text-gray-400">{post.date}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
