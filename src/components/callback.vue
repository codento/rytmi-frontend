<template>
  
</template>

<script>
import {mapActions} from 'vuex'

export default {
  created () {
    this.$nextTick(() => {
      this.fetchProfiles()
      this.fetchSkills()
      this.fetchProfileSkills()
      this.$router.push(this.$route.query.redirect || '/')
    })
  },
  methods: {
    ...mapActions([
      'fetchProfiles',
      'fetchSkills',
      'fetchProfileSkills'
    ])
  }
}
</script>