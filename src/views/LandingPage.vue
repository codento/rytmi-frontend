<template>
  <div
    class="animated fadeIn container"
    style="margin-top: 24px"
  >
    <b-jumbotron
      v-if="!isAuthenticated"
      bg-variant="white"
      text-variant="primary"
      border-variant="dark"
    >
      <template
        slot="lead"
      >
        <span
          class="clickable"
          @click="handleLogin()"
        >
          Please Sign in
        </span>
      </template>
      <span slot="header">Codento Rytmi</span>
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
<style scoped>
.clickable:hover {
  cursor: pointer;
}
</style>
