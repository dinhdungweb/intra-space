'use client'
import { LogoFull, LogoIcon } from '@/components/IntraspaceLogo'
import SimplebarClient from '@/components/client-wrapper/SimplebarClient'
import { useLayoutContext } from '@/context/useLayoutContext'
import AppMenu from '@/layouts/components/sidenav/components/AppMenu'
import UserProfile from '@/layouts/components/sidenav/components/UserProfile'
import Image from 'next/image'
import Link from 'next/link'
import { TbMenu4, TbX } from 'react-icons/tb'

const Sidenav = () => {
  const { hideBackdrop, updateSettings, sidenavSize, sidenavUser } = useLayoutContext()

  const toggleSidebar = () => {
    updateSettings({ sidenavSize: sidenavSize === 'on-hover-active' ? 'on-hover' : 'on-hover-active' })
  }

  const closeSidebar = () => {
    const html = document.documentElement
    html.classList.toggle('sidebar-enable')
    hideBackdrop()
  }

  return (
    <div className="sidenav-menu">
      <Link href="/" className="logo d-flex align-items-center justify-content-center" style={{ height: '70px' }}>
        <span className="logo logo-light">
          <span className="logo-lg">
            <LogoFull mode="dark" iconSize={24} height={70} />
          </span>
          <span className="logo-sm">
            <div className="d-flex align-items-center justify-content-center" style={{ height: '70px' }}>
              <LogoIcon size={24} className="text-white" />
            </div>
          </span>
        </span>

        <span className="logo logo-dark">
          <span className="logo-lg">
            <LogoFull mode="light" iconSize={24} height={70} />
          </span>
          <span className="logo-sm">
            <div className="d-flex align-items-center justify-content-center" style={{ height: '70px' }}>
              <LogoIcon size={24} className="text-primary" />
            </div>
          </span>
        </span>
      </Link>

      <button className="button-on-hover">
        <TbMenu4 onClick={toggleSidebar} className="fs-22 align-middle" />
      </button>

      <button className="button-close-offcanvas">
        <TbX onClick={closeSidebar} className="align-middle" />
      </button>

      <SimplebarClient id="sidenav" className="scrollbar">
        {sidenavUser && <UserProfile />}
        <AppMenu />
      </SimplebarClient>
    </div>
  )
}

export default Sidenav
