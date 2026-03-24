'use client'

import Link from 'next/link'
import { useState } from 'react'
import SearchBar from '@/components/layout/SearchBar'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { label: 'Companies',      href: '/rankings/top-100' },
    { label: 'Rankings',       href: '/rankings/top-100' },
    { label: 'By Nationality', href: '/by-nationality' },
    { label: 'Calculators',    href: '/calculator/real-income' },
    { label: 'Blog',           href: '/blog' },
  ]

  return (
    <nav style={{ borderBottom: '0.5px solid #e5e7eb', background: '#fff', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <Link href="/" style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-.3px', flexShrink: 0 }}>
          Study<span style={{ color: '#185FA5' }}>Career</span>
        </Link>

        <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
          {links.map(({ label, href }) => (
            <Link key={label} href={href} style={{
              fontSize: 12.5,
              fontWeight: label === 'By Nationality' ? 500 : 400,
              color: label === 'By Nationality' ? '#185FA5' : '#6b7280',
            }}>
              {label}
            </Link>
          ))}
        </div>

        <div style={{ flex: 1, maxWidth: 180 }}>
          <SearchBar />
        </div>
      </div>
    </nav>
  )
}