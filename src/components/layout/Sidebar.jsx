import { useEffect, useRef, useState } from 'react'
import { usePage } from '../../context/PageContext'
import { useAuth } from '../../context/AuthContext'

function PageAvatar({ name, picture, size = 28 }) {
  const [imgFailed, setImgFailed] = useState(false)
  if (picture && !imgFailed) {
    return <img src={picture} alt={name} onError={() => setImgFailed(true)} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
  }
  const initials = name ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : 'FB'
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: '#3B5BDB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: size * 0.36, fontWeight: 700, color: '#fff' }}>
      {initials}
    </div>
  )
}

// Compact inline toggle switch
function AutomationToggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={e => { e.stopPropagation(); onToggle() }}
      title={enabled ? 'Automation ON — click to disable' : 'Automation OFF — click to enable'}
      style={{
        width: 32, height: 18, borderRadius: 9, border: 'none', flexShrink: 0,
        background: enabled ? '#10B981' : 'rgba(255,255,255,0.15)',
        position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
      }}
    >
      <span style={{
        position: 'absolute', top: 2, width: 14, height: 14,
        borderRadius: '50%', background: '#fff',
        left: enabled ? 16 : 2,
        transition: 'left 0.2s',
      }} />
    </button>
  )
}

const sidebarBg = '#1E293B'
const sidebarBorder = 'rgba(255,255,255,0.08)'
const sidebarText = '#CBD5E1'
const sidebarTextActive = '#FFFFFF'
const sidebarHover = 'rgba(255,255,255,0.06)'
const sidebarActive = 'rgba(255,255,255,0.1)'

const NAV_ICONS = {
  home: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  user: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  settings: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  box: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  star: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
}

function NavIcon({ name }) {
  return NAV_ICONS[name] || NAV_ICONS.home
}

function Sidebar({ menuItems, activeSection, onSectionChange }) {
  const { pages, selectedPage, setSelectedPage, toggleAutomation } = usePage()
  const { logout, isAdmin, dbUser } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleConnectPage = async () => {
    try {
      const { auth: firebaseAuth } = await import('../../lib/firebase')
      const token = await firebaseAuth.currentUser?.getIdToken()
      if (!token) return
      window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/facebook/login?token=${token}`
    } catch (err) { console.error('OAuth error:', err) }
  }

  // Plan info from dbUser
  const usedMessages = dbUser?.usedMessages ?? 0
  const messageLimit = dbUser?.messageLimit ?? 100
  const planType = dbUser?.planType ?? 'free'
  const usagePct = Math.min(100, Math.round((usedMessages / messageLimit) * 100))
  const usageColor = usagePct >= 90 ? '#EF4444' : usagePct >= 70 ? '#F59E0B' : '#10B981'

  return (
    <aside style={{ width: 240, height: '100vh', background: sidebarBg, display: 'flex', flexDirection: 'column', flexShrink: 0, borderRight: `1px solid ${sidebarBorder}`, overflow: 'hidden' }}>
      {/* Brand */}
      <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${sidebarBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/replizz-logo.png" alt="Replizz" style={{ width: 28, height: 28, borderRadius: 6 }} onError={e => e.target.style.display = 'none'} />
          <span style={{ fontSize: 16, fontWeight: 700, color: sidebarTextActive, letterSpacing: '-0.01em' }}>Replizz</span>
        </div>
      </div>

      {/* Page selector dropdown */}
      <div style={{ padding: '12px 12px 8px' }} ref={dropdownRef}>
        <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, paddingLeft: 2 }}>Active Page</p>
        <button
          type="button"
          onClick={() => setDropdownOpen(p => !p)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, background: sidebarHover, border: `1px solid ${sidebarBorder}`, borderRadius: 8, padding: '8px 10px', cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
          onMouseLeave={e => e.currentTarget.style.background = sidebarHover}
        >
          {selectedPage ? (
            <PageAvatar name={selectedPage.pageName} picture={selectedPage.pagePicture} size={24} />
          ) : (
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={sidebarText} strokeWidth="2"><circle cx="12" cy="8" r="3.5" /><path d="M5 19c1.3-2.8 3.8-4.2 7-4.2S17.7 16.2 19 19" /></svg>
            </div>
          )}
          <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: sidebarText, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>
            {selectedPage?.pageName || 'Select a Page'}
          </span>
          {selectedPage && (
            <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4, background: selectedPage.automationEnabled !== false ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)', color: selectedPage.automationEnabled !== false ? '#34D399' : '#F87171', flexShrink: 0, marginRight: 2 }}>
              {selectedPage.automationEnabled !== false ? 'ON' : 'OFF'}
            </span>
          )}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={sidebarText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.6, transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9" /></svg>
        </button>

        {dropdownOpen && (
          <div style={{ marginTop: 4, background: '#0F172A', border: `1px solid ${sidebarBorder}`, borderRadius: 8, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
            {pages.length === 0 ? (
              <p style={{ padding: '10px 12px', fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>No pages connected yet</p>
            ) : (
              pages.map((page) => (
                <div key={page.pageId} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: selectedPage?.pageId === page.pageId ? 'rgba(37,99,235,0.2)' : 'transparent', borderBottom: `1px solid ${sidebarBorder}`, transition: 'background 0.15s' }}>
                  {/* Click area to select the page */}
                  <button
                    type="button"
                    onClick={() => { setSelectedPage(page); setDropdownOpen(false) }}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, minWidth: 0 }}
                  >
                    <PageAvatar name={page.pageName} picture={page.pagePicture} size={26} />
                    <div style={{ minWidth: 0, textAlign: 'left' }}>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: sidebarTextActive, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{page.pageName}</p>
                      <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                        {(page.totalMessages || 0).toLocaleString()} msgs
                      </p>
                    </div>
                  </button>
                  {/* Automation toggle */}
                  <AutomationToggle
                    enabled={page.automationEnabled !== false}
                    onToggle={() => toggleAutomation(page.pageId)}
                  />
                </div>
              ))
            )}
            <div style={{ borderTop: `1px solid ${sidebarBorder}` }}>
              <button type="button" onClick={handleConnectPage} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#60A5FA', fontSize: 12, fontWeight: 500 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Connect Another Page
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '4px 12px', overflowY: 'auto' }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px 4px', marginBottom: 2 }}>Navigation</p>
        {menuItems.map((item) => {
          if (!item.navigable) return null
          const isActive = item.key === activeSection
          return (
            <button
              key={item.key} type="button"
              onClick={() => onSectionChange(item.key)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', marginBottom: 2, background: isActive ? sidebarActive : 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = sidebarHover }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ color: isActive ? sidebarTextActive : sidebarText, display: 'flex', flexShrink: 0 }}>
                <NavIcon name={item.icon} />
              </span>
              <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? sidebarTextActive : sidebarText, flex: 1, textAlign: 'left' }}>
                {item.label}
              </span>
              {item.badge && (
                <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', background: '#2563EB', borderRadius: 4, padding: '2px 5px' }}>{item.badge}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Usage meter */}
      <div style={{ padding: '10px 12px', borderTop: `1px solid ${sidebarBorder}` }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {planType.charAt(0).toUpperCase() + planType.slice(1)} Plan
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: usageColor }}>
              {usedMessages.toLocaleString()} / {messageLimit.toLocaleString()}
            </span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${usagePct}%`, background: usageColor, borderRadius: 2, transition: 'width 0.4s ease' }} />
          </div>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
            {Math.max(0, messageLimit - usedMessages).toLocaleString()} messages remaining
          </p>
        </div>

        {isAdmin && (
          <button type="button" onClick={() => window.location.href = '/admin'} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', marginBottom: 4, background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 4 7v5c0 4.4 3.4 8.5 8 10 4.6-1.5 8-5.6 8-10V7l-8-4Z" /></svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#F87171' }}>Admin Panel</span>
          </button>
        )}
        <button type="button" onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#EF4444' }}>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
