<template>
  <div class="app">
    <AppHeader>

    </AppHeader>
    <div class="app-body">
      <Sidebar :navItems="nav"/>
      <main class="main">
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
      <AppAside/>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

import { Header as AppHeader } from '@coreui/vue'

import {
  Sidebar,
  Aside as AppAside,
  Footer as AppFooter,
  Breadcrumb
} from './components/appStructures'

export default {
  name: 'app',
  components: {
    AppHeader,
    Sidebar,
    AppAside,
    AppFooter,
    Breadcrumb
  },
  methods: {
    ...mapActions([
      'fetchProfiles',
      'fetchAllFutureProfileProjects',
      'fetchSkills',
      'fetchProfileSkills',
      'fetchProjects'
    ])
  },
  computed: {
    ...mapGetters([
      'isAuthenticated',
      'profileId'
    ]),
    nav () {
      return [
        {
          name: 'Search',
          url: '/search',
          icon: 'icon-magnifier'
        },
        {
          name: 'Projects',
          url: '/projects',
          icon: 'icon-drawer'
        },
        {
          divider: true
        },
        {
          name: 'My Profile',
          url: '/profile/' + this.profileId,
          icon: 'icon-user'
        },
        {
          name: 'Edit Profile',
          url: '/edit/' + this.profileId,
          icon: 'icon-pencil'
        }
      ]
    },
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched
    }
  },
  created () {
    if (this.isAuthenticated) {
      this.fetchProfiles()
      this.fetchAllFutureProfileProjects()
      this.fetchSkills()
      this.fetchProfileSkills()
      this.fetchProjects()
    }
  }
}
</script>

<style lang="scss">
  // CoreUI Icons Set
  @import '~@coreui/icons/css/coreui-icons.min.css';
  /* Import Font Awesome Icons Set */
  $fa-font-path: '~font-awesome/fonts/';
  @import '~font-awesome/scss/font-awesome.scss';
  /* Import Simple Line Icons Set */
  $simple-line-font-path: '~simple-line-icons/fonts/';
  @import '~simple-line-icons/scss/simple-line-icons.scss';
  /* Import Flag Icons Set */
  @import '~flag-icon-css/css/flag-icon.min.css';
  /* Import Bootstrap Vue Styles */
  @import '~bootstrap-vue/dist/bootstrap-vue.css';
  // Import Main styles for this application
  @import 'assets/scss/style';
</style>
