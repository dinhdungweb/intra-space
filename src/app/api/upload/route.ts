import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

// POST /api/upload - Upload files
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
        }

        const formData = await request.formData()
        const files = formData.getAll('files') as File[]

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'Không có file nào được chọn' }, { status: 400 })
        }

        // Create uploads directory if not exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
        }

        const uploadedUrls: string[] = []

        for (const file of files) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
            if (!allowedTypes.includes(file.type)) {
                continue
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                continue
            }

            // Generate unique filename
            const timestamp = Date.now()
            const randomString = Math.random().toString(36).substring(2, 15)
            const ext = path.extname(file.name)
            const filename = `${timestamp}-${randomString}${ext}`

            // Save file
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const filePath = path.join(uploadDir, filename)
            await writeFile(filePath, buffer)

            // Return public URL
            uploadedUrls.push(`/uploads/${filename}`)
        }

        return NextResponse.json({ urls: uploadedUrls })
    } catch (error) {
        console.error('Error uploading files:', error)
        return NextResponse.json({ error: 'Lỗi khi tải lên file' }, { status: 500 })
    }
}
