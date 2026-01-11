/**
 * Send email API
 * POST /api/email/send
 * 
 * Supports Resend and Sendgrid providers
 */
import { getTemplate } from '../../../templates'

interface SendRequest {
    to: string | string[]
    subject?: string
    template?: string
    data?: Record<string, any>
    html?: string
    text?: string
}

export default defineEventHandler(async (event) => {
    const body = await readBody<SendRequest>(event)
    const config = useRuntimeConfig()
    const emailConfig = config.email

    if (!body.to) {
        throw createError({ statusCode: 400, message: 'Recipient (to) is required' })
    }

    // Get email content from template or direct html/text
    let subject = body.subject
    let html = body.html
    let text = body.text

    if (body.template) {
        try {
            const templateContent = getTemplate(body.template, body.data || {})
            subject = subject || templateContent.subject
            html = templateContent.html
            text = templateContent.text
        } catch (e: any) {
            throw createError({ statusCode: 400, message: e.message })
        }
    }

    if (!subject || (!html && !text)) {
        throw createError({ statusCode: 400, message: 'Subject and content (html or text) are required' })
    }

    const recipients = Array.isArray(body.to) ? body.to : [body.to]

    try {
        let messageId: string | undefined

        if (emailConfig.provider === 'resend') {
            messageId = await sendWithResend({
                apiKey: emailConfig.resendApiKey,
                from: `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
                to: recipients,
                subject,
                html,
                text
            })
        } else if (emailConfig.provider === 'sendgrid') {
            messageId = await sendWithSendgrid({
                apiKey: emailConfig.sendgridApiKey,
                from: { name: emailConfig.fromName, email: emailConfig.fromEmail },
                to: recipients,
                subject,
                html,
                text
            })
        } else {
            throw createError({ statusCode: 500, message: 'Invalid email provider configured' })
        }

        return {
            success: true,
            messageId
        }

    } catch (error: any) {
        console.error('Email send error:', error)
        throw createError({ statusCode: 500, message: 'Failed to send email' })
    }
})

// Resend provider
async function sendWithResend(options: {
    apiKey: string
    from: string
    to: string[]
    subject: string
    html?: string
    text?: string
}) {
    const response = await $fetch<{ id: string }>('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${options.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: {
            from: options.from,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text
        }
    })
    return response.id
}

// Sendgrid provider
async function sendWithSendgrid(options: {
    apiKey: string
    from: { name: string; email: string }
    to: string[]
    subject: string
    html?: string
    text?: string
}) {
    const personalizations = options.to.map(email => ({
        to: [{ email }]
    }))

    const content: any[] = []
    if (options.text) content.push({ type: 'text/plain', value: options.text })
    if (options.html) content.push({ type: 'text/html', value: options.html })

    await $fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${options.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: {
            personalizations,
            from: options.from,
            subject: options.subject,
            content
        }
    })

    return `sg-${Date.now()}`
}
