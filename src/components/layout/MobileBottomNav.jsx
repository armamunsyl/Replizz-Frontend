import Icon from '../ui/Icon'
import { useAuth } from '../../context/AuthContext'

function MobileBottomNav({ menuItems, activeSection, onSectionChange }) {
  const { isAdmin } = useAuth()
  const primaryKeys = ['overview', 'inbox', 'settings', 'your-product']
  const displayItems = menuItems.filter(m => m.navigable && primaryKeys.includes(m.key)).slice(0, 4)

  return (
    <div style={{
      background: '#1E293B',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center',
      padding: '6px 0 8px',
      paddingBottom: 'env(safe-area-inset-bottom, 8px)',
    }}>
      {displayItems.map((item) => {
        const isActive = item.key === activeSection
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSectionChange(item.key)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
            }}
          >
            <span style={{ color: isActive ? '#60A5FA' : 'rgba(255,255,255,0.4)' }}>
              <Icon name={item.icon} className="" />
            </span>
            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, color: isActive ? '#60A5FA' : 'rgba(255,255,255,0.4)' }}>
              {item.label}
            </span>
          </button>
        )
      })}
      {isAdmin && (
        <button type="button" onClick={() => window.location.href = '/admin'} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 4 7v5c0 4.4 3.4 8.5 8 10 4.6-1.5 8-5.6 8-10V7l-8-4Z" /></svg>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Admin</span>
        </button>
      )}
    </div>
  )
}

export default MobileBottomNav
