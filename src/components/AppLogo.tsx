import Link from 'next/link'
import { LogoFull } from './IntraspaceLogo'

const AppLogo = ({ height }: { height?: number }) => {
  return (
    <>
      <Link href="/" className="logo-dark">
        <LogoFull mode="light" iconSize={32} textSize="24px" height={height} />
      </Link>
      <Link href="/" className="logo-light">
        <LogoFull mode="dark" iconSize={32} textSize="24px" height={height} />
      </Link>
    </>
  )
}

export default AppLogo

