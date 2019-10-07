<template>
  <b-navbar
    id="header-navbar"
    type="dark"
    toggleable="xl"
    variant="c-violet-dark"
  >
    <b-navbar-brand>
      <router-link to="/home">
        <img
          class="navbar-brand-full mx-5"
          src="/img/logo.png"
          width="143"
          height="25"
          alt="Codento Logo"
        >
      </router-link>
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse" />
    <b-collapse
      id="nav-collapse"
      is-nav
    >
      <b-navbar-nav v-if="isAuthenticated">
        <b-nav-item
          class="px-3"
          name="go-to-dashboard"
        >
          <router-link to="/home">
            <b-row class="text-center my-1">
              <b-col cols="12">
                <GlobeIcon class="nav-icon" />
              </b-col>
              <b-col class="nav-item-label">
                DASHBOARD
              </b-col>
            </b-row>
          </router-link>
        </b-nav-item>
        <b-nav-item
          class="px-3"
          variant="light"
          name="go-to-profiles"
          href="/search"
        >
          <router-link to="/search">
            <b-row class="nav-item text-center my-1">
              <b-col cols="12">
                <UsersIcon class="nav-icon" />
              </b-col>
              <b-col class="nav-item-label">
                PROFILES
              </b-col>
            </b-row>
          </router-link>
        </b-nav-item>
        <b-nav-item
          class="px-3"
          name="go-to-projects"
        >
          <router-link to="/projects">
            <b-row class="text-center my-1">
              <b-col cols="12">
                <ArchiveIcon class="nav-icon" />
              </b-col>
              <b-col class="nav-item-label">
                PROJECTS
              </b-col>
            </b-row>
          </router-link>
        </b-nav-item>
        <b-nav-item
          class="px-3"
          name="go-to-skills"
        >
          <router-link to="/skills">
            <b-row class="nav-item text-center my-1">
              <b-col cols="12">
                <StarIcon class="nav-icon" />
              </b-col>
              <b-col class="nav-item-label">
                SKILLS
              </b-col>
            </b-row>
          </router-link>
        </b-nav-item>
        <b-nav-item
          v-show="isAdmin"
          class="px-3"
          name="go-to-profiles"
          href="/admin"
        >
          <router-link to="/admin">
            <b-row class="nav-item text-center my-1">
              <b-col cols="12">
                <SettingsIcon class="nav-icon" />
              </b-col>
              <b-col class="nav-item-label">
                ADMIN
              </b-col>
            </b-row>
          </router-link>
        </b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="float-right ml-auto">
        <b-nav-item
          v-if="!isAuthenticated"
          class="px-3"
          name="login"
          @click="login"
        >
          <UnlockIcon size="1x" />&nbsp; Sign in
        </b-nav-item>
        <b-nav-item
          v-if="isAuthenticated"
          class="px-3"
        >
          <b-dropdown
            id="account-dropdown"
            variant="outline-c-violet-light"
            text="Account"
          >
            <b-dropdown-item
              id="account-dropdown-item-profile"
              :to="{ name: 'profile', params: { id: profileId } }"
              variant="c-violet-dark"
              exact
            >
              <img
                class="profile-icon"
                :src="profileById(profileId) ? profileById(profileId).photoPath : ''"
                alt="Profile picture"
              >
              My Profile
            </b-dropdown-item>
            <b-dropdown-divider variant="c-violet-dark" />
            <b-dropdown-item
              id="account-dropdown-item-leave"
              v-b-modal.add-leave-modal
              variant="c-violet-dark"
            >
              <CalendarIcon
                size="1x"
                class="feather-icon-dropdown"
              />
              Manage absences
            </b-dropdown-item>
            <b-dropdown-item
              id="account-dropdown-item-signout"
              variant="c-violet-dark"
              @click="logout"
            >
              <LockIcon
                size="1x"
                class="feather-icon-dropdown"
              />
              Sign Out
            </b-dropdown-item>
          </b-dropdown>
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
    <b-modal
      id="add-leave-modal"
      hide-footer
      hide-header
    >
      <leave-form
        :profile="profileById(profileId)"
      />
    </b-modal>
  </b-navbar>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import { UsersIcon, GlobeIcon, StarIcon, ArchiveIcon, SettingsIcon, LockIcon, UnlockIcon, CalendarIcon } from 'vue-feather-icons'
import { LeaveForm } from '../Common/'

export default {
  name: 'CHeader',
  components: {
    UsersIcon,
    GlobeIcon,
    StarIcon,
    ArchiveIcon,
    SettingsIcon,
    UnlockIcon,
    LockIcon,
    CalendarIcon,
    LeaveForm
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'isAdmin', 'profileId', 'getToken', 'profileById'])
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

<style lang="scss">
@import '@/assets/scss/_variables.scss';
.profile-icon, .feather-icon-dropdown {
  margin: 0 10px 0 -10px;
  width: 20px;
  height: 20px;
}
.profile-icon {
  border-radius: 50%;
}
.nav-item-label {
  margin-top: 10px;
  font-family: 'Poppins';
  font-weight: 600;
}
.nav-item-active {
  color: $c-light;
}
a.dropdown-item {
  color: $c-violet-dark
}
a.dropdown-item.router-link-active, a.dropdown-item:focus, a.dropdown-item:active {
  background-color: $c-violet-light;
  color: $c-light;
}
a.nav-link a {
  color: $c-violet-light;
}
a.nav-link a:hover, a.nav-link a.router-link-active {
  color: $c-light;
  text-decoration: none;
}
@media screen and (min-width: 1200px) {
  #header-navbar {
    min-height: 100px;
  }
}

</style>
