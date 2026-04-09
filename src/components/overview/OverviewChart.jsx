function OverviewChart({ days = [], series = [] }) {
  const max = Math.max(...series, 1)
  const chartH = 140
  const barW = 28
  const gap = 16

  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px 20px 16px', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 2 }}>AI Replies — Last 7 Days</h3>
          <p style={{ fontSize: 12, color: '#9CA3AF' }}>Daily message activity</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: '#2563EB' }} />
          <span style={{ fontSize: 12, color: '#6B7280' }}>Replies</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: gap, height: chartH + 24 }}>
        {series.map((val, i) => {
          const pct = val / max
          const barH = Math.max(pct * chartH, 4)
          return (
            <div key={days[i] || i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
              <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div
                  title={`${val} replies`}
                  style={{
                    width: barW, height: barH,
                    background: `linear-gradient(to top, #2563EB, #60A5FA)`,
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease',
                    cursor: 'default',
                  }}
                />
              </div>
              <span style={{ fontSize: 11, color: '#9CA3AF', whiteSpace: 'nowrap' }}>{days[i] || ''}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OverviewChart
