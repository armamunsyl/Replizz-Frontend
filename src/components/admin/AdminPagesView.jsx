import { useCallback, useEffect, useState } from 'react'
import api from '../../lib/api'

function AdminPagesView() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPages = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/admin/pages')
      setPages(data.data || [])
    } catch (err) {
      console.error('Admin pages error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPages() }, [fetchPages])

  const thStyle = { padding: '8px 12px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap', borderBottom: '1px solid #E5E7EB' }
  const tdStyle = { padding: '10px 12px', fontSize: 13, color: '#374151', borderBottom: '1px solid #F3F4F6' }

  return (
    <div style={{ padding: '28px 28px 40px', minHeight: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Admin Panel</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>Connected Pages</h1>
        </div>
        <span style={{ fontSize: 12, color: '#6B7280', background: '#F3F4F6', border: '1px solid #E5E7EB', padding: '4px 10px', borderRadius: 6 }}>{pages.length} pages</span>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '40px 0', color: '#9CA3AF', fontSize: 13 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #E5E7EB', borderTopColor: '#2563EB', animation: 'spin 0.8s linear infinite' }} />
          Loading pages…
        </div>
      ) : pages.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#9CA3AF' }}>No connected pages yet.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={thStyle}>Page</th>
                  <th style={thStyle}>Page ID</th>
                  <th style={thStyle}>Owner</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>AI</th>
                  <th style={thStyle}>Messages</th>
                  <th style={thStyle}>Plan</th>
                  <th style={thStyle}>Connected</th>
                </tr>
              </thead>
              <tbody>
                {pages.map(page => (
                  <tr key={page._id}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {page.pagePicture ? (
                          <img src={page.pagePicture} alt={page.pageName} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                            {page.pageName?.charAt(0)?.toUpperCase() || 'P'}
                          </div>
                        )}
                        <span style={{ fontWeight: 500, color: '#111827' }}>{page.pageName}</span>
                      </div>
                    </td>
                    <td style={tdStyle}><code style={{ fontSize: 11, background: '#F3F4F6', padding: '2px 6px', borderRadius: 4 }}>{page.pageId}</code></td>
                    <td style={tdStyle}><code style={{ fontSize: 11, background: '#F3F4F6', padding: '2px 6px', borderRadius: 4 }}>{page.userId?.slice(0, 12)}…</code></td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: page.isActive ? '#F0FDF4' : '#F3F4F6', color: page.isActive ? '#16A34A' : '#9CA3AF' }}>
                        {page.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: page.aiEnabled ? '#EFF6FF' : '#F3F4F6', color: page.aiEnabled ? '#2563EB' : '#9CA3AF' }}>
                        {page.aiEnabled ? 'ON' : 'OFF'}
                      </span>
                    </td>
                    <td style={tdStyle}>{(page.totalMessages || 0).toLocaleString()}</td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: page.planType === 'pro' ? '#F5F3FF' : '#F3F4F6', color: page.planType === 'pro' ? '#7C3AED' : '#6B7280', textTransform: 'uppercase' }}>
                        {page.planType || 'free'}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: 'nowrap', color: '#6B7280' }}>
                      {page.connectedAt ? new Date(page.connectedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
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

export default AdminPagesView
