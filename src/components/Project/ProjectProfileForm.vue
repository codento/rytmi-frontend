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
        id="consultantLabel"
        label="Consultant"
        label-for="consultant"
      >
        <b-form-select
          id="consultant"
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
            v-for="project in projects"
            :key="project.id"
            :value="project.id"
          >
            {{ project.code }} {{ project.code ? '-' : '' }} {{ getProjectName(project) }}
          </option>
        </b-form-select>
      </b-form-group>

      <b-row>
        <b-col>
          <span>Role (in Finnish)</span>
          <b-input
            v-model="descriptionFi.title"
            type="text"
            required
          />
        </b-col>
        <b-col>
          <span>Role (in English)</span>
          <b-input
            v-model="descriptionEn.title"
            type="text"
            required
          />
        </b-col>
      </b-row>

      <span>Start date</span>
      <Datepicker
        v-model="editableProfileProject.startDate"
        name="profile-project-start-date"
      />
      <span>End date</span>
      <Datepicker
        v-model="editableProfileProject.endDate"
        name="profile-project-end-date"
      />
      <span>Utilization percentage</span>
      <b-input
        v-model="editableProfileProject.workPercentage"
        name="utilization"
        type="number"
        required
        min="0"
        max="100"
      />

      <b-button
        primary
        name="submit"
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
import cloneDeep from 'lodash/cloneDeep'

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
    }
  },
  data () {
    return {
      show: true,
      showError: false,
      errorDetails: [],
      projectVisible: true,
      profileVisible: false,
      editableProfileProject: this.getEditableProfileProject()
    }
  },
  computed: {
    ...mapGetters([
      'profiles',
      'projects',
      'currentLanguage'
    ]),
    descriptionFi () {
      return this.getProfileProjectDescriptionByLanguage('fi')
    },
    descriptionEn () {
      return this.getProfileProjectDescriptionByLanguage('en')
    },
  },
  created () {
    this.projectVisible = this.profileProject.projectId ? false : true
    this.profileVisible = this.profileProject.profileId ? false : true
  },
  methods: {
    ...mapActions([
      'newProjectProfile',
      'updateProfileProject'
    ]),
    getEditableProfileProject () {
      if (!this.profileProject.id) {
        return {
          ...this.profileProject,
          descriptions: this.descriptions ? this.descriptions : this.getEmptyDescriptions()
        }
      }
      return cloneDeep(this.profileProject)
    },
    getProjectName (project) {
      const description = project.descriptions.find(description => description.language === this.currentLanguage)
      return description ? description.name : ''
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
        this.editableProfileProject.profileId = this.profileId
        this.editableProfileProject.descriptions = this.getEmptyDescriptions()
      } else {
        this.redirect()
      }
    },
    redirect () {
      if (this.profileId) {
        this.$router.push('/profile/' + this.profileId)
      } else if (this.projectId) {
        this.$router.push('/projects/' + this.projectId)
      }
    },
    getEmptyDescriptions () {
      return [
        {
          language: 'fi',
          title: ''
        },
        {
          language: 'en',
          title: ''
        }
      ]
    },
    getProfileProjectDescriptionByLanguage (language) {
      return this.editableProfileProject.descriptions.find(description => description.language === language)
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
