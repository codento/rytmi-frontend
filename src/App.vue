<template>
  <div class="app">
    <AppHeader />
    <div class="app-body">
      <Sidebar :nav-items="nav" />
      <main class="main">
        <div class="container-fluid">
          <router-view />
        </div>
      </main>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { SET_APP_INITIALIZED, SET_APP_INITIALIZE_ERROR } from '@/store/mutation-types'
import {
  Sidebar,
  Header as AppHeader,
  Footer as AppFooter
} from './components/appStructures'

export default {
  name: 'App',
  components: {
    AppHeader,
    Sidebar,
    AppFooter
  },
  computed: {
    ...mapGetters([
      'isAuthenticated',
      'profileId'
    ]),
    nav () {
      return this.isAuthenticated
        ? [
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
            url: '/profile/' + this.profileId + '/edit',
            icon: 'icon-pencil'
          },
          {
            name: 'Add skill',
            url: '/skills',
            icon: 'icon-plus'
          }
        ]
        : []
    },
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched
    }
  },
  created () {
    this.initializeApp()
  },
  methods: {
    ...mapActions([
      'fetchProfiles',
      'fetchAllFutureProfileProjects',
      'fetchSkills',
      'fetchProfileSkills',
      'fetchProjects'
    ]),
    ...mapMutations({
      setAppInitialized: SET_APP_INITIALIZED,
      setAppInitializeError: SET_APP_INITIALIZE_ERROR
    }),
    initializeApp () {
      if (this.isAuthenticated) {
        Promise.all([
          this.fetchProfiles(),
          this.fetchAllFutureProfileProjects(),
          this.fetchSkills(),
          this.fetchProfileSkills(),
          this.fetchProjects()
        ])
          .catch(error => {
            this.setAppInitializeError(error)
          })
          .finally(() => {
            this.setAppInitialized(true)
          })
      }
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
