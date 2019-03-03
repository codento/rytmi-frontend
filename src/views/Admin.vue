<template>
  <b-container>
    <b-row>ADMIN VIEW</b-row>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Admin',
  computed: {
    ...mapGetters(['profiles'])
  }
}
</script>
