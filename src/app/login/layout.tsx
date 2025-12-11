import { beVietnamPro, ibmPlexSans, inter, nunito, poppins, publicSans, roboto } from '@/helpers/fonts'
import '@/assets/scss/app.scss'

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={`${beVietnamPro.variable} ${nunito.variable} ${publicSans.variable} ${poppins.variable} ${roboto.variable} ${inter.variable} ${ibmPlexSans.variable}`}>
            {children}
        </div>
    )
}
