<template>
  <div class="animated fadeIn container" style="margin-top: 24px">
    <b-jumbotron bg-variant="white" text-variant="primary" border-variant="dark" header="Rytmiryhmä app" :lead="!isAuthenticated? 'Please Login' : 'Tattaraa'" >
      <p>For more information visit website</p>
    </b-jumbotron>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'login',
  computed: {
    ...mapGetters(['isAuthenticated'])
  }
}
</script>
