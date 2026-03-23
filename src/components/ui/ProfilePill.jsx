import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from './Avatar'
import Icon from './Icon'
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
            // Don't close if clicking inside the wrapper (button or modal)
            if (wrapRef.current && wrapRef.current.contains(e.target)) return
            close()
        }

        // Delay attaching so the current click event finishes first
        const id = setTimeout(() => {
            document.addEventListener('mousedown', handler)
        }, 0)

        return () => {
            clearTimeout(id)
            document.removeEventListener('mousedown', handler)
        }
    }, [open, close])

    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login', { replace: true })
        } catch (err) {
            console.error('Logout failed:', err)
        }
    }

    return (
        <div className="profile-pill-wrap" ref={wrapRef}>
            <div
                className="profile-pill"
                onClick={() => setOpen((prev) => !prev)}
                style={{ cursor: 'pointer' }}
            >
                <Avatar name={displayName} colors={['#57b9d8', '#c3f5ff']} size="sm" />
                <span>{displayName}</span>
            </div>

            {open && (
                <div className="profile-modal">
                    <div className="profile-modal-header">
                        <Avatar name={displayName} colors={['#57b9d8', '#c3f5ff']} size="md" />
                        <div className="profile-modal-info">
                            <p className="profile-modal-name">{displayName}</p>
                            <p className="profile-modal-email">{email}</p>
                        </div>
                    </div>

                    <div className="profile-modal-divider" />

                    <button
                        type="button"
                        className="profile-modal-logout"
                        onClick={handleLogout}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Log Out
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfilePill
