<template>
  <AppSidebar fixed>
    <SidebarHeader />
    <SidebarForm />
    <SidebarNav :nav-items="navItems" />
    <SidebarFooter />
    <SidebarMinimizer />
  </AppSidebar>
</template>

<script>

import { Sidebar as AppSidebar, SidebarFooter, SidebarForm, SidebarHeader, SidebarMinimizer, SidebarNav } from '@coreui/vue'

export default {
  name: 'CSidebar',
  components: {
    AppSidebar,
    SidebarHeader,
    SidebarForm,
    SidebarNav,
    SidebarFooter,
    SidebarMinimizer
  },
  props: {
    navItems: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {}
  }
}
</script>
