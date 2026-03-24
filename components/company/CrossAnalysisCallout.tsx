interface Props { hasPerm: boolean }

export default function CrossAnalysisCallout({ hasPerm }: Props) {
  if (!hasPerm) return null
  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      padding: '12px 14px', marginBottom: 24,
      background: '#eff6ff', border: '0.5px solid #bfdbfe', borderRadius: 10,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        background: '#185FA5', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 600, flexShrink: 0, marginTop: 1,
      }}>✓</div>
      <div>
        <p style={{ fontSize: 12.5, fontWeight: 500, color: '#1e3a5f', margin: '0 0 2px' }}>
          This company sponsors both H1B work visas and PERM green cards.
        </p>
        <p style={{ fontSize: 11.5, color: '#3b5f8a', margin: 0 }}>
          Dual sponsorship significantly reduces long-term immigration risk.
        </p>
      </div>
    </div>
  )
}
