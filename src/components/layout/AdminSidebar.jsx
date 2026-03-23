import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import { useAuth } from '../../context/AuthContext'

function AdminSidebar({ menuItems, activeSection, onSectionChange }) {
    const { user, dbUser, logout } = useAuth()
    const navigate = useNavigate()

    return (
        <aside className="left-rail admin-rail anim-slide-left">
            <div className="left-top">
                <div className="brand anim-pop anim-delay-1">
                    <div className="brand-glyph">
                        <img src="/replizz-logo.png" alt="Replizz logo" />
                    </div>
                    <p>Replizz</p>
                </div>

                {/* Admin Badge */}
                <div className="admin-badge-card anim-pop anim-delay-2">
                    <div className="admin-badge-icon">
                        <Icon name="shield" />
                    </div>
                    <div className="admin-badge-info">
                        <span className="admin-badge-role">{dbUser?.role || 'Admin'}</span>
                        <span className="admin-badge-email">{user?.email || ''}</span>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="left-nav-divider" aria-hidden />

            <nav className="left-nav" aria-label="Admin Sidebar">
                {menuItems.map((item, index) => {
                    if (item.isHeader) {
                        return (
                            <div
                                key={item.key}
                                className="admin-nav-header"
                                style={{ animationDelay: `${0.18 + index * 0.05}s` }}
                            >
                                {item.label}
                            </div>
                        )
                    }

                    if (item.isDivider) {
                        return (
                            <div
                                key={item.key}
                                className="left-nav-divider"
                                style={{ margin: '0.3rem 0' }}
                                aria-hidden
                            />
                        )
                    }

                    const isActive = item.key === activeSection
                    const isClickable = Boolean(item.navigable)
                    return (
                        <button
                            key={item.key}
                            className={`nav-item anim-pop ${isActive ? 'active' : ''} ${isClickable ? 'clickable' : ''}`}
                            type="button"
                            style={{ animationDelay: `${0.18 + index * 0.05}s` }}
                            onClick={() => {
                                if (isClickable) onSectionChange(item.key)
                            }}
                        >
                            <Icon name={item.icon} className="nav-item-icon" />
                            <span>{item.label}</span>
                            {item.badge ? <span className="pro-badge">{item.badge}</span> : null}
                        </button>
                    )
                })}
            </nav>

            <div style={{ marginTop: 'auto', padding: '0 0.9rem' }}>
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

export default AdminSidebar
