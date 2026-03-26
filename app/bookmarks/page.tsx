'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getBookmarks, removeBookmark } from '@/lib/supabase/bookmarks'
import { createClient } from '@/lib/supabase/client'

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        getBookmarks().then(data => {
          setBookmarks(data)
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })
  }, [])

  const handleRemove = async (slug: string) => {
    await removeBookmark(slug)
    setBookmarks(prev => prev.filter(b => b.slug !== slug))
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', fontSize: 13, color: '#9ca3af' }}>Loading...</div>

  if (!user) return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Sign in to view bookmarks</div>
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>Save companies and access them anytime.</div>
      <Link href="/login" style={{ fontSize: 13, fontWeight: 500, color: '#fff', background: '#185FA5', padding: '8px 20px', borderRadius: 7, textDecoration: 'none' }}>
        Sign in
      </Link>
    </div>
  )

  return (
    <div>
      <div style={{ paddingBottom: 20, borderBottom: '0.5px solid #e5e7eb', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
          <a href="/" style={{ color: '#9ca3af' }}>Home</a>
          <span>›</span>
          <span style={{ color: '#6b7280' }}>Saved companies</span>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-.4px', marginBottom: 4 }}>Saved companies</h1>
        <p style={{ fontSize: 13, color: '#6b7280' }}>{bookmarks.length} saved</p>
      </div>

      {bookmarks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>No saved companies yet</div>
          <div style={{ fontSize: 12.5, color: '#9ca3af', marginBottom: 20 }}>Browse companies and click ★ to save them here.</div>
          <Link href="/search" style={{ fontSize: 13, fontWeight: 500, color: '#185FA5' }}>Browse companies →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {bookmarks.map(b => (
            <div key={b.slug} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', border: '0.5px solid #e5e7eb', borderRadius: 9 }}>
              <Link href={`/company/${b.slug}`} style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', textDecoration: 'none' }}>
                {b.employer_name}
              </Link>
              <button
                onClick={() => handleRemove(b.slug)}
                style={{ fontSize: 12, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}