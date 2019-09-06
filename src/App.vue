
<template>
  <div class="app">
    <AppHeader />
    <div class="app-body">
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
        title="Session expiring!"
        @ok.prevent="loginViaModal"
        @cancel="clearLoginModalCheckInterval"
      >
        {{ loginModalText() }}
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
  Header as AppHeader,
  Footer as AppFooter
} from './components/appStructures'
export default {
  name: 'App',
  components: {
    AppHeader,
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
      'tokenValidTime',
      'now'
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
    this.startNow()
    this.initialAuth()
    this.modalTimer = setInterval(() => {
      this.loginModalTokenCheck()
    }, 10000)
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
      'handleLogin',
      'startNow'
    ]),
    ...mapMutations({
      setAppInitialized: SET_APP_INITIALIZED,
      setAppInitializeError: SET_APP_INITIALIZE_ERROR
    }),
    loginModalTokenCheck () {
      if (Number(this.tokenValidTime) - 360 < this.now / 1000 && this.isAuthenticated && this.isTokenValid) {
        this.$bvModal.show('login-popup')
      }
    },
    clearLoginModalCheckInterval () {
      clearInterval(this.modalTimer)
    },
    async loginViaModal () {
      await this.handleLogin(true)
      this.$bvModal.hide('login-popup')
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
          .then(() => {
            this.setAppInitialized(this.isTokenValid && isSignedInToGoogle)
          })
      }
    },
    loginModalText () {
      return this.tokenValidTime - 360 < this.now / 1000 && this.tokenValidTime > this.now / 1000
        ? `Your session will expire soon`
        : `Your session has expired`
    },
    beforeDestroy () {
      this.clearLoginModalCheckInterval()
    }
  }
}
</script>

<style lang="scss">
/* Import Bootstrap Vue Styles */
@import "~bootstrap-vue/dist/bootstrap-vue.css";
// Import Main styles for this application
@import "assets/scss/style";
</style>
