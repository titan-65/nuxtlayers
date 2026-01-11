/**
 * Email composable for sending transactional emails
 */
export interface EmailTemplate {
    subject: string
    html: string
    text?: string
}

export interface SendEmailOptions {
    to: string | string[]
    subject?: string
    template?: string
    data?: Record<string, any>
    html?: string
    text?: string
}

export function useEmail() {
    const apiBase = '/api/email'

    /**
     * Send a transactional email
     */
    const send = async (options: SendEmailOptions) => {
        const response = await $fetch<{ success: boolean; messageId?: string }>(`${apiBase}/send`, {
            method: 'POST',
            body: options
        })
        return response
    }

    /**
     * Send a welcome email
     */
    const sendWelcome = async (to: string, data: { name: string }) => {
        return send({
            to,
            template: 'welcome',
            data
        })
    }

    /**
     * Send a password reset email
     */
    const sendPasswordReset = async (to: string, data: { resetUrl: string; name?: string }) => {
        return send({
            to,
            template: 'password-reset',
            data
        })
    }

    /**
     * Send an invoice email
     */
    const sendInvoice = async (to: string, data: { invoiceNumber: string; amount: string; dueDate: string }) => {
        return send({
            to,
            template: 'invoice',
            data
        })
    }

    /**
     * Send a notification email
     */
    const sendNotification = async (to: string, data: { title: string; message: string; actionUrl?: string }) => {
        return send({
            to,
            template: 'notification',
            data
        })
    }

    return {
        send,
        sendWelcome,
        sendPasswordReset,
        sendInvoice,
        sendNotification
    }
}
