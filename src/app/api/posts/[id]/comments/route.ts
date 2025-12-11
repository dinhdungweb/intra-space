import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/posts/[id]/comments - Lấy comments của post
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: postId } = await params

        // Get only top-level comments (no parentId)
        const comments = await prisma.comment.findMany({
            where: {
                postId,
                parentId: null
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                replies: {
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
            },
            orderBy: { createdAt: 'asc' },
        })

        return NextResponse.json({ comments })
    } catch (error) {
        console.error('Error fetching comments:', error)
        return NextResponse.json({ error: 'Lỗi khi tải bình luận' }, { status: 500 })
    }
}

// POST /api/posts/[id]/comments - Thêm comment
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

        const body = await request.json()
        const { content, parentId } = body

        if (!content || content.trim() === '') {
            return NextResponse.json({ error: 'Nội dung bình luận không được để trống' }, { status: 400 })
        }

        // If parentId provided, verify it exists
        if (parentId) {
            const parentComment = await prisma.comment.findUnique({
                where: { id: parentId },
            })
            if (!parentComment) {
                return NextResponse.json({ error: 'Comment gốc không tồn tại' }, { status: 404 })
            }
        }

        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                postId,
                authorId: user.id,
                parentId: parentId || null,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        })

        return NextResponse.json({ comment }, { status: 201 })
    } catch (error) {
        console.error('Error creating comment:', error)
        return NextResponse.json({ error: 'Lỗi khi tạo bình luận' }, { status: 500 })
    }
}

