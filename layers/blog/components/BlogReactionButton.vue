<script setup lang="ts">
/**
 * Reaction button for blog posts.
 * Works without authentication using anonymous visitor IDs.
 */
const props = defineProps<{
  slug: string
}>()

const { likeCount, hasLiked, loading, init, toggleLike } = useReactions(props.slug)

onMounted(() => init())

const animating = ref(false)

const handleLike = async () => {
  animating.value = true
  await toggleLike()
  setTimeout(() => { animating.value = false }, 300)
}
</script>

<template>
  <ClientOnly>
    <button 
      @click="handleLike"
      class="blog-reaction"
      :class="{ 'is-liked': hasLiked }"
      :disabled="loading"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" 
           :fill="hasLiked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"
           :class="{ 'scale-125': animating }">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
      <span>{{ loading ? '...' : likeCount }}</span>
    </button>
    <template #fallback><span>...</span></template>
  </ClientOnly>
</template>
