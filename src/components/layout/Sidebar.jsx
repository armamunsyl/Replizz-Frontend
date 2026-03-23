import { useEffect, useRef, useState } from 'react'
import Icon from '../ui/Icon'
import { usePage } from '../../context/PageContext'
import { useAuth } from '../../context/AuthContext'
import api from '../../lib/api'

// Initials fallback avatar
function PageAvatar({ name, picture, size = 32 }) {
  const [imgFailed, setImgFailed] = useState(false)

  if (picture && !imgFailed) {
    return (
      <img
        src={picture}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          border: '1.5px solid rgba(255,255,255,0.18)',
        }}
        onError={() => setImgFailed(true)}
      />
    )
  }

  // Fallback: initials
  const initials = name
    ? name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : 'FB'

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: size * 0.35,
        fontWeight: 700,
        color: '#fff',
        border: '1.5px solid rgba(255,255,255,0.18)',
      }}
    >
      {initials}
    </div>
  )
}

function Sidebar({ menuItems, activeSection, onSectionChange }) {
  const { pages, selectedPage, setSelectedPage } = usePage()
  const { user, logout, isAdmin } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleConnectPage = async () => {
    try {
      const { auth } = await import('../../lib/firebase')
      const token = await auth.currentUser?.getIdToken()
      if (!token) { console.error('Not authenticated'); return }
      // Use the backend OAuth flow that properly handles callback + saves pages
      window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/facebook/login?token=${token}`
    } catch (err) {
      console.error('Failed to start OAuth:', err)
    }
  }

  return (
    <aside className="left-rail anim-slide-left">
      <div className="left-top">
        <div className="brand anim-pop anim-delay-1">
          <div className="brand-glyph">
            <img src="/replizz-logo.png" alt="Replizz logo" />
          </div>
          <p>Replizz</p>
        </div>

        {/* ─── Page Switcher ─── */}
        <div
          ref={dropdownRef}
          className={`sidebar-dropdown anim-pop anim-delay-2 ${dropdownOpen ? 'open' : ''}`}
        >
          <button
            className="sidebar-dropdown-trigger anim-hover-lift"
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <span className="sidebar-dropdown-label">
              {selectedPage ? (
                <PageAvatar
                  name={selectedPage.pageName}
                  picture={selectedPage.pagePicture}
                  size={22}
                />
              ) : (
                <Icon name="facebook" className="sidebar-page-icon" />
              )}
              <span className="sidebar-dropdown-text">
                {selectedPage?.pageName || 'Select a Page'}
              </span>
            </span>
            <Icon name="chevron" className="sidebar-dropdown-icon" />
          </button>

          {dropdownOpen ? (
            <div className="sidebar-dropdown-menu" role="menu" aria-label="Facebook pages">
              {pages.length === 0 ? (
                <p style={{ padding: '0.6rem 0.75rem', fontSize: '0.78rem', opacity: 0.55 }}>
                  No pages connected yet
                </p>
              ) : (
                pages.map((page) => (
                  <button
                    key={page.pageId}
                    type="button"
                    role="menuitem"
                    className={`sidebar-dropdown-option ${selectedPage?.pageId === page.pageId ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedPage(page)
                      setDropdownOpen(false)
                    }}
                  >
                    <PageAvatar name={page.pageName} picture={page.pagePicture} size={26} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '0.68rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {page.pageName}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.58rem', opacity: 0.5, fontWeight: 500 }}>
                        ID: {page.pageId}
                      </p>
                    </div>
                  </button>
                ))
              )}

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0.25rem 0.3rem' }} />

              <button type="button" className="sidebar-dropdown-connect" onClick={handleConnectPage}>
                <Icon name="plus" className="sidebar-connect-icon" />
                <span>Connect Another Page</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Divider */}
      <div className="left-nav-divider" aria-hidden />

      <nav className="left-nav" aria-label="Sidebar">
        {menuItems.map((item, index) => {
          const isActive = item.key === activeSection
          const isClickable = Boolean(item.navigable)
          return (
            <button
              key={item.key}
              className={`nav-item anim-pop ${isActive ? 'active' : ''} ${isClickable ? 'clickable' : ''}`}
              type="button"
              style={{ animationDelay: `${0.18 + index * 0.05}s` }}
              onClick={() => { if (isClickable) onSectionChange(item.key) }}
            >
              <Icon name={item.icon} className="nav-item-icon" />
              <span>{item.label}</span>
              {item.badge ? <span className="pro-badge">{item.badge}</span> : null}
            </button>
          )
        })}
      </nav>

      <div style={{ marginTop: 'auto', padding: '0 0.9rem' }}>
        {/* Admin Panel link — only for Admins */}
        {isAdmin && (
          <button
            className="nav-item anim-pop clickable"
            type="button"
            onClick={() => window.location.href = '/admin'}
            style={{ animationDelay: '0.38s', color: '#c4b5fd' }}
          >
            <Icon name="shield" className="nav-item-icon" />
            <span style={{ fontWeight: 600 }}>Admin Panel</span>
            <span className="pro-badge" style={{ background: 'linear-gradient(90deg, #ef4444, #f97316)', fontSize: '0.5rem' }}>ADMIN</span>
          </button>
        )}
        <button
          className="nav-item anim-pop"
          type="button"
          onClick={logout}
          style={{ animationDelay: '0.4s', color: '#ef4444' }}
        >
          <svg style={{ width: '15px', height: '15px', opacity: 0.9 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span style={{ fontWeight: 600 }}>Log Out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
