<template>
  <div>
    <LoadingSpinner v-if="!isNewProject && !editableProject.id" />
    <ProjectForm
      :form-id="formId"
      :project="editableProject"
      :is-new-project="isNewProject"
      :employer-id="internalCompanyId"
      @on-submit="createOrUpdateProject"
    />
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
import LoadingSpinner from '@/components/helpers/LoadingSpinner'
import { ProjectForm } from '@/components/Common'
import { INTERNAL_COMPANY_NAME } from '@/utils/constants'

export default {
  name: 'ProjectFormWrapper',
  components: {
    ProjectForm,
    LoadingSpinner,
    ApiErrorDetailsPanel
  },
  props: {
    editableProject: Object,
    isNewProject: {
      type: Boolean,
      default: false
    },
    createProfileProjectAfterProjectCreation: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showError: false,
      errorDetails: [],
      formId: 'project-form'
    }
  },
  computed: {
    ...mapGetters(['employerByName']),
    internalCompanyId () {
      return this.employerByName(INTERNAL_COMPANY_NAME).id
    }
  },
  methods: {
    ...mapActions([
      'createProject',
      'updateProject'
    ]),
    async createOrUpdateProject (project) {
      this.errorDetails = []

      if (project.isInternal) {
        project.descriptions.forEach(description => { description.customerName = '' })
      }
      try {
        if (this.isNewProject) {
          await this.createProject(project)
        } else {
          await this.updateProject(project)
        }
        this.$toasted.global.rytmi_success({
          message: this.isNewProject ? 'Project created!' : 'Project updated!'
        })
        this.showError = false
        if (this.isNewProject) {
          document.getElementById(this.formId).reset()
        }
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
