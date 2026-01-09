<script setup lang="ts">
/**
 * Blog post card component.
 * Customizable via slots and props.
 */
defineProps<{
  post: {
    slug: string
    title: string
    excerpt?: string
    date?: string
    author?: string
    authorAvatar?: string
    tags?: string[]
    readTime?: string
    image?: string
  }
  basePath?: string
}>()

const { theme } = useBlogConfig()
</script>

<template>
  <NuxtLink 
    :to="`${basePath || '/blog'}/${post.slug}`" 
    class="blog-post-card group"
    :class="theme === 'dark' ? 'dark-theme' : 'light-theme'"
  >
    <!-- Image slot -->
    <slot name="image">
      <div v-if="post.image" class="blog-post-card-image">
        <img :src="post.image" :alt="post.title" />
      </div>
    </slot>

    <div class="blog-post-card-content">
      <!-- Tags -->
      <div v-if="post.tags?.length" class="blog-post-card-tags">
        <span v-for="tag in post.tags" :key="tag" class="blog-post-card-tag">
          {{ tag }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="blog-post-card-title">
        <slot name="title">{{ post.title }}</slot>
      </h3>

      <!-- Excerpt -->
      <p v-if="post.excerpt" class="blog-post-card-excerpt">
        <slot name="excerpt">{{ post.excerpt }}</slot>
      </p>

      <!-- Meta -->
      <div class="blog-post-card-meta">
        <slot name="author">
          <div v-if="post.author" class="blog-post-card-author">
            <img 
              v-if="post.authorAvatar" 
              :src="post.authorAvatar" 
              :alt="post.author"
              class="blog-post-card-avatar"
            />
            <span>{{ post.author }}</span>
          </div>
        </slot>
        <span v-if="post.date" class="blog-post-card-date">{{ post.date }}</span>
        <span v-if="post.readTime" class="blog-post-card-read-time">{{ post.readTime }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.blog-post-card {
  display: block;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.25rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.blog-post-card:hover {
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.blog-post-card.dark-theme {
  background: #111111;
  color: #fff;
}

.blog-post-card.light-theme {
  background: #fff;
  color: #0A0A0A;
  border-color: rgba(0, 0, 0, 0.1);
}

.blog-post-card.light-theme:hover {
  border-color: rgba(0, 0, 0, 0.3);
}

.blog-post-card-image {
  aspect-ratio: 16/9;
  overflow: hidden;
}

.blog-post-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.blog-post-card:hover .blog-post-card-image img {
  transform: scale(1.05);
}

.blog-post-card-content {
  padding: 1.25rem;
}

.blog-post-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.blog-post-card-tag {
  font-size: 0.625rem;
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.25rem 0.5rem;
  background: rgba(249, 115, 22, 0.1);
  color: #F97316;
  border: 1px solid rgba(249, 115, 22, 0.3);
}

.light-theme .blog-post-card-tag {
  background: rgba(0, 0, 0, 0.05);
  color: #374151;
  border-color: rgba(0, 0, 0, 0.1);
}

.blog-post-card-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
}

.blog-post-card:hover .blog-post-card-title {
  color: #F97316;
}

.blog-post-card-excerpt {
  font-size: 0.875rem;
  color: #9CA3AF;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.light-theme .blog-post-card-excerpt {
  color: #6B7280;
}

.blog-post-card-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.625rem;
  font-family: monospace;
  color: #6B7280;
  text-transform: uppercase;
}

.blog-post-card-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.blog-post-card-avatar {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
}
</style>
