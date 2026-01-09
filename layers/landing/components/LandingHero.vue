<script setup lang="ts">
/**
 * Hero section component.
 */
defineProps<{
  title: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  secondaryText?: string
  secondaryLink?: string
}>()
</script>

<template>
  <section class="hero">
    <div class="hero-content">
      <h1 class="hero-title">{{ title }}</h1>
      <p v-if="subtitle" class="hero-subtitle">{{ subtitle }}</p>
      <div class="hero-actions">
        <NuxtLink v-if="ctaText" :to="ctaLink || '#'" class="hero-btn primary">
          {{ ctaText }}
        </NuxtLink>
        <NuxtLink v-if="secondaryText" :to="secondaryLink || '#'" class="hero-btn secondary">
          {{ secondaryText }}
        </NuxtLink>
      </div>
    </div>
    <slot name="image" />
  </section>
</template>

<style scoped>
.hero {
  padding: 6rem 2rem;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #000 0%, #333 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-btn {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}

.hero-btn.primary {
  background: #000;
  color: white;
}

.hero-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.hero-btn.secondary {
  background: transparent;
  color: #000;
  border: 1px solid #e5e7eb;
}

.hero-btn.secondary:hover {
  background: #f9fafb;
}
</style>
