'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SearchBar from '@/components/layout/SearchBar'

export default function Navbar() {
  const pathname = usePathname()

const links = [
  { label: 'Companies',      href: '/rankings/top-100', match: '/company' },
  { label: 'Rankings',       href: '/rankings/top-100', match: '/rankings' },
  { label: 'Sectors',        href: '/sector',           match: '/sector' },
  { label: 'By Nationality', href: '/by-nationality',   match: '/by-nationality' },
  { label: 'Cap-Exempt',     href: '/cap-exempt',       match: '/cap-exempt' },
  { label: 'Calculators',    href: '/calculator/real-income', match: '/calculator' },
  { label: 'Blog',           href: '/blog',             match: '/blog' },
]

  return (
    <nav style={{ borderBottom: '0.5px solid #e5e7eb', background: '#fff', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <Link href="/" style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-.3px', flexShrink: 0 }}>
          Study<span style={{ color: '#185FA5' }}>Career</span>
        </Link>

        <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
         {links.map(({ label, href, match }) => {
            const isActive = pathname.startsWith(match)
            return (
              <Link key={label} href={href} style={{
                fontSize: 12.5,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? '#185FA5' : '#6b7280',
              }}>
                {label}
              </Link>
            )
          })}
        </div>

        <div style={{ flex: 1, maxWidth: 180 }}>
          <SearchBar />
        </div>
      </div>
    </nav>
  )
}