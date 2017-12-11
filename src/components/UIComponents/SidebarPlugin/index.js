import Sidebar from './SideBar.vue'

const SidebarStore = {
  showSidebar: false,
  sidebarLinks: [
    {
      name: 'Overview',
      icon: 'ti-book',
      path: '/admin/overview'
    },
    {
      name: 'Typography',
      icon: 'ti-text',
      path: '/admin/typography'
    },
    {
      name: 'Profile',
      icon: 'ti-user',
      path: '/admin/userprofile'
    },
    {
      name: 'Table List',
      icon: 'ti-layout-grid2',
      path: '/admin/tablelist'
    },
    {
      name: 'Icons',
      icon: 'ti-github',
      path: '/admin/icons'
    },
    {
      name: 'Notifications',
      icon: 'ti-bell',
      path: '/admin/notifications'
    },
    {
      name: 'Maps',
      icon: 'ti-map',
      path: '/admin/maps'
    }
  ],
  displaySidebar (value) {
    this.showSidebar = value
  }
}

const SidebarPlugin = {

  install (Vue) {
    Vue.mixin({
      data () {
        return {
          sidebarStore: SidebarStore
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$sidebar', {
      get () {
        return this.$root.sidebarStore
      }
    })
    Vue.component('side-bar', Sidebar)
  }
}

export default SidebarPlugin
