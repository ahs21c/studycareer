import { createClient } from '@/lib/supabase/client'

export async function getBookmarks() {
  const supabase = createClient()
  const { data } = await supabase
    .from('bookmarks')
    .select('slug, employer_name, created_at')
    .order('created_at', { ascending: false })
  return data ?? []
}

export async function addBookmark(slug: string, employer_name: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { error } = await supabase.from('bookmarks').insert({ user_id: user.id, slug, employer_name })
  return !error
}

export async function removeBookmark(slug: string) {
  const supabase = createClient()
  const { error } = await supabase.from('bookmarks').delete().eq('slug', slug)
  return !error
}

export async function isBookmarked(slug: string) {
  const supabase = createClient()
  const { data } = await supabase.from('bookmarks').select('id').eq('slug', slug).single()
  return !!data
}