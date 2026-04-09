import { useCallback, useEffect, useState } from 'react'
import api from '../../lib/api'

function AdminAnalyticsView() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/admin/analytics')
      setAnalytics(data.data)
    } catch (err) {
      console.error('Admin analytics error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAnalytics() }, [fetchAnalytics])

  const metrics = analytics ? [
    { label: 'Total Users', value: analytics.userCount, color: '#8B5CF6' },
    { label: 'Connected Pages', value: analytics.pageCount, color: '#2563EB' },
    { label: 'Conversations', value: analytics.conversationCount, color: '#F59E0B' },
    { label: 'Messages Processed', value: (analytics.totalMessages || 0).toLocaleString(), color: '#10B981' },
    { label: 'Input Tokens', value: (analytics.totalInputTokens || 0).toLocaleString(), color: '#6366F1' },
    { label: 'Output Tokens', value: (analytics.totalOutputTokens || 0).toLocaleString(), color: '#A855F7' },
    { label: 'Total Tokens', value: (analytics.totalTokens || 0).toLocaleString(), color: '#EF4444' },
    { label: 'Estimated Cost (USD)', value: `$${(analytics.totalCost || 0).toFixed(4)}`, color: '#06B6D4' },
  ] : []

  return (
    <div style={{ padding: '28px 28px 40px', minHeight: '100%' }}>
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Admin Panel</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>Analytics</h1>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '40px 0', color: '#9CA3AF', fontSize: 13 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #E5E7EB', borderTopColor: '#2563EB', animation: 'spin 0.8s linear infinite' }} />
          Loading analytics…
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {metrics.map(m => (
            <div key={m.label} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px', borderTop: `3px solid ${m.color}` }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{m.value ?? '—'}</p>
              <p style={{ fontSize: 12, color: '#6B7280' }}>{m.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminAnalyticsView
