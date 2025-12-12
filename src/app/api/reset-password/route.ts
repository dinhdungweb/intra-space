'use server'

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { token, password } = body

        // Validate input
        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token và mật khẩu là bắt buộc' },
                { status: 400 }
            )
        }

        // Check password length
        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
                { status: 400 }
            )
        }

        // Find token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        })

        if (!resetToken) {
            return NextResponse.json(
                { error: 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn' },
                { status: 400 }
            )
        }

        // Check if token is expired
        if (new Date() > resetToken.expiresAt) {
            // Delete expired token
            await prisma.passwordResetToken.delete({
                where: { id: resetToken.id }
            })
            return NextResponse.json(
                { error: 'Link đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu lại.' },
                { status: 400 }
            )
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: resetToken.email }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'Không tìm thấy tài khoản' },
                { status: 404 }
            )
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Update user password
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        })

        // Delete used token
        await prisma.passwordResetToken.delete({
            where: { id: resetToken.id }
        })

        return NextResponse.json({
            message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới.'
        })

    } catch (error) {
        console.error('Reset password error:', error)
        return NextResponse.json(
            { error: 'Đã có lỗi xảy ra. Vui lòng thử lại.' },
            { status: 500 }
        )
    }
}
