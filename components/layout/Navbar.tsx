'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import SearchBar from '@/components/layout/SearchBar'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.refresh()
  }

  const links = [
    { label: 'Companies',      href: '/search',               match: '/search' },
    { label: 'Rankings',       href: '/rankings/top-100',      match: '/rankings' },
    { label: 'Sectors',        href: '/sector',                match: '/sector' },
    { label: 'Schools',        href: '/school',                match: '/school' },
    { label: 'Cities',         href: '/city',                  match: '/city' },
    { label: 'E2 Visa',        href: '/e2',                    match: '/e2' },
    { label: 'Cap-Exempt',     href: '/cap-exempt',            match: '/cap-exempt' },
    { label: 'Calculators',    href: '/calculator/real-income',match: '/calculator' },
  ]

  return (
    <nav style={{ borderBottom: '0.5px solid #e5e7eb', background: '#fff', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <Link href="/" style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-.3px', flexShrink: 0 }}>
          Study<span style={{ color: '#185FA5' }}>Career</span>
        </Link>

        <div style={{ display: 'flex', gap: 16, flexShrink: 0, overflowX: 'auto' }}>
          {links.map(({ label, href, match }) => {
            const isActive = pathname.startsWith(match)
            return (
              <Link key={label} href={href} style={{
                fontSize: 12.5,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? '#185FA5' : '#6b7280',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </Link>
            )
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ width: 160 }}>
            <SearchBar />
          </div>
          {user ? (
            <button
              onClick={handleSignOut}
              style={{ fontSize: 12, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
            >
              Sign out
            </button>
          ) : (
            <Link href="/login" style={{
              fontSize: 12.5, fontWeight: 500, color: '#fff',
              background: '#185FA5', padding: '5px 14px', borderRadius: 6,
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}>
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}