<template>
  <div class="animated fadeIn profile-editor col-sm-12 col-md-10">
    <h1>Edit Profile</h1>
    <hr>
    <h1>Basic Details</h1>
    <hr>
    <template v-if="profile">
      <ProfileForm
        :profile="profile"
        @profileUpdated="profileUpdated()"
      />
      <Employers :profile-id="profile.id" />
      <EditLinks
        :profile="profile"
        @profileUpdated="profileUpdated()"
      />
      <EditSkills :profile-id="profile.id" />
      <EditProjects :profile-id="profile.id" />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  EditLinks,
  EditSkills,
  EditProjects,
  ProfileForm,
  Employers
} from '../components/EditProfile'
import store from '../store'

export default {
  name: 'EditProfile',
  components: {
    ProfileForm,
    EditLinks,
    EditSkills,
    EditProjects,
    Employers
  },
  props: {
    profileId: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapGetters(['profileById']),
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
  },
  methods: {
    profileUpdated () {
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>
.profile-editor {
  margin: 0 auto;
  padding: 1em;
}
</style>
