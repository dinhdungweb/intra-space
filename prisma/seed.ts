import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)

    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@intraspace.com' },
        update: {},
        create: {
            email: 'admin@intraspace.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
            bio: 'System Administrator',
        },
    })

    console.log('✅ Created admin user:', adminUser.email)

    // Create organization settings
    const orgSettings = await prisma.organizationSettings.upsert({
        where: { id: '1' },
        update: {},
        create: {
            id: '1',
            companyName: 'Intraspace',
            companyEmail: 'contact@intraspace.com',
            companyPhone: '+84 123 456 789',
            companyAddress: 'Ha Noi, Vietnam',
            timezone: 'Asia/Ho_Chi_Minh',
            language: 'vi',
        },
    })

    console.log('✅ Created organization settings:', orgSettings.companyName)

    // Create sample departments
    const itDept = await prisma.department.upsert({
        where: { id: '1' },
        update: {},
        create: {
            id: '1',
            name: 'IT Department',
            description: 'Information Technology',
        },
    })

    const hrDept = await prisma.department.upsert({
        where: { id: '2' },
        update: {},
        create: {
            id: '2',
            name: 'HR Department',
            description: 'Human Resources',
        },
    })

    console.log('✅ Created departments')

    // Create sample users
    const user1Password = await bcrypt.hash('user123', 10)

    const sampleUser = await prisma.user.upsert({
        where: { email: 'user@intraspace.com' },
        update: {},
        create: {
            email: 'user@intraspace.com',
            name: 'Nguyen Van A',
            password: user1Password,
            role: 'USER',
            departmentId: itDept.id,
            bio: 'Software Developer',
        },
    })

    console.log('✅ Created sample users')

    console.log('🎉 Database seed completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
