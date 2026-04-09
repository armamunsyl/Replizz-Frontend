import { useNavigate } from 'react-router-dom'
import ProfilePill from '../ui/ProfilePill'
import { useAuth } from '../../context/AuthContext'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '০',
    currency: '৳',
    period: 'month',
    tagline: 'Just getting started',
    desc: 'Try Replizz with zero cost. No credit card needed.',
    limits: ['50 AI replies / month', '1 Facebook page'],
    features: [
      'Basic AI auto replies',
      'Simple question answering',
      'English & Bangla support',
      'Basic inbox automation',
      'Replizz branding',
    ],
    cta: 'Current Plan',
    payTo: null,
    hl: false,
    custom: false,
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '২৯৯',
    currency: '৳',
    period: 'month',
    tagline: 'For growing pages',
    desc: 'Reliable automation for small businesses with steady traffic.',
    limits: ['1,000 AI replies / month', '2 Facebook pages'],
    features: [
      'AI auto replies',
      'Multi-language support',
      'Basic context awareness',
      'Reply-to-message support',
      'Simple conversation flow',
      'Limited reaction support',
    ],
    cta: 'Upgrade to Standard',
    payTo: '/payment?plan=standard',
    hl: false,
    custom: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '৯৯৯',
    currency: '৳',
    period: 'month',
    tagline: 'Best for growing businesses',
    desc: 'Full automation power for businesses serious about conversion.',
    badge: 'Most Popular',
    limits: ['5,000 AI replies / month', 'Up to 5 Facebook pages'],
    features: [
      'Full AI automation',
      'Advanced context memory',
      'Payment screenshot detection',
      'Custom AI instructions per page',
      'Smart reaction system',
      'Moderator-aware automation',
      'Follow-up automation',
      'Priority response handling',
    ],
    cta: 'Upgrade to Pro',
    payTo: '/payment?plan=pro',
    hl: true,
    custom: false,
  },
  {
    id: 'custom',
    name: 'Custom',
    price: null,
    currency: null,
    period: null,
    tagline: 'Enterprise & agencies',
    desc: 'Tailored setup for large operations with unique requirements.',
    limits: ['High / unlimited replies', 'Unlimited Facebook pages'],
    features: [
      'Everything in Pro',
      'Custom workflow automation',
      'API access (future-ready)',
      'Dedicated support manager',
      'Custom AI setup & tuning',
      'Integration support',
    ],
    cta: 'Contact Us',
    payTo: null,
    hl: false,
    custom: true,
  },
]

const PLAN_BADGE = {
  free:     { bg: '#F3F4F6', color: '#6B7280' },
  standard: { bg: '#EFF6FF', color: '#2563EB' },
  pro:      { bg: '#F5F3FF', color: '#7C3AED' },
  custom:   { bg: '#FEF3C7', color: '#92400E' },
}

const PLAN_LABEL = {
  free: 'Free', standard: 'Standard', pro: 'Pro', custom: 'Custom',
}

function CheckIcon({ color }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function PlanView() {
  const navigate = useNavigate()
  const { dbUser } = useAuth()

  const wp = dbUser?.workspacePlan
  const planType = wp?.planCode ?? 'free'
  const usedReplies = wp?.usedReplies ?? 0
  const replyLimit = wp?.replyLimit ?? 50
  const usagePct = replyLimit > 0 ? Math.min(usedReplies / replyLimit, 1) : 0
  const usageColor = usagePct >= 0.9 ? '#EF4444' : usagePct >= 0.7 ? '#F59E0B' : '#7C3AED'

  const planLabel = PLAN_LABEL[planType] || planType
  const planBadge = PLAN_BADGE[planType] || PLAN_BADGE.free

  const billingPeriodEnd = wp?.billingPeriodEnd
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : null

  return (
    <div style={{ padding: '28px 28px 40px', minHeight: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Workspace</p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', letterSpacing: '-0.02em' }}>My Plan</h1>
        </div>
        <ProfilePill />
      </div>

      {/* Current plan summary */}
      {dbUser && (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px 24px', marginBottom: 28, maxWidth: 680 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Current Plan</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>{planLabel}</h2>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 4, background: planBadge.bg, color: planBadge.color }}>
                  {planType}
                </span>
              </div>
              {billingPeriodEnd && (
                <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 3 }}>
                  Renews {fmt(billingPeriodEnd)}
                </p>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 2 }}>Replies used</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>
                {usedReplies.toLocaleString()}
                <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 400 }}> / {replyLimit.toLocaleString()}</span>
              </p>
            </div>
          </div>

          <div style={{ height: 7, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ height: '100%', width: `${usagePct * 100}%`, background: usageColor, borderRadius: 99, transition: 'width 0.6s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 12, color: '#9CA3AF' }}>
              {(replyLimit - usedReplies).toLocaleString()} replies remaining this billing period
            </p>
            <p style={{ fontSize: 12, fontWeight: 600, color: usageColor }}>{Math.round(usagePct * 100)}% used</p>
          </div>
        </div>
      )}

      {/* Section label */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 4 }}>Available Plans</h2>
        <p style={{ fontSize: 13, color: '#6B7280' }}>
          Pick the package that matches your team size and conversation volume.
        </p>
      </div>

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14, maxWidth: 920 }}>
        {PLANS.map(plan => {
          const isCurrent = plan.id === planType
          const cardBg = plan.hl ? 'linear-gradient(145deg,#3D5AFE 0%,#7C3AED 100%)' : '#fff'
          const textPri = plan.hl ? '#fff' : '#111827'
          const textSec = plan.hl ? 'rgba(255,255,255,0.72)' : '#6B7280'
          const textMuted = plan.hl ? 'rgba(255,255,255,0.50)' : '#9CA3AF'
          const checkColor = plan.hl ? 'rgba(255,255,255,0.85)' : '#7C3AED'
          const borderStyle = isCurrent
            ? '2px solid #7C3AED'
            : plan.hl
              ? 'none'
              : '1px solid #E5E7EB'

          return (
            <div
              key={plan.id}
              style={{
                background: cardBg,
                border: borderStyle,
                borderRadius: 12,
                padding: plan.hl ? '22px 16px 18px' : '16px 16px 16px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transform: plan.hl ? 'translateY(-4px)' : 'none',
                boxShadow: plan.hl ? '0 8px 32px rgba(124,58,237,0.22)' : isCurrent ? '0 0 0 1px rgba(124,58,237,0.15)' : 'none',
              }}
            >
              {/* Badges */}
              {plan.badge && !isCurrent && (
                <span style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: '#7C3AED', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                  {plan.badge.toUpperCase()}
                </span>
              )}
              {isCurrent && (
                <span style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: '#16A34A', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                  CURRENT PLAN
                </span>
              )}

              {/* Name + tagline */}
              <div style={{ marginBottom: 10 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: textPri, marginBottom: 2 }}>{plan.name}</h3>
                <p style={{ fontSize: 11, color: textMuted }}>{plan.tagline}</p>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 1, marginBottom: 8 }}>
                {plan.price !== null ? (
                  <>
                    <span style={{ fontSize: 13, fontWeight: 500, color: textSec }}>{plan.currency}</span>
                    <span style={{ fontSize: 26, fontWeight: 800, color: textPri, lineHeight: 1 }}>{plan.price}</span>
                    <span style={{ fontSize: 12, color: textMuted }}>/{plan.period}</span>
                  </>
                ) : (
                  <span style={{ fontSize: 18, fontWeight: 700, color: textPri }}>Custom</span>
                )}
              </div>

              <p style={{ fontSize: 12, color: textSec, lineHeight: 1.55, marginBottom: 10 }}>{plan.desc}</p>

              {/* Limits strip */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 10, padding: '8px 10px', background: plan.hl ? 'rgba(255,255,255,0.10)' : '#F9FAFB', borderRadius: 7 }}>
                {plan.limits.map(l => (
                  <p key={l} style={{ fontSize: 11, fontWeight: 600, color: plan.hl ? 'rgba(255,255,255,0.85)' : '#374151' }}>{l}</p>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: plan.hl ? 'rgba(255,255,255,0.12)' : '#F3F4F6', marginBottom: 10 }} />

              {/* Features */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 11.5, color: plan.hl ? 'rgba(255,255,255,0.88)' : '#374151', lineHeight: 1.4 }}>
                    <CheckIcon color={checkColor} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {plan.custom ? (
                <a
                  href="mailto:hello@replizz.com"
                  style={{
                    display: 'block', textAlign: 'center', padding: '9px 12px', fontSize: 12, fontWeight: 700,
                    borderRadius: 7, border: '1px solid #E5E7EB', background: '#F9FAFB',
                    color: '#374151', textDecoration: 'none', transition: 'background 0.15s',
                  }}
                >
                  Contact Us
                </a>
              ) : (
                <button
                  type="button"
                  disabled={isCurrent}
                  onClick={() => { if (!isCurrent && plan.payTo) navigate(plan.payTo) }}
                  style={{
                    padding: '9px 12px', fontSize: 12, fontWeight: 700, borderRadius: 7,
                    border: plan.hl ? 'none' : '1px solid #E5E7EB',
                    background: isCurrent ? (plan.hl ? 'rgba(255,255,255,0.15)' : '#F3F4F6') : plan.hl ? '#fff' : '#F9FAFB',
                    color: isCurrent ? (plan.hl ? 'rgba(255,255,255,0.5)' : '#9CA3AF') : plan.hl ? '#7C3AED' : '#374151',
                    cursor: isCurrent ? 'default' : 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {isCurrent ? 'Current Plan' : plan.cta}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 20, maxWidth: 680 }}>
        Plans are billed monthly via bKash. Your plan activates within 24 hours after payment verification. For help, email hello@replizz.com
      </p>
    </div>
  )
}

export default PlanView
