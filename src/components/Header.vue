<template>
  <header class="app-header navbar">
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    <b-link class="navbar-brand" to="#"></b-link>
    <button class="navbar-toggler sidebar-toggler d-md-down-none" type="button" @click="sidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>

    <b-navbar-nav v-if="isAuthenticated">
      <b-nav-item to="Search">Search</b-nav-item>
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto">
      <button id="loginBtn"  v-if="!isAuthenticated" v-on:click="login" class="btn">Sign in</button>
      <button id="logoutBtn" v-if="isAuthenticated" v-on:click="logout" class="btn">Sign out</button>
      <button id="logoutBtn"  v-on:click="checkStatus" class="btn">Check status</button>
    </b-navbar-nav>
    <button class="navbar-toggler aside-menu-toggler d-md-down-none" type="button" @click="asideToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    
  </header>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import {loadAuthClient, handleLogin, handleLogout} from '../utils/auth'

export default {
  name: 'c-header',
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  methods: {
    sidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-hidden')
    },
    sidebarMinimize (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-minimized')
    },
    mobileSidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-mobile-show')
    },
    asideToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('aside-menu-hidden')
    },
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
        this.requestAuth(response.Zi.id_token)
      }).catch((error) => {
        console.log(error)
        this.$toasted.global.rytmi_error({
          message: 'Login failed'
        })
      })
    },
    ...mapActions(['requestAuth', 'logoutAuth'])
  },
  created () {
    /* eslint-disable */
    loadAuthClient()
  }
}
</script>
