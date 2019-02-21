<template>
  <div>
    <b-form
      id="project-profile-form"
      @submit="onSubmit"
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
            {{ project.code }} - {{ project.name }}
          </option>
        </b-form-select>
      </b-form-group>

      <span>Start date</span>
      <b-input
        v-model="profileProject.startDate"
        type="date"
        required
      />

      <span>End date</span>
      <b-input
        v-model="profileProject.endDate"
        type="date"
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
      class="profile-form-errors"
    >
      <div
        v-for="detail in errorDetails"
        :key="detail"
      >
        {{ detail }}
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
  computed: {
    ...mapGetters([
      'profiles',
      'projects'
    ])
  },
  created () {
    this.projectVisible = this.projectId === null
    this.profileVisible = this.profileId === null
  },
  methods: {
    ...mapActions(['newProjectProfile']),
    onSubmit (evt) {
      evt.preventDefault()
      this.newProjectProfile(this.profileProject)
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
