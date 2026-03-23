import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'

function AdminLayout({ menuItems, activeSection, onSectionChange }) {
    return (
        <div className="page-bg">
            <div className="dashboard-shell anim-reveal">
                <AdminSidebar
                    menuItems={menuItems}
                    activeSection={activeSection}
                    onSectionChange={onSectionChange}
                />
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout
