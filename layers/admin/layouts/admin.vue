<script setup lang="ts">
/**
 * Admin layout with sidebar.
 */
</script>

<template>
  <div class="admin-layout">
    <AdminSidebar />
    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f9fafb;
}

.admin-main {
  flex: 1;
  margin-left: 240px;
  padding: 2rem;
}
</style>
