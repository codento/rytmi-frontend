<template>
  <div class="animated fadeIn">
    <ProfileForm :profile="profile" />
    <EditLinks :profile="profile" />
    <edit-skills :profileId="profile.id" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProfileForm from '../components/ProfileForm'
import EditLinks from '../components/EditLinks'
import EditSkills from './EditSkills'

export default {
  name: 'EditProfile',
  components: {
    ProfileForm,
    EditLinks,
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
