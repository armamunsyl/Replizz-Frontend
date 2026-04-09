import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import { useAuth } from '../../context/AuthContext'

function ProfilePill() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User'
  const email = user?.email || ''

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (wrapRef.current && wrapRef.current.contains(e.target)) return
      close()
    }
    const id = setTimeout(() => document.addEventListener('mousedown', handler), 0)
    return () => { clearTimeout(id); document.removeEventListener('mousedown', handler) }
  }, [open, close])

  const handleLogout = async () => {
    try { await logout(); navigate('/login', { replace: true }) }
    catch (err) { console.error('Logout failed:', err) }
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'transparent', border: '1px solid #E5E7EB',
          borderRadius: 8, padding: '5px 10px 5px 6px',
          cursor: 'pointer', color: '#374151',
          fontSize: 13, fontWeight: 500,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <Avatar name={displayName} size="xs" />
        <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayName}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: '#fff', border: '1px solid #E5E7EB',
          borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          minWidth: 200, zIndex: 100, overflow: 'hidden',
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar name={displayName} size="sm" />
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: 13, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</p>
              </div>
            </div>
          </div>
          <div style={{ padding: '6px 0' }}>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '8px 16px',
                background: 'transparent', border: 'none',
                color: '#EF4444', fontSize: 13, fontWeight: 500,
                cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePill
