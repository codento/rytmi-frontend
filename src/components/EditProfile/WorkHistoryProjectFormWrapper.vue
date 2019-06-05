<template>
  <div>
    <h3> {{ isNewProject ? 'Add a new project' : 'Edit project' }} </h3>
    {{ editableProject }}
    <ProjectForm
      :form-id="formId"
      :project="editableProject"
      :is-new-project="isNewProject"
      :employer-id="currentEmployerId"
      :custom-form-validation="formIsValid"
      show-cancel
      @on-submit="createOrUpdateProject"
      @cancel="$emit('close-modal')"
    >
      <template #custom-form>
        <b-row>
          <b-col sm="6">
            <small for="project-role-fi-input">Your role in the project (in Finnish)</small>
            <b-form-group
              invalid-feedback="Required"
            >
              <b-form-input
                id="project-role-fi-input"
                v-model="getRoleByLanguage('fi').title"
                placeholder="e.g. front-end developer, database admin, architect"
                type="text"
                :state="inputStates.roleFi"
              />
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <small for="project-role-en-input">Your role in the project (in English)</small>
            <b-form-group
              invalid-feedback="Required"
            >
              <b-form-input
                id="project-role-en-input"
                v-model="getRoleByLanguage('en').title"
                placeholder="e.g. front-end developer, database admin, architect"
                type="text"
                :state="inputStates.roleEn"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </template>
    </ProjectForm>
    <div
      v-if="showError"
      class="project-creation-error"
    >
      Creating a project failed because:
      <ApiErrorDetailsPanel :error-details="errorDetails" />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import ApiErrorDetailsPanel from '@/components/helpers/ApiErrorDetailsPanel.vue'
import { ProjectForm } from '@/components/Common'

export default {
  name: 'WorkHistoryProjectFormWrapper',
  components: {
    ProjectForm,
    ApiErrorDetailsPanel
  },
  props: {
    editableProject: {
      type: Object,
      required: true
    },
    profileProject: {
      type: Object,
      required: true
    },
    currentEmployerId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      showError: false,
      errorDetails: [],
      formId: 'work-history-project-form',
      descriptions: this.profileProject.descriptions ? this.profileProject.descriptions : []
    }
  },
  computed: {
    ...mapGetters(['employers']),
    isNewProject () {
      return this.editableProject.id === null
    },
    inputStates () {
      return {
        roleFi: this.getRoleByLanguage('fi').title.length > 0,
        roleEn: this.getRoleByLanguage('en').title.length > 0
      }
    },
    formIsValid () {
      return this.inputStates.roleFi && this.inputStates.roleEn
    }
  },
  methods: {
    ...mapActions([
      'createProject',
      'updateProject',
      'newProjectProfile',
      'updateProfileProject'
    ]),
    getRoleByLanguage (language) {
      if (this.profileProject && this.profileProject.descriptions) {
        const paramsWithTranslations = this.profileProject.descriptions.find(description => description.language === language)
        if (!paramsWithTranslations) {
          this.profileProject.descriptions.push(
            {
              title: '',
              language: language
            }
          )
        }
        return this.profileProject.descriptions.find(description => description.language === language)
      }
      return { title: '' }
    },
    async createOrUpdateProject (project) {
      this.errorDetails = []

      if (project.isInternal) {
        project.descriptions.forEach(description => { description.customerName = '' })
      }
      try {
        let response
        if (this.isNewProject) {
          response = await this.createProject(project)
        } else {
          await this.updateProject(project)
        }
        this.createOrUpdateProfileProject(project.id ? project.id : response.data)
      } catch (error) {
        if (Array.isArray(error.data.error.details)) {
          this.errorDetails = error.data.error.details
        } else {
          this.errorDetails.push(error.data.error.message)
        }
        this.$toasted.global.rytmi_error({
          message: this.isNewProject ? `Error creating project: \n ${this.errorDetails}` : `Error updating project: \n ${this.errorDetails}`
        })
        this.showError = true
      }
    },
    async createOrUpdateProfileProject (project) {
      const profileProject = {
        id: this.profileProject.id,
        profileId: this.profileProject.profileId,
        projectId: project.id,
        workPercentage: 100,
        startDate: project.startDate,
        endDate: project.endDate,
        descriptions: this.descriptions
      }
      try {
        if (this.isNewProject) {
          await this.newProjectProfile(profileProject)
        } else {
          await this.updateProfileProject(profileProject)
        }
        this.$toasted.global.rytmi_success({
          message: this.isNewProject ? 'Project created!' : 'Project updated!'
        })
        this.showError = false
        this.$emit('close-modal')
      } catch (error) {
        if (Array.isArray(error.data.error.details)) {
          this.errorDetails = error.data.error.details
        } else {
          this.errorDetails.push(error.data.error.message)
        }
        this.$toasted.global.rytmi_error({
          message: this.isNewProject ? `Error creating project: \n ${this.errorDetails}` : `Error updating project: \n ${this.errorDetails}`
        })
        this.showError = true
      }
    }
  }
}
</script>

<style scoped>
.project-creation-error {
  color: red;
}
</style>
