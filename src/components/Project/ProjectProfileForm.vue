<template>
  <div>
    <b-form
      id="project-profile-form"
      @submit="onSubmit"
      @reset="onReset"
    >
      <b-form-group
        v-show="profileVisible"
        id="consultantLabel"
        label="Consultant:"
        label-for="consultant"
      >
        <b-form-select
          id="consultant"
          v-model="profileProject.profileId"
          :disabled="!profileVisible"
          value-field="id"
          text-field="name"
          required
        >
          <template slot="first">
            <option
              :value="null"
              disabled
            >
              -- Select Consultant --
            </option>
          </template>
          <option
            v-for="profile in profiles"
            :key="profile.id"
            :value="profile.id"
          >
            {{ profile.firstName + ' ' + profile.lastName }}
          </option>
        </b-form-select>
      </b-form-group>

      <b-form-group
        v-show="projectVisible"
        id="ProjectLabel"
        label="Project:"
        label-for="project"
      >
        <b-form-select
          id="project"
          v-model="profileProject.projectId"
          :disabled="!projectVisible"
          value-field="id"
          text-field="name"
          required
        >
          <template slot="first">
            <option
              :value="null"
              disabled
            >
              -- Select Project --
            </option>
          </template>
          <option
            v-for="project in projects"
            :key="project.id"
            :value="project.id"
          >
            {{ project.code }} - {{ getProjectName(project) }}
          </option>
        </b-form-select>
      </b-form-group>

      <span>Start date</span>
      <Datepicker
        v-model="profileProject.startDate"
        name="profile-project-start-date"
      />
      <span>End date</span>
      <Datepicker
        v-model="profileProject.endDate"
        name="profile-project-end-date"
      />
      <span>Utilization percentage</span>
      <b-input
        v-model="profileProject.workPercentage"
        type="number"
        required
        min="0"
        max="100"
      />

      <b-button
        primary
        type="submit"
      >
        Submit
      </b-button>
    </b-form>
    <div
      v-if="showError"
    >
      <b-alert
        show
        variant="warning"
      >
        Adding project failed
        <ApiErrorDetailsPanel :error-details="errorDetails" />
      </b-alert>
    </div>
  </div>
</template>

<script>
import Datepicker from '../helpers/Datepicker'
import { mapGetters, mapActions } from 'vuex'
import ApiErrorDetailsPanel from '@/components/helpers/ApiErrorDetailsPanel'

export default {
  name: 'ProjectProfileForm',
  components: { ApiErrorDetailsPanel, Datepicker },
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
      show: true,
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
  computed: {
    ...mapGetters([
      'profiles',
      'projects',
      'currentLanguage'
    ])
  },
  created () {
    this.projectVisible = this.projectId === null
    this.profileVisible = this.profileId === null
  },
  methods: {
    ...mapActions(['newProjectProfile']),
    getProjectName (project) {
      const description = project.descriptions.find(description => description.language === this.currentLanguage)
      return description ? description.name : ''
    },
    onSubmit (evt) {
      evt.preventDefault()
      this.errorDetails = []
      this.showError = false
      this.newProjectProfile(this.profileProject)
        .then((response) => {
          this.$toasted.global.rytmi_success({
            message: 'Profile added to the project!'
          })
          document.getElementById('project-profile-form').reset()
          if (this.toggleForm !== null) {
            this.toggleForm()
          }
        })
        .catch((err) => {
          if (Array.isArray(err.response.data.error.details)) {
            this.errorDetails = err.response.data.error.details
          } else {
            this.errorDetails.push(err.response.data.error.details)
          }
          this.showError = true
        })
    },
    onReset (evt) {
      evt.preventDefault()
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.showError = false
      this.$nextTick(() => { this.show = true })
      this.redirect()
    },
    redirect () {
      this.$router.push('/profile/' + this.profile.id)
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
