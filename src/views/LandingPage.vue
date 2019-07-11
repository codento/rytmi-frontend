<template>
  <div
    class="animated fadeIn container"
    style="margin-top: 24px"
  >
    <b-jumbotron
      v-if="!isAuthenticated"
      class="sign-in-jumbotron"
    >
      <span slot="header">Codento Rytmi</span>
      <div class="mt-5">
        <b-button
          variant="primary"
          @click="handleLogin()"
        >
          Please Sign in
        </b-button>
      </div>
    </b-jumbotron>
    <div v-if="employeeRolesLoaded">
      <Dashboard
        v-if="isAuthenticated"
        class="mb-2"
      >
        <template slot="header">
          Codento Rytmi
        </template>
      </Dashboard>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Dashboard from '@/components/Dashboard'

export default {
  name: 'Login',
  components: {
    Dashboard
  },
  computed: {
    ...mapGetters([
      'isAuthenticated',
      'employeeRoles'
    ]),
    employeeRolesLoaded () {
      return Object.keys(this.employeeRoles).length > 0
    }
  },
  mounted () {
    document.title = 'Rytmi'
  },
  methods: {
    ...mapActions(['handleLogin'])
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
.sign-in-jumbotron {
  background-color: white;
  box-shadow: 2px 2px darken($color: $body-bg, $amount: 5);
}
</style>
