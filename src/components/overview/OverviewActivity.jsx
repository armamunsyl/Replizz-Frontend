import { useNavigate } from 'react-router-dom'

const statusStyle = {
  Replied: { bg: '#F0FDF4', color: '#16A34A' },
  Pending: { bg: '#FFF7ED', color: '#EA580C' },
}

function OverviewActivity({ activity = [] }) {
  const navigate = useNavigate()
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px', width: 280, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Recent Activity</h3>
        <button type="button" onClick={() => navigate('/inbox')} style={{ background: 'none', border: 'none', fontSize: 12, color: '#2563EB', cursor: 'pointer', fontWeight: 500, padding: 0 }}>View all</button>
      </div>

      {activity.length === 0 ? (
        <p style={{ fontSize: 13, color: '#9CA3AF', padding: '20px 0', textAlign: 'center' }}>No activity yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {activity.map((item) => {
            const { bg, color } = statusStyle[item.status] || { bg: '#F9FAFB', color: '#6B7280' }
            return (
              <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 5 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#111827', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.preview}</p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color, background: bg, padding: '2px 7px', borderRadius: 6, flexShrink: 0 }}>{item.status}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OverviewActivity
