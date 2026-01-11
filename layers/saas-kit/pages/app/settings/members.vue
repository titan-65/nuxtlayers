<script setup lang="ts">
/**
 * Members Settings - Team member management
 */

definePageMeta({
  layout: 'saas'
})

useHead({ title: 'Team Members - My SaaS App' })

const route = useRoute()
const teamStore = useSaasTeam()
const { members, currentTeam, loading } = storeToRefs(teamStore)

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

// Invite modal state
const showInviteModal = ref(false)
const inviteEmail = ref('')
const inviteRole = ref<'admin' | 'member'>('member')
const inviting = ref(false)

const handleInvite = async () => {
  if (!inviteEmail.value) return
  
  inviting.value = true
  try {
    await teamStore.inviteMember(inviteEmail.value, inviteRole.value)
    inviteEmail.value = ''
    showInviteModal.value = false
  } catch (e) {
    // Handle error
  } finally {
    inviting.value = false
  }
}

onMounted(() => {
  teamStore.fetchMembers()
})

const roleColors = {
  owner: 'text-orange-500 bg-orange-500/10',
  admin: 'text-purple-500 bg-purple-500/10',
  member: 'text-gray-400 bg-gray-500/10'
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
      <div class="members-header">
        <div>
          <h2 class="members-title">Team Members</h2>
          <p class="members-desc">Manage who has access to {{ currentTeam?.name || 'your team' }}</p>
        </div>
        <button class="members-invite-btn" @click="showInviteModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/>
            <line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
          Invite Member
        </button>
      </div>

      <!-- Members List -->
      <div class="members-list">
        <div v-for="member in members" :key="member.id" class="member-card">
          <div class="member-avatar">
            <img v-if="member.avatarUrl" :src="member.avatarUrl" :alt="member.name" />
            <span v-else>{{ member.name?.charAt(0) || member.email.charAt(0) }}</span>
          </div>
          <div class="member-info">
            <div class="member-name">{{ member.name || member.email }}</div>
            <div class="member-email">{{ member.email }}</div>
          </div>
          <div class="member-role" :class="roleColors[member.role]">
            {{ member.role }}
          </div>
          <div class="member-joined">
            Joined {{ new Date(member.joinedAt).toLocaleDateString() }}
          </div>
          <button v-if="member.role !== 'owner'" class="member-menu-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
            </svg>
          </button>
        </div>

        <div v-if="members.length === 0 && !loading" class="members-empty">
          <p>No team members yet. Invite someone to get started.</p>
        </div>
      </div>
    </div>

    <!-- Invite Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showInviteModal" class="modal-overlay" @click.self="showInviteModal = false">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">Invite Team Member</h3>
              <button class="modal-close" @click="showInviteModal = false">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="modal-field">
                <label class="modal-label">Email Address</label>
                <input 
                  v-model="inviteEmail"
                  type="email"
                  class="modal-input"
                  placeholder="colleague@company.com"
                />
              </div>
              <div class="modal-field">
                <label class="modal-label">Role</label>
                <select v-model="inviteRole" class="modal-input">
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button class="modal-btn-secondary" @click="showInviteModal = false">
                Cancel
              </button>
              <button 
                class="modal-btn-primary" 
                :disabled="!inviteEmail || inviting"
                @click="handleInvite"
              >
                {{ inviting ? 'Sending...' : 'Send Invite' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.settings-page { max-width: 900px; }
.settings-header { margin-bottom: 1.5rem; }
.settings-title { font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 0.25rem; }
.settings-subtitle { color: #888; font-size: 0.875rem; }
.settings-tabs { display: flex; gap: 0.25rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.settings-tab { padding: 0.75rem 1rem; font-size: 0.875rem; color: #888; text-decoration: none; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.2s; }
.settings-tab:hover { color: #fff; }
.settings-tab.active { color: #F97316; border-bottom-color: #F97316; }
.settings-content { background: #111; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.5rem; }

.members-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; }
.members-title { font-size: 1rem; font-weight: 600; color: #fff; margin-bottom: 0.25rem; }
.members-desc { font-size: 0.8rem; color: #888; }
.members-invite-btn { display: flex; align-items: center; gap: 0.5rem; background: #F97316; color: #000; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; border: none; cursor: pointer; transition: all 0.2s; }
.members-invite-btn:hover { background: #ea580c; }

.members-list { display: flex; flex-direction: column; gap: 0.5rem; }
.member-card { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 10px; }
.member-avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 600; flex-shrink: 0; overflow: hidden; }
.member-avatar img { width: 100%; height: 100%; object-fit: cover; }
.member-info { flex: 1; min-width: 0; }
.member-name { font-size: 0.875rem; font-weight: 500; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.member-email { font-size: 0.75rem; color: #888; }
.member-role { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; }
.member-joined { font-size: 0.75rem; color: #666; white-space: nowrap; }
.member-menu-btn { background: transparent; border: none; color: #666; cursor: pointer; padding: 0.25rem; border-radius: 4px; transition: all 0.2s; }
.member-menu-btn:hover { background: rgba(255, 255, 255, 0.05); color: #fff; }

.members-empty { text-align: center; padding: 2rem; color: #888; font-size: 0.875rem; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: #1a1a1a; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; width: 100%; max-width: 400px; margin: 1rem; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.modal-title { font-size: 1rem; font-weight: 600; color: #fff; }
.modal-close { background: transparent; border: none; color: #888; cursor: pointer; padding: 0.25rem; }
.modal-close:hover { color: #fff; }
.modal-body { padding: 1.25rem; }
.modal-field { margin-bottom: 1rem; }
.modal-field:last-child { margin-bottom: 0; }
.modal-label { display: block; font-size: 0.8rem; font-weight: 500; color: #ccc; margin-bottom: 0.375rem; }
.modal-input { width: 100%; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 0.625rem 0.875rem; font-size: 0.875rem; color: #fff; }
.modal-input:focus { outline: none; border-color: #F97316; }
.modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; padding: 1.25rem; border-top: 1px solid rgba(255, 255, 255, 0.06); }
.modal-btn-secondary { background: transparent; border: 1px solid rgba(255, 255, 255, 0.1); color: #ccc; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
.modal-btn-secondary:hover { background: rgba(255, 255, 255, 0.05); color: #fff; }
.modal-btn-primary { background: #F97316; border: none; color: #000; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.modal-btn-primary:hover { background: #ea580c; }
.modal-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-content, .modal-leave-to .modal-content { transform: scale(0.95); }
</style>
