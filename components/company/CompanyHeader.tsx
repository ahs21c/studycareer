import { SECTOR_LABELS, STATE_NAMES } from '@/lib/constants'
import Link from 'next/link'

interface Props {
  name: string
  sector: string
  state: string
  trend: string
}

const TREND_STYLE: Record<string, { bg: string; text: string; label: string; arrow: string }> = {
  INCREASING: { bg: '#dcfce7', text: '#166534', label: 'Growing',  arrow: '↑' },
  STABLE:     { bg: '#dbeafe', text: '#1e40af', label: 'Stable',   arrow: '→' },
  DECREASING: { bg: '#fee2e2', text: '#991b1b', label: 'Declining', arrow: '↓' },
  NEW:        { bg: '#f3e8ff', text: '#6b21a8', label: 'New',      arrow: '★' },
  STOPPED:    { bg: '#f3f4f6', text: '#6b7280', label: 'Inactive', arrow: '—' },
}

function toTitleCase(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

export default function CompanyHeader({ name, sector, state, trend }: Props) {
  const sectorLabel = SECTOR_LABELS[sector] ?? sector.replace(/_/g, ' ')
  const sectorSlug  = sector.toLowerCase().replace(/_/g, '-')
  const stateName   = STATE_NAMES[state] ?? state
  const t = TREND_STYLE[trend] ?? TREND_STYLE.STABLE

  return (
    <div style={{ paddingBottom: 24, borderBottom: '0.5px solid #e5e7eb', marginBottom: 24 }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9ca3af', marginBottom: 16 }}>
        <Link href="/rankings/top-100" style={{ color: '#9ca3af' }}>Companies</Link>
        <span>›</span>
        <Link href={`/sector/${sectorSlug}`} style={{ color: '#9ca3af' }}>{sectorLabel}</Link>
        <span>›</span>
        <span style={{ color: '#6b7280' }}>{toTitleCase(name)}</span>
      </div>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-.5px', lineHeight: 1.2, marginBottom: 10 }}>
            {toTitleCase(name)}
          </h1>
          {/* Meta pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <Link href={`/sector/${sectorSlug}`} style={{
              fontSize: 11, fontWeight: 500,
              background: '#E6F1FB', color: '#185FA5',
              padding: '3px 9px', borderRadius: 5,
            }}>
              {sectorLabel}
            </Link>
            <span style={{ fontSize: 11, color: '#9ca3af', padding: '3px 0' }}>
              {stateName}
            </span>
            <span style={{
              fontSize: 11, fontWeight: 500,
              background: t.bg, color: t.text,
              padding: '3px 9px', borderRadius: 5,
            }}>
              {t.arrow} {t.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
