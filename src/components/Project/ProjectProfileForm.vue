<template>
  <div>
    <b-form id="project-profile-form" @submit="this.onSubmit">
      <span>Select a consultant</span>
      <b-form-select required text="Profile" v-model="projectProfile.profileId">
        <option 
          v-for="profile in this.profiles"
          :key="profile.id"
          :value="profile.id"
        >{{profile.firstName + ' ' + profile.lastName}}
        </option>
      </b-form-select>
      <span>Start date</span>
      <b-input type="date" required v-model="projectProfile.startDate"></b-input>
      <span>End date</span>
      <b-input type="date" v-model="projectProfile.endDate"></b-input>
      <span>Utilization percentage</span>
      <b-input type="number" required min="0" max="100" v-model="projectProfile.workPercentage"></b-input>
      <b-button primary type="submit">Submit</b-button>
    </b-form>
    <div class="profile-form-errors" v-if="showError">
      <div v-for="detail in errorDetails" :key="detail">
          
        </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ProjectProfileForm',
  props: {
    projectId: Number,
    toggleForm: Function
  },
  data () {
    return {
      showError: false,
      errorDetails: [],
      projectProfile: {
        projectId: this.projectId
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
        .then((reponse) => {
          this.$toasted.global.rytmi_success({
            message: 'Profile added to the project!'
          })
          document.getElementById('project-profile-form').reset()
          this.toggleForm()
        })
        .catch((err) => {
          this.errorDetails = err.response.data.error.details
          this.showError = true
        })
    }
  }
}
</script>
<style>
button {
  width: 100%;
  margin-top: 1em;
}

</style>
