<script setup lang="ts">
/**
 * Settings Index - General settings page
 */

definePageMeta({
  layout: 'saas'
})

useHead({ title: 'Settings - My SaaS App' })

const route = useRoute()
const { user } = useFirebaseAuth()
const teamStore = useSaasTeam()
const { currentTeam } = storeToRefs(teamStore)

const tabs = [
  { name: 'General', href: '/app/settings', icon: 'settings' },
  { name: 'Team', href: '/app/settings/team', icon: 'building' },
  { name: 'Members', href: '/app/settings/members', icon: 'users' },
  { name: 'Billing', href: '/app/settings/billing', icon: 'credit-card' }
]

const isActiveTab = (href: string) => {
  if (href === '/app/settings') {
    return route.path === href
  }
  return route.path.startsWith(href)
}

// Form state
const form = reactive({
  displayName: user.value?.displayName || '',
  email: user.value?.email || '',
  timezone: 'America/New_York',
  notifications: {
    email: true,
    push: false,
    weekly: true
  }
})

const saving = ref(false)

const handleSave = async () => {
  saving.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  saving.value = false
}
</script>

<template>
  <div class="settings-page">
    <!-- Header -->
    <div class="settings-header">
      <h1 class="settings-title">Settings</h1>
      <p class="settings-subtitle">Manage your account and preferences</p>
    </div>

    <!-- Tabs -->
    <div class="settings-tabs">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.name"
        :to="tab.href"
        class="settings-tab"
        :class="{ active: isActiveTab(tab.href) }"
      >
        {{ tab.name }}
      </NuxtLink>
    </div>

    <!-- Content -->
    <div class="settings-content">
      <div class="settings-section">
        <h2 class="settings-section-title">Profile</h2>
        <p class="settings-section-description">Update your personal information</p>

        <div class="settings-form">
          <div class="settings-field">
            <label class="settings-label">Display Name</label>
            <input 
              v-model="form.displayName"
              type="text"
              class="settings-input"
              placeholder="Your name"
            />
          </div>

          <div class="settings-field">
            <label class="settings-label">Email</label>
            <input 
              v-model="form.email"
              type="email"
              class="settings-input"
              disabled
            />
            <p class="settings-hint">Email cannot be changed</p>
          </div>

          <div class="settings-field">
            <label class="settings-label">Timezone</label>
            <select v-model="form.timezone" class="settings-input">
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="settings-divider" />

      <div class="settings-section">
        <h2 class="settings-section-title">Notifications</h2>
        <p class="settings-section-description">Choose what you want to be notified about</p>

        <div class="settings-form">
          <div class="settings-toggle-group">
            <label class="settings-toggle">
              <div>
                <div class="settings-toggle-label">Email Notifications</div>
                <div class="settings-toggle-hint">Receive emails about activity</div>
              </div>
              <input type="checkbox" v-model="form.notifications.email" class="settings-checkbox" />
            </label>

            <label class="settings-toggle">
              <div>
                <div class="settings-toggle-label">Push Notifications</div>
                <div class="settings-toggle-hint">Receive push notifications in browser</div>
              </div>
              <input type="checkbox" v-model="form.notifications.push" class="settings-checkbox" />
            </label>

            <label class="settings-toggle">
              <div>
                <div class="settings-toggle-label">Weekly Digest</div>
                <div class="settings-toggle-hint">Get a weekly summary email</div>
              </div>
              <input type="checkbox" v-model="form.notifications.weekly" class="settings-checkbox" />
            </label>
          </div>
        </div>
      </div>

      <div class="settings-actions">
        <button 
          class="settings-btn-primary"
          :disabled="saving"
          @click="handleSave"
        >
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  max-width: 800px;
}

.settings-header {
  margin-bottom: 1.5rem;
}

.settings-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.25rem;
}

.settings-subtitle {
  color: #888;
  font-size: 0.875rem;
}

.settings-tabs {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 0;
}

.settings-tab {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #888;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all 0.2s;
}

.settings-tab:hover {
  color: #fff;
}

.settings-tab.active {
  color: #F97316;
  border-bottom-color: #F97316;
}

.settings-content {
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 1.5rem;
}

.settings-section {
  padding: 0.5rem 0;
}

.settings-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.25rem;
}

.settings-section-description {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 1.25rem;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.settings-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.settings-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #ccc;
}

.settings-input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: #fff;
  transition: all 0.2s;
}

.settings-input:focus {
  outline: none;
  border-color: #F97316;
}

.settings-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.settings-hint {
  font-size: 0.7rem;
  color: #666;
}

.settings-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 1.5rem 0;
}

.settings-toggle-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.settings-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.settings-toggle:hover {
  background: rgba(255, 255, 255, 0.04);
}

.settings-toggle-label {
  font-size: 0.875rem;
  color: #fff;
  margin-bottom: 0.125rem;
}

.settings-toggle-hint {
  font-size: 0.75rem;
  color: #666;
}

.settings-checkbox {
  width: 40px;
  height: 22px;
  appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 11px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}

.settings-checkbox::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: all 0.3s;
}

.settings-checkbox:checked {
  background: #F97316;
}

.settings-checkbox:checked::before {
  transform: translateX(18px);
}

.settings-actions {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.settings-btn-primary {
  background: #F97316;
  color: #000;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.settings-btn-primary:hover {
  background: #ea580c;
}

.settings-btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
