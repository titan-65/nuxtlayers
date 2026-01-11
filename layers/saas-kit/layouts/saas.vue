<script setup lang="ts">
/**
 * SaaS Layout - Uses the SaasShell component
 */

const { user, init } = useFirebaseAuth()
const teamStore = useSaasTeam()

// Initialize auth and fetch teams
onMounted(async () => {
  await init()
  if (user.value) {
    await teamStore.fetchTeams()
  }
})
</script>

<template>
  <SaasShell>
    <template #sidebar>
      <SaasSidebar />
    </template>
    <template #header>
      <SaasHeader />
    </template>
    <slot />
  </SaasShell>
</template>
