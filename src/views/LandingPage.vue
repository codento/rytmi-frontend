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
      <span slot="header">Codento Rytmi</span>
      <template
        slot="lead">
        Please Sign in
      </template>
    </b-jumbotron>
    <dashboard v-if="isAuthenticated">
      <template slot="header">
        Codento Rytmi
      </template>
    </dashboard>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Dashboard from '@/components/Dashboard'

export default {
  name: 'Login',
  components: {
    Dashboard
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  mounted () {
    document.title = 'Rytmi'
  }
}
</script>
