<template>
  <header class="app-header navbar">
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    <b-link class="navbar-brand" to="Home"></b-link>
    <button class="navbar-toggler sidebar-toggler d-md-down-none" type="button" @click="sidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
     <b-navbar-nav  v-if="isAuthenticated">
      <b-nav-item to="/search">Search</b-nav-item>

      <b-nav-item v-if="!getProfileId" to="/createProfile">Create Profile</b-nav-item>
      <b-nav-item v-else to="/editProfile">Edit My Profile</b-nav-item>

    </b-navbar-nav>
    <b-navbar-nav class="ml-auto">
      <b-nav-item id="loginBtn"  v-if="!isAuthenticated" v-on:click="login" >Sign in</b-nav-item>
      <b-nav-item id="logoutBtn" v-if="isAuthenticated" v-on:click="logout" >Sign out</b-nav-item>
      <b-nav-item id="logoutBtn"  v-on:click="checkStatus" >Check status</b-nav-item>
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
    ...mapGetters(['isAuthenticated', 'getProfileId', 'getToken'])
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
  },
  created () {
    /* eslint-disable */
    loadAuthClient()
  }
}
</script>
