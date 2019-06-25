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
        <small for="project-select">Consultant *</small>
        <b-form-select
          id="consultant-select"
          v-model="editableProfileProject.profileId"
          :disabled="!profileVisible"
          value-field="id"
          text-field="name"
          :state="inputStates.profileId"
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
        <small
          v-if="!inputStates.profileId && inputStates.profileId !== undefined"
          class="text-danger"
        >
          Required
        </small>
      </b-form-group>

      <b-form-group
        v-show="projectVisible"
        id="projectSelectFormGroup"
      >
        <small for="project-select">Project *</small>
        <b-form-select
          id="project-select"
          v-model="editableProfileProject.projectId"
          :disabled="!projectVisible"
          value-field="id"
          text-field="name"
          :state="inputStates.projectId"
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
        <small
          v-if="!inputStates.projectId && inputStates.projectId !== undefined"
          class="text-danger"
        >
          Required
        </small>
      </b-form-group>

      <b-row>
        <b-col>
          <b-form-group invalid-feedback="Required">
            <small for="project-role-fi-input">Your role in the project (in Finnish) *</small>
            <b-input
              id="project-role-fi-input"
              v-model="editableProfileProject.role.fi"
              placeholder="esim. front-end kehittäjä, ohjelmistoarkkitehti"
              type="text"
              :state="inputStates.projectRoleFi"
            />
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group invalid-feedback="Required">
            <small for="project-role-en-input">Your role in the project (in English) *</small>
            <b-input
              id="project-role-en-input"
              v-model="editableProfileProject.role.en"
              placeholder="e.g. front-end developer, database admin"
              type="text"
              :state="inputStates.projectRoleEn"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <small for="profile-project-start-date">Start date *</small>
          <Datepicker
            id="profile-project-start-date"
            v-model="editableProfileProject.startDate"
            :name="`profile-project-start-date${isInModal ? '-modal' : ''}`"
            :is-valid="inputStates.startDate"
          />
          <small
            v-if="!inputStates.startDate && inputStates.startDate !== undefined"
            class="text-danger"
          >
            Required
          </small>
        </b-col>
        <b-col>
          <small for="profile-project-end-date">End date</small>
          <Datepicker
            id="profile-project-end-date"
            v-model="editableProfileProject.endDate"
            :name="`profile-project-end-date${isInModal ? '-modal' : ''}`"
          />
        </b-col>
      </b-row>
      <b-form-group
        :invalid-feedback="workPercentageState.filter(item => { return item.state !== undefined ? item.state === false : false }).map(item => item.feedback).join('\n')"
      >
        <small for="utilization-input">Utilization percentage *</small>
        <b-input
          id="utilization-input"
          v-model="editableProfileProject.workPercentage"
          name="utilization"
          type="number"
          :state="isWorkPercentageValid"
        />
      </b-form-group>
      <b-button
        variant="primary"
        block
        name="submit"
        class="mt-2"
        type="submit"
      >
        {{ submitButtonText }}
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
    hideProjectSelect: {
      type: Boolean,
      default: false
    },
    hideProfileSelect: {
      type: Boolean,
      default: false
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
      editableProfileProject: this.initProfileProject(),
      validated: false
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
    },
    isWorkPercentageValid () {
      if (!this.validated) {
        return undefined
      } else {
        return this.workPercentageState.every(item => item.state)
      }
    },
    workPercentageState () {
      return [
        {
          state: !!this.editableProfileProject.workPercentage,
          feedback: 'Required'
        },
        {
          state: this.editableProfileProject.workPercentage ? this.editableProfileProject.workPercentage >= 0 && this.editableProfileProject.workPercentage <= 100 : undefined,
          feedback: 'Utilization percentage must be between 0 and 100'
        }
      ]
    },
    inputStates () {
      return {
        projectId: this.validated ? !!this.editableProfileProject.projectId : undefined,
        profileId: this.validated ? !!this.editableProfileProject.profileId : undefined,
        projectRoleFi: this.validated ? this.editableProfileProject.role.fi.length > 0 : undefined,
        projectRoleEn: this.validated ? this.editableProfileProject.role.en.length > 0 : undefined,
        startDate: this.validated ? new Date(this.editableProfileProject.startDate) > 1 : undefined
      }
    },
    submitButtonText () {
      if (this.profileProject.id) {
        return 'Update'
      }
      if (!this.profileProject.profileId) {
        return 'Add consultant'
      } else {
        return 'Join project'
      }
    },
    formIsValid () {
      const stateArray = []
      for (let entry of Object.entries(this.inputStates)) {
        stateArray.push(entry[1])
      }
      Array.prototype.push.apply(stateArray, this.workPercentageState.map(item => item.state))
      return stateArray.every(item => item)
    }
  },
  created () {
    this.projectVisible = !this.profileProject.projectId && !this.hideProjectSelect
    this.profileVisible = !this.profileProject.profileId && !this.hideProfileSelect
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
          role: { fi: '', en: '' }
        }
      }
      return cloneDeep(this.profileProject)
    },
    async createNewProfileProject (profileProject) {
      try {
        this.newProjectProfile(profileProject)
        this.$toasted.global.rytmi_success({
          message: 'Profile added to the project!'
        })
        this.$emit('profile-project-created-or-updated')
        document.getElementById('project-profile-form').reset()
        if (this.toggleForm !== null) {
          this.toggleForm()
        }
      } catch (error) {
        if (Array.isArray(error.response.data.error.details)) {
          this.errorDetails = error.response.data.error.details
        } else {
          this.errorDetails.push(error.response.data.error.details)
        }
        this.showError = true
      }
    },
    async callProfileProjectUpdate (profileProject) {
      try {
        await this.updateProfileProject(profileProject)
        this.$toasted.global.rytmi_success({
          message: 'Profile in the project updated.'
        })
        this.$emit('profile-project-created-or-updated')
      } catch (error) {
        if (Array.isArray(error.response.data.error.details)) {
          this.errorDetails = error.response.data.error.details
        } else {
          this.errorDetails.push(error.response.data.error.details)
        }
        this.showError = true
      }
    },
    onSubmit (evt) {
      evt.preventDefault()
      this.validated = true
      if (this.formIsValid) {
        this.validated = false
        this.errorDetails = []
        this.showError = false
        if (this.profileProject.id) {
          this.callProfileProjectUpdate(this.editableProfileProject)
        } else {
          this.createNewProfileProject(this.editableProfileProject)
        }
      }
    },
    onReset (evt) {
      evt.preventDefault()
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.showError = false
      this.validated = false
      this.$nextTick(() => { this.show = true })
      if (this.noRedirect) {
        this.editableProfileProject = {}
        this.editableProfileProject.projectId = !this.projectVisible ? this.profileProject.projectId : null
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
