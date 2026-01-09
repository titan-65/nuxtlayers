<script setup lang="ts">
/**
 * Features grid component.
 */
interface Feature {
  icon?: string
  title: string
  description: string
}

defineProps<{
  title?: string
  subtitle?: string
  features: Feature[]
}>()
</script>

<template>
  <section class="features">
    <div class="features-header" v-if="title">
      <h2 class="features-title">{{ title }}</h2>
      <p v-if="subtitle" class="features-subtitle">{{ subtitle }}</p>
    </div>
    <div class="features-grid">
      <div v-for="(feature, idx) in features" :key="idx" class="feature-card">
        <div v-if="feature.icon" class="feature-icon">
          <slot :name="`icon-${idx}`">{{ feature.icon }}</slot>
        </div>
        <h3 class="feature-title">{{ feature.title }}</h3>
        <p class="feature-desc">{{ feature.description }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.features-header {
  text-align: center;
  margin-bottom: 3rem;
}

.features-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.features-subtitle {
  color: #6b7280;
  font-size: 1.125rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  padding: 2rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s;
}

.feature-card:hover {
  border-color: #000;
  transform: translateY(-4px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: #f3f4f6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.feature-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.feature-desc {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.6;
}
</style>
