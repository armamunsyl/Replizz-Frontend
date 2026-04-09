import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_ICONS = {
  overview: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  users: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  analytics: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  reports: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  pages: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
}

function AdminSidebar({ menuItems, activeSection, onSectionChange }) {
  const { user, dbUser, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside style={{ width: 224, flexShrink: 0, background: '#1E293B', display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
      {/* Brand */}
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff', flexShrink: 0 }}>R</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.01em' }}>Replizz</span>
        </div>

        {/* Admin badge */}
        <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#FCA5A5', lineHeight: 1.2 }}>{dbUser?.role || 'Admin'}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || ''}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px' }}>
        {menuItems.map((item) => {
          if (item.isHeader) {
            return (
              <p key={item.key} style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '12px 8px 4px' }}>
                {item.label}
              </p>
            )
          }
          if (item.isDivider) {
            return <div key={item.key} style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '6px 0' }} />
          }
          const isActive = item.key === activeSection
          const isClickable = Boolean(item.navigable)
          const icon = NAV_ICONS[item.icon] || NAV_ICONS['overview']
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => isClickable && onSectionChange(item.key)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, border: 'none', background: isActive ? 'rgba(37,99,235,0.25)' : 'transparent', color: isActive ? '#93C5FD' : 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: isActive ? 600 : 400, cursor: isClickable ? 'pointer' : 'default', marginBottom: 2, textAlign: 'left', transition: 'background 0.15s, color 0.15s' }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' } }}
            >
              <span style={{ opacity: isActive ? 1 : 0.7, flexShrink: 0 }}>{icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10, background: '#2563EB', color: '#fff' }}>{item.badge}</span>}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          type="button"
          onClick={() => { logout(); navigate('/login', { replace: true }) }}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, border: 'none', background: 'transparent', color: '#FCA5A5', fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'left' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
