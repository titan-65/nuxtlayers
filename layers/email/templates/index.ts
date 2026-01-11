/**
 * Email templates with consistent branding
 */

const baseStyles = `
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f4f4f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #f97316, #ea580c); padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .content { padding: 32px; color: #18181b; }
    .content p { line-height: 1.6; margin: 16px 0; }
    .button { display: inline-block; padding: 12px 24px; background: #f97316; color: white !important; text-decoration: none; border-radius: 6px; font-weight: 600; }
    .footer { padding: 24px 32px; background: #f4f4f5; text-align: center; color: #71717a; font-size: 12px; }
`

export const templates = {
    welcome: (data: { name: string; appName?: string }) => ({
        subject: `Welcome to ${data.appName || 'Our App'}! 🎉`,
        html: `
            <!DOCTYPE html>
            <html>
            <head><style>${baseStyles}</style></head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome, ${data.name}!</h1>
                    </div>
                    <div class="content">
                        <p>We're thrilled to have you on board. You're now part of an amazing community!</p>
                        <p>Here's what you can do next:</p>
                        <ul>
                            <li>Complete your profile</li>
                            <li>Explore our features</li>
                            <li>Connect with other users</li>
                        </ul>
                        <p style="text-align: center; margin-top: 32px;">
                            <a href="#" class="button">Get Started</a>
                        </p>
                    </div>
                    <div class="footer">
                        <p>You're receiving this because you signed up for ${data.appName || 'our app'}.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `Welcome, ${data.name}! We're thrilled to have you on board.`
    }),

    'password-reset': (data: { resetUrl: string; name?: string }) => ({
        subject: 'Reset Your Password',
        html: `
            <!DOCTYPE html>
            <html>
            <head><style>${baseStyles}</style></head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset</h1>
                    </div>
                    <div class="content">
                        <p>Hi${data.name ? ` ${data.name}` : ''},</p>
                        <p>We received a request to reset your password. Click the button below to choose a new one:</p>
                        <p style="text-align: center; margin: 32px 0;">
                            <a href="${data.resetUrl}" class="button">Reset Password</a>
                        </p>
                        <p style="color: #71717a; font-size: 14px;">
                            This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
                        </p>
                    </div>
                    <div class="footer">
                        <p>If you didn't request a password reset, please ignore this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `Reset your password by visiting: ${data.resetUrl}`
    }),

    invoice: (data: { invoiceNumber: string; amount: string; dueDate: string; items?: any[] }) => ({
        subject: `Invoice #${data.invoiceNumber}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head><style>${baseStyles}</style></head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Invoice #${data.invoiceNumber}</h1>
                    </div>
                    <div class="content">
                        <p>Here's your invoice for recent services.</p>
                        <div style="background: #f4f4f5; padding: 24px; border-radius: 8px; margin: 24px 0;">
                            <p style="margin: 0; font-size: 14px; color: #71717a;">Amount Due</p>
                            <p style="margin: 8px 0 0; font-size: 32px; font-weight: bold;">${data.amount}</p>
                            <p style="margin: 8px 0 0; font-size: 14px; color: #71717a;">Due by ${data.dueDate}</p>
                        </div>
                        <p style="text-align: center;">
                            <a href="#" class="button">View Invoice</a>
                        </p>
                    </div>
                    <div class="footer">
                        <p>Thank you for your business!</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `Invoice #${data.invoiceNumber} - Amount: ${data.amount}, Due: ${data.dueDate}`
    }),

    notification: (data: { title: string; message: string; actionUrl?: string; actionText?: string }) => ({
        subject: data.title,
        html: `
            <!DOCTYPE html>
            <html>
            <head><style>${baseStyles}</style></head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>${data.title}</h1>
                    </div>
                    <div class="content">
                        <p>${data.message}</p>
                        ${data.actionUrl ? `
                            <p style="text-align: center; margin-top: 32px;">
                                <a href="${data.actionUrl}" class="button">${data.actionText || 'View Details'}</a>
                            </p>
                        ` : ''}
                    </div>
                    <div class="footer">
                        <p>This is an automated notification.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
        text: `${data.title}: ${data.message}`
    })
}

export function getTemplate(name: string, data: Record<string, any>) {
    const templateFn = templates[name as keyof typeof templates]
    if (!templateFn) {
        throw new Error(`Template "${name}" not found`)
    }
    return templateFn(data as any)
}
