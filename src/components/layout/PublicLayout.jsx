import { Outlet, useLocation } from 'react-router-dom'
import PublicFooter from './PublicFooter'

function PublicLayout() {
  const location = useLocation()
  const hideNav = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div style={{ minHeight: '100vh', background: '#fff', overflowY: 'auto', overflowX: 'hidden' }}>
      <Outlet />
      {!hideNav && <PublicFooter />}
    </div>
  )
}

export default PublicLayout
