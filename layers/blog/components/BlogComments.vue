<script setup lang="ts">
/**
 * Real-time comments component for blog posts.
 * Requires Firebase Database and optionally auth for posting.
 */
const props = defineProps<{
  slug: string
}>()

const { comments, loading, init, addComment, deleteComment, cleanup } = useRealtimeComments(props.slug)

const newComment = ref('')
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const user = ref<any>(null)
const isAdmin = ref(false)

// Inject auth if available
const nuxtApp = useNuxtApp()
const getAuth = () => {
  try {
    // Try to use useFirebaseAuth if available
    const auth = (nuxtApp as any).useFirebaseAuth?.() 
    return auth || { user: ref(null), isAdmin: ref(false), signInWithGoogle: () => {}, signOut: () => {} }
  } catch {
    return { user: ref(null), isAdmin: ref(false), signInWithGoogle: () => {}, signOut: () => {} }
  }
}

onMounted(async () => {
  init()
})

onUnmounted(() => {
  cleanup()
})

const handleSubmit = async () => {
  if (!newComment.value.trim() || isSubmitting.value || !user.value) return

  isSubmitting.value = true
  error.value = null

  try {
    await addComment(newComment.value, user.value)
    newComment.value = ''
  } catch (e: any) {
    error.value = e.message || 'Failed to add comment'
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (commentId: string) => {
  if (!confirm('Are you sure you want to delete this comment?')) return

  try {
    await deleteComment(commentId, user.value?.email, isAdmin.value)
  } catch (e: any) {
    error.value = e.message || 'Failed to delete comment'
  }
}

const canDelete = (comment: any) => {
  if (!user.value) return false
  return isAdmin.value || comment.authorEmail === user.value.email
}

function formatDate(timestamp: number) {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="blog-comments">
    <div class="blog-comments-header">
      <h3 class="blog-comments-title">Comments</h3>
      <span class="blog-comments-count">({{ comments.length }})</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="blog-comments-loading">
      <div class="blog-comments-spinner"></div>
    </div>

    <template v-else>
      <!-- Comments List -->
      <div v-if="comments.length > 0" class="blog-comments-list">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="blog-comment"
        >
          <img
            :src="comment.authorPhoto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(comment.authorName)"
            :alt="comment.authorName"
            class="blog-comment-avatar"
          />
          <div class="blog-comment-content">
            <div class="blog-comment-header">
              <span class="blog-comment-author">{{ comment.authorName }}</span>
              <span class="blog-comment-date">{{ formatDate(comment.createdAt) }}</span>
              <button
                v-if="canDelete(comment)"
                @click="handleDelete(comment.id)"
                class="blog-comment-delete"
              >
                Delete
              </button>
            </div>
            <p class="blog-comment-text">{{ comment.text }}</p>
          </div>
        </div>
      </div>

      <!-- No Comments -->
      <div v-else class="blog-comments-empty">
        <p>No comments yet. Be the first!</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="blog-comments-error">
        {{ error }}
      </div>

      <!-- Comment Form (when user is available) -->
      <div v-if="user" class="blog-comments-form">
        <form @submit.prevent="handleSubmit">
          <textarea
            v-model="newComment"
            placeholder="Write a comment..."
            rows="3"
            :disabled="isSubmitting"
          ></textarea>
          <button
            type="submit"
            :disabled="!newComment.trim() || isSubmitting"
          >
            {{ isSubmitting ? 'Posting...' : 'Post Comment' }}
          </button>
        </form>
      </div>

      <!-- Sign In Prompt -->
      <div v-else class="blog-comments-signin">
        <p>Sign in to join the conversation</p>
        <slot name="auth-button">
          <!-- Override this slot with your own auth button -->
        </slot>
      </div>
    </template>
  </div>
</template>

<style scoped>
.blog-comments {
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.blog-comments-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.blog-comments-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.blog-comments-count {
  font-size: 0.75rem;
  font-family: monospace;
  color: #9ca3af;
}

.blog-comments-loading {
  text-align: center;
  padding: 2rem;
}

.blog-comments-spinner {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.blog-comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.blog-comment {
  display: flex;
  gap: 0.75rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.blog-comment:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.blog-comment-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
}

.blog-comment-content {
  flex: 1;
  min-width: 0;
}

.blog-comment-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.blog-comment-author {
  font-size: 0.75rem;
  font-weight: 700;
}

.blog-comment-date {
  font-size: 0.625rem;
  font-family: monospace;
  color: #9ca3af;
}

.blog-comment-delete {
  margin-left: auto;
  font-size: 0.625rem;
  font-family: monospace;
  color: #9ca3af;
  background: none;
  border: none;
  cursor: pointer;
}

.blog-comment-delete:hover {
  color: #ef4444;
}

.blog-comment-text {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
}

.blog-comments-empty {
  text-align: center;
  padding: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.blog-comments-empty p {
  font-size: 0.875rem;
  font-family: monospace;
  color: #9ca3af;
}

.blog-comments-error {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  font-size: 0.75rem;
  font-family: monospace;
  color: #b91c1c;
}

.blog-comments-form textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #f9fafb;
  font-size: 0.875rem;
  font-family: monospace;
  resize: none;
  margin-bottom: 1rem;
}

.blog-comments-form textarea:focus {
  outline: none;
  border-color: #000;
}

.blog-comments-form button {
  padding: 0.5rem 1.5rem;
  background: #000;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: none;
  cursor: pointer;
}

.blog-comments-form button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.blog-comments-signin {
  text-align: center;
  padding: 1.5rem;
  border: 1px dashed rgba(0, 0, 0, 0.1);
}

.blog-comments-signin p {
  font-size: 0.875rem;
  font-family: monospace;
  color: #6b7280;
  margin-bottom: 1rem;
}
</style>
