import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// POST /api/posts/[id]/like - Toggle like
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const { id: postId } = await params
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'Người dùng không tồn tại' }, { status: 404 })
        }

        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: postId },
        })

        if (!post) {
            return NextResponse.json({ error: 'Bài viết không tồn tại' }, { status: 404 })
        }

        // Check if already liked
        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId: user.id,
                },
            },
        })

        if (existingLike) {
            // Unlike
            await prisma.like.delete({
                where: { id: existingLike.id },
            })

            const likesCount = await prisma.like.count({
                where: { postId },
            })

            return NextResponse.json({ liked: false, likesCount })
        } else {
            // Like
            await prisma.like.create({
                data: {
                    postId,
                    userId: user.id,
                },
            })

            const likesCount = await prisma.like.count({
                where: { postId },
            })

            return NextResponse.json({ liked: true, likesCount })
        }
    } catch (error) {
        console.error('Error toggling like:', error)
        return NextResponse.json({ error: 'Lỗi khi thao tác' }, { status: 500 })
    }
}
