# @vantol/admin

Admin dashboard layer with sidebar, stats cards, data tables, and modern UI.

## Features

- 📊 Dashboard with stats cards
- 📋 Data table component
- 🎨 Sidebar navigation
- 🔒 Auth middleware ready

## Installation

```bash
npx nuxt-layers add @vantol/admin
```

## Usage

### Layout

```vue
<script setup>
definePageMeta({
  layout: 'admin'
})
</script>
```

### Components

```vue
<!-- Stats Card -->
<AdminStatCard title="Users" value="1,234" :change="12" />

<!-- Data Table -->
<AdminTable 
  :columns="[{ key: 'name', label: 'Name' }]" 
  :data="items" 
/>

<!-- Sidebar (auto-included in layout) -->
<AdminSidebar :items="navItems" />
```

### Custom Nav Items

```vue
<AdminSidebar :items="[
  { label: 'Dashboard', icon: 'home', to: '/admin' },
  { label: 'Users', icon: 'users', to: '/admin/users' }
]" />
```

## License

MIT
