import { useCallback, useEffect, useState } from 'react'
import Icon from '../ui/Icon'
import api from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

function AdminOverviewView() {
    const { dbUser } = useAuth()
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

    const cards = analytics
        ? [
            { icon: 'user', title: 'Total Users', value: analytics.userCount, color: '#8b5cf6' },
            { icon: 'facebook', title: 'Connected Pages', value: analytics.pageCount, color: '#3b82f6' },
            { icon: 'message', title: 'Total Messages', value: (analytics.totalMessages || 0).toLocaleString(), color: '#10b981' },
            { icon: 'chat', title: 'Conversations', value: (analytics.conversationCount || 0).toLocaleString(), color: '#f59e0b' },
            { icon: 'chart', title: 'Total Tokens', value: (analytics.totalTokens || 0).toLocaleString(), color: '#ef4444' },
            { icon: 'star', title: 'Est. Cost', value: `$${(analytics.totalCost || 0).toFixed(4)}`, color: '#06b6d4' },
        ]
        : []

    return (
        <section className="workspace admin-workspace anim-reveal" aria-label="Admin Dashboard">
            <header className="workspace-top admin-workspace-top anim-pop anim-delay-1">
                <div className="overview-title-wrap">
                    <p className="overview-kicker">Admin Panel</p>
                    <h1>Platform Overview</h1>
                </div>
                <div className="admin-user-welcome">
                    <span>Welcome, <strong>{dbUser?.name || 'Admin'}</strong></span>
                </div>
            </header>

            <div className="admin-content anim-pop anim-delay-2">
                {loading ? (
                    <div className="admin-loading">
                        <div className="admin-spinner" />
                        <p>Loading analytics…</p>
                    </div>
                ) : (
                    <div className="admin-stats-grid">
                        {cards.map((card) => (
                            <div key={card.title} className="admin-stat-card" style={{ '--accent': card.color }}>
                                <div className="admin-stat-icon">
                                    <Icon name={card.icon} />
                                </div>
                                <div className="admin-stat-info">
                                    <p className="admin-stat-value">{card.value}</p>
                                    <p className="admin-stat-title">{card.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default AdminOverviewView
