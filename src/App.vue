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
    <AppFooter />
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
      'profileId',
      'validAuth'
    ]),
    nav () {
      return this.isAuthenticated
        ? [
          {
            name: 'Profiles',
            url: '/search',
            icon: 'icon-user'
          },
          {
            name: 'Projects',
            url: '/projects',
            icon: 'icon-drawer'
          },
          {
            name: 'Skills',
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
    this.initialAuth()
  },
  methods: {
    ...mapActions([
      'fetchProfiles',
      'fetchAllFutureProfileProjects',
      'fetchSkills',
      'fetchProfileSkills',
      'fetchProjects',
      'fetchSkillCategories',
      'fetchSkillGroups',
      'requestAuth',
      'logoutAuth'
    ]),
    ...mapMutations({
      setAppInitialized: SET_APP_INITIALIZED,
      setAppInitializeError: SET_APP_INITIALIZE_ERROR
    }),
    async initialAuth () {
      /* eslint-disable no-undef */
      const authInstance = await gapi.auth2.getAuthInstance()
      const validToken = this.validAuth > Math.round(Date.now() / 1000)

      if (!validToken && authInstance.isSignedIn.get()) {
        await this.requestAuth(authInstance.currentUser.Ab.Zi.id_token)
      }
      if (!authInstance.isSignedIn.get() && this.validAuth) {
        await this.logoutAuth()
      }
      /* eslint-enable no-undef */

      this.initializeApp()
    },
    initializeApp () {
      if (this.isAuthenticated) {
        Promise.all([
          this.fetchProfiles(),
          this.fetchAllFutureProfileProjects(),
          this.fetchSkills(),
          this.fetchProfileSkills(),
          this.fetchProjects(),
          this.fetchSkillCategories(),
          this.fetchSkillGroups()
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
