const palette = [
  { bg: '#EFF6FF', color: '#2563EB' },
  { bg: '#F0FDF4', color: '#16A34A' },
  { bg: '#FFF7ED', color: '#EA580C' },
  { bg: '#FDF4FF', color: '#9333EA' },
]

const StatIcon = ({ name }) => {
  const shared = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }
  const icons = {
    message: <svg {...shared}><path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.2-2.5L3 21l2.5-2.8A9 9 0 1 1 21 12Z" /></svg>,
    chat: <svg {...shared}><path d="M5 6.5h14v9H9l-4 3v-12Z" /></svg>,
    chart: <svg {...shared}><path d="M4 20V10" /><path d="M9 20V4" /><path d="M14 20v-8" /><path d="M19 20v-4" /></svg>,
    star: <svg {...shared}><path d="m12 4.6 2.3 4.6 5.1.7-3.7 3.6.9 5.1L12 16.2 7.4 18.6l.9-5.1-3.7-3.6 5.1-.7L12 4.6Z" /></svg>,
  }
  return icons[name] ?? null
}

function OverviewStats({ stats }) {
  if (!stats?.length) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
      {stats.map((stat, i) => {
        const { bg, color } = palette[i % palette.length]
        return (
          <div key={stat.title} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: 14 }}>
              <StatIcon name={stat.icon} />
            </div>
            <p style={{ fontSize: 26, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em', marginBottom: 2 }}>{stat.value}</p>
            <p style={{ fontSize: 13, color: '#6B7280' }}>{stat.title}</p>
          </div>
        )
      })}
    </div>
  )
}

export default OverviewStats
