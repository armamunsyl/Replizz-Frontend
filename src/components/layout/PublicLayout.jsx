import { Outlet, useLocation } from 'react-router-dom'
import HomeNavbar from '../home/HomeNavbar'
import { homeNavItems } from '../../data/homeData'
import PublicFooter from './PublicFooter'

function PublicLayout() {
  const location = useLocation()
  const hideFooter = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div className="block h-full bg-[#060910] overflow-x-hidden overflow-y-auto">
      <HomeNavbar items={homeNavItems} />
      <main key={location.pathname} className="anim-reveal anim-delay-1">
        <Outlet />
      </main>
      {hideFooter ? null : <PublicFooter />}
    </div>
  )
}

export default PublicLayout
