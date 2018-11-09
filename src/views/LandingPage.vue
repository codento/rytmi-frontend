<template>
  <div
    class="animated fadeIn container"
    style="margin-top: 24px"
  >
    <b-jumbotron
      bg-variant="white"
      text-variant="primary"
      border-variant="dark"
    >
      <span slot="header">Codento Rytmi</span>
      <template
        v-if="!isAuthenticated"
        slot="lead"
      >
        Please Sign in
      </template>
      <template
        v-else
        slot="lead"
      >
        Ready to Rock ’n’ Roll
      </template>
    </b-jumbotron>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Login',
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  mounted () {
    document.title = 'Rytmi'
  }
}
</script>
