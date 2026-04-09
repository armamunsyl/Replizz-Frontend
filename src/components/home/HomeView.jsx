import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageCircle, Zap, Star, Building2, Camera, Brain,
  Settings2, UserRound, Bot, CheckCircle2, Link2, Rocket,
  ShoppingBag, TrendingUp, ArrowRight, Clock, Users,
  BarChart3, Shield, Sparkles, ChevronDown, Play,
  MousePointer2, Globe, Package,
} from 'lucide-react'

/* ─── TOKENS ─── */
const P   = '#7C3AED'
const PG  = 'linear-gradient(135deg, #3D5AFE 0%, #7C3AED 52%, #C850F4 100%)'
const PL  = '#F5F3FF'
const PD  = '#5B21B6'
const ACC = '#E8503A'
const T1  = '#1A0A2E'
const T2  = '#4B4469'
const T3  = '#8B82A7'
const BDR = '#E5DEFF'
const W   = '#FFFFFF'
const G1  = '#FAFAFA'
const G2  = '#F5F3FF'

/* ─── GLOBAL CSS ─── */
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  section[id] { scroll-margin-top: 88px; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(36px) } to { opacity:1; transform:translateY(0) } }
  @keyframes fadeLeft { from { opacity:0; transform:translateX(-40px) } to { opacity:1; transform:translateX(0) } }
  @keyframes fadeRight{ from { opacity:0; transform:translateX(40px) } to { opacity:1; transform:translateX(0) } }
  @keyframes scaleIn  { from { opacity:0; transform:scale(0.90) } to { opacity:1; transform:scale(1) } }
  @keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes pulseRing{ 0%{box-shadow:0 0 0 0 rgba(124,58,237,0.35)} 70%{box-shadow:0 0 0 14px rgba(124,58,237,0)} 100%{box-shadow:0 0 0 0 rgba(124,58,237,0)} }
  @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes spin     { to { transform:rotate(360deg) } }
  @keyframes dotBounce{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes chatSlide{ from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

  .r-fadeup   { animation: fadeUp    0.7s cubic-bezier(0.22,1,0.36,1) both; }
  .r-fadeleft { animation: fadeLeft  0.7s cubic-bezier(0.22,1,0.36,1) both; }
  .r-faderight{ animation: fadeRight 0.7s cubic-bezier(0.22,1,0.36,1) both; }
  .r-scalein  { animation: scaleIn   0.6s cubic-bezier(0.22,1,0.36,1) both; }

  .r-nav-mobile { display:none !important; }
  @media(max-width:860px){
    .r-nav-desk { display:none !important; }
    .r-nav-mobile { display:block !important; }
  }
  @media(max-width:768px){
    .r-hero-grid  { grid-template-columns:1fr !important; }
    .r-prob-grid  { grid-template-columns:1fr !important; }
    .r-feat-split { flex-direction:column !important; }
    .r-feat-split-rev { flex-direction:column !important; }
    .r-price-grid { grid-template-columns:1fr 1fr !important; }
    .r-testi-grid { grid-template-columns:1fr !important; }
    .r-work-grid  { grid-template-columns:1fr !important; }
    .r-work-line  { display:none !important; }
    .r-hero-chat  { display:none !important; }
    .r-ben-grid   { grid-template-columns:1fr 1fr !important; }
  }
  @media(max-width:540px){
    .r-price-grid { grid-template-columns:1fr !important; }
    .r-ben-grid   { grid-template-columns:1fr !important; }
  }
`

/* ─── ANIMATION HELPERS ─── */
function useVisible(threshold = 0.12) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect() }
    }, { threshold })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, vis]
}

// Returns style object for different animation directions
function anim(vis, dir = 'up', delay = 0, duration = 700) {
  const base = { transition: `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms` }
  if (!vis) {
    const transforms = { up: 'translateY(36px)', left: 'translateX(-40px)', right: 'translateX(40px)', scale: 'scale(0.90)', none: 'none' }
    return { ...base, opacity: 0, transform: transforms[dir] || transforms.up }
  }
  return { ...base, opacity: 1, transform: 'none' }
}

function useActiveSection(ids) {
  const [active, setActive] = useState('')
  useEffect(() => {
    const fn = () => {
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 100) { setActive(id); return }
      }
      setActive('')
    }
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [ids])
  return active
}

/* ─── CHIP BADGE ─── */
function Chip({ children, color = P, bg = PL, icon }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: bg, color, padding: '5px 13px', borderRadius: 999, fontSize: 12, fontWeight: 600, letterSpacing: '0.02em', border: `1px solid ${color}22` }}>
      {icon && <span style={{ display: 'flex' }}>{icon}</span>}
      {children}
    </span>
  )
}

/* ─── NAVBAR ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mOpen, setMOpen] = useState(false)
  const active = useActiveSection(['hero', 'features', 'workflow', 'pricing', 'testimonials'])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { label: 'Features', href: '#features', id: 'features' },
    { label: 'How it Works', href: '#workflow', id: 'workflow' },
    { label: 'Pricing', href: '#pricing', id: 'pricing' },
    { label: 'Testimonials', href: '#testimonials', id: 'testimonials' },
  ]

  return (
    <header style={{ position: 'fixed', top: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, width: 'calc(100% - 32px)', maxWidth: 860 }}>
      <div style={{ background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: `1px solid ${scrolled ? 'rgba(0,0,0,0.09)' : 'rgba(229,222,255,0.8)'}`, borderRadius: 999, boxShadow: scrolled ? '0 8px 40px rgba(124,58,237,0.10)' : '0 4px 24px rgba(124,58,237,0.07)', padding: '6px 6px 6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, transition: 'all 0.3s' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '2px 8px 2px 2px', textDecoration: 'none', flexShrink: 0 }}>
          <img src="/replizz-logo.png" alt="Replizz" style={{ width: 32, height: 32, borderRadius: 9 }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: T1, letterSpacing: '-0.02em' }}>Replizz</span>
        </Link>
        <nav className="r-nav-desk" style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
          {links.map(l => (
            <a key={l.label} href={l.href} style={{ padding: '7px 15px', fontSize: 13.5, fontWeight: active === l.id ? 600 : 500, color: active === l.id ? P : T2, textDecoration: 'none', borderRadius: 999, background: active === l.id ? PL : 'transparent', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { if (active !== l.id) { e.currentTarget.style.color = T1; e.currentTarget.style.background = G2 } }}
              onMouseLeave={e => { if (active !== l.id) { e.currentTarget.style.color = T2; e.currentTarget.style.background = 'transparent' } }}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="r-nav-desk" style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <Link to="/login" style={{ padding: '8px 14px', fontSize: 13, fontWeight: 500, color: T2, textDecoration: 'none', borderRadius: 999, transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = T1}
            onMouseLeave={e => e.currentTarget.style.color = T2}>Sign In</Link>
          <Link to="/register" style={{ padding: '9px 20px', fontSize: 13, fontWeight: 600, color: W, background: ACC, textDecoration: 'none', borderRadius: 999, boxShadow: '0 2px 12px rgba(232,80,58,0.35)', transition: 'opacity 0.15s, transform 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none' }}>Get Started Free</Link>
        </div>
        <button type="button" className="r-nav-mobile" onClick={() => setMOpen(v => !v)} style={{ background: 'none', border: 'none', padding: '6px 10px', cursor: 'pointer', color: T1, marginRight: 2 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {mOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></>}
          </svg>
        </button>
      </div>
      {mOpen && (
        <div style={{ marginTop: 8, background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 20, boxShadow: '0 8px 40px rgba(0,0,0,0.12)', padding: 12 }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMOpen(false)} style={{ display: 'block', padding: '12px 16px', fontSize: 15, fontWeight: 500, color: T2, textDecoration: 'none', borderRadius: 12, transition: 'all 0.12s' }}
              onMouseEnter={e => { e.currentTarget.style.background = G2; e.currentTarget.style.color = T1 }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T2 }}>{l.label}</a>
          ))}
          <div style={{ height: 1, background: BDR, margin: '8px 0' }} />
          <Link to="/login" onClick={() => setMOpen(false)} style={{ display: 'block', padding: '12px 16px', fontSize: 15, fontWeight: 500, color: T2, textDecoration: 'none', borderRadius: 12 }}>Sign In</Link>
          <Link to="/register" onClick={() => setMOpen(false)} style={{ display: 'block', margin: '4px 0 0', padding: '12px 16px', fontSize: 15, fontWeight: 700, color: W, background: ACC, textDecoration: 'none', borderRadius: 12, textAlign: 'center' }}>Get Started Free</Link>
        </div>
      )}
    </header>
  )
}

/* ─── CHAT MOCKUP ─── */

/* ═══════════════════════════════════════════
   SECTION 1 — HERO
═══════════════════════════════════════════ */
function Hero() {
  const [ref, vis] = useVisible(0.05)
  return (
    <section id="hero" style={{ background: `linear-gradient(160deg, #F8F6FF 0%, #FFFFFF 50%, #F0EEFF 100%)`, paddingTop: 120, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
      {/* Background shapes */}
      <div style={{ position: 'absolute', top: -120, right: -100, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -60, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(61,90,254,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '30%', left: '10%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,80,244,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div ref={ref} style={{ maxWidth: 1120, margin: '0 auto', padding: '0 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="r-hero-grid">
        {/* Left */}
        <div>
          <div style={{ ...anim(vis, 'up', 0), marginBottom: 24 }}>
            <Chip icon={<Sparkles size={11} />}>AI-Powered Facebook Inbox</Chip>
          </div>
          <h1 style={{ ...anim(vis, 'up', 80), fontSize: 'clamp(36px,4.8vw,60px)', fontWeight: 900, color: T1, lineHeight: 1.08, letterSpacing: '-0.035em', marginBottom: 22 }}>
            Reply to every<br />
            customer{' '}
            <span style={{ background: PG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              instantly
            </span>
            <br />— even at 3AM
          </h1>
          <p style={{ ...anim(vis, 'up', 160), fontSize: 18, color: T2, lineHeight: 1.75, marginBottom: 36, maxWidth: 460 }}>
            Replizz connects to your Facebook page and uses AI to handle every inbox message — answering questions, confirming orders, and converting leads while you sleep.
          </p>
          <div style={{ ...anim(vis, 'up', 220), display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '14px 30px', fontSize: 15, fontWeight: 700, color: W, background: ACC, textDecoration: 'none', borderRadius: 14, boxShadow: '0 4px 20px rgba(232,80,58,0.40)', transition: 'transform 0.15s, box-shadow 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(232,80,58,0.50)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(232,80,58,0.40)' }}>
              Start for free <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
            <a href="#features" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 22px', fontSize: 15, fontWeight: 500, color: P, textDecoration: 'none', borderRadius: 14, border: `1.5px solid ${BDR}`, transition: 'all 0.15s', background: W }}
              onMouseEnter={e => { e.currentTarget.style.background = PL; e.currentTarget.style.borderColor = P + '55' }}
              onMouseLeave={e => { e.currentTarget.style.background = W; e.currentTarget.style.borderColor = BDR }}>
              See how it works
            </a>
          </div>
          {/* Trust row */}
          <div style={{ ...anim(vis, 'up', 300), display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {[ACC, '#F59E0B', '#7C3AED', '#3D5AFE', '#10B981'].map((c, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: `2px solid ${W}`, marginLeft: i > 0 ? -10 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: W, zIndex: 5 - i }}>
                  {['R','K','S','M','A'][i]}
                </div>
              ))}
              <span style={{ fontSize: 13, color: T2, fontWeight: 500, marginLeft: 4 }}>500+ businesses</span>
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(i => <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
              <span style={{ fontSize: 13, color: T2, fontWeight: 500, marginLeft: 4 }}>4.9/5 rating</span>
            </div>
          </div>
        </div>

        {/* Right — Product video */}
        <div className="r-hero-chat" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', ...anim(vis, 'right', 100) }}>
          {/* Glow behind phone */}
          <div style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 65%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', animation: 'floatY 6s ease-in-out infinite' }}>
            <PhoneVideo src="https://res.cloudinary.com/dksttdlbb/video/upload/q_auto,f_mp4/v1774687177/60F14033-7C97-41C7-811D-FB7FA46ACB1B_cqluhw.mp4" />
            {/* Floating badge top-right */}
            <div style={{ position: 'absolute', top: 24, right: -72, background: W, border: `1px solid ${BDR}`, borderRadius: 12, padding: '8px 14px', boxShadow: '0 8px 24px rgba(124,58,237,0.12)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: PL, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={15} color={P} /></div>
              <div>
                <p style={{ fontSize: 11, color: T3, fontWeight: 500 }}>Avg. reply time</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: T1 }}>{'< 2 sec'}</p>
              </div>
            </div>
            {/* Floating badge bottom-left */}
            <div style={{ position: 'absolute', bottom: 32, left: -72, background: W, border: `1px solid ${BDR}`, borderRadius: 12, padding: '8px 14px', boxShadow: '0 8px 24px rgba(124,58,237,0.12)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={15} color="#10B981" /></div>
              <div>
                <p style={{ fontSize: 11, color: T3, fontWeight: 500 }}>Revenue boost</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: T1 }}>+30% avg</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Scroll cue */}
      <div style={{ textAlign: 'center', marginTop: 56, ...anim(vis, 'up', 400) }}>
        <a href="#problem" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: T3, textDecoration: 'none', fontSize: 12, fontWeight: 500, animation: 'floatY 2s ease-in-out infinite' }}>
          Scroll to explore <ChevronDown size={16} />
        </a>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SECTION 2 — PROBLEM (slide from sides)
═══════════════════════════════════════════ */
function Problem() {
  const [ref, vis] = useVisible()
  const pains = [
    { Icon: Clock, title: 'Hours wasted daily', body: 'Business owners spend 4–6 hours every day copy-pasting the same answers. That time could be spent growing — not repeating yourself.', color: '#EF4444', bg: '#FEF2F2', dir: 'left' },
    { Icon: MessageCircle, title: 'Leads lost at night', body: 'Customers message at midnight. Without an instant reply, they move on to a competitor. Every unanswered message is a missed sale.', color: '#F59E0B', bg: '#FFFBEB', dir: 'up' },
    { Icon: Users, title: 'Inconsistent replies', body: 'Different team members, different tones, different answers. Customers get confused — and trust takes years to build but seconds to lose.', color: P, bg: PL, dir: 'right' },
  ]
  return (
    <section id="problem" style={{ background: W, padding: '100px 28px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto 64px', ...anim(vis, 'up', 0) }} ref={ref}>
          <Chip>The Problem</Chip>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 800, color: T1, letterSpacing: '-0.03em', lineHeight: 1.15, marginTop: 14, marginBottom: 16 }}>
            Facebook inbox is<br />
            <span style={{ background: PG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>killing your growth</span>
          </h2>
          <p style={{ fontSize: 16, color: T2, lineHeight: 1.75 }}>Every missed message is a missed sale. Manual replies don't scale. And your competitors are already automating.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="r-prob-grid">
          {pains.map((p, i) => (
            <div key={p.title} style={{ background: p.bg, borderRadius: 20, padding: '32px 28px', border: `1px solid ${p.color}18`, ...anim(vis, p.dir, 80 + i * 60) }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: W, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: `0 4px 16px ${p.color}22` }}>
                <p.Icon size={24} color={p.color} strokeWidth={2} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: T1, marginBottom: 12, letterSpacing: '-0.01em' }}>{p.title}</h3>
              <p style={{ fontSize: 14.5, color: T2, lineHeight: 1.75 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SECTION 3 — SOLUTION (split layout)
═══════════════════════════════════════════ */
function Solution() {
  const [ref, vis] = useVisible()
  const points = [
    { Icon: Bot, text: 'AI trained on your products, tone, and business rules' },
    { Icon: Zap, text: 'Responds in under 2 seconds, 24 hours a day' },
    { Icon: Camera, text: 'Reads payment screenshots and confirms orders automatically' },
    { Icon: Brain, text: 'Learns from your conversations and improves over time' },
  ]
  return (
    <section style={{ background: G2, padding: '100px 28px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div ref={ref} style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 72 }} className="r-feat-split">
        {/* Left visual */}
        <div style={{ flex: 1, flexShrink: 0, ...anim(vis, 'left', 0) }}>
          <div style={{ background: W, borderRadius: 24, padding: 32, boxShadow: '0 20px 60px rgba(124,58,237,0.10)', border: `1px solid ${BDR}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: PG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={18} color="#fff" /></div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: T1 }}>Replizz AI</p>
                <p style={{ fontSize: 11.5, color: T3 }}>Always on · Context-aware</p>
              </div>
            </div>
            {[
              { q: 'Is this product available in size L?', a: 'Yes! We have Size L in stock. Shall I add it to your order?' },
              { q: 'How long does delivery take?', a: 'We deliver within 2-3 business days inside Dhaka. Outside Dhaka takes 4-5 days via courier.' },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: i === 0 ? 16 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                  <div style={{ background: G2, borderRadius: '16px 16px 4px 16px', padding: '10px 14px', fontSize: 13, color: T1, maxWidth: '80%' }}>{item.q}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: PG, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={12} color="#fff" /></div>
                  <div style={{ background: PL, borderRadius: '16px 16px 16px 4px', padding: '10px 14px', fontSize: 13, color: T1, maxWidth: '80%', border: `1px solid ${BDR}` }}>{item.a}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 20, padding: '14px 16px', background: '#ECFDF5', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #BBF7D0' }}>
              <CheckCircle2 size={18} color="#10B981" />
              <p style={{ fontSize: 13, color: '#065F46', fontWeight: 500 }}>Order confirmed automatically. Receipt sent.</p>
            </div>
          </div>
        </div>
        {/* Right text */}
        <div style={{ flex: 1, ...anim(vis, 'right', 100) }}>
          <Chip>The Solution</Chip>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: T1, letterSpacing: '-0.03em', lineHeight: 1.15, marginTop: 14, marginBottom: 16 }}>
            Your AI inbox<br />that never sleeps
          </h2>
          <p style={{ fontSize: 16, color: T2, lineHeight: 1.75, marginBottom: 28 }}>Replizz is an AI agent trained specifically on your business. It reads, understands, and replies to every Facebook message with the right answer — instantly.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {points.map(pt => (
              <div key={pt.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: PL, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><pt.Icon size={16} color={P} /></div>
                <p style={{ fontSize: 14.5, color: T2, lineHeight: 1.65, paddingTop: 8 }}>{pt.text}</p>
              </div>
            ))}
          </div>
          <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 32, padding: '13px 26px', fontSize: 14, fontWeight: 700, color: W, background: PG, textDecoration: 'none', borderRadius: 12, boxShadow: '0 4px 20px rgba(124,58,237,0.30)', transition: 'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(124,58,237,0.40)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.30)' }}>
            Try it free <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── PHONE VIDEO (autoplay on scroll) ─── */
function PhoneVideo({ src, label }) {
  const videoRef = useRef(null)
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.muted = true
        el.play().catch(() => {})
      } else {
        el.pause()
      }
    }, { threshold: 0.25 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div style={{ position: 'relative', width: 230, flexShrink: 0 }}>
      {/* Phone frame */}
      <div style={{ background: '#1A0A2E', borderRadius: 34, padding: '6px 9px 5px', boxShadow: '0 32px 80px rgba(124,58,237,0.20), 0 8px 24px rgba(0,0,0,0.18)', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
        {/* Notch */}
        <div style={{ width: 72, height: 14, background: '#0D0618', borderRadius: 99, margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2A1A4E' }} />
        </div>
        <div style={{ borderRadius: 22, overflow: 'hidden', background: '#000', aspectRatio: '9/19.5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <video ref={videoRef} src={src} autoPlay muted loop playsInline preload="auto"
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
        </div>
        {/* Home bar */}
        <div style={{ width: 64, height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 99, margin: '4px auto 2px' }} />
      </div>
      {/* Label badge */}
      {label && (
        <div style={{ position: 'absolute', bottom: -14, left: '50%', transform: 'translateX(-50%)', background: '#fff', border: `1px solid ${BDR}`, borderRadius: 999, padding: '4px 14px', fontSize: 11.5, fontWeight: 600, color: P, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(124,58,237,0.12)' }}>{label}</div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════
   SECTION 4 — PRODUCT DEMOS (alternating split)
═══════════════════════════════════════════ */
function ProductDemos() {
  const demos = [
    {
      src: 'https://res.cloudinary.com/dksttdlbb/video/upload/q_auto,f_mp4/v1774687740/60F14033-7C97-41C7-811D-FB7FA46ACB1B_2_bthlfr.mp4',
      label: 'Language Switch',
      badge: 'Multi-Language AI',
      title: 'Replies in the language your customer prefers',
      body: 'When a customer asks Replizz to switch languages, it immediately adapts — mid-conversation. No setup needed, no manual intervention. Just seamless communication.',
      points: ['Customer asks to switch language — AI switches instantly', 'Supports Bangla, English, and mixed conversation', 'Consistent tone and accuracy in every language'],
      badgeColor: '#10B981',
      reverse: true,
    },
    {
      src: 'https://res.cloudinary.com/dksttdlbb/video/upload/q_auto,f_mp4/v1774687816/60F14033-7C97-41C7-811D-FB7FA46ACB1B_3_qnkkwr.mp4',
      label: 'Human Touch',
      badge: 'Natural Conversations',
      title: 'AI that feels genuinely human',
      body: 'Replizz doesn\'t just give robotic answers — it replies the way a real person would. Warm, natural, and conversational so customers never feel like they\'re talking to a bot.',
      points: ['Empathetic tone that matches the conversation mood', 'Avoids stiff, scripted replies customers can spot instantly', 'Builds trust and keeps customers engaged longer'],
      badgeColor: ACC,
    },
  ]

  return (
    <section id="demos" style={{ background: W, padding: '100px 28px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', maxWidth: 540, margin: '0 auto 80px' }}>
          <Chip icon={<Play size={11} />}>See It In Action</Chip>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 800, color: T1, letterSpacing: '-0.03em', lineHeight: 1.15, marginTop: 14, marginBottom: 16 }}>Watch Replizz work in real time</h2>
          <p style={{ fontSize: 16, color: T2, lineHeight: 1.75 }}>Real product recordings — not mockups. See exactly what your customers experience when Replizz handles your inbox.</p>
        </div>

        {demos.map((demo, i) => (
          <DemoRow key={i} demo={demo} idx={i} />
        ))}
      </div>
    </section>
  )
}

function DemoRow({ demo, idx }) {
  const [ref, vis] = useVisible(0.1)
  const rev = demo.reverse
  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 64, marginBottom: idx < 2 ? 96 : 0, flexDirection: rev ? 'row-reverse' : 'row' }} className="r-feat-split">
      {/* Video side */}
      <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', ...anim(vis, rev ? 'right' : 'left', 0) }}>
        <PhoneVideo src={demo.src} label={demo.label} />
      </div>
      {/* Text side */}
      <div style={{ flex: 1, ...anim(vis, rev ? 'left' : 'right', 120) }}>
        <span style={{ display: 'inline-block', background: demo.badgeColor + '15', color: demo.badgeColor, padding: '4px 13px', borderRadius: 999, fontSize: 12, fontWeight: 600, marginBottom: 16, border: `1px solid ${demo.badgeColor}22` }}>{demo.badge}</span>
        <h3 style={{ fontSize: 'clamp(22px,2.8vw,32px)', fontWeight: 800, color: T1, letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 16 }}>{demo.title}</h3>
        <p style={{ fontSize: 16, color: T2, lineHeight: 1.75, marginBottom: 24 }}>{demo.body}</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {demo.points.map(pt => (
            <li key={pt} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14.5, color: T2, lineHeight: 1.6 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: demo.badgeColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                <CheckCircle2 size={13} color={demo.badgeColor} strokeWidth={2.5} />
              </div>
              {pt}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   SECTION 5 — FEATURES (card grid + alternating)
═══════════════════════════════════════════ */
function Features() {
  const [ref, vis] = useVisible()
  const feats = [
    { Icon: Brain, title: 'Context-Aware AI', body: 'Trained on your product catalog, FAQs, and business rules. Answers in the right tone every time.', grad: 'linear-gradient(135deg,#7C3AED,#A78BFA)', shadow: 'rgba(124,58,237,0.28)' },
    { Icon: Camera, title: 'Payment Screenshot Detection', body: 'Replizz can reads payment screenshots from customers and confirms orders automatically.', grad: 'linear-gradient(135deg,#3D5AFE,#60A5FA)', shadow: 'rgba(61,90,254,0.28)' },
    { Icon: UserRound, title: 'Human Takeover Mode', body: 'Pause AI and jump in manually whenever a conversation needs a personal touch.', grad: 'linear-gradient(135deg,#C850F4,#E879F9)', shadow: 'rgba(200,80,244,0.28)' },
    { Icon: Globe, title: 'Multi-Language Support', body: 'Reply in Bangla, English, or mixed — Replizz detects the customer language and responds naturally.', grad: 'linear-gradient(135deg,#10B981,#34D399)', shadow: 'rgba(16,185,129,0.28)' },
    { Icon: Package, title: 'Product Knowledge Base', body: 'Add your products with prices, descriptions, and availability. AI references them in every reply.', grad: 'linear-gradient(135deg,#F59E0B,#FCD34D)', shadow: 'rgba(245,158,11,0.28)' },
    { Icon: BarChart3, title: 'Conversation Analytics', body: 'Track messages handled, response rate, and customer satisfaction across all your pages.', grad: 'linear-gradient(135deg,#EF4444,#F87171)', shadow: 'rgba(239,68,68,0.28)' },
  ]
  return (
    <section id="features" style={{ background: W, padding: '100px 28px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 540, margin: '0 auto 64px', ...anim(vis, 'up', 0) }} ref={ref}>
          <Chip icon={<Sparkles size={11} />}>Features</Chip>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 800, color: T1, letterSpacing: '-0.03em', lineHeight: 1.15, marginTop: 14, marginBottom: 16 }}>Everything your inbox needs</h2>
          <p style={{ fontSize: 16, color: T2, lineHeight: 1.75 }}>From AI replies to payment detection — Replizz handles the full customer journey in your Facebook inbox.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="r-prob-grid">
          {feats.map((f, i) => (
            <div key={f.title} style={{ background: W, border: `1px solid ${BDR}`, borderRadius: 20, padding: '28px 24px', boxShadow: '0 2px 12px rgba(124,58,237,0.05)', transition: 'box-shadow 0.2s, transform 0.2s', ...anim(vis, i % 2 === 0 ? 'left' : 'right', 80 + i * 50) }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 16px 48px ${f.shadow}`; e.currentTarget.style.transform = 'translateY(-5px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(124,58,237,0.05)'; e.currentTarget.style.transform = 'none' }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: f.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, boxShadow: `0 6px 16px ${f.shadow}` }}>
                <f.Icon size={22} color="#fff" strokeWidth={2} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: T1, marginBottom: 9, lineHeight: 1.35 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: T2, lineHeight: 1.72 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SECTION 5 — BENEFITS (full-width dark highlight)
═══════════════════════════════════════════ */
function Benefits() {
  const [ref, vis] = useVisible()
  const stats = [
    { value: '3+ hrs', label: 'Saved per day on average', Icon: Clock },
    { value: '< 2s', label: 'AI response time', Icon: Zap },
    { value: '30%+', label: 'Revenue increase reported', Icon: TrendingUp },
    { value: '24/7', label: 'Always-on automation', Icon: Shield },
  ]
  return (
    <section style={{ background: '#0F0A1E', padding: '100px 28px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -80, left: '10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.20) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, right: '5%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(61,90,254,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '40%', right: '20%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,80,244,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />

      <div ref={ref} style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', textAlign: 'center' }}>
        <Chip color="#C850F4" bg="rgba(200,80,244,0.12)" icon={<Star size={11} />}>Results That Matter</Chip>
        <h2 style={{ fontSize: 'clamp(32px,5vw,58px)', fontWeight: 900, color: W, letterSpacing: '-0.035em', lineHeight: 1.1, marginTop: 16, marginBottom: 16, maxWidth: 680, margin: '16px auto 16px' }}>
          Real businesses.<br />
          <span style={{ background: PG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Real results.</span>
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.50)', lineHeight: 1.75, maxWidth: 500, margin: '0 auto 64px' }}>
          Businesses using Replizz consistently see more sales, faster responses, and happier customers — starting from day one.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2, maxWidth: 900, margin: '0 auto 56px' }} className="r-ben-grid">
          {stats.map((s, i) => (
            <div key={s.label} style={{ padding: '40px 24px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: i === 0 ? '20px 0 0 20px' : i === 3 ? '0 20px 20px 0' : '0', ...anim(vis, 'scale', i * 100) }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <s.Icon size={20} color="#C850F4" />
              </div>
              <p style={{ fontSize: 'clamp(34px,4vw,48px)', fontWeight: 900, background: PG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 10 }}>{s.value}</p>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.42)', lineHeight: 1.55 }}>{s.label}</p>
            </div>
          ))}
        </div>
        <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '14px 30px', fontSize: 15, fontWeight: 700, color: W, background: ACC, textDecoration: 'none', borderRadius: 14, boxShadow: '0 4px 20px rgba(232,80,58,0.40)', transition: 'transform 0.15s, box-shadow 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(232,80,58,0.52)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(232,80,58,0.40)' }}>
          Start automating today <ArrowRight size={16} strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SECTION 6 — WORKFLOW (horizontal timeline)
═══════════════════════════════════════════ */
function Workflow() {
  const [ref, vis] = useVisible()
  const steps = [
    { n: '01', title: 'Connect your page', body: 'Link your Facebook Business Page in under 2 minutes via secure OAuth. No technical skills needed.', Icon: Link2 },
    { n: '02', title: 'Train your AI', body: 'Upload products, set your tone, language, and instructions. Replizz learns your business inside-out.', Icon: Settings2 },
    { n: '03', title: 'Go live instantly', body: 'Turn on Replizz and it starts replying to all incoming messages — right away, around the clock.', Icon: Rocket },
    { n: '04', title: 'Watch results grow', body: 'Monitor conversations, track performance, and let Replizz keep improving your customer experience.', Icon: BarChart3 },
  ]
  return (
    <section id="workflow" style={{ background: G2, padding: '100px 28px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(61,90,254,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto 64px', ...anim(vis, 'up', 0) }} ref={ref}>
          <Chip icon={<MousePointer2 size={11} />}>How It Works</Chip>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 800, color: T1, letterSpacing: '-0.03em', lineHeight: 1.15, marginTop: 14, marginBottom: 16 }}>Set up in minutes.<br />Save hours every day.</h2>
          <p style={{ fontSize: 16, color: T2, lineHeight: 1.75 }}>Getting started is as simple as connecting your page and letting Replizz handle the rest.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, position: 'relative' }} className="r-work-grid">
          {/* Connecting line */}
          <div className="r-work-line" style={{ position: 'absolute', top: 32, left: '12.5%', right: '12.5%', height: 2, background: `linear-gradient(to right, ${BDR}, ${P}, ${BDR})`, borderRadius: 2, zIndex: 0 }} />
          {steps.map((s, i) => (
            <div key={s.n} style={{ padding: '0 16px', position: 'relative', zIndex: 1, ...anim(vis, 'up', 80 + i * 80) }}>
              {/* Step number circle */}
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: PG, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: `0 8px 24px rgba(124,58,237,0.30)`, animation: vis ? `pulseRing 2.5s ease ${i * 400}ms infinite` : 'none' }}>
                <s.Icon size={24} color="#fff" strokeWidth={2} />
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: T3, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', marginBottom: 8 }}>{s.n}</p>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: T1, textAlign: 'center', marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 13.5, color: T2, lineHeight: 1.70, textAlign: 'center' }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SECTION 7 — TESTIMONIALS
═══════════════════════════════════════════ */
function Testimonials() {
  const [ref, vis] = useVisible()
  const reviews = [
    { name: 'Rahim Uddin', role: 'Owner, Dhaka Fashion House', text: 'Before Replizz I was spending 4+ hours answering the same questions. Now customers get instant replies and my sales increased 30%!', init: 'R', color: ACC },
    { name: 'Sumaiya Akter', role: 'Manager, Mega Electronics BD', text: 'The payment screenshot detection is incredible. Replizz confirms orders automatically even at midnight. Our customers are much happier.', init: 'S', color: P },
    { name: 'Karim Hossain', role: 'Founder, Digital Services BD', text: 'The AI understands complex questions about our services. Professional, on-brand, and customers often do not realize it is automated.', init: 'K', color: '#10B981' },
  ]
  return (
    <section id="testimonials" style={{ background: W, padding: '100px 28px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 20, left: '2%', fontSize: 240, fontWeight: 900, color: PL, lineHeight: 1, userSelect: 'none', pointerEvents: 'none', opacity: 0.7, fontFamily: 'Georgia, serif' }}>"</div>
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto 64px', ...anim(vis, 'up', 0) }} ref={ref}>
          <Chip icon={<Star size={11} />}>Testimonials</Chip>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 800, color: T1, letterSpacing: '-0.03em', lineHeight: 1.15, marginTop: 14, marginBottom: 16 }}>Loved by business owners</h2>
          <p style={{ fontSize: 16, color: T2, lineHeight: 1.75 }}>Real results from real businesses across Bangladesh using Replizz daily.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }} className="r-testi-grid">
          {reviews.map((r, i) => (
            <div key={r.name} style={{ background: G2, border: `1px solid ${BDR}`, borderRadius: 22, padding: '32px 28px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(124,58,237,0.06)', transition: 'box-shadow 0.2s, transform 0.2s', ...anim(vis, i === 1 ? 'up' : i === 0 ? 'left' : 'right', 80 + i * 80) }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 16px 48px rgba(124,58,237,0.13)'; e.currentTarget.style.transform = 'translateY(-5px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.06)'; e.currentTarget.style.transform = 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <div style={{ display: 'flex', gap: 2 }}>{[1,2,3,4,5].map(j => <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}</div>
                <span style={{ fontSize: 44, fontWeight: 900, color: P, opacity: 0.18, lineHeight: 0.8 }}>"</span>
              </div>
              <p style={{ fontSize: 14.5, color: T2, lineHeight: 1.80, flex: 1, marginBottom: 22 }}>{r.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 18, borderTop: `1px solid ${BDR}` }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: r.color, color: W, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0, boxShadow: `0 4px 12px ${r.color}44` }}>{r.init}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: T1 }}>{r.name}</p>
                  <p style={{ fontSize: 12, color: T3 }}>{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SECTION 8 — PRICING
═══════════════════════════════════════════ */
function Pricing() {
  const [ref, vis] = useVisible()

  const plans = [
    {
      name: 'Free',
      price: '০',
      currency: '৳',
      period: 'month',
      tagline: 'Just getting started',
      desc: 'Try Replizz with zero cost. No credit card needed.',
      limits: [
        { Icon: MessageCircle, text: '50 AI replies / month' },
        { Icon: Link2,         text: '1 Facebook page' },
      ],
      features: [
        { text: 'Basic AI auto replies' },
        { text: 'Simple question answering' },
        { text: 'English & Bangla support' },
        { text: 'Basic inbox automation' },
        { text: 'Replizz branding' },
      ],
      cta: 'Start Free',
      ctaTo: '/register',
      hl: false,
      custom: false,
    },
    {
      name: 'Standard',
      price: '২৯৯',
      currency: '৳',
      period: 'month',
      tagline: 'For growing pages',
      desc: 'Reliable automation for small businesses with steady traffic.',
      limits: [
        { Icon: MessageCircle, text: '1,000 AI replies / month' },
        { Icon: Link2,         text: '2 Facebook pages' },
      ],
      features: [
        { text: 'AI auto replies' },
        { text: 'Multi-language support' },
        { text: 'Basic context awareness' },
        { text: 'Reply-to-message support' },
        { text: 'Simple conversation flow' },
        { text: 'Limited reaction support' },
      ],
      cta: 'Get Started',
      ctaTo: '/payment?plan=standard',
      hl: false,
      custom: false,
    },
    {
      name: 'Pro',
      price: '৯৯৯',
      currency: '৳',
      period: 'month',
      tagline: 'Best for growing businesses',
      desc: 'Full automation power for businesses serious about conversion.',
      badge: 'Most Popular',
      limits: [
        { Icon: MessageCircle, text: '5,000 AI replies / month' },
        { Icon: Link2,         text: 'Up to 5 Facebook pages' },
      ],
      features: [
        { text: 'Full AI automation' },
        { text: 'Advanced context memory' },
        { text: 'Payment screenshot detection' },
        { text: 'Custom AI instructions per page' },
        { text: 'Smart reaction system' },
        { text: 'Moderator-aware automation' },
        { text: 'Follow-up automation' },
        { text: 'Priority response handling' },
      ],
      cta: 'Upgrade to Pro',
      ctaTo: '/payment?plan=pro',
      hl: true,
      custom: false,
    },
    {
      name: 'Custom',
      price: null,
      currency: null,
      period: null,
      tagline: 'Enterprise & agencies',
      desc: 'Tailored setup for large operations with unique requirements.',
      limits: [
        { Icon: MessageCircle, text: 'High / unlimited replies' },
        { Icon: Link2,         text: 'Unlimited Facebook pages' },
      ],
      features: [
        { text: 'Everything in Pro' },
        { text: 'Custom workflow automation' },
        { text: 'API access (future-ready)' },
        { text: 'Dedicated support manager' },
        { text: 'Custom AI setup & tuning' },
        { text: 'Integration support' },
      ],
      cta: 'Contact Us',
      ctaTo: null,
      hl: false,
      custom: true,
    },
  ]

  /* subtle hover lift for non-pro cards */
  const cardHover = e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.13)'; e.currentTarget.style.transform = 'translateY(-4px)' }
  const cardLeave = e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'none' }

  return (
    <section id="pricing" style={{ background: `linear-gradient(180deg, ${W} 0%, ${G2} 100%)`, padding: '108px 28px 120px', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient orb */}
      <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 800, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.055) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 72px', ...anim(vis, 'up', 0) }} ref={ref}>
          <Chip icon={<Sparkles size={11} />}>Pricing</Chip>
          <h2 style={{ fontSize: 'clamp(30px,3.8vw,46px)', fontWeight: 900, color: T1, letterSpacing: '-0.035em', lineHeight: 1.1, marginTop: 16, marginBottom: 18 }}>
            Pick the plan that fits<br />
            <span style={{ background: PG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>your business size</span>
          </h2>
          <p style={{ fontSize: 16, color: T2, lineHeight: 1.8 }}>Start free. Upgrade when you grow. No hidden fees, cancel anytime.</p>
        </div>

        {/* ── Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, alignItems: 'stretch' }} className="r-price-grid">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              onMouseEnter={plan.hl ? undefined : cardHover}
              onMouseLeave={plan.hl ? undefined : cardLeave}
              style={{
                background: plan.hl ? PG : W,
                border: `1.5px solid ${plan.hl ? 'transparent' : BDR}`,
                borderRadius: 14,
                padding: plan.hl ? '20px 14px 16px' : '14px 14px 14px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: plan.hl
                  ? '0 10px 32px rgba(124,58,237,0.26), 0 2px 8px rgba(124,58,237,0.12)'
                  : '0 1px 6px rgba(0,0,0,0.05)',
                transform: plan.hl ? 'translateY(-5px)' : 'none',
                transition: plan.hl ? 'none' : 'box-shadow 0.2s, transform 0.2s',
                zIndex: plan.hl ? 2 : 1,
                ...anim(vis, i === 2 ? 'scale' : i < 2 ? 'left' : 'right', 60 + i * 70),
              }}
            >
              {/* Most Popular badge */}
              {plan.badge && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#10B981', color: W, padding: '3px 14px', borderRadius: 999, fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '0.05em', boxShadow: '0 3px 12px rgba(16,185,129,0.40)' }}>
                  {plan.badge}
                </div>
              )}

              {/* Plan name + tagline */}
              <div style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: plan.hl ? 'rgba(255,255,255,0.50)' : T3, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{plan.name}</span>
                <p style={{ fontSize: 10.5, fontWeight: 500, color: plan.hl ? 'rgba(255,255,255,0.70)' : T2, marginTop: 1 }}>{plan.tagline}</p>
              </div>

              {/* Price block */}
              <div style={{ marginBottom: 4, display: 'flex', alignItems: 'flex-end', gap: 2, minHeight: 32 }}>
                {plan.price !== null ? (
                  <>
                    <span style={{ fontSize: 11, fontWeight: 600, color: plan.hl ? 'rgba(255,255,255,0.65)' : T3, paddingBottom: 4 }}>{plan.currency}</span>
                    <span style={{ fontSize: 26, fontWeight: 900, color: plan.hl ? W : T1, letterSpacing: '-0.05em', lineHeight: 1 }}>{plan.price}</span>
                    <span style={{ fontSize: 10, color: plan.hl ? 'rgba(255,255,255,0.42)' : T3, paddingBottom: 4 }}>/{plan.period}</span>
                  </>
                ) : (
                  <div>
                    <span style={{ fontSize: 16, fontWeight: 800, color: T1, letterSpacing: '-0.02em' }}>Contact Us</span>
                    <p style={{ fontSize: 10, color: T3, marginTop: 1 }}>Custom quote</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <p style={{ fontSize: 10.5, color: plan.hl ? 'rgba(255,255,255,0.60)' : T2, lineHeight: 1.55, marginBottom: 8 }}>{plan.desc}</p>

              {/* Usage limits strip */}
              <div style={{ background: plan.hl ? 'rgba(255,255,255,0.10)' : G2, borderRadius: 7, padding: '6px 8px', marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {plan.limits.map(l => (
                  <div key={l.text} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <l.Icon size={10} color={plan.hl ? 'rgba(255,255,255,0.70)' : P} strokeWidth={2.5} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: plan.hl ? 'rgba(255,255,255,0.80)' : T1 }}>{l.text}</span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: plan.hl ? 'rgba(255,255,255,0.12)' : BDR, marginBottom: 8 }} />

              {/* Feature list */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px', display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
                {plan.features.map(f => (
                  <li key={f.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 10.5, color: plan.hl ? 'rgba(255,255,255,0.85)' : T2, lineHeight: 1.35 }}>
                    <CheckCircle2
                      size={11}
                      strokeWidth={2.5}
                      color={plan.hl ? 'rgba(255,255,255,0.65)' : '#10B981'}
                      style={{ flexShrink: 0, marginTop: 1 }}
                    />
                    {f.text}
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              {plan.custom ? (
                <a
                  href="mailto:hello@replizz.com"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px 0', fontSize: 11.5, fontWeight: 700, color: P, background: PL, textDecoration: 'none', borderRadius: 7, border: `1.5px solid ${BDR}`, transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = BDR; e.currentTarget.style.borderColor = P + '55' }}
                  onMouseLeave={e => { e.currentTarget.style.background = PL; e.currentTarget.style.borderColor = BDR }}
                >
                  {plan.cta} <ArrowRight size={11} strokeWidth={2.5} />
                </a>
              ) : (
                <Link
                  to={plan.ctaTo}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px 0', fontSize: 11.5, fontWeight: 700, color: plan.hl ? P : W, background: plan.hl ? W : plan.name === 'Free' ? G2 : ACC, textDecoration: 'none', borderRadius: 7, border: plan.name === 'Free' ? `1.5px solid ${BDR}` : 'none', boxShadow: plan.hl ? '0 2px 10px rgba(255,255,255,0.25)' : plan.name === 'Free' ? 'none' : '0 2px 8px rgba(232,80,58,0.25)', transition: 'opacity 0.15s, transform 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none' }}
                >
                  {plan.cta} <ArrowRight size={11} strokeWidth={2.5} />
                </Link>
              )}

              {/* Pro sub-label */}
              {plan.hl && (
                <p style={{ textAlign: 'center', fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginTop: 12 }}>
                  Best for growing businesses
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{ textAlign: 'center', marginTop: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {[
            { Icon: Shield, text: 'No credit card required' },
            { Icon: Zap,    text: '7-day free trial on paid plans' },
            { Icon: Users,  text: 'Cancel anytime' },
          ].map(item => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: T3 }}>
              <item.Icon size={14} color={T3} strokeWidth={2} />
              {item.text}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SECTION 9 — FAQ
═══════════════════════════════════════════ */
function FAQ() {
  const [open, setOpen] = useState(null)
  const [ref, vis] = useVisible()
  const items = [
    { q: 'Does Replizz work with all Facebook Pages?', a: 'Yes. As long as you are the admin of the Facebook Page and connect it via our OAuth flow, Replizz can automate your inbox.' },
    { q: 'Will customers know they are talking to AI?', a: 'The AI responds in a natural, conversational tone. You can configure it to disclose it is AI or to respond as your business persona.' },
    { q: 'What happens if the AI cannot answer a question?', a: 'Replizz sends a fallback message and you can jump in with Human Takeover mode to handle it personally.' },
    { q: 'How does payment screenshot detection work?', a: 'When a customer sends an image, GPT-4 Vision analyzes it and confirms if it looks like a payment receipt, then responds accordingly.' },
    { q: 'Can I cancel my plan at any time?', a: 'Yes. All plans are month-to-month. You can upgrade, downgrade, or cancel anytime from your account settings.' },
  ]
  return (
    <section style={{ background: W, padding: '100px 28px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 72, alignItems: 'start' }} className="r-feat-split">
          <div style={{ position: 'sticky', top: 100, ...anim(vis, 'left', 0) }} ref={ref}>
            <Chip>FAQ</Chip>
            <h2 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, color: T1, letterSpacing: '-0.03em', lineHeight: 1.2, marginTop: 14, marginBottom: 16 }}>Questions answered</h2>
            <p style={{ fontSize: 15, color: T2, lineHeight: 1.75, marginBottom: 28 }}>Can't find what you're looking for? Reach out to our team directly.</p>
            <a href="mailto:hello@replizz.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', fontSize: 13.5, fontWeight: 600, color: P, textDecoration: 'none', border: `1.5px solid ${BDR}`, borderRadius: 12, transition: 'all 0.15s', background: W }}
              onMouseEnter={e => { e.currentTarget.style.background = PL; e.currentTarget.style.borderColor = P + '55' }}
              onMouseLeave={e => { e.currentTarget.style.background = W; e.currentTarget.style.borderColor = BDR }}>
              Contact support <ArrowRight size={14} />
            </a>
          </div>
          <div style={{ ...anim(vis, 'right', 100) }}>
            {items.map((item, i) => (
              <div key={item.q} style={{ borderBottom: `1px solid ${BDR}`, borderTop: i === 0 ? `1px solid ${BDR}` : 'none' }}>
                <button type="button" onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: T1, lineHeight: 1.4 }}>{item.q}</span>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: open === i ? PL : G2, border: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                    <ChevronDown size={14} color={open === i ? P : T3} strokeWidth={2.5} style={{ transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'block' }} />
                  </div>
                </button>
                {open === i && <p style={{ fontSize: 14.5, color: T2, lineHeight: 1.78, paddingBottom: 22 }}>{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   SECTION 10 — FINAL CTA
═══════════════════════════════════════════ */
function CTA() {
  const [ref, vis] = useVisible()
  return (
    <section style={{ background: G2, padding: '100px 28px 120px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div ref={ref} style={{ background: PG, borderRadius: 28, padding: '80px 52px', textAlign: 'center', position: 'relative', overflow: 'hidden', ...anim(vis, 'scale', 0) }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -40, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.12)', borderRadius: 999, fontSize: 12, fontWeight: 600, color: '#93C5FD', padding: '5px 16px', marginBottom: 24, border: '1px solid rgba(255,255,255,0.20)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80', animation: 'blink 1.5s ease infinite', flexShrink: 0 }} />
              Join 500+ businesses already growing with Replizz
            </div>
            <h2 style={{ fontSize: 'clamp(28px,4.5vw,52px)', fontWeight: 900, color: W, letterSpacing: '-0.035em', lineHeight: 1.1, marginBottom: 18 }}>
              Start automating your inbox today
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
              Free to start. Set up in 2 minutes. No code required. See results from the very first day.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 32px', fontSize: 15, fontWeight: 700, color: P, background: W, textDecoration: 'none', borderRadius: 14, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', transition: 'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.22)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)' }}>
                Create Your Free Account <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
              <a href="#features" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '15px 24px', fontSize: 15, fontWeight: 500, color: W, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.30)', borderRadius: 14, transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.10)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                Explore Features
              </a>
            </div>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.38)', marginTop: 22 }}>Free plan · No setup fees · Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   PAGE SHELL
═══════════════════════════════════════════ */
function HomeView() {
  return (
    <>
      <style>{css}</style>
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <ProductDemos />
      <Features />
      <Benefits />
      <Workflow />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  )
}

export default HomeView
