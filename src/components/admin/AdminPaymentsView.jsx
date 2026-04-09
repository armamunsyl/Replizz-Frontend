import { useCallback, useEffect, useState } from 'react'
import api from '../../lib/api'

const STATUS_STYLES = {
  pending: { bg: '#FEF9C3', color: '#92400E', label: 'Pending' },
  approved: { bg: '#DCFCE7', color: '#15803D', label: 'Approved' },
  rejected: { bg: '#FEE2E2', color: '#DC2626', label: 'Rejected' },
}

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
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function ReviewModal({ request, onClose, onDone }) {
  const [action, setAction] = useState('approve')
  const [note, setNote] = useState('')
  const [customLimit, setCustomLimit] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = async () => {
    setError('')
    setLoading(true)
    try {
      const url = `/api/payments/${request._id}/${action}`
      const body = { reviewNote: note }
      if (action === 'approve' && request.planType === 'custom' && customLimit) {
        body.customMessageLimit = parseInt(customLimit)
      }
      await api.put(url, body)
      onDone()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: '28px 28px', width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Review Payment Request</h3>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', lineHeight: 1 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Request summary */}
        <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '12px 14px', marginBottom: 18, fontSize: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#6B7280' }}>User</span>
            <span style={{ fontWeight: 600, color: '#111827' }}>{request.userId?.name} ({request.userId?.email})</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#6B7280' }}>Plan</span>
            <span style={{ fontWeight: 600, color: '#111827', textTransform: 'capitalize' }}>{request.planType} — ৳{request.amount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ color: '#6B7280' }}>Sender bKash</span>
            <span style={{ fontFamily: 'monospace', color: '#374151' }}>{request.senderBkashNumber}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6B7280' }}>Transaction ID</span>
            <span style={{ fontFamily: 'monospace', color: '#374151' }}>{request.transactionId}</span>
          </div>
          {request.screenshotUrl && (
            <div style={{ marginTop: 8 }}>
              <a href={request.screenshotUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#7C3AED', textDecoration: 'none' }}>
                View Screenshot →
              </a>
            </div>
          )}
        </div>

        {/* Action select */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Decision</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {['approve', 'reject'].map(a => (
              <button key={a} type="button" onClick={() => setAction(a)}
                style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: `1.5px solid ${action === a ? (a === 'approve' ? '#16A34A' : '#DC2626') : '#E5E7EB'}`, background: action === a ? (a === 'approve' ? '#DCFCE7' : '#FEE2E2') : '#fff', color: action === a ? (a === 'approve' ? '#15803D' : '#DC2626') : '#6B7280', fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s' }}>
                {a === 'approve' ? '✓ Approve' : '✕ Reject'}
              </button>
            ))}
          </div>
        </div>

        {/* Custom limit for custom plan approval */}
        {action === 'approve' && request.planType === 'custom' && (
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>Custom Message Limit</label>
            <input type="number" min="0" placeholder="e.g. 5000" value={customLimit} onChange={e => setCustomLimit(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', fontSize: 13, border: '1px solid #D1D5DB', borderRadius: 8, outline: 'none', boxSizing: 'border-box' }} />
          </div>
        )}

        {/* Review note */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>
            Note to user <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(optional)</span>
          </label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="e.g. Transaction verified successfully."
            style={{ width: '100%', padding: '9px 12px', fontSize: 13, border: '1px solid #D1D5DB', borderRadius: 8, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </div>

        {error && <p style={{ fontSize: 12, color: '#DC2626', marginBottom: 12 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" onClick={onClose} style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button type="button" onClick={handle} disabled={loading}
            style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: action === 'approve' ? '#16A34A' : '#DC2626', color: '#fff', fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Processing…' : action === 'approve' ? 'Approve & Activate' : 'Reject Request'}
          </button>
        </div>
      </div>
    </div>
  )
}

function BkashSettingsPanel({ onClose }) {
  const [number, setNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/payments/settings').then(r => setNumber(r.data?.data?.bkashNumber || '')).catch(() => {})
  }, [])

  const save = async () => {
    setError('')
    setLoading(true)
    try {
      await api.put('/api/payments/settings', { bkashNumber: number })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: '28px 28px', width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>bKash Settings</h3>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>This number will be shown to users on the payment page.</p>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Recipient bKash Number</label>
        <input type="text" value={number} onChange={e => setNumber(e.target.value)} placeholder="01XXXXXXXXX"
          style={{ width: '100%', padding: '9px 12px', fontSize: 14, fontWeight: 600, border: '1px solid #D1D5DB', borderRadius: 8, outline: 'none', boxSizing: 'border-box', marginBottom: 14, letterSpacing: '0.04em' }} />
        {error && <p style={{ fontSize: 12, color: '#DC2626', marginBottom: 10 }}>{error}</p>}
        <button type="button" onClick={save} disabled={loading}
          style={{ width: '100%', padding: '10px 0', borderRadius: 8, border: 'none', background: saved ? '#16A34A' : '#7C3AED', color: '#fff', fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}>
          {loading ? 'Saving…' : saved ? '✓ Saved!' : 'Save bKash Number'}
        </button>
      </div>
    </div>
  )
}

export default function AdminPaymentsView() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('pending')
  const [reviewing, setReviewing] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/api/payments/all?status=${statusFilter}`)
      setPayments(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => { fetchPayments() }, [fetchPayments])

  const counts = { pending: 0, approved: 0, rejected: 0 }
  payments.forEach(p => { if (counts[p.status] !== undefined) counts[p.status]++ })

  return (
    <div style={{ padding: '28px 28px 40px', minHeight: '100%' }}>
      {reviewing && (
        <ReviewModal
          request={reviewing}
          onClose={() => setReviewing(null)}
          onDone={() => { setReviewing(null); fetchPayments() }}
        />
      )}
      {showSettings && <BkashSettingsPanel onClose={() => setShowSettings(false)} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Admin</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>Payment Requests</h1>
        </div>
        <button type="button" onClick={() => setShowSettings(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: '1px solid #D1D5DB', background: '#fff', color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          bKash Settings
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['pending', 'approved', 'rejected'].map(s => (
          <button key={s} type="button" onClick={() => setStatusFilter(s)}
            style={{ padding: '7px 16px', borderRadius: 8, border: `1.5px solid ${statusFilter === s ? '#7C3AED' : '#E5E7EB'}`, background: statusFilter === s ? '#F5F3FF' : '#fff', color: statusFilter === s ? '#7C3AED' : '#6B7280', fontSize: 13, fontWeight: statusFilter === s ? 700 : 500, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s' }}>
            {s}
          </button>
        ))}
        <button type="button" onClick={fetchPayments} style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: 13, cursor: 'pointer' }}>
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9CA3AF', fontSize: 13, padding: '32px 0' }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #E5E7EB', borderTopColor: '#7C3AED', animation: 'spin 0.8s linear infinite' }} />
          Loading…
        </div>
      ) : payments.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '40px 24px', textAlign: 'center', maxWidth: 480, color: '#9CA3AF', fontSize: 14 }}>
          No {statusFilter} requests.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 800 }}>
          {payments.map(p => (
            <div key={p._id} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#111827', textTransform: 'capitalize' }}>{p.planType} Plan</span>
                    <StatusBadge status={p.status} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#7C3AED' }}>৳{p.amount}</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#374151', marginBottom: 2 }}>
                    <strong>{p.userId?.name}</strong> · {p.userId?.email}
                  </p>
                  <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>
                    bKash: <span style={{ fontFamily: 'monospace' }}>{p.senderBkashNumber}</span> · TxnID: <span style={{ fontFamily: 'monospace' }}>{p.transactionId}</span>
                  </p>
                  <p style={{ fontSize: 11, color: '#9CA3AF' }}>Submitted: {fmt(p.createdAt)}</p>
                  {p.reviewNote && (
                    <p style={{ fontSize: 12, color: p.status === 'rejected' ? '#DC2626' : '#6B7280', marginTop: 4, fontStyle: 'italic' }}>
                      Note: {p.reviewNote}
                    </p>
                  )}
                  {p.screenshotUrl && (
                    <a href={p.screenshotUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#7C3AED', textDecoration: 'none', display: 'inline-block', marginTop: 4 }}>
                      View Screenshot →
                    </a>
                  )}
                </div>
                {p.status === 'pending' && (
                  <button type="button" onClick={() => setReviewing(p)}
                    style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#7C3AED', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                    Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
