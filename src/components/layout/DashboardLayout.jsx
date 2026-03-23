import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

function DashboardLayout({ menuItems, activeSection, onSectionChange }) {
  return (
    <div className="page-bg">
      <div className="dashboard-shell anim-reveal">
        <Sidebar
          menuItems={menuItems}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
