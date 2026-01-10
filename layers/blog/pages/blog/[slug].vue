<script setup lang="ts">
/**
 * Blog post detail page.
 * Fetches post from configured data source.
 */
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { title: blogTitle, theme, basePath, authorName, authorAvatar } = useBlogConfig()
const { post, loading, error, refresh } = useBlogPost(slug)

useHead({
  title: () => post.value ? `${post.value.title} | ${blogTitle.value}` : blogTitle.value
})
</script>

<template>
  <div 
    class="blog-post-page"
    :class="theme === 'dark' ? 'dark-theme' : 'light-theme'"
  >
    <!-- Back link -->
    <NuxtLink :to="basePath" class="blog-back-link">
      ← Back to {{ blogTitle }}
    </NuxtLink>

    <!-- Loading -->
    <div v-if="loading" class="blog-loading">
      <div class="blog-spinner"></div>
    </div>

    <article v-else-if="post" class="blog-article">
      <!-- Header -->
      <header class="blog-article-header">
        <slot name="header">
          <div v-if="post.tags?.length" class="blog-article-tags">
            <span v-for="tag in post.tags" :key="tag" class="blog-article-tag">
              {{ tag }}
            </span>
          </div>

          <h1 class="blog-article-title">{{ post.title }}</h1>
          
          <div class="blog-article-meta">
            <div class="blog-article-author">
              <img 
                v-if="post.author?.avatar" 
                :src="post.author.avatar" 
                :alt="post.author?.name"
                class="blog-article-avatar"
              />
              <span>{{ post.author?.name || authorName }}</span>
            </div>
            <span>{{ post.date }}</span>
            <span>{{ post.readTime }}</span>
          </div>
        </slot>
      </header>

      <!-- Content -->
      <div class="blog-article-content">
        <slot name="content">
          <div v-if="post.content" v-html="post.content.replace(/\n/g, '<br>')"></div>
        </slot>
      </div>

      <!-- Reactions slot -->
      <slot name="reactions">
        <!-- Add BlogReactionButton component here if needed -->
      </slot>

      <!-- Comments -->
      <section class="blog-comments-section">
        <slot name="comments">
          <BlogComments :slug="slug" />
        </slot>
      </section>
    </article>
  </div>
</template>

<style scoped>
.blog-post-page {
  min-height: 100vh;
  padding: 6rem 1.5rem 4rem;
}

.blog-post-page.dark-theme {
  background: #0A0A0A;
  color: #fff;
}

.blog-post-page.light-theme {
  background: #F3F3F3;
  color: #0A0A0A;
}

.blog-back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.625rem;
  font-family: monospace;
  text-transform: uppercase;
  color: #9CA3AF;
  max-width: 48rem;
  margin: 0 auto 2rem;
  display: block;
}

.blog-back-link:hover {
  color: #F97316;
}

.blog-article {
  max-width: 48rem;
  margin: 0 auto;
}

.blog-article-header {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.light-theme .blog-article-header {
  border-color: rgba(0, 0, 0, 0.1);
}

.blog-article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.blog-article-tag {
  font-size: 0.625rem;
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.25rem 0.5rem;
  background: rgba(249, 115, 22, 0.1);
  color: #F97316;
  border: 1px solid rgba(249, 115, 22, 0.3);
}

.blog-article-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.blog-article-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
  font-family: monospace;
  color: #9CA3AF;
  text-transform: uppercase;
}

.blog-article-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.blog-article-avatar {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
}

.blog-article-content {
  font-size: 1rem;
  line-height: 1.8;
  color: #D1D5DB;
  margin-bottom: 3rem;
}

.light-theme .blog-article-content {
  color: #374151;
}

.blog-article-content :deep(h1),
.blog-article-content :deep(h2),
.blog-article-content :deep(h3) {
  color: #fff;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.light-theme .blog-article-content :deep(h1),
.light-theme .blog-article-content :deep(h2),
.light-theme .blog-article-content :deep(h3) {
  color: #0A0A0A;
}

.blog-article-content :deep(code) {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.125rem 0.375rem;
  border-radius: 0.125rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875em;
}

.light-theme .blog-article-content :deep(code) {
  background: rgba(0, 0, 0, 0.05);
}

.blog-article-content :deep(pre) {
  background: #111111;
  padding: 1rem;
  border-radius: 0.25rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.blog-article-content :deep(pre code) {
  background: none;
  padding: 0;
}

.blog-comments-section {
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.light-theme .blog-comments-section {
  border-color: rgba(0, 0, 0, 0.1);
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

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
