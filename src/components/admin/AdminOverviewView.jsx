import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, FileText, MessageSquare, FolderOpen,
  Zap, DollarSign, CheckCircle, Clock, XCircle,
  TrendingUp, RefreshCw,
} from 'lucide-react'
import api from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

const STATUS_STYLES = {
  pending:  { bg: '#FEF9C3', color: '#92400E', label: 'Pending' },
  approved: { bg: '#DCFCE7', color: '#15803D', label: 'Approved' },
  rejected: { bg: '#FEE2E2', color: '#DC2626', label: 'Rejected' },
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: s.bg, color: s.color, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  )
}

function fmt(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function StatCard({ title, value, sub, color, Icon, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12,
        padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.15s',
      }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)' }}
      onMouseLeave={e => { if (onClick) e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ width: 42, height: 42, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} color={color} strokeWidth={2} />
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 20, fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>{value ?? '—'}</p>
        <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{title}</p>
        {sub && <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{sub}</p>}
      </div>
    </div>
  )
}

function RevenueHighlight({ total, month }) {
  return (
    <div style={{ background: 'linear-gradient(135deg,#3D5AFE 0%,#7C3AED 100%)', borderRadius: 12, padding: '20px 22px', color: '#fff', gridColumn: 'span 2' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
        <TrendingUp size={13} color="rgba(255,255,255,0.7)" strokeWidth={2.5} />
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7 }}>Total Revenue</p>
      </div>
      <p style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
        ৳{total.toLocaleString()}
      </p>
      <p style={{ fontSize: 13, opacity: 0.72, marginTop: 6 }}>
        This month: <strong>৳{month.toLocaleString()}</strong>
      </p>
    </div>
  )
}

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '40px 0', color: '#9CA3AF', fontSize: 13 }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #E5E7EB', borderTopColor: '#7C3AED', animation: 'spin 0.8s linear infinite' }} />
      Loading…
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
      {children}
    </p>
  )
}

export default function AdminOverviewView() {
  const navigate = useNavigate()
  const { dbUser } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [payments, setPayments] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchAll = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    try {
      const [analyticsRes, paymentsRes] = await Promise.all([
        api.get('/api/admin/analytics'),
        api.get('/api/payments/analytics'),
      ])
      setAnalytics(analyticsRes.data.data)
      setPayments(paymentsRes.data.data)
    } catch (err) {
      console.error('Admin overview error:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  return (
    <div style={{ padding: '28px 28px 48px', minHeight: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Admin Panel</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>Platform Overview</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            onClick={() => fetchAll(true)}
            disabled={refreshing}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 7, border: '1px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: 12, cursor: 'pointer' }}
          >
            <RefreshCw size={13} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
            Refresh
          </button>
          <div style={{ fontSize: 13, color: '#6B7280', background: '#F3F4F6', border: '1px solid #E5E7EB', padding: '6px 12px', borderRadius: 8 }}>
            Welcome, <strong style={{ color: '#111827' }}>{dbUser?.name || 'Admin'}</strong>
          </div>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <>
          {/* ── Revenue & Payments ───────────────────────── */}
          {payments && (
            <>
              <SectionLabel>Revenue & Payments</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
                <RevenueHighlight total={payments.totalRevenue} month={payments.monthRevenue} />
                <StatCard
                  title="Approved Payments"
                  value={payments.approvedCount}
                  color="#16A34A"
                  Icon={CheckCircle}
                  onClick={() => navigate('/admin/payments?status=approved')}
                />
                <StatCard
                  title="Pending Review"
                  value={payments.pendingCount}
                  sub={payments.pendingCount > 0 ? 'Needs attention' : 'All clear'}
                  color="#F59E0B"
                  Icon={Clock}
                  onClick={() => navigate('/admin/payments')}
                />
                <StatCard
                  title="Rejected Payments"
                  value={payments.rejectedCount}
                  color="#EF4444"
                  Icon={XCircle}
                  onClick={() => navigate('/admin/payments?status=rejected')}
                />
              </div>
            </>
          )}

          {/* ── Platform Stats ───────────────────────────── */}
          {analytics && (
            <>
              <SectionLabel>Platform Stats</SectionLabel>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 32 }}>
                <StatCard title="Total Users"     value={analytics.userCount}                                 color="#8B5CF6" Icon={Users} />
                <StatCard title="Connected Pages" value={analytics.pageCount}                                 color="#2563EB" Icon={FileText} />
                <StatCard title="Total Messages"  value={(analytics.totalMessages || 0).toLocaleString()}     color="#10B981" Icon={MessageSquare} />
                <StatCard title="Conversations"   value={(analytics.conversationCount || 0).toLocaleString()} color="#F59E0B" Icon={FolderOpen} />
                <StatCard title="Total Tokens"    value={(analytics.totalTokens || 0).toLocaleString()}       color="#EF4444" Icon={Zap} />
                <StatCard title="Est. AI Cost"    value={`$${(analytics.totalCost || 0).toFixed(4)}`}        color="#06B6D4" Icon={DollarSign} />
              </div>
            </>
          )}

          {/* ── Recent Payment Requests ──────────────────── */}
          {payments?.recent?.length > 0 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <SectionLabel>Recent Payment Requests</SectionLabel>
                <button type="button" onClick={() => navigate('/admin/payments')}
                  style={{ fontSize: 12, fontWeight: 600, color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 12 }}>
                  View all →
                </button>
              </div>
              <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden', maxWidth: 900 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 90px 90px 80px', padding: '10px 18px', borderBottom: '1px solid #F3F4F6' }}>
                  {['User', 'Plan · Amount', 'Transaction ID', 'Date', 'Status'].map(h => (
                    <p key={h} style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</p>
                  ))}
                </div>
                {payments.recent.map((p, i) => (
                  <div
                    key={p._id}
                    style={{
                      display: 'grid', gridTemplateColumns: '1fr 1fr 90px 90px 80px',
                      padding: '11px 18px', alignItems: 'center',
                      borderBottom: i < payments.recent.length - 1 ? '1px solid #F9FAFB' : 'none',
                      background: i % 2 === 0 ? '#fff' : '#FAFAFA',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.userId?.name || '—'}
                      </p>
                      <p style={{ fontSize: 11, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.userId?.email || ''}
                      </p>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', textTransform: 'capitalize' }}>
                      {p.planType} · <span style={{ color: '#7C3AED' }}>৳{p.amount}</span>
                    </p>
                    <p style={{ fontSize: 11, fontFamily: 'monospace', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.transactionId}
                    </p>
                    <p style={{ fontSize: 11, color: '#6B7280' }}>{fmt(p.createdAt)}</p>
                    <StatusBadge status={p.status} />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
