import Link from 'next/link'

const LINKS = [
  {
    heading: 'Data',
    items: [
      { label: 'Top 100 companies', href: '/rankings/top-100' },
      { label: 'By state',          href: '/rankings/by-state' },
      { label: 'By industry',       href: '/rankings/by-industry' },
      { label: 'Cap-exempt',        href: '/cap-exempt' },
    ],
  },
  {
    heading: 'Tools',
    items: [
      { label: 'Real income calculator',  href: '/calculator/real-income' },
      { label: 'H1B lottery calculator',  href: '/calculator/lottery' },
      { label: 'Visa eligibility checker', href: '/calculator/visa-check' },
    ],
  },
  {
    heading: 'Resources',
    items: [
      { label: 'Blog',        href: '/blog' },
      { label: 'Methodology', href: '/methodology' },
    ],
  },
  {
    heading: 'About',
    items: [
      { label: 'About us', href: '/about' },
    ],
  },
]

export default function Footer() {
  return (
    <footer style={{ borderTop: '0.5px solid #e5e7eb', marginTop: 12 }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '28px 24px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 24 }}>
          {LINKS.map(col => (
            <div key={col.heading}>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 10 }}>{col.heading}</div>
              {col.items.map(item => (
                <Link key={item.href} href={item.href}
                  style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 7 }}>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{
          borderTop: '0.5px solid #f3f4f6',
          paddingTop: 16,
          textAlign: 'center',
          fontSize: 10.5,
          color: '#9ca3af',
          lineHeight: 1.7,
        }}>
          <p>Employment and visa data sourced from U.S. Department of Labor (DOL) and USCIS public records.</p>
          <p>This service is not affiliated with or endorsed by any U.S. government agency.</p>
        </div>
      </div>
    </footer>
  )
}
