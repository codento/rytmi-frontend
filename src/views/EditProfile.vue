<template>
  <div class="animated fadeIn">
    <profile-form :profile="profile" />
    <edit-skills :profileId="profile.id" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProfileForm from '../components/ProfileForm'
import EditSkills from './EditSkills'

export default {
  name: 'EditProfile',
  components: {
    ProfileForm,
    EditSkills
  },
  computed: {
    ...mapGetters([
      'profileById'
    ]),
    profile () {
      let profile = this.profileById(this.$route.params.id)
      if (!profile) {
        // if profile not found, use empty profile
        profile = {firstName: '', lastName: ''}
      }
      return profile
    }
  }
}
</script>

<style scoped>
</style>
