export function formatSalary(amount: number | null | undefined): string {
  if (!amount) return 'N/A'
  return `$${Math.round(amount).toLocaleString()}`
}

export function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined) return 'N/A'
  return Math.round(n).toLocaleString()
}

export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

export function trendColor(trend: string): string {
  switch (trend) {
    case 'INCREASING': return 'bg-[#dcfce7] text-[#166534]'
    case 'STABLE':     return 'bg-[#dbeafe] text-[#1e40af]'
    case 'DECREASING': return 'bg-[#fee2e2] text-[#991b1b]'
    case 'NEW':        return 'bg-[#f3e8ff] text-[#6b21a8]'
    case 'STOPPED':    return 'bg-gray-100 text-gray-600'
    default:           return 'bg-gray-100 text-gray-600'
  }
}

export function trendLabel(trend: string): string {
  switch (trend) {
    case 'INCREASING': return 'Growing'
    case 'STABLE':     return 'Stable'
    case 'DECREASING': return 'Declining'
    case 'NEW':        return 'New'
    case 'STOPPED':    return 'Inactive'
    default:           return '-'
  }
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
