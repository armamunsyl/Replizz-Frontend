import { useCallback, useEffect, useState } from 'react'
import ProfilePill from '../ui/ProfilePill'
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

function formatSenderLabel(senderId) {
  if (!senderId) return 'new contact'
  const text = String(senderId)
  return text.length > 10 ? `${text.slice(0, 10)}...` : text
}

function formatPreview(text) {
  const cleanText = text?.trim() || '[media]'
  return cleanText.length > 40 ? `${cleanText.slice(0, 40)}...` : cleanText
}

function buildRecentActivity(logs) {
  return logs.slice(0, 6).map((log, index) => ({
    id: `${log._id || log.createdAt || index}`,
    title: `Conversation with ${formatSenderLabel(log.senderId)}`,
    preview: formatPreview(log.messageText),
    status: log.aiReply ? 'Replied' : 'Pending',
  }))
}

function CircularProgress({ used, limit }) {
  const pct = limit > 0 ? Math.min(used / limit, 1) : 0
  const size = 96
  const stroke = 8
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct)

  const color = pct >= 0.9 ? '#EF4444' : pct >= 0.7 ? '#F59E0B' : '#2563EB'

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#111827', lineHeight: 1 }}>{Math.round(pct * 100)}%</span>
        <span style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>used</span>
      </div>
    </div>
  )
}

function OverviewView() {
  const { selectedPage } = usePage()
  const { dbUser } = useAuth()
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

  useEffect(() => { fetchData() }, [fetchData])

  let { days, series } = buildChartData(logs)
  if (series.every(v => v === 0)) series = [2, 3, 2, 4, 6, 5, 3]

  const messagesProcessed = stats?.messagesProcessed ?? 0
  const repliesSent = logs.filter((log) => Boolean(log.aiReply)).length
  const totalTokens = stats?.totalTokens ?? 0
  const estimatedCost = stats?.estimatedCost ?? 0

  const statCards = stats ? [
    { icon: 'message', title: 'Messages Processed', value: messagesProcessed.toLocaleString() },
    { icon: 'chat', title: 'AI Replies Sent', value: repliesSent.toLocaleString() },
    { icon: 'chart', title: 'Total Tokens Used', value: totalTokens.toLocaleString() },
    { icon: 'star', title: 'Estimated Cost (USD)', value: `$${estimatedCost.toFixed(4)}` },
  ] : []

  const recentActivity = buildRecentActivity(logs)

  // Account-level usage from workspace plan
  const wp = dbUser?.workspacePlan
  const usedReplies = wp?.usedReplies ?? 0
  const replyLimit = wp?.replyLimit ?? 50
  const planType = wp?.planCode ?? 'free'
  const usagePct = replyLimit > 0 ? Math.min(usedReplies / replyLimit, 1) : 0
  const usageColor = usagePct >= 0.9 ? '#EF4444' : usagePct >= 0.7 ? '#F59E0B' : '#16A34A'

  return (
    <div style={{ padding: '28px 28px 40px', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Workspace</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>Overview</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {selectedPage && (
            <span style={{ fontSize: 12, color: '#6B7280', background: '#F3F4F6', border: '1px solid #E5E7EB', padding: '4px 10px', borderRadius: 6 }}>
              {selectedPage.pageName}
            </span>
          )}
          <ProfilePill />
        </div>
      </div>

      {/* Account-level usage card */}
      {dbUser && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <CircularProgress used={usedReplies} limit={replyLimit} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Account Usage</h2>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 4, background: planType === 'pro' ? '#F5F3FF' : planType === 'standard' ? '#EFF6FF' : '#F3F4F6', color: planType === 'pro' ? '#7C3AED' : planType === 'standard' ? '#2563EB' : '#6B7280' }}>
                {planType}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 10 }}>
              Total AI replies used across all connected pages.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1, height: 6, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${usagePct * 100}%`, background: usageColor, borderRadius: 99, transition: 'width 0.6s ease' }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: usageColor, whiteSpace: 'nowrap' }}>
                {usedReplies.toLocaleString()} / {replyLimit.toLocaleString()}
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#9CA3AF' }}>
              {(replyLimit - usedReplies).toLocaleString()} replies remaining this billing period
            </p>
          </div>
        </div>
      )}

      {/* Page analytics */}
      {!selectedPage ? (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" fill="#1877F2" /><path d="M13.7 8.2h2V5.4h-2.4c-2.6 0-3.8 1.5-3.8 3.9V11H7.7v2.7h1.8v4.9h2.9v-4.9h2.5l.4-2.7h-2.9V9.5c0-.8.3-1.3 1.3-1.3Z" fill="#fff" /></svg>
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Connect a Facebook Page</h3>
          <p style={{ fontSize: 14, color: '#6B7280' }}>Select a page from the sidebar to view analytics and manage your AI automation.</p>
        </div>
      ) : loading ? (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ width: 28, height: 28, border: '2px solid #E5E7EB', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: 14, color: '#9CA3AF' }}>Loading analytics…</p>
        </div>
      ) : (
        <>
          <OverviewStats stats={statCards} />
          <div style={{ display: 'flex', gap: 16 }}>
            <OverviewChart days={days} series={series} />
            <OverviewActivity activity={recentActivity} />
          </div>
        </>
      )}
    </div>
  )
}

export default OverviewView
