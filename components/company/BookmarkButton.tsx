'use client'
import { useEffect, useState } from 'react'
import { addBookmark, removeBookmark, isBookmarked } from '@/lib/supabase/bookmarks'
import { createClient } from '@/lib/supabase/client'

export default function BookmarkButton({ slug, employerName }: { slug: string; employerName: string }) {
  const [bookmarked, setBookmarked] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        isBookmarked(slug).then(v => {
          setBookmarked(v)
          setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })
  }, [slug])

  const handleToggle = async () => {
    if (!user) {
      window.location.href = '/login'
      return
    }
    if (bookmarked) {
      await removeBookmark(slug)
      setBookmarked(false)
    } else {
      await addBookmark(slug, employerName)
      setBookmarked(true)
    }
  }

  if (loading) return null

  return (
    <button
      onClick={handleToggle}
      style={{
        fontSize: 13, fontWeight: 500,
        color: bookmarked ? '#185FA5' : '#9ca3af',
        background: bookmarked ? '#E6F1FB' : '#f3f4f6',
        border: 'none', cursor: 'pointer',
        padding: '5px 12px', borderRadius: 6,
        flexShrink: 0,
      }}
    >
      {bookmarked ? '★ Saved' : '☆ Save'}
    </button>
  )
}