<script setup lang="ts">
/**
 * Data table component for admin.
 */
interface Column {
  key: string
  label: string
}

defineProps<{
  columns: Column[]
  data: Record<string, any>[]
  loading?: boolean
}>()

defineEmits<{
  rowClick: [row: Record<string, any>]
}>()
</script>

<template>
  <div class="admin-table-wrapper">
    <table class="admin-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length" class="admin-table-loading">Loading...</td>
        </tr>
        <tr v-else-if="data.length === 0">
          <td :colspan="columns.length" class="admin-table-empty">No data</td>
        </tr>
        <tr v-else v-for="(row, idx) in data" :key="idx" @click="$emit('rowClick', row)" class="admin-table-row">
          <td v-for="col in columns" :key="col.key">
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">{{ row[col.key] }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.admin-table-wrapper { background: white; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th { text-align: left; padding: 1rem; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: #6b7280; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
.admin-table td { padding: 1rem; font-size: 0.875rem; border-bottom: 1px solid #f3f4f6; }
.admin-table-row { cursor: pointer; transition: background 0.2s; }
.admin-table-row:hover { background: #f9fafb; }
.admin-table-loading, .admin-table-empty { text-align: center; padding: 3rem; color: #9ca3af; }
</style>
