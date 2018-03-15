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
      return this.profileById(this.$route.params.id)
    }
  }
}
</script>

<style scoped>
</style>
