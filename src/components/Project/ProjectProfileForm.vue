<template>
  <div>
    <b-form
      id="project-profile-form"
      class="mx-2 my-2"
      @submit="onSubmit"
      @reset="onReset"
    >
      <b-form-group
        v-show="profileVisible"
        id="consultantSelectFormGroup"
      >
        <small for="project-select">Consultant</small>
        <b-form-select
          id="consultant-select"
          v-model="editableProfileProject.profileId"
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
            :key="'profile-' + profile.id"
            :value="profile.id"
          >
            {{ profile.firstName + ' ' + profile.lastName }}
          </option>
        </b-form-select>
      </b-form-group>

      <b-form-group
        v-show="projectVisible"
        id="projectSelectFormGroup"
      >
        <small for="project-select">Project</small>
        <b-form-select
          id="project-select"
          v-model="editableProfileProject.projectId"
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
            v-for="project in filteredProjects"
            :key="'project-' + project.id"
            :value="project.id"
          >
            {{ project.code }} {{ project.code ? '-' : '' }} {{ project.name[currentLanguage] }}
          </option>
        </b-form-select>
      </b-form-group>

      <b-row>
        <b-col>
          <small for="project-role-fi-input">Your role in the project (in Finnish)</small>
          <b-input
            id="project-role-fi-input"
            v-model="editableProfileProject.role.fi"
            placeholder="esim. front-end kehittäjä, ohjelmistoarkkitehti"
            type="text"
            required
          />
        </b-col>
        <b-col>
          <small for="project-role-en-input">Your role in the project (in English)</small>
          <b-input
            id="project-role-en-input"
            v-model="editableProfileProject.role.en"
            placeholder="e.g. front-end developer, database admin"
            type="text"
            required
          />
        </b-col>
      </b-row>

      <small for="profile-project-start-date">Start date</small>
      <Datepicker
        id="profile-project-start-date"
        v-model="editableProfileProject.startDate"
        :name="`profile-project-start-date${isInModal ? '-modal' : ''}`"
      />
      <small for="profile-project-end-date">End date</small>
      <Datepicker
        id="profile-project-end-date"
        v-model="editableProfileProject.endDate"
        :name="`profile-project-end-date${isInModal ? '-modal' : ''}`"
      />
      <small for="utilization-input">Utilization percentage</small>
      <b-input
        id="utilization-input"
        v-model="editableProfileProject.workPercentage"
        name="utilization"
        type="number"
        required
        min="0"
        max="100"
      />

      <b-button
        variant="primary"
        block
        name="submit"
        class="mt-2"
        type="submit"
      >
        {{ profileVisible ? 'Add consultant' : 'Join project' }}
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
import cloneDeep from 'lodash/cloneDeep'
import { INTERNAL_COMPANY_NAME } from '@/utils/constants'

export default {
  name: 'ProjectProfileForm',
  components: { ApiErrorDetailsPanel, Datepicker },
  props: {
    profileProject: {
      type: Object
    },
    toggleForm: {
      type: Function,
      default: null
    },
    noRedirect: {
      type: Boolean,
      default: false
    },
    isInModal: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: true,
      showError: false,
      errorDetails: [],
      projectVisible: true,
      profileVisible: false,
      editableProfileProject: this.initProfileProject()
    }
  },
  computed: {
    ...mapGetters([
      'profiles',
      'projects',
      'employerByName',
      'currentLanguage'
    ]),
    filteredProjects () {
      const projectList = Object.keys(this.projects).map(key => this.projects[key])
      return projectList.filter(project => {
        return project.employerId === this.employerByName(INTERNAL_COMPANY_NAME).id
      })
    }
  },
  created () {
    this.projectVisible = !this.profileProject.projectId
    this.profileVisible = !this.profileProject.profileId
  },
  methods: {
    ...mapActions([
      'newProjectProfile',
      'updateProfileProject'
    ]),
    initProfileProject () {
      if (!this.profileProject.id) {
        return {
          ...this.profileProject,
          role: {}
        }
      }
      return cloneDeep(this.profileProject)
    },
    createNewProfileProject (profileProject) {
      this.newProjectProfile(profileProject)
        .then((response) => {
          this.$toasted.global.rytmi_success({
            message: 'Profile added to the project!'
          })
          this.$emit('profileProjectCreatedOrUpdated')
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
    callProfileProjectUpdate (profileProject) {
      this.updateProfileProject(profileProject)
        .then((response) => {
          this.$toasted.global.rytmi_success({
            message: 'Profile in the project updated.'
          })
          this.$emit('profileProjectCreatedOrUpdated')
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
    onSubmit (evt) {
      evt.preventDefault()
      this.errorDetails = []
      this.showError = false
      if (this.profileProject.id) {
        this.callProfileProjectUpdate(this.editableProfileProject)
      } else {
        this.createNewProfileProject(this.editableProfileProject)
      }
    },
    onReset (evt) {
      evt.preventDefault()
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.showError = false
      this.$nextTick(() => { this.show = true })
      if (this.noRedirect) {
        this.editableProfileProject = {}
        this.editableProfileProject.projectId = null
        this.editableProfileProject.profileId = this.profileProject.profileId
        this.editableProfileProject.role = {}
      } else {
        this.redirect()
      }
    },
    redirect () {
      if (this.profileProject.profileId) {
        this.$router.push('/profile/' + this.profileProject.profileId)
      } else if (this.profileProject.projectId) {
        this.$router.push('/projects/' + this.profileProject.projectId)
      }
    }
  }
}
</script>
