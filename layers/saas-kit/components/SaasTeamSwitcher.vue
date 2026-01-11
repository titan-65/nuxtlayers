<script setup lang="ts">
/**
 * SaaS Team Switcher - Dropdown to switch between teams/organizations
 */

const { user } = useFirebaseAuth()
const teamStore = useSaasTeam()
const { currentTeam, teams, loading } = storeToRefs(teamStore)

const dropdownOpen = ref(false)

const selectTeam = (team: any) => {
  teamStore.setCurrentTeam(team)
  dropdownOpen.value = false
}

// Close dropdown on outside click
const dropdownRef = ref<HTMLElement>()
onClickOutside(dropdownRef, () => {
  dropdownOpen.value = false
})
</script>

<template>
  <div ref="dropdownRef" class="team-switcher">
    <button 
      class="team-switcher-trigger"
      @click="dropdownOpen = !dropdownOpen"
    >
      <div class="team-switcher-avatar">
        {{ currentTeam?.name?.charAt(0) || 'T' }}
      </div>
      <div class="team-switcher-info">
        <div class="team-switcher-name">{{ currentTeam?.name || 'Select Team' }}</div>
        <div class="team-switcher-plan">{{ currentTeam?.plan || 'Free' }}</div>
      </div>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        class="team-switcher-chevron"
        :class="{ open: dropdownOpen }"
      >
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div v-if="dropdownOpen" class="team-switcher-dropdown">
        <div class="team-switcher-dropdown-header">
          <span class="text-[10px] font-mono text-gray-500 uppercase">Your Teams</span>
        </div>
        
        <div class="team-switcher-dropdown-list">
          <button
            v-for="team in teams"
            :key="team.id"
            class="team-switcher-dropdown-item"
            :class="{ active: currentTeam?.id === team.id }"
            @click="selectTeam(team)"
          >
            <div class="team-switcher-avatar small">
              {{ team.name?.charAt(0) || 'T' }}
            </div>
            <div class="flex-1">
              <div class="text-sm">{{ team.name }}</div>
              <div class="text-[10px] text-gray-500">{{ team.memberCount || 1 }} members</div>
            </div>
            <svg 
              v-if="currentTeam?.id === team.id"
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
              class="text-orange-500"
            >
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
        </div>

        <div class="team-switcher-dropdown-footer">
          <NuxtLink to="/app/settings/team" class="team-switcher-dropdown-action" @click="dropdownOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create Team
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.team-switcher {
  position: relative;
}

.team-switcher-trigger {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.5rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.team-switcher-trigger:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.team-switcher-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  color: #fff;
  flex-shrink: 0;
}

.team-switcher-avatar.small {
  width: 28px;
  height: 28px;
  font-size: 0.75rem;
}

.team-switcher-info {
  flex: 1;
  min-width: 0;
}

.team-switcher-name {
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.team-switcher-plan {
  font-size: 0.65rem;
  color: #888;
  text-transform: uppercase;
  font-weight: 500;
}

.team-switcher-chevron {
  color: #666;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.team-switcher-chevron.open {
  transform: rotate(180deg);
}

.team-switcher-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.team-switcher-dropdown-header {
  padding: 0.75rem 1rem 0.5rem;
}

.team-switcher-dropdown-list {
  max-height: 200px;
  overflow-y: auto;
}

.team-switcher-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  text-align: left;
  color: #fff;
}

.team-switcher-dropdown-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.team-switcher-dropdown-item.active {
  background: rgba(249, 115, 22, 0.1);
}

.team-switcher-dropdown-footer {
  padding: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.team-switcher-dropdown-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  color: #888;
  font-size: 0.8rem;
  text-decoration: none;
  transition: all 0.2s;
}

.team-switcher-dropdown-action:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
