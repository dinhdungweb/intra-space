import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: "/login",
    },
})

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (auth API routes)
         * - api/register (registration API)
         * - api/forgot-password (forgot password API)
         * - api/reset-password (reset password API)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - login (login page)
         * - register (register page)
         * - forgot-password (forgot password page)
         * - reset-password (reset password page)
         * - landing (public landing page)
         * - assets (public assets)
         */
        '/((?!api/auth|api/register|api/forgot-password|api/reset-password|_next/static|_next/image|favicon.ico|login|register|forgot-password|reset-password|landing|assets).*)',
    ],
}

