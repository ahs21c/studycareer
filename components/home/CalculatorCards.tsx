import Link from 'next/link'

const CALCS = [
  {
    href: '/calculator/real-income',
    icon: '$',
    iconBg: '#E6F1FB', iconColor: '#185FA5',
    title: 'Real income calculator',
    desc: 'Compare take-home pay across 20 US cities after taxes and cost of living.',
    cta: 'Try it →',
  },
  {
    href: '/calculator/lottery',
    icon: '%',
    iconBg: '#FAEEDA', iconColor: '#854F0B',
    title: 'H1B lottery calculator',
    desc: 'Estimate your FY2027 odds under the new wage-weighted lottery system.',
    cta: 'Try it →',
  },
  {
    href: '/calculator/visa-check',
    icon: 'globe',
    iconBg: '#E1F5EE', iconColor: '#0F6E56',
    title: 'Visa eligibility checker',
    desc: 'See visa types, green card wait times, and E2 eligibility by nationality.',
    cta: 'Check now →',
  },
]

export default function CalculatorCards() {
  return (
    <section style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <h2 style={{ fontSize: 14, fontWeight: 500 }}>Calculators</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {CALCS.map(c => (
          <Link key={c.href} href={c.href} className="sc-card" style={{ padding: 16, display: 'block' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: c.iconBg, color: c.iconColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 600, marginBottom: 10,
            }}>
              {c.icon === 'globe'
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                : c.icon}
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 5 }}>{c.title}</div>
            <p style={{ fontSize: 11.5, color: '#6b7280', lineHeight: 1.55, marginBottom: 10 }}>{c.desc}</p>
            <span style={{ fontSize: 11, color: '#185FA5', fontWeight: 500 }}>{c.cta}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
