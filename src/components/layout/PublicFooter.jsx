import { Link } from 'react-router-dom'

const cols = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'Help Center', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Status', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Security', href: '#' },
    ],
  },
]

/* Social icon SVGs */
const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const socials = [
  { label: 'X (Twitter)', Icon: XIcon, href: '#' },
  { label: 'LinkedIn', Icon: LinkedInIcon, href: '#' },
  { label: 'Facebook', Icon: FacebookIcon, href: '#' },
]

function SocialBtn({ label, Icon, href }) {
  return (
    <a href={href} aria-label={label} style={{
      width: 38, height: 38, borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.10)',
      background: 'rgba(255,255,255,0.04)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(255,255,255,0.40)', textDecoration: 'none',
      transition: 'border-color 0.15s, color 0.15s, background 0.15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(37,99,235,0.5)'; e.currentTarget.style.color = '#60A5FA'; e.currentTarget.style.background = 'rgba(37,99,235,0.10)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = 'rgba(255,255,255,0.40)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
    >
      <Icon />
    </a>
  )
}

function FooterLink({ label, href }) {
  const isExternal = href.startsWith('/')
  const El = isExternal ? Link : 'a'
  return (
    <li>
      <El to={isExternal ? href : undefined} href={!isExternal ? href : undefined}
        style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.42)', textDecoration: 'none', transition: 'color 0.15s', display: 'inline-block' }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.42)'}>
        {label}
      </El>
    </li>
  )
}

function PublicFooter() {
  return (
    <footer style={{ background: '#0E0620', position: 'relative', overflow: 'hidden' }}>

      {/* Main content area */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 28px 0', position: 'relative', zIndex: 1 }}>

        {/* Top grid: brand + columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 64, marginBottom: 56, alignItems: 'start' }} className="rplz-footer-top">

          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <img src="/replizz-logo.png" alt="Replizz" style={{ width: 34, height: 34, borderRadius: 9, display: 'block' }} />
              <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>Replizz</span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.42)', lineHeight: 1.78, maxWidth: 220, marginBottom: 28 }}>
              AI-powered Facebook inbox automation for growing businesses.
            </p>

            {/* Contact */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Get in touch</p>
              <a href="mailto:hello@replizz.com"
                style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', display: 'block', marginBottom: 4, transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
                hello@replizz.com
              </a>
            </div>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {socials.map(s => <SocialBtn key={s.label} {...s} />)}
            </div>
          </div>

          {/* Link columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="rplz-footer-cols">
            {cols.map(col => (
              <div key={col.title}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.30)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 16 }}>
                  {col.title}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                  {col.links.map(link => <FooterLink key={link.label} {...link} />)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

        {/* Bottom bar */}
        <div style={{ padding: '22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.24)' }}>
            &copy; {new Date().getFullYear()} Replizz. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Link to="/terms-of-service" style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.28)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.28)'}>Terms &amp; Conditions</Link>
            <Link to="/privacy-policy" style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.28)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.28)'}>Privacy Policy</Link>
          </div>
        </div>
      </div>

      {/* Large brand mark — Studio-inspired */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 0, overflow: 'hidden', position: 'relative', zIndex: 1, paddingTop: 8 }}>
        {/* Real logo mark */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', paddingLeft: 'max(28px, calc((100vw - 1200px) / 2 + 28px))' }}>
          <img src="/replizz-logo.png" alt="Replizz" style={{ width: 'clamp(52px, 9vw, 112px)', height: 'clamp(52px, 9vw, 112px)', borderRadius: 'clamp(10px, 1.8vw, 22px)', display: 'block', flexShrink: 0 }} />
        </div>

        {/* Brand name */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <span style={{
            display: 'block',
            fontSize: 'clamp(64px, 12vw, 152px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            color: '#fff',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            paddingLeft: '0.18em',
            userSelect: 'none',
          }}>
            REPLIZZ
          </span>
        </div>
      </div>

    </footer>
  )
}

export default PublicFooter
