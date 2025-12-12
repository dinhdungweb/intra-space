import nodemailer from 'nodemailer'

// SMTP Configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
})

interface SendEmailOptions {
    to: string
    subject: string
    html: string
    text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<boolean> {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || `"Intraspace" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text: text || '',
            html,
        })

        console.log('Email sent:', info.messageId)
        return true
    } catch (error) {
        console.error('Error sending email:', error)
        return false
    }
}

// Email Templates
export function getPasswordResetEmailTemplate(resetLink: string, userName?: string): { subject: string; html: string; text: string } {
    const subject = 'Đặt lại mật khẩu - Intraspace'

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt lại mật khẩu</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #6658dd 0%, #4a81d4 100%); border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Intraspace</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; color: #333333; font-size: 22px; font-weight: 600;">
                                Xin chào${userName ? ` ${userName}` : ''},
                            </h2>
                            <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                                Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nhấn vào nút bên dưới để tiếp tục:
                            </p>
                            
                            <!-- Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="${resetLink}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6658dd 0%, #4a81d4 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                                            Đặt lại mật khẩu
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 20px 0 0; color: #999999; font-size: 14px; line-height: 1.6;">
                                Link này sẽ hết hạn sau <strong>1 giờ</strong>.
                            </p>
                            <p style="margin: 10px 0 0; color: #999999; font-size: 14px; line-height: 1.6;">
                                Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                            </p>
                            
                            <!-- Fallback Link -->
                            <p style="margin: 30px 0 0; color: #999999; font-size: 12px; line-height: 1.6; word-break: break-all;">
                                Nếu nút không hoạt động, sao chép đường link sau vào trình duyệt:<br>
                                <a href="${resetLink}" style="color: #6658dd;">${resetLink}</a>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0; color: #999999; font-size: 12px; text-align: center;">
                                © ${new Date().getFullYear()} Intraspace. Tất cả quyền được bảo lưu.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim()

    const text = `
Xin chào${userName ? ` ${userName}` : ''},

Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.

Truy cập link sau để đặt lại mật khẩu:
${resetLink}

Link này sẽ hết hạn sau 1 giờ.

Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.

---
© ${new Date().getFullYear()} Intraspace
    `.trim()

    return { subject, html, text }
}
