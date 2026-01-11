// @vantol/email
// Transactional email templates with Resend and Sendgrid integration

export default defineNuxtConfig({
    $meta: {
        name: '@vantol/email',
        version: '1.0.0'
    },

    runtimeConfig: {
        // Email provider config (server only)
        email: {
            provider: 'resend', // 'resend' | 'sendgrid'
            resendApiKey: '',
            sendgridApiKey: '',
            fromEmail: 'noreply@example.com',
            fromName: 'My App'
        }
    }
})
