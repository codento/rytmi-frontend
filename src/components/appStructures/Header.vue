<template>
  <AppHeader fixed>
    <SidebarToggler
      class="d-lg-none"
      display="md"
      mobile
    />
    <b-link
      class="navbar-brand"
      to="/home"
    >
      <img
        class="navbar-brand-full"
        src="/img/logo.png"
        width="143"
        height="25"
        alt="Codento Logo"
      >
      <img
        class="navbar-brand-minimized"
        src="/img/Codento C RGB medium square.jpg"
        width="30"
        height="30"
        alt="Codento Logo"
      >
    </b-link>
    <SidebarToggler
      class="d-md-down-none"
      display="lg"
    />

    <b-navbar-nav class="ml-auto">
      <b-nav-item
        v-if="!isAuthenticated"
        class="px-3"
        name="login"
        @click="login"
      >
        <i class="fa fa-unlock" />&nbsp; Sign in
      </b-nav-item>
      <b-nav-item
        v-else
        class="px-3"
      >
        <b-dropdown
          id="account-dropdown"
          variant="light"
          text="Account"
        >
          <b-dropdown-item
            id="account-dropdown-item-profile"
            :to="{ name: 'profile', params: { id: profileId } }"
            exact
          >
            <img
              class="profile-icon"
              :src="profileById(profileId).photoPath"
              height="20px"
              width="20px"
              alt="Profile picture"
            >
            My Profile
          </b-dropdown-item>
          <b-dropdown-divider />
          <b-dropdown-item
            id="account-dropdown-item-signout"
            @click="logout"
          >
            <i class="fa fa-lock" /> Sign Out
          </b-dropdown-item>
        </b-dropdown>
      </b-nav-item>
    </b-navbar-nav>
  </AppHeader>
</template>

<script>

import { Header as AppHeader, SidebarToggler } from '@coreui/vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'CHeader',
  components: {
    AppHeader,
    SidebarToggler
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'profileId', 'getToken', 'profileById'])
  },
  methods: {
    logout () {
      gapi.auth2.getAuthInstance().signOut().then(() => {
        this.clearLoginData()
        this.$router.push(this.$route.query.redirect || '/home')
      })
    },
    login () {
      this.handleLogin()
    },
    ...mapActions(['clearLoginData', 'handleLogin'])
  }
}
</script>

<style scoped>
.profile-icon {
  margin: 0 10px 0 -10px;
}
</style>
