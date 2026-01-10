<script setup lang="ts">
/**
 * Blog listing page.
 * Fetches posts from configured data source (Firestore, Content, API, or static).
 */
const { title, description, theme, basePath, dataSource } = useBlogConfig()
const { posts, loading, error, refresh } = useBlogPosts()

useHead({
  title: () => title.value
})
</script>

<template>
  <div 
    class="blog-page"
    :class="theme === 'dark' ? 'dark-theme' : 'light-theme'"
  >
    <!-- Header slot -->
    <slot name="header">
      <div class="blog-header">
        <div class="blog-section-title">
          <span>{{ title }}</span>
        </div>
        <h1 class="blog-title">{{ title }}</h1>
        <p class="blog-description">{{ description }}</p>
      </div>
    </slot>

    <!-- Loading -->
    <div v-if="loading" class="blog-loading">
      <div class="blog-spinner"></div>
    </div>

    <!-- Posts grid -->
    <div v-else class="blog-posts-grid">
      <slot name="posts" :posts="posts" :basePath="basePath">
        <BlogPostCard 
          v-for="post in posts" 
          :key="post.slug" 
          :post="post" 
          :base-path="basePath"
        />
      </slot>
    </div>

    <!-- Empty state -->
    <slot v-if="!loading && posts.length === 0" name="empty">
      <div class="blog-empty">
        <p>No posts yet. Check back soon!</p>
      </div>
    </slot>
  </div>
</template>

<style scoped>
.blog-page {
  min-height: 100vh;
  padding: 6rem 1.5rem 4rem;
}

.blog-page.dark-theme {
  background: #0A0A0A;
  color: #fff;
}

.blog-page.light-theme {
  background: #F3F3F3;
  color: #0A0A0A;
}

.blog-header {
  max-width: 64rem;
  margin: 0 auto 3rem;
}

.blog-section-title {
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #737373;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.blog-section-title::before {
  content: '';
  width: 0.375rem;
  height: 0.375rem;
  background: #F97316;
  border-radius: 50%;
}

.blog-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.blog-description {
  font-size: 0.875rem;
  color: #9CA3AF;
}

.light-theme .blog-description {
  color: #6B7280;
}

.blog-posts-grid {
  max-width: 64rem;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.blog-loading {
  display: flex;
  justify-content: center;
  padding: 4rem;
}

.blog-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: #F97316;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.light-theme .blog-spinner {
  border-color: rgba(0, 0, 0, 0.1);
  border-top-color: #F97316;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.blog-empty {
  text-align: center;
  padding: 4rem;
  max-width: 64rem;
  margin: 0 auto;
}

.blog-empty p {
  font-size: 0.875rem;
  font-family: monospace;
  color: #9CA3AF;
}
</style>
