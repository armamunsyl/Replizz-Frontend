import { useCallback, useEffect, useState } from 'react'
import Icon from '../ui/Icon'
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

    useEffect(() => {
        fetchAnalytics()
    }, [fetchAnalytics])

    const metrics = analytics
        ? [
            { label: 'Total Users', value: analytics.userCount, icon: 'user', color: '#8b5cf6' },
            { label: 'Connected Pages', value: analytics.pageCount, icon: 'facebook', color: '#3b82f6' },
            { label: 'Conversations', value: analytics.conversationCount, icon: 'chat', color: '#f59e0b' },
            { label: 'Messages Processed', value: (analytics.totalMessages || 0).toLocaleString(), icon: 'message', color: '#10b981' },
            { label: 'Input Tokens', value: (analytics.totalInputTokens || 0).toLocaleString(), icon: 'chart', color: '#6366f1' },
            { label: 'Output Tokens', value: (analytics.totalOutputTokens || 0).toLocaleString(), icon: 'chart', color: '#a855f7' },
            { label: 'Total Tokens', value: (analytics.totalTokens || 0).toLocaleString(), icon: 'chart', color: '#ef4444' },
            { label: 'Estimated Cost (USD)', value: `$${(analytics.totalCost || 0).toFixed(4)}`, icon: 'star', color: '#06b6d4' },
        ]
        : []

    return (
        <section className="workspace admin-workspace anim-reveal" aria-label="Analytics">
            <header className="workspace-top admin-workspace-top anim-pop anim-delay-1">
                <div className="overview-title-wrap">
                    <p className="overview-kicker">Admin Panel</p>
                    <h1>Analytics</h1>
                </div>
            </header>

            <div className="admin-content anim-pop anim-delay-2">
                {loading ? (
                    <div className="admin-loading">
                        <div className="admin-spinner" />
                        <p>Loading analytics…</p>
                    </div>
                ) : (
                    <div className="admin-analytics-grid">
                        {metrics.map((m) => (
                            <div key={m.label} className="admin-analytics-card" style={{ '--accent': m.color }}>
                                <div className="admin-analytics-icon">
                                    <Icon name={m.icon} />
                                </div>
                                <p className="admin-analytics-value">{m.value}</p>
                                <p className="admin-analytics-label">{m.label}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default AdminAnalyticsView
