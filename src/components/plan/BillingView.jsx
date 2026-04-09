import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import ProfilePill from '../ui/ProfilePill'

const STATUS_STYLES = {
  pending: { bg: '#FEF9C3', color: '#92400E', label: 'Pending' },
  approved: { bg: '#DCFCE7', color: '#15803D', label: 'Approved' },
  rejected: { bg: '#FEE2E2', color: '#DC2626', label: 'Rejected' },
}

const PLAN_AMOUNTS = { standard: 299, pro: 499 }

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: s.bg, color: s.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {s.label}
    </span>
  )
}

function fmt(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function BillingView() {
  const navigate = useNavigate()
  const { dbUser } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  const wp = dbUser?.workspacePlan
  const planType = wp?.planCode ?? 'free'
  const billingPeriodEnd = wp?.billingPeriodEnd

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/payments/my')
      setPayments(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPayments() }, [fetchPayments])

  const hasPending = payments.some(p => p.status === 'pending')

  return (
    <div style={{ padding: '28px 28px 40px', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Workspace</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>Billing</h1>
        </div>
        <ProfilePill />
      </div>

      {/* Current plan card */}
      {dbUser && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '18px 22px', marginBottom: 24, maxWidth: 640, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Active Plan</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#111827', textTransform: 'capitalize' }}>{planType}</span>
              {planType !== 'free' && billingPeriodEnd && (
                <span style={{ fontSize: 11, color: '#6B7280' }}>· renews {fmt(billingPeriodEnd)}</span>
              )}
            </div>
          </div>
          {!hasPending && (
            <button
              type="button"
              onClick={() => navigate('/payment?plan=standard')}
              style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: '#7C3AED', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              Upgrade Plan
            </button>
          )}
          {hasPending && (
            <span style={{ fontSize: 12, color: '#92400E', background: '#FEF9C3', padding: '6px 12px', borderRadius: 8, fontWeight: 600 }}>
              Payment under review
            </span>
          )}
        </div>
      )}

      {/* Payment history */}
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 4 }}>Payment History</h2>
        <p style={{ fontSize: 13, color: '#6B7280' }}>All bKash payment requests submitted from your account.</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '32px 0', color: '#9CA3AF', fontSize: 13 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #E5E7EB', borderTopColor: '#7C3AED', animation: 'spin 0.8s linear infinite' }} />
          Loading…
        </div>
      ) : payments.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '40px 24px', textAlign: 'center', maxWidth: 480 }}>
          <p style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 16 }}>No payment requests yet.</p>
          <button type="button" onClick={() => navigate('/my-plan')} style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid #D1D5DB', background: '#fff', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            View Plans
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 720 }}>
          {payments.map(p => (
            <div key={p._id} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', textTransform: 'capitalize' }}>{p.planType} Plan</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <p style={{ fontSize: 12, color: '#6B7280' }}>
                    Submitted {fmt(p.createdAt)} · TxnID: <span style={{ fontFamily: 'monospace', color: '#374151' }}>{p.transactionId}</span>
                  </p>
                  {p.status === 'approved' && p.billingPeriodStart && (
                    <p style={{ fontSize: 12, color: '#15803D', marginTop: 2 }}>
                      Active {fmt(p.billingPeriodStart)} → {fmt(p.billingPeriodEnd)}
                    </p>
                  )}
                  {p.reviewNote && (
                    <p style={{ fontSize: 12, color: p.status === 'rejected' ? '#DC2626' : '#6B7280', marginTop: 4, fontStyle: 'italic' }}>
                      Note: {p.reviewNote}
                    </p>
                  )}
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#7C3AED', whiteSpace: 'nowrap' }}>৳{p.amount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
