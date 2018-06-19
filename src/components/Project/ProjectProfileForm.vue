<template>
  <div>
    <b-form id="project-profile-form" @submit="this.onSubmit">

      <b-form-group v-show="profileVisible"
        id="consultantLabel"
        label="Consultant:"
        label-for="consultant">
        <b-form-select
          id="consultant"
          v-model="profileProject.profileId" 
          value-field="id"
          text-field="name"
          :disabled="!profileVisible"
          required  
        >
          <template slot="first">
            <option :value="null" disabled>-- Select Consultant --</option>
          </template>
          <option 
            v-for="profile in this.profiles"
            :key="profile.id"
            :value="profile.id"
          >{{profile.firstName + ' ' + profile.lastName}}
          </option>
        </b-form-select>
      </b-form-group>

      <b-form-group v-show="projectVisible"
        id="ProjectLabel"
        label="Project:"
        label-for="project">
        <b-form-select
          id="project"
          v-model="profileProject.projectId" 
          value-field="id"
          text-field="name"
          :disabled="!projectVisible"
          required
        >
          <template slot="first">
            <option :value="null" disabled>-- Select Project --</option>
          </template>
          <option 
            v-for="project in this.projects"
            :key="project.id"
            :value="project.id"
          >{{ project.id }} - {{ project.name }}
          </option>
        </b-form-select>
      </b-form-group>

      <span>Start date</span>
      <b-input type="date" required v-model="profileProject.startDate"></b-input>

      <span>End date</span>
      <b-input type="date" v-model="profileProject.endDate"></b-input>

      <span>Utilization percentage</span>
      <b-input type="number" required min="0" max="100" v-model="profileProject.workPercentage"></b-input>

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
    projectId: {
      type: Number,
      default: null
    },
    profileId: {
      type: Number,
      default: null
    },
    toggleForm: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      showError: false,
      errorDetails: [],
      profileProject: {
        projectId: this.projectId,
        profileId: this.profileId
      },
      projectVisible: true,
      profileVisible: false
    }
  },
  created () {
    this.projectVisible = this.projectId === null
    this.profileVisible = this.profileId === null
  },
  computed: {
    ...mapGetters([
      'profiles',
      'projects'
    ])
  },
  methods: {
    ...mapActions([
      'addProjectProfile'
    ]),
    onSubmit (evt) {
      evt.preventDefault()
      this.addProjectProfile(this.profileProject)
        .then((reponse) => {
          this.$toasted.global.rytmi_success({
            message: 'Profile added to the project!'
          })
          document.getElementById('project-profile-form').reset()
          if (this.toggleForm !== null) {
            this.toggleForm()
          }
        })
        .catch((err) => {
          this.errorDetails = err.response.data.error.details
          this.showError = true
        })
    }
  }
}
</script>
<style scoped>
button {
  width: 100%;
  margin-top: 1em;
}

</style>
