import { defineStore } from 'pinia'

export interface Team {
    id: string
    name: string
    slug: string
    plan: 'free' | 'pro' | 'team' | 'enterprise'
    ownerId: string
    memberCount: number
    createdAt: string
}

export interface TeamMember {
    id: string
    email: string
    name?: string
    role: 'owner' | 'admin' | 'member'
    joinedAt: string
    avatarUrl?: string
}

export const useSaasTeam = defineStore('saas-team', () => {
    const teams = ref<Team[]>([])
    const currentTeam = ref<Team | null>(null)
    const members = ref<TeamMember[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Fetch user's teams
    const fetchTeams = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await $fetch<{ success: boolean; teams: Team[] }>('/api/team')
            if (response.success) {
                teams.value = response.teams
                // Set first team as current if none selected
                if (!currentTeam.value && teams.value.length > 0) {
                    currentTeam.value = teams.value[0]
                }
            }
        } catch (e: any) {
            error.value = e.message || 'Failed to fetch teams'
            // Demo data for development
            teams.value = [
                {
                    id: 'demo-team-1',
                    name: 'Acme Corp',
                    slug: 'acme-corp',
                    plan: 'pro',
                    ownerId: 'user-1',
                    memberCount: 5,
                    createdAt: new Date().toISOString()
                }
            ]
            currentTeam.value = teams.value[0]
        } finally {
            loading.value = false
        }
    }

    // Set current team
    const setCurrentTeam = (team: Team) => {
        currentTeam.value = team
        // Persist selection
        if (import.meta.client) {
            localStorage.setItem('saas-current-team', team.id)
        }
    }

    // Create new team
    const createTeam = async (data: { name: string; slug?: string }) => {
        loading.value = true
        error.value = null
        try {
            const response = await $fetch<{ success: boolean; team: Team }>('/api/team', {
                method: 'POST',
                body: data
            })
            if (response.success) {
                teams.value.push(response.team)
                currentTeam.value = response.team
                return response.team
            }
        } catch (e: any) {
            error.value = e.message || 'Failed to create team'
            throw e
        } finally {
            loading.value = false
        }
    }

    // Fetch team members
    const fetchMembers = async (teamId?: string) => {
        const id = teamId || currentTeam.value?.id
        if (!id) return

        loading.value = true
        try {
            const response = await $fetch<{ success: boolean; members: TeamMember[] }>(`/api/team/members`, {
                query: { teamId: id }
            })
            if (response.success) {
                members.value = response.members
            }
        } catch (e: any) {
            // Demo data
            members.value = [
                {
                    id: 'member-1',
                    email: 'owner@example.com',
                    name: 'Team Owner',
                    role: 'owner',
                    joinedAt: new Date().toISOString()
                },
                {
                    id: 'member-2',
                    email: 'admin@example.com',
                    name: 'Admin User',
                    role: 'admin',
                    joinedAt: new Date().toISOString()
                }
            ]
        } finally {
            loading.value = false
        }
    }

    // Invite member
    const inviteMember = async (email: string, role: 'admin' | 'member' = 'member') => {
        if (!currentTeam.value) throw new Error('No team selected')

        loading.value = true
        error.value = null
        try {
            const response = await $fetch('/api/team/invite', {
                method: 'POST',
                body: {
                    teamId: currentTeam.value.id,
                    email,
                    role
                }
            })
            return response
        } catch (e: any) {
            error.value = e.message || 'Failed to invite member'
            throw e
        } finally {
            loading.value = false
        }
    }

    return {
        teams,
        currentTeam,
        members,
        loading,
        error,
        fetchTeams,
        setCurrentTeam,
        createTeam,
        fetchMembers,
        inviteMember
    }
})

// Auto-import helper
export const storeToRefs = (store: ReturnType<typeof useSaasTeam>) => {
    const { teams, currentTeam, members, loading, error } = store
    return {
        teams: computed(() => teams),
        currentTeam: computed(() => currentTeam),
        members: computed(() => members),
        loading: computed(() => loading),
        error: computed(() => error)
    }
}
