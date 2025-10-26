import useAuthListener from '@/hooks/use-auth'
import { AppFooter, AppHeader } from '../components/common'
import { Outlet } from 'react-router'

export default function RootLaout() {
  useAuthListener();
  
  return (
      <div className="page">
        <AppHeader />
        <div className="container">
            <Outlet />
        </div>
        <AppFooter />
      </div>
  )
}
