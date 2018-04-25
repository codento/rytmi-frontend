<template>
  <div class="animated fadeIn profile-editor col-sm-12 col-md-10">
    <h1>Basic Details</h1>
    <hr />
    <ProfileForm :profile="profile" />
    <EditLinks :profile="profile" />
    <edit-skills :profileId="profile.id" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  EditLinks,
  EditSkills,
  ProfileForm
} from '../components/EditProfile'

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
.profile-editor {
  margin: 0 auto;
}
</style>
