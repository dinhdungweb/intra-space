import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// DELETE /api/comments/[id] - Xóa comment
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const { id } = await params
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'Người dùng không tồn tại' }, { status: 404 })
        }

        const comment = await prisma.comment.findUnique({
            where: { id },
        })

        if (!comment) {
            return NextResponse.json({ error: 'Bình luận không tồn tại' }, { status: 404 })
        }

        // Cho phép xóa nếu là tác giả comment hoặc admin
        if (comment.authorId !== user.id && user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Không có quyền xóa bình luận này' }, { status: 403 })
        }

        await prisma.comment.delete({
            where: { id },
        })

        return NextResponse.json({ message: 'Đã xóa bình luận' })
    } catch (error) {
        console.error('Error deleting comment:', error)
        return NextResponse.json({ error: 'Lỗi khi xóa bình luận' }, { status: 500 })
    }
}
