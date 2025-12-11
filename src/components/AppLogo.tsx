import Image from 'next/image'
import Link from 'next/link'

import logoDark from '@/assets/images/intraspace-logo.png'
import logo from '@/assets/images/intraspace-logo.png'

const AppLogo = ({ height }: { height?: number }) => {
  return (
    <>
      <Link href="/" className="logo-dark">
        <Image src={logoDark} alt="dark logo" height={height ?? 40} />
      </Link>
      <Link href="/" className="logo-light">
        <Image src={logo} alt="logo" height={height ?? 40} />
      </Link>
    </>
  )
}

export default AppLogo
