import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/posts - Lấy danh sách posts
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        const posts = await prisma.post.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
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
                    where: { parentId: null },
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

        const total = await prisma.post.count()

        return NextResponse.json({
            posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    } catch (error) {
        console.error('Error fetching posts:', error)
        return NextResponse.json({ error: 'Lỗi khi tải bài viết' }, { status: 500 })
    }
}

// POST /api/posts - Tạo post mới
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'Người dùng không tồn tại' }, { status: 404 })
        }

        const body = await request.json()
        const { content, media } = body

        if (!content || content.trim() === '') {
            return NextResponse.json({ error: 'Nội dung không được để trống' }, { status: 400 })
        }

        const post = await prisma.post.create({
            data: {
                content: content.trim(),
                media: media || [],
                authorId: user.id,
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
                _count: {
                    select: {
                        comments: true,
                        likes: true,
                    },
                },
            },
        })

        return NextResponse.json({ post }, { status: 201 })
    } catch (error) {
        console.error('Error creating post:', error)
        return NextResponse.json({ error: 'Lỗi khi tạo bài viết' }, { status: 500 })
    }
}
