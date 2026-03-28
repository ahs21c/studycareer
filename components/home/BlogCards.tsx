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
  const latestPost = BLOG_POSTS[0]
  const cat = latestPost ? (CAT_STYLE[latestPost.category] ?? CAT_STYLE.DEFAULT) : CAT_STYLE.DEFAULT

  return (
    <section style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <h2 style={{ fontSize: 14, fontWeight: 500 }}>Explore more</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {/* Find your match — City comparison */}
        <Link href="/city" className="sc-card" style={{ padding: 16, display: 'block' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: '#FAEEDA', color: '#854F0B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 600, marginBottom: 10,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 5 }}>Find your match</div>
          <p style={{ fontSize: 11.5, color: '#6b7280', lineHeight: 1.55, marginBottom: 10 }}>
            Compare cities by salary, cost of living, and visa-friendly employers side by side.
          </p>
          <span style={{ fontSize: 11, color: '#185FA5', fontWeight: 500 }}>Compare cities →</span>
        </Link>

        {/* Latest blog post */}
        {latestPost && (
          <Link href={`/blog/${latestPost.slug}`} className="sc-card" style={{ padding: 16, display: 'block' }}>
            <span style={{
              fontSize: 9.5, fontWeight: 500,
              background: cat.bg, color: cat.color,
              padding: '2px 7px', borderRadius: 4,
              display: 'inline-block', marginBottom: 8,
            }}>
              {latestPost.category}
            </span>
            <div style={{ fontSize: 12.5, fontWeight: 500, lineHeight: 1.5, color: '#1a1a1a', marginBottom: 8 }}>
              {latestPost.title}
            </div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 10 }}>{latestPost.date}</div>
            <span style={{ fontSize: 11, color: '#185FA5', fontWeight: 500 }}>Read more →</span>
          </Link>
        )}

        {/* Cap-exempt employers */}
        <Link href="/cap-exempt" className="sc-card" style={{ padding: 16, display: 'block' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: '#E1F5EE', color: '#0F6E56',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 600, marginBottom: 10,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 5 }}>Cap-exempt employers</div>
          <p style={{ fontSize: 11.5, color: '#6b7280', lineHeight: 1.55, marginBottom: 10 }}>
            Universities and research institutions that can sponsor H1B without the annual cap or lottery.
          </p>
          <span style={{ fontSize: 11, color: '#185FA5', fontWeight: 500 }}>Browse cap-exempt →</span>
        </Link>
      </div>
    </section>
  )
}