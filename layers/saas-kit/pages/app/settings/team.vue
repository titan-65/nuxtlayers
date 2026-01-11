<script setup lang="ts">
/**
 * Team Settings - Team info and management
 */

definePageMeta({
  layout: 'saas'
})

useHead({ title: 'Team Settings - My SaaS App' })

const route = useRoute()
const teamStore = useSaasTeam()
const { currentTeam, loading } = storeToRefs(teamStore)

const tabs = [
  { name: 'General', href: '/app/settings' },
  { name: 'Team', href: '/app/settings/team' },
  { name: 'Members', href: '/app/settings/members' },
  { name: 'Billing', href: '/app/settings/billing' }
]

const isActiveTab = (href: string) => {
  if (href === '/app/settings') return route.path === href
  return route.path.startsWith(href)
}

// Form state
const form = reactive({
  name: currentTeam.value?.name || '',
  slug: currentTeam.value?.slug || ''
})

watch(currentTeam, (team) => {
  if (team) {
    form.name = team.name
    form.slug = team.slug
  }
})

const saving = ref(false)
const showDeleteModal = ref(false)

const handleSave = async () => {
  saving.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  saving.value = false
}
</script>

<template>
  <div class="settings-page">
    <div class="settings-header">
      <h1 class="settings-title">Settings</h1>
      <p class="settings-subtitle">Manage your account and preferences</p>
    </div>

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

    <div class="settings-content">
      <!-- Team Info -->
      <div class="team-section">
        <h2 class="team-section-title">Team Information</h2>
        <p class="team-section-desc">Update your team's profile</p>

        <div class="team-form">
          <div class="team-field">
            <label class="team-label">Team Name</label>
            <input 
              v-model="form.name"
              type="text"
              class="team-input"
              placeholder="Acme Inc"
            />
          </div>

          <div class="team-field">
            <label class="team-label">Team URL</label>
            <div class="team-input-group">
              <span class="team-input-prefix">app.nuxtlayers.dev/</span>
              <input 
                v-model="form.slug"
                type="text"
                class="team-input"
              />
            </div>
          </div>

          <div class="team-field">
            <label class="team-label">Team Logo</label>
            <div class="team-logo-upload">
              <div class="team-logo-preview">
                {{ currentTeam?.name?.charAt(0) || 'T' }}
              </div>
              <div class="team-logo-actions">
                <button class="team-upload-btn">Upload Image</button>
                <p class="team-upload-hint">PNG, JPG up to 2MB</p>
              </div>
            </div>
          </div>
        </div>

        <div class="team-actions">
          <button 
            class="team-btn-primary"
            :disabled="saving"
            @click="handleSave"
          >
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>

      <div class="team-divider" />

      <!-- Danger Zone -->
      <div class="team-section danger">
        <h2 class="team-section-title danger">Danger Zone</h2>
        <p class="team-section-desc">Irreversible and destructive actions</p>

        <div class="team-danger-card">
          <div class="team-danger-info">
            <h3 class="team-danger-title">Delete Team</h3>
            <p class="team-danger-desc">
              Permanently delete this team and all associated data. This action cannot be undone.
            </p>
          </div>
          <button class="team-danger-btn" @click="showDeleteModal = true">
            Delete Team
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
          <div class="modal-content modal-danger">
            <div class="modal-header">
              <h3 class="modal-title">Delete Team</h3>
            </div>
            <div class="modal-body">
              <p class="modal-text">
                Are you sure you want to delete <strong>{{ currentTeam?.name }}</strong>? 
                This action is permanent and cannot be undone.
              </p>
              <p class="modal-text danger">
                All team data, including projects and member access, will be permanently deleted.
              </p>
            </div>
            <div class="modal-footer">
              <button class="modal-btn-secondary" @click="showDeleteModal = false">
                Cancel
              </button>
              <button class="modal-btn-danger">
                Yes, Delete Team
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.settings-page { max-width: 800px; }
.settings-header { margin-bottom: 1.5rem; }
.settings-title { font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 0.25rem; }
.settings-subtitle { color: #888; font-size: 0.875rem; }
.settings-tabs { display: flex; gap: 0.25rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.settings-tab { padding: 0.75rem 1rem; font-size: 0.875rem; color: #888; text-decoration: none; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.2s; }
.settings-tab:hover { color: #fff; }
.settings-tab.active { color: #F97316; border-bottom-color: #F97316; }
.settings-content { background: #111; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.5rem; }

.team-section { padding: 0.5rem 0; }
.team-section-title { font-size: 1rem; font-weight: 600; color: #fff; margin-bottom: 0.25rem; }
.team-section-title.danger { color: #ef4444; }
.team-section-desc { font-size: 0.8rem; color: #888; margin-bottom: 1.25rem; }
.team-divider { height: 1px; background: rgba(255, 255, 255, 0.06); margin: 1.5rem 0; }

.team-form { display: flex; flex-direction: column; gap: 1rem; }
.team-field { display: flex; flex-direction: column; gap: 0.375rem; }
.team-label { font-size: 0.8rem; font-weight: 500; color: #ccc; }
.team-input { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 0.625rem 0.875rem; font-size: 0.875rem; color: #fff; transition: all 0.2s; }
.team-input:focus { outline: none; border-color: #F97316; }

.team-input-group { display: flex; align-items: center; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; overflow: hidden; }
.team-input-group:focus-within { border-color: #F97316; }
.team-input-prefix { padding: 0.625rem 0.75rem; background: rgba(255, 255, 255, 0.02); color: #888; font-size: 0.875rem; }
.team-input-group .team-input { border: none; border-radius: 0; background: transparent; }

.team-logo-upload { display: flex; align-items: center; gap: 1rem; }
.team-logo-preview { width: 64px; height: 64px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem; font-weight: 700; }
.team-upload-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
.team-upload-btn:hover { background: rgba(255, 255, 255, 0.1); }
.team-upload-hint { font-size: 0.7rem; color: #666; margin-top: 0.25rem; }

.team-actions { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.06); }
.team-btn-primary { background: #F97316; color: #000; padding: 0.625rem 1.25rem; border-radius: 8px; font-size: 0.875rem; font-weight: 600; border: none; cursor: pointer; transition: all 0.2s; }
.team-btn-primary:hover { background: #ea580c; }
.team-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.team-danger-card { display: flex; align-items: center; justify-content: space-between; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 10px; padding: 1rem 1.25rem; }
.team-danger-title { font-size: 0.9rem; font-weight: 600; color: #fff; margin-bottom: 0.25rem; }
.team-danger-desc { font-size: 0.75rem; color: #888; max-width: 300px; }
.team-danger-btn { background: transparent; border: 1px solid rgba(239, 68, 68, 0.5); color: #ef4444; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.team-danger-btn:hover { background: rgba(239, 68, 68, 0.1); }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: #1a1a1a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; width: 100%; max-width: 400px; margin: 1rem; }
.modal-danger { border-color: rgba(239, 68, 68, 0.3); }
.modal-header { padding: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.modal-title { font-size: 1rem; font-weight: 600; color: #fff; }
.modal-body { padding: 1.25rem; }
.modal-text { font-size: 0.875rem; color: #ccc; margin-bottom: 0.75rem; }
.modal-text.danger { color: #ef4444; }
.modal-text:last-child { margin-bottom: 0; }
.modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1.25rem; border-top: 1px solid rgba(255, 255, 255, 0.06); }
.modal-btn-secondary { background: transparent; border: 1px solid rgba(255, 255, 255, 0.1); color: #ccc; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
.modal-btn-secondary:hover { background: rgba(255, 255, 255, 0.05); color: #fff; }
.modal-btn-danger { background: #ef4444; border: none; color: #fff; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.modal-btn-danger:hover { background: #dc2626; }

.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
