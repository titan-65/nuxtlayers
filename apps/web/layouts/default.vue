<script setup lang="ts">
/**
 * Default global layout.
 * Includes the persistent navigation bar.
 */
</script>

<template>
  <div class="min-h-screen bg-[#0A0A0A] text-white selection:bg-orange-500 selection:text-black">
    <AppNavbar />
    <slot />
  </div>
</template>
