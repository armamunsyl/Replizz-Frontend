import { useCallback, useEffect, useState } from 'react'
import api from '../../lib/api'

function AdminReportsView() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/admin/reports?limit=100')
      setReports(data.data || [])
    } catch (err) {
      console.error('Admin reports error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchReports() }, [fetchReports])

  const thStyle = { padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap', borderBottom: '1px solid #E5E7EB' }
  const tdStyle = { padding: '10px 12px', fontSize: 13, color: '#374151', borderBottom: '1px solid #F3F4F6' }

  return (
    <div style={{ padding: '28px 28px 40px', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Admin Panel</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>Message Reports</h1>
        </div>
        <span style={{ fontSize: 12, color: '#6B7280', background: '#F3F4F6', border: '1px solid #E5E7EB', padding: '4px 10px', borderRadius: 6 }}>{reports.length} logs</span>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '40px 0', color: '#9CA3AF', fontSize: 13 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #E5E7EB', borderTopColor: '#2563EB', animation: 'spin 0.8s linear infinite' }} />
          Loading reports…
        </div>
      ) : reports.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#9CA3AF' }}>No message logs yet.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={thStyle}>Page ID</th>
                  <th style={thStyle}>Sender</th>
                  <th style={thStyle}>Message</th>
                  <th style={thStyle}>Tokens</th>
                  <th style={thStyle}>Cost</th>
                  <th style={thStyle}>Date</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(log => (
                  <tr key={log._id}>
                    <td style={tdStyle}><code style={{ fontSize: 12, background: '#F3F4F6', padding: '2px 6px', borderRadius: 4 }}>{log.pageId?.slice(0, 12) || '—'}…</code></td>
                    <td style={tdStyle}><code style={{ fontSize: 12, background: '#F3F4F6', padding: '2px 6px', borderRadius: 4 }}>{log.senderId?.slice(0, 10) || '—'}…</code></td>
                    <td style={{ ...tdStyle, maxWidth: 280 }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                        {log.messageText ? log.messageText.slice(0, 60) + (log.messageText.length > 60 ? '…' : '') : '[media]'}
                      </span>
                    </td>
                    <td style={tdStyle}>{(log.totalTokens || 0).toLocaleString()}</td>
                    <td style={tdStyle}>${(log.estimatedCost || 0).toFixed(4)}</td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap', color: '#6B7280' }}>
                      {log.createdAt ? new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminReportsView
