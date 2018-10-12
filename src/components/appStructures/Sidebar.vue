<template>
  <AppSidebar fixed>
    <SidebarHeader/>
    <SidebarForm/>
    <SidebarNav :navItems="navItems"></SidebarNav>
    <SidebarFooter/>
    <SidebarMinimizer/>
  </AppSidebar>
</template>

<script>

import { Sidebar as AppSidebar, SidebarFooter, SidebarForm, SidebarHeader, SidebarMinimizer, SidebarNav } from '@coreui/vue'

export default {
  name: 'c-sidebar',
  props: {
    navItems: Array
  },
  components: {
    AppSidebar,
    SidebarHeader,
    SidebarForm,
    SidebarNav,
    SidebarFooter,
    SidebarMinimizer
  },
  data () {
    return {}
  }
}
</script>
