<template>
  <AppHeader>
    <SidebarToggler
      class="d-lg-none"
      display="md"
      mobile />
    <b-link
      class="navbar-brand"
      to="/home">
      <img
        class="navbar-brand-full"
        src="/img/logo.png"
        width="143"
        height="25"
        alt="Codento Logo">
      <img
        class="navbar-brand-minimized"
        src="/img/Codento C RGB medium square.jpg"
        width="30"
        height="30"
        alt="Codento Logo">
    </b-link>
    <SidebarToggler
      class="d-md-down-none"
      display="lg" />

    <b-navbar-nav class="ml-auto">
      <b-nav-item
        v-if="!isAuthenticated"
        class="px-3"
        @click="login">
        <i class="fa fa-unlock" />&nbsp; Sign in
      </b-nav-item>
      <b-nav-item
        v-if="isAuthenticated"
        class="px-3"
        @click="logout">
        <i class="fa fa-lock" />&nbsp; Sign out
      </b-nav-item>
    </b-navbar-nav>
  </AppHeader>
</template>

<script>

import { Header as AppHeader, SidebarToggler } from '@coreui/vue'

import { mapGetters, mapActions } from 'vuex'
import { loadAuthClient, handleLogin, handleLogout } from '../../utils/auth'

export default {
  name: 'CHeader',
  components: {
    AppHeader,
    SidebarToggler
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'profileId', 'getToken']),
    isDev () {
      return process.env.NODE_ENV === 'development'
    }
  },
  created () {
    /* eslint-disable */
    loadAuthClient()
  },
  methods: {
    checkStatus () {
      this.$toasted.global.rytmi_success({
        message: 'Authenticated: ' + this.isAuthenticated
      })
    },
    logout () {
      handleLogout().then(() => {
        this.logoutAuth()
        this.$router.push(this.$route.query.redirect || '/home')
      })
    },
    login () {
      handleLogin().then((response) => {
        return this.requestAuth(response.Zi.id_token)
      }).then(() => {
        this.$router.push(this.$route.query.redirect || '/callback')
      }).catch((error) => {
        console.log(error)
        this.$toasted.global.rytmi_error({
          message: 'Login failed'
        })
      })
    },
    ...mapActions(['requestAuth', 'logoutAuth', 'createUser'])
  }
}
</script>
