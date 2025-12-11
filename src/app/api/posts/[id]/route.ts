import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/posts/[id] - Lấy chi tiết post
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
                likes: {
                    select: {
                        userId: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        })

        if (!post) {
            return NextResponse.json({ error: 'Bài viết không tồn tại' }, { status: 404 })
        }

        return NextResponse.json({ post })
    } catch (error) {
        console.error('Error fetching post:', error)
        return NextResponse.json({ error: 'Lỗi khi tải bài viết' }, { status: 500 })
    }
}

// PUT /api/posts/[id] - Cập nhật post
export async function PUT(
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

        const existingPost = await prisma.post.findUnique({
            where: { id },
        })

        if (!existingPost) {
            return NextResponse.json({ error: 'Bài viết không tồn tại' }, { status: 404 })
        }

        if (existingPost.authorId !== user.id) {
            return NextResponse.json({ error: 'Không có quyền sửa bài viết này' }, { status: 403 })
        }

        const body = await request.json()
        const { content, media } = body

        const post = await prisma.post.update({
            where: { id },
            data: {
                content: content?.trim() || existingPost.content,
                media: media || existingPost.media,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        })

        return NextResponse.json({ post })
    } catch (error) {
        console.error('Error updating post:', error)
        return NextResponse.json({ error: 'Lỗi khi cập nhật bài viết' }, { status: 500 })
    }
}

// DELETE /api/posts/[id] - Xóa post
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

        const existingPost = await prisma.post.findUnique({
            where: { id },
        })

        if (!existingPost) {
            return NextResponse.json({ error: 'Bài viết không tồn tại' }, { status: 404 })
        }

        // Cho phép xóa nếu là tác giả hoặc admin
        if (existingPost.authorId !== user.id && user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Không có quyền xóa bài viết này' }, { status: 403 })
        }

        await prisma.post.delete({
            where: { id },
        })

        return NextResponse.json({ message: 'Đã xóa bài viết' })
    } catch (error) {
        console.error('Error deleting post:', error)
        return NextResponse.json({ error: 'Lỗi khi xóa bài viết' }, { status: 500 })
    }
}
