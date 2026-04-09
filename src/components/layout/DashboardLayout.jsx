import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileBottomNav from './MobileBottomNav'
import MobileTopHeader from './MobileTopHeader'

function DashboardLayout({ menuItems, activeSection, onSectionChange }) {
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F9FAFB', overflow: 'hidden' }}>
      {/* Desktop sidebar */}
      <div className="rplz-sidebar-wrap">
        <Sidebar menuItems={menuItems} activeSection={activeSection} onSectionChange={onSectionChange} />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Mobile top header */}
        <div className="rplz-mobile-header">
          <MobileTopHeader />
        </div>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <div className="rplz-mobile-nav">
          <MobileBottomNav menuItems={menuItems} activeSection={activeSection} onSectionChange={onSectionChange} />
        </div>
      </div>

      <style>{`
        .rplz-sidebar-wrap { display: flex; }
        .rplz-mobile-header { display: none; }
        .rplz-mobile-nav { display: none; }
        @media (max-width: 768px) {
          .rplz-sidebar-wrap { display: none; }
          .rplz-mobile-header { display: block; }
          .rplz-mobile-nav { display: block; }
        }
      `}</style>
    </div>
  )
}

export default DashboardLayout
