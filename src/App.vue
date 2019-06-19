<template>
  <div class="app">
    <AppHeader />
    <div class="app-body">
      <Sidebar :nav-items="nav" />
      <loading v-if="!appInitialized && isAuthenticated" />
      <main
        v-else
        class="main"
      >
        <div class="container-fluid">
          <router-view />
        </div>
      </main>
      <b-modal
        id="login-popup"
        title="Login expiring!"
        @ok.prevent="loginViaModal"
        @cancel="resetAuthModalTimer"
      >
        Your login will expire in 5 minutes!
        <template #modal-ok>
          Keep me logged in
        </template>
      </b-modal>
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
  data () {
    return {
      modalTimer: undefined
    }
  },
  computed: {
    ...mapGetters([
      'isAuthenticated',
      'isAdmin',
      'profileId',
      'isTokenValid',
      'appInitialized',
      'tokenValidTime'
    ]),
    nav () {
      const navItems = [
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
      if (this.isAdmin) {
        navItems.push({
          name: 'Admin',
          url: '/admin',
          icon: 'cui-cog'
        })
      }
      return this.isAuthenticated ? navItems : []
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
    this.modalTimer = setInterval(this.checkTokenTimeout, 10000)
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
      'fetchEmployeeRoles',
      'requestAuth',
      'clearLoginData',
      'fetchUsers',
      'fetchEmployers',
      'fetchProfileEmployers',
      'handleLogin'
    ]),
    ...mapMutations({
      setAppInitialized: SET_APP_INITIALIZED,
      setAppInitializeError: SET_APP_INITIALIZE_ERROR
    }),
    checkTokenTimeout () {
      if (Number(this.tokenValidTime) - 360 < Math.round(Date.now() / 1000)) {
        this.$bvModal.show('login-popup')
      }
    },
    resetAuthModalTimer () {
      clearInterval(this.modalTimer)
    },
    loginViaModal () {
      this.handleLogin(true)
      setTimeout(() => { this.$bvModal.hide('login-popup') }, 1500)
    },
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
          this.fetchEmployeeRoles(),
          this.fetchUsers(),
          this.fetchEmployers(),
          this.fetchProfileEmployers()
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
@import "~@coreui/icons/css/coreui-icons.min.css";
/* Import Font Awesome Icons Set */
$fa-font-path: "~font-awesome/fonts/";
@import "~font-awesome/scss/font-awesome.scss";
/* Import Simple Line Icons Set */
$simple-line-font-path: "~simple-line-icons/fonts/";
@import "~simple-line-icons/scss/simple-line-icons.scss";
/* Import Flag Icons Set */
@import "~flag-icon-css/css/flag-icon.min.css";
/* Import Bootstrap Vue Styles */
@import "~bootstrap-vue/dist/bootstrap-vue.css";
// Import Main styles for this application
@import "assets/scss/style";
</style>
