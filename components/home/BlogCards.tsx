import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/data/companies'

const CAT_STYLE: Record<string, { bg: string; color: string }> = {
  RANKINGS: { bg: '#E6F1FB', color: '#185FA5' },
  SALARY:   { bg: '#FAEEDA', color: '#854F0B' },
  POLICY:   { bg: '#EAF3DE', color: '#3B6D11' },
  VISA:     { bg: '#E1F5EE', color: '#0F6E56' },
  H1B:      { bg: '#E6F1FB', color: '#185FA5' },
  DEFAULT:  { bg: '#f3f4f6', color: '#4b5563' },
}

export default function BlogCards() {
  return (
    <section style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <h2 style={{ fontSize: 14, fontWeight: 500 }}>Latest from the blog</h2>
        <Link href="/blog" style={{ fontSize: 11, color: '#185FA5' }}>View all →</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {BLOG_POSTS.map(post => {
          const cat = CAT_STYLE[post.category] ?? CAT_STYLE.DEFAULT
          return (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="sc-card" style={{ padding: 15, display: 'block' }}>
              <span style={{
                fontSize: 9.5, fontWeight: 500,
                background: cat.bg, color: cat.color,
                padding: '2px 7px', borderRadius: 4,
                display: 'inline-block', marginBottom: 8,
              }}>
                {post.category}
              </span>
              <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.5, color: '#1a1a1a', marginBottom: 8 }}>
                {post.title}
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>{post.date}</div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
