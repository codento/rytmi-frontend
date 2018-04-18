<template>
  <div>
    <h3>Add a member to the project</h3>
    <b-form @submit="this.onSubmit">
      <b-form-select text="Profile" v-model="projectProfile.ProfileId">
        <option 
          v-for="profile in this.profiles"
          :key="profile.id"
          :value="profile.id"
        >{{profile.firstName + ' ' + profile.lastName}}
        </option>
      </b-form-select>
      <span>Start date</span>
      <b-input type="date" v-model="projectProfile.startAt"></b-input>
      <span>End date</span>
      <b-input type="date" v-model="projectProfile.endAt"></b-input>
      <b-input type="number" min="0" max="100" v-model="projectProfile.workPercentage"></b-input>
      <b-button primary type="submit">Submit</b-button>
    </b-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ProjectProfileForm',
  props: {
    projectId: Number
  },
  data () {
    return {
      projectProfile: {
        ProjectId: this.projectId
      }
    }
  },
  computed: {
    ...mapGetters([
      'profiles'
    ])
  },
  methods: {
    ...mapActions([
      'addProjectProfile'
    ]),
    onSubmit (evt) {
      evt.preventDefault()
      this.addProjectProfile(this.projectProfile)
    }
  }
}
</script>
<style>

</style>
