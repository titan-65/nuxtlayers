<script setup lang="ts">
/**
 * Call-to-action section component.
 */
defineProps<{
  title: string
  description?: string
  ctaText: string
  ctaLink?: string
}>()
</script>

<template>
  <section class="cta">
    <div class="cta-content">
      <h2 class="cta-title">{{ title }}</h2>
      <p v-if="description" class="cta-desc">{{ description }}</p>
      <NuxtLink :to="ctaLink || '#'" class="cta-button">
        {{ ctaText }}
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.cta {
  padding: 5rem 2rem;
  background: #000;
  color: white;
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-desc {
  color: rgba(255,255,255,0.7);
  margin-bottom: 2rem;
  font-size: 1.125rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2.5rem;
  background: white;
  color: #000;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255,255,255,0.2);
}
</style>
