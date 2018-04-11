<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <!-- <Sidebar :navItems="nav"/> -->
      <main class="main">
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
      <AppAside/>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import {
  Sidebar,
  Header as AppHeader,
  Aside as AppAside,
  Footer as AppFooter,
  Breadcrumb
} from './components/appStructures'

export default {
  name: 'app',
  components: {
    AppHeader,
    Sidebar,
    AppAside,
    AppFooter,
    Breadcrumb
  },
  methods: {
    ...mapActions([
      'fetchProfiles',
      'fetchSkills',
      'fetchProfileSkills'
    ])
  },
  computed: {
    ...mapGetters([
      'isAuthenticated',
      'profileId'
    ]),
    nav () {
      return [{
        name: 'Profile',
        url: '/profile/' + this.profileId,
        icon: 'icon-star'
      },
      {
        name: 'EditProfile',
        url: '/edit/' + this.profileId,
        icon: 'icon-star'
      }]
    },
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched
    }
  },
  created () {
    if (this.isAuthenticated) {
      this.fetchProfiles()
      this.fetchSkills()
      this.fetchProfileSkills()
    }
  }
}
</script>

<style lang="scss">
  /* Import Font Awesome Icons Set */
  $fa-font-path: '~font-awesome/fonts/';
  @import '~font-awesome/css/font-awesome.min.css';
  /* Import Simple Line Icons Set */
  $simple-line-font-path: '~simple-line-icons/fonts/';
  @import '~simple-line-icons/css/simple-line-icons.css';
  /* Import Bootstrap Vue Styles */
  @import '~bootstrap-vue/dist/bootstrap-vue.css';

  // Import Main styles for this application
  @import './scss/style';
</style>

