<template>
  <header class="app-header navbar">
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    <b-link class="navbar-brand" to="#"></b-link>
    <button class="navbar-toggler sidebar-toggler d-md-down-none mr-auto" type="button" @click="sidebarToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    <button id="loginBtn"  v-if="!loggedIn" v-on:click="login" class="btn">Sign in</button>
    <button id="logoutBtn" v-if="loggedIn" v-on:click="logout" class="btn">Sign out</button>

    <button class="navbar-toggler aside-menu-toggler d-md-down-none" type="button" @click="asideToggle">
      <span class="navbar-toggler-icon"></span>
    </button>
    
  </header>
</template>
<script>

import {loadAuthClient, handleLogout, handleLogin} from '../utils/auth'
export default {
  name: 'c-header',
  data () {
    return {
      loggedIn: false
    }
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
    logout () {
      handleLogout().then(() => {
        this.loggedIn = false
        this.$toasted.global.rytmi_success({
          message: 'Logout success'
        })
      }).catch((error) => {
        console.log(error)
        this.$toasted.global.rytmi_error({
          message: 'Logout failed'
        })
      })
    },
    login () {
      handleLogin().then(() => {
        this.loggedIn = true
        this.$toasted.global.rytmi_success({
          message: 'Login success'
        })
      }).catch((error) => {
        console.log(error)
        this.$toasted.global.rytmi_error({
          message: 'Login failed'
        })
      })
    }
  },
  created () {
    /* eslint-disable */
    loadAuthClient()
  }
}
</script>
