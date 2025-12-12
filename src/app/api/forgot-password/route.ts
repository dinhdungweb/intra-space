'use server'

import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import prisma from '@/lib/prisma'
import { sendEmail, getPasswordResetEmailTemplate } from '@/lib/email'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = body

        // Validate input
        if (!email) {
            return NextResponse.json(
                { error: 'Vui lòng nhập email' },
                { status: 400 }
            )
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        })

        if (!user) {
            // Return success even if user doesn't exist (security best practice)
            return NextResponse.json({
                message: 'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.'
            })
        }

        // Delete any existing tokens for this email
        await prisma.passwordResetToken.deleteMany({
            where: { email: email.toLowerCase() }
        })

        // Create new token with 1 hour expiration
        const token = randomUUID()
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

        await prisma.passwordResetToken.create({
            data: {
                token,
                email: email.toLowerCase(),
                expiresAt,
            }
        })

        // Generate reset link
        const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`

        // Send email
        const emailTemplate = getPasswordResetEmailTemplate(resetLink, user.name)
        const emailSent = await sendEmail({
            to: user.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text,
        })

        if (!emailSent) {
            console.error('Failed to send password reset email to:', user.email)
            // Still return success for security reasons (don't reveal if email exists)
        }

        // Log for debugging (can be removed in production)
        console.log('Password reset requested for:', user.email)
        console.log('Reset link:', resetLink)

        return NextResponse.json({
            message: 'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.'
        })

    } catch (error) {
        console.error('Forgot password error:', error)
        return NextResponse.json(
            { error: 'Đã có lỗi xảy ra. Vui lòng thử lại.' },
            { status: 500 }
        )
    }
}
