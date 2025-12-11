'use client'

import AppLogo from '@/components/AppLogo'
import { currentYear } from '@/helpers'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button, Card, Col, Container, Form, FormControl, FormLabel, Row, Alert, Spinner } from 'react-bootstrap'

const Page = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('Email hoặc mật khẩu không đúng')
            } else {
                router.push(callbackUrl)
                router.refresh()
            }
        } catch (error) {
            setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-box overflow-hidden align-items-center d-flex" style={{ minHeight: '100vh' }}>
            <Container>
                <Row className="justify-content-center">
                    <Col xxl={4} md={6} sm={8}>

                        <Card className="p-4">
                            <div className="position-absolute top-0 end-0" style={{ width: 180 }}>
                                <svg style={{ opacity: '0.075', width: '100%', height: 'auto' }} width={600} height={560} viewBox="0 0 600 560" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_948_1464)"><mask id="mask0_948_1464" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x={0} y={0} width={600} height={1200}><path d="M0 0L0 1200H600L600 0H0Z" fill="white" /></mask><g mask="url(#mask0_948_1464)"><path d="M537.448 166.697L569.994 170.892L550.644 189.578L537.448 166.697Z" fill="#FF4C3E" /></g><mask id="mask1_948_1464" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x={0} y={0} width={600} height={1200}><path d="M0 0L0 1200H600L600 0H0Z" fill="white" /></mask><g mask="url(#mask1_948_1464)"><path d="M364.093 327.517L332.306 359.304C321.885 369.725 304.989 369.725 294.568 359.304L262.781 327.517C252.36 317.096 252.36 300.2 262.781 289.779L294.568 257.992C304.989 247.571 321.885 247.571 332.306 257.992L364.093 289.779C374.514 300.2 374.514 317.096 364.093 327.517Z" stroke="#089df1" strokeWidth={2} strokeMiterlimit={10} /><path d="M377.923 101.019L315.106 163.836C299.517 179.425 274.242 179.425 258.653 163.836L195.836 101.019C180.247 85.4301 180.247 60.1551 195.836 44.5661L258.653 -18.251C274.242 -33.84 299.517 -33.84 315.106 -18.251L377.923 44.5661C393.512 60.1551 393.512 85.4301 377.923 101.019Z" stroke="#089df1" strokeWidth={2} strokeMiterlimit={10} /><path d="M403.998 311.555L372.211 343.342C361.79 353.763 344.894 353.763 334.473 343.342L302.686 311.555C292.265 301.134 292.265 284.238 302.686 273.817L334.473 242.03C344.894 231.609 361.79 231.609 372.211 242.03L403.998 273.817C414.419 284.238 414.419 301.134 403.998 311.555Z" fill="#089df1" /><path d="M417.828 85.0572L355.011 147.874C339.422 163.463 314.147 163.463 298.558 147.874L235.741 85.0572C220.152 69.4682 220.152 44.1931 235.741 28.6051L298.558 -34.2119C314.147 -49.8009 339.422 -49.8009 355.011 -34.2119L417.828 28.6051C433.417 44.1931 433.417 69.4682 417.828 85.0572Z" fill="#7b70ef" /><path d="M714.621 64.24L541.575 237.286C525.986 252.875 500.711 252.875 485.122 237.286L312.076 64.24C296.487 48.651 296.487 23.376 312.076 7.787L485.122 -165.259C500.711 -180.848 525.986 -180.848 541.575 -165.259L714.621 7.787C730.21 23.377 730.21 48.651 714.621 64.24Z" fill="#f9bf59" /><path d="M619.299 318.084L563.736 373.647C548.147 389.236 522.872 389.236 507.283 373.647L451.72 318.084C436.131 302.495 436.131 277.22 451.72 261.631L507.283 206.068C522.872 190.479 548.147 190.479 563.736 206.068L619.299 261.631C634.888 277.221 634.888 302.495 619.299 318.084Z" fill="#089df1" /><path d="M225.523 71.276L198.553 98.2459C186.21 110.589 166.198 110.589 153.854 98.2459L126.884 71.276C114.541 58.933 114.541 38.921 126.884 26.578L153.854 -0.392014C166.197 -12.735 186.209 -12.735 198.553 -0.392014L225.523 26.578C237.866 38.92 237.866 58.932 225.523 71.276Z" fill="#f7577e" /><path d="M289.224 7.80493L268.764 28.2649C261.722 35.3069 250.305 35.3069 243.263 28.2649L222.803 7.80493C215.761 0.762926 215.761 -10.6542 222.803 -17.6962L243.263 -38.1561C250.305 -45.1981 261.722 -45.1981 268.764 -38.1561L289.224 -17.6962C296.266 -10.6542 296.266 0.762926 289.224 7.80493Z" fill="#f7577e" /><path d="M415.205 201.866L394.745 222.326C387.703 229.368 376.286 229.368 369.244 222.326L348.784 201.866C341.742 194.824 341.742 183.407 348.784 176.365L369.244 155.905C376.286 148.863 387.703 148.863 394.745 155.905L415.205 176.365C422.247 183.407 422.247 194.824 415.205 201.866Z" fill="#f7577e" /><path d="M302.231 213.405L295.607 220.029C292.186 223.45 286.639 223.45 283.218 220.029L276.594 213.405C273.173 209.984 273.173 204.437 276.594 201.016L283.218 194.392C286.639 190.971 292.186 190.971 295.607 194.392L302.231 201.016C305.652 204.437 305.652 209.984 302.231 213.405Z" fill="#f7577e" /></g></g><defs><clipPath id="clip0_948_1464"><rect width={560} height={600} fill="white" transform="matrix(0 -1 1 0 0 560)" /></clipPath></defs></svg>
                            </div>

                            <div className="auth-brand text-center mb-4">
                                <AppLogo />
                                <p className="text-muted w-lg-75 mt-3 mx-auto">Let's get you signed in. Enter your email and password to continue.</p>
                            </div>

                            {error && (
                                <Alert variant="danger" className="mb-3">
                                    {error}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <div className="mb-3 form-group">
                                    <FormLabel>
                                        Email <span className="text-danger">*</span>
                                    </FormLabel>
                                    <FormControl
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-3 form-group">
                                    <FormLabel>
                                        Mật khẩu <span className="text-danger">*</span>
                                    </FormLabel>
                                    <FormControl
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="form-check">
                                        <input className="form-check-input form-check-input-light fs-14" type="checkbox" id="rememberMe" />
                                        <label className="form-check-label" htmlFor="rememberMe">
                                            Ghi nhớ đăng nhập
                                        </label>
                                    </div>
                                    <Link href="/auth-1/reset-password" className="text-decoration-underline link-offset-3 text-muted">
                                        Quên mật khẩu?
                                    </Link>
                                </div>

                                <div className="d-grid">
                                    <Button type="submit" className="btn-primary fw-semibold py-2" disabled={loading}>
                                        {loading ? <><Spinner size="sm" className="me-2" />Đang đăng nhập...</> : 'Đăng nhập'}
                                    </Button>
                                </div>
                            </Form>

                            <p className="text-muted text-center mt-4 mb-0">
                                New here?{' '}
                                <Link href="/auth-1/sign-up" className="text-decoration-underline link-offset-3 fw-semibold">
                                    Create an account
                                </Link>
                            </p>
                        </Card>

                        <p className="text-center text-muted mt-4 mb-0">
                            © {currentYear} Intraspace
                        </p>

                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Page
