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
      'isTokenValid'
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
          },
          {
            name: 'Admin',
            url: '/admin',
            icon: 'cui-cog'
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
      'clearLoginData',
      'fetchUsers'
    ]),
    ...mapMutations({
      setAppInitialized: SET_APP_INITIALIZED,
      setAppInitializeError: SET_APP_INITIALIZE_ERROR
    }),
    async initialAuth () {
      const isSignedInToGoogle = await gapi.auth2.getAuthInstance().isSignedIn.get()
      let googleUserToken = isSignedInToGoogle ? await gapi.auth2.getAuthInstance().currentUser.Ab.Zi.id_token : false

      if (!this.isTokenValid && isSignedInToGoogle) {
        await this.requestAuth(googleUserToken)
        googleUserToken = await gapi.auth2.getAuthInstance().currentUser.Ab.Zi.id_token
      } else if (await !isSignedInToGoogle || !this.isTokenValid) {
        await this.clearLoginData()
      }

      this.initializeApp(isSignedInToGoogle)
    },
    initializeApp (isSignedInToGoogle) {
      if (this.isAuthenticated) {
        Promise.all([
          this.fetchProfiles(),
          this.fetchAllFutureProfileProjects(),
          this.fetchSkills(),
          this.fetchProfileSkills(),
          this.fetchProjects(),
          this.fetchSkillCategories(),
          this.fetchSkillGroups(),
          this.fetchUsers()
        ])
          .catch(error => {
            this.setAppInitializeError(error)
          })
          .finally(() => {
            this.setAppInitialized(this.isTokenValid && isSignedInToGoogle)
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
