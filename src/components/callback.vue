<template />

<script>
import {mapActions} from 'vuex'

export default {
  methods: {
    ...mapActions([
      'fetchProfiles',
      'fetchSkills',
      'fetchProfileSkills'
    ])
  },
  created () {
    this.$nextTick(() => {
      this.fetchProfiles()
      this.fetchSkills()
      this.fetchProfileSkills()
      this.$router.push(this.$route.query.redirect || '/')
    })
  }
}
</script>