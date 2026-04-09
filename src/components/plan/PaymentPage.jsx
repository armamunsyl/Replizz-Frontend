import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

const PLANS = {
  standard: { name: 'Standard', amount: 299, limit: '2,000 AI replies / month' },
  pro: { name: 'Pro', amount: 499, limit: 'Unlimited AI replies' },
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button type="button" onClick={copy} style={{ marginLeft: 8, padding: '2px 10px', fontSize: 11, fontWeight: 600, borderRadius: 5, border: '1px solid #D1D5DB', background: copied ? '#DCFCE7' : '#F9FAFB', color: copied ? '#16A34A' : '#374151', cursor: 'pointer', transition: 'all 0.15s' }}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export default function PaymentPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { dbUser } = useAuth()

  const planKey = params.get('plan') || 'standard'
  const plan = PLANS[planKey] || PLANS.standard

  const [bkashNumber, setBkashNumber] = useState('')
  const [form, setForm] = useState({ senderBkashNumber: '', transactionId: '', screenshotUrl: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    api.get('/api/payments/settings').then(r => setBkashNumber(r.data?.data?.bkashNumber || '')).catch(() => {})
  }, [])

  const validate = () => {
    const e = {}
    if (!form.senderBkashNumber.trim()) e.senderBkashNumber = 'Enter your bKash number'
    else if (!/^01[3-9]\d{8}$/.test(form.senderBkashNumber.trim())) e.senderBkashNumber = 'Enter a valid BD mobile number'
    if (!form.transactionId.trim()) e.transactionId = 'Enter the bKash transaction ID'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    try {
      await api.post('/api/payments/submit', { planType: planKey, ...form })
      setSuccess(true)
    } catch (err) {
      setServerError(err.response?.data?.message || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: '48px 40px', maxWidth: 440, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 10 }}>Request Submitted!</h2>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6, marginBottom: 24 }}>
            Your <strong>{plan.name}</strong> plan payment request has been received. Our team will verify and activate your plan within 24 hours.
          </p>
          <button type="button" onClick={() => navigate('/my-plan')} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#7C3AED', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            View My Plan
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', padding: '40px 20px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        {/* Back */}
        <button type="button" onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#6B7280', fontSize: 13, cursor: 'pointer', marginBottom: 24, padding: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Back
        </button>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Subscribe to {plan.name}</h1>
        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 28 }}>Complete your bKash payment and submit the details below.</p>

        {/* Plan summary */}
        <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{plan.name} Plan</p>
            <p style={{ fontSize: 13, color: '#4B5563' }}>{plan.limit}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: '#7C3AED' }}>৳{plan.amount}</span>
            <span style={{ fontSize: 12, color: '#9CA3AF' }}> / month</span>
          </div>
        </div>

        {/* Step 1 — Send payment */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px 20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#7C3AED', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</span>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Send Payment via bKash</h3>
          </div>
          <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>
            Send <strong>৳{plan.amount}</strong> to the following bKash number using <strong>Send Money</strong>:
          </p>
          {bkashNumber ? (
            <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>bKash Number</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', letterSpacing: '0.04em' }}>{bkashNumber}</p>
              </div>
              <CopyBtn text={bkashNumber} />
            </div>
          ) : (
            <div style={{ background: '#FEF9C3', border: '1px solid #FDE047', borderRadius: 8, padding: '10px 14px' }}>
              <p style={{ fontSize: 13, color: '#92400E' }}>bKash number not configured yet. Please contact support.</p>
            </div>
          )}
          <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 10 }}>
            Use your registered name or email as the reference. Keep your transaction ID for the next step.
          </p>
        </div>

        {/* Step 2 — Submit details */}
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px 20px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#7C3AED', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</span>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Submit Payment Details</h3>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Account info (read-only) */}
            {dbUser && (
              <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
                <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>Submitting for account</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{dbUser.name} · {dbUser.email}</p>
              </div>
            )}

            {/* Sender bKash number */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>
                Your bKash Number <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="01XXXXXXXXX"
                value={form.senderBkashNumber}
                onChange={e => setForm(f => ({ ...f, senderBkashNumber: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', fontSize: 13, border: `1px solid ${errors.senderBkashNumber ? '#EF4444' : '#D1D5DB'}`, borderRadius: 8, outline: 'none', boxSizing: 'border-box' }}
              />
              {errors.senderBkashNumber && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{errors.senderBkashNumber}</p>}
            </div>

            {/* Transaction ID */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>
                bKash Transaction ID <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 8G12AB3C4D"
                value={form.transactionId}
                onChange={e => setForm(f => ({ ...f, transactionId: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', fontSize: 13, border: `1px solid ${errors.transactionId ? '#EF4444' : '#D1D5DB'}`, borderRadius: 8, outline: 'none', boxSizing: 'border-box' }}
              />
              {errors.transactionId && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{errors.transactionId}</p>}
            </div>

            {/* Screenshot URL (optional) */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>
                Screenshot URL <span style={{ fontSize: 11, fontWeight: 400, color: '#9CA3AF' }}>(optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={form.screenshotUrl}
                onChange={e => setForm(f => ({ ...f, screenshotUrl: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', fontSize: 13, border: '1px solid #D1D5DB', borderRadius: 8, outline: 'none', boxSizing: 'border-box' }}
              />
              <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Upload your screenshot to imgur.com or any image host and paste the link.</p>
            </div>

            {serverError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', marginBottom: 14 }}>
                <p style={{ fontSize: 13, color: '#DC2626' }}>{serverError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{ width: '100%', padding: '11px 0', borderRadius: 8, border: 'none', background: submitting ? '#C4B5FD' : '#7C3AED', color: '#fff', fontSize: 14, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', transition: 'background 0.15s' }}
            >
              {submitting ? 'Submitting…' : 'Submit Payment Request'}
            </button>
          </form>
        </div>

        <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
          Your plan will be activated within 24 hours after verification. For help, email hello@replizz.com
        </p>
      </div>
    </div>
  )
}
