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
            <small for="project-role-fi-input">{{ editableProfileProject.profileId === profileId ? `Your role in the project (in Finnish) *` : 'The consultants role in the Project (in Finnish)' }}</small>
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
            <small for="project-role-en-input">{{ editableProfileProject.profileId === profileId ? `Your role in the project (in English) *` : 'The consultants role in the Project (in English)' }}</small>
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
            :name="`profile-project-start-date-${profileProject.id}${isInModal ? '-modal' : ''}`"
            :default-value="projectDates.start"
            :min-value="projectDates.start"
            :max-value="editableProfileProject.endDate || projectDates.end"
            :validator="{ isValid: inputStates.startDate, message: 'Required'}"
            @input-state="childComponentState.startDate = $event"
          />
        </b-col>
        <b-col>
          <small for="profile-project-end-date">End date</small>
          <Datepicker
            id="profile-project-end-date"
            v-model="editableProfileProject.endDate"
            :name="`profile-project-end-date-${profileProject.id}${isInModal ? '-modal' : ''}`"
            :default-value="new Date()"
            :min-value="editableProfileProject.startDate || projectDates.start"
            :max-value="projectDates.end"
            @input-state="childComponentState.endDate = $event"
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
      <b-form-group
        id="profile-project-skill-form"
      >
        <b-row>
          <b-col cols="12">
            <small>Select skills you have worked with while on the project:</small>
          </b-col>
          <b-col cols="12">
            <div
              v-for="skill of projectSkills"
              :key="skill.skillId"
              :class="`skill-item mx-1 my-1 ${isSelectedSkill(skill) ? 'selected' : ''}`"
              @click="editableProfileProject.skills.some(profileProjectSkill => profileProjectSkill.id === skill.id) ? removeSkill(skill) : addSkillToProfileProject(skill)"
            >
              <span>
                {{ (isSelectedSkill(skill) ? '✓ ' : '') + skill.name[currentLanguage] }}
              </span>
            </div>
            <div
              v-if="!projectSkills || projectSkills.length === 0"
              class="text-muted"
            >
              <small>This project doesn't have any skills yet. To add them, edit the project.</small>
            </div>
          </b-col>
        </b-row>
      </b-form-group>
      <b-button
        variant="primary"
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
      validated: false,
      childComponentState: {
        startDate: true,
        endDate: true
      }
    }
  },
  computed: {
    ...mapGetters([
      'profiles',
      'projects',
      'employerByName',
      'currentLanguage',
      'projectById',
      'skillById',
      'profileId'
    ]),
    projectDates () {
      const project = this.projectById(this.profileProject.projectId || this.editableProfileProject.projectId)
      if (project) {
        project.endDate = project.endDate ? project.endDate : new Date('2100-12-31')
      }
      return {
        start: project ? new Date(project.startDate) : null,
        end: project ? new Date(project.endDate) : null
      }
    },
    projectSkills () {
      if (this.profileProject.projectId) {
        return this.projectById(this.profileProject.projectId).skills
      }
      if (this.editableProfileProject.projectId) {
        return this.projectById(this.editableProfileProject.projectId).skills
      }
      return []
    },
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
      const stateArray = [Object.entries(this.childComponentState).map(entry => entry[1])]
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
    isSelectedSkill (skill) {
      return this.editableProfileProject.skills.some(profileProjectSkill => profileProjectSkill.id === skill.id)
    },
    initProfileProject () {
      if (!this.profileProject.id) {
        return {
          ...this.profileProject,
          role: { fi: '', en: '' },
          skills: []
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
        this.editableProfileProject.role = { fi: '', en: '' }
        this.editableProfileProject.skills = []
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
    },
    addSkillToProfileProject (skill) {
      this.editableProfileProject.skills.push(skill)
    },
    removeSkill (skill) {
      this.editableProfileProject.skills = this.editableProfileProject.skills.filter(skillToFilter => skillToFilter.id !== skill.id)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '@/assets/scss/_variables.scss';
  .skill-item {
    float: left;
    padding: 5px 10px;
    border-radius: 10px;
    border: 1px solid $c-light;
  }
  .skill-item.selected {
    background-color: $c-light;
  }
  .skill-item:hover {
    background-color: darken($color:  $c-light, $amount: 15);
    cursor: pointer;
  }
</style>
