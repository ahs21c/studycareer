import Link from 'next/link'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  link: string
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(
      'https://ahs21c.blogspot.com/feeds/posts/default?alt=json&max-results=12',
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    const entries = data.feed?.entry ?? []
    return entries.map((entry: Record<string, unknown>) => {
      const links = entry.link as { rel: string; href: string }[]
      const link = links?.find((l) => l.rel === 'alternate')?.href ?? ''
      const slug = link.split('/').pop()?.replace('.html', '') ?? ''
      const content = (entry.content as { $t: string } | undefined)?.$t ?? 
                      (entry.summary as { $t: string } | undefined)?.$t ?? ''
      const excerpt = content.replace(/<[^>]+>/g, '').slice(0, 120) + '...'
      const dateRaw = (entry.published as { $t: string })?.$t ?? ''
      const date = dateRaw ? new Date(dateRaw).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''
      const title = (entry.title as { $t: string })?.$t ?? 'Untitled'
      return { slug, title, excerpt, date, link }
    })
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>Blog</h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>H1B, green card, and US career guides for international students.</p>
      </div>

      {posts.length === 0 ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
          No posts available. Check back soon.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {posts.map((post) => (
            
              key={post.slug}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', textDecoration: 'none' }}
            >
              <div className="sc-card" style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: '#1a1a1a', marginBottom: 5, lineHeight: 1.45 }}>
                  {post.title}
                </div>
                <div style={{ fontSize: 11.5, color: '#6b7280', lineHeight: 1.55, marginBottom: 8 }}>
                  {post.excerpt}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>{post.date}</span>
                  <span style={{ fontSize: 11, color: '#185FA5', fontWeight: 500 }}>Read →</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}