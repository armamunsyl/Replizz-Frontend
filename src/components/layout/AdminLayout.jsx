import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import MobileTopHeader from './MobileTopHeader'
import MobileBottomNav from './MobileBottomNav'

function AdminLayout({ menuItems, activeSection, onSectionChange }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F9FAFB' }}>
      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-mobile-top { display: flex !important; }
          .admin-mobile-bottom { display: flex !important; }
        }
        @media (min-width: 769px) {
          .admin-sidebar-desktop { display: flex !important; }
          .admin-mobile-top { display: none !important; }
          .admin-mobile-bottom { display: none !important; }
        }
      `}</style>

      {/* Desktop sidebar */}
      <div className="admin-sidebar-desktop">
        <AdminSidebar menuItems={menuItems} activeSection={activeSection} onSectionChange={onSectionChange} />
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Mobile top header */}
        <div className="admin-mobile-top" style={{ display: 'none' }}>
          <MobileTopHeader />
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>

        {/* Mobile bottom nav */}
        <div className="admin-mobile-bottom" style={{ display: 'none' }}>
          <MobileBottomNav menuItems={menuItems} activeSection={activeSection} onSectionChange={onSectionChange} />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
