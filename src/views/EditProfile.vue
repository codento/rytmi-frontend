<template>
  <div class="animated fadeIn profile-editor col-sm-12 col-md-10">
    <h1>Edit Profile</h1>
    <hr >
    <h1>Basic Details</h1>
    <hr >
    <template v-if="profile">
      <ProfileForm :profile="profile" />
      <EditLinks :profile="profile" />
      <edit-skills :profile-id="profile.id" />
      <edit-projects :profile-id="profile.id" />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  EditLinks,
  EditSkills,
  EditProjects,
  ProfileForm
} from '../components/EditProfile'
import store from '../store'

export default {
  name: 'EditProfile',
  components: {
    ProfileForm,
    EditLinks,
    EditSkills,
    EditProjects
  },
  props: {
    profileId: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'profileById'
    ]),
    profile () {
      return this.profileById(this.profileId)
    }
  },
  mounted () {
    document.title = 'Rytmi - Edit Profile'
  },
  beforeRouteEnter (to, from, next) {
    store.dispatch('fetchPPsOfProfile', to.params.profileId)
    next()
  }
}
</script>

<style scoped>
.profile-editor {
  margin: 0 auto;
}
</style>
