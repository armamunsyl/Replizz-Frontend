import { useCallback, useEffect, useState } from 'react'
import ProfilePill from '../ui/ProfilePill'
import Icon from '../ui/Icon'
import OverviewActivity from './OverviewActivity'
import OverviewChart from './OverviewChart'
import OverviewStats from './OverviewStats'
import api from '../../lib/api'
import { usePage } from '../../context/PageContext'
import { useAuth } from '../../context/AuthContext'

function buildChartData(logs) {
  const now = new Date()
  const days = []
  const series = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' })
    const dayStr = d.toISOString().slice(0, 10)
    const count = logs.filter((l) => l.createdAt?.slice(0, 10) === dayStr).length
    days.push(dayLabel)
    series.push(count)
  }
  return { days, series }
}

function OverviewView() {
  const { user } = useAuth()
  const { selectedPage } = usePage()
  const [stats, setStats] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    if (!selectedPage) return
    setLoading(true)
    try {
      const [statsRes, logsRes] = await Promise.all([
        api.get(`/api/stats/${selectedPage.pageId}`),
        api.get(`/api/messages/${selectedPage.pageId}`),
      ])
      setStats(statsRes.data.data)
      setLogs(logsRes.data.data || [])
    } catch (err) {
      console.error('Overview fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedPage])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const { days, series } = buildChartData(logs)

  const statCards = stats
    ? [
      { icon: 'message', title: 'Messages Processed', value: stats.messagesProcessed ?? 0, change: '+all time', trend: 'up' },
      { icon: 'reply', title: 'AI Replies Sent', value: stats.messagesProcessed ?? 0, change: '+all time', trend: 'up' },
      { icon: 'token', title: 'Total Tokens', value: (stats.totalTokens ?? 0).toLocaleString(), change: '+all time', trend: 'up' },
      { icon: 'dollar', title: 'Est. Cost (USD)', value: `$${(stats.estimatedCost ?? 0).toFixed(4)}`, change: '+all time', trend: 'up' },
    ]
    : []

  const recentActivity = logs.slice(0, 8).map((log, i) => ({
    title: log.senderId ? `Conversation with ${log.senderId.slice(0, 8)}…` : 'Unknown',
    meta: log.messageText ? log.messageText.slice(0, 50) : '[image]',
    status: 'Replied',
  }))

  const displayName = user?.displayName || user?.email || 'User'

  return (
    <section className="workspace overview-view anim-reveal" aria-label="Overview dashboard">
      <header className="workspace-top overview-top anim-pop anim-delay-1">
        <div className="overview-title-wrap">
          <p className="overview-kicker">Workspace</p>
          <h1>Overview Analytics</h1>
        </div>

        <div className="workspace-actions">
          <button type="button" className="overview-range-pill anim-hover-lift">
            All Time
            <Icon name="chevron" />
          </button>
          <ProfilePill />
        </div>
      </header>

      <div className="overview-content anim-pop anim-delay-2">
        {!selectedPage ? (
          <p style={{ opacity: 0.5, padding: '2rem' }}>Select a Facebook page from the sidebar to view analytics.</p>
        ) : loading ? (
          <p style={{ opacity: 0.5, padding: '2rem' }}>Loading analytics…</p>
        ) : (
          <>
            <OverviewStats stats={statCards} />
            <div className="overview-grid">
              <OverviewChart days={days} series={series} />
              <OverviewActivity activity={recentActivity} />
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default OverviewView
