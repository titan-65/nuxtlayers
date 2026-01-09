// @vantol/blog layer configuration
export default defineNuxtConfig({
    $meta: {
        name: '@vantol/blog',
        version: '1.0.0'
    },

    // Ensure composables are auto-imported
    imports: {
        dirs: ['composables']
    },

    // Default blog configuration (can be overridden by consuming app)
    runtimeConfig: {
        public: {
            blog: {
                title: 'Blog',
                description: 'Latest posts and updates',
                basePath: '/blog',
                postsPerPage: 10,
                authorName: 'Author',
                authorAvatar: '',
                theme: 'dark' // 'light' | 'dark'
            }
        }
    }
})
