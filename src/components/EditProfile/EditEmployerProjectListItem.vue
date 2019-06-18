<template>
  <div>
    <h3 v-if="modalHeader">
      {{ modalHeader }}
    </h3>
    <h3 v-else>
      {{ isNewProject ? 'Add a new project' : 'Edit project' }}
    </h3>
    <ProjectForm
      :form-id="formId"
      :project="editableProject"
      :is-new-project="isNewProject"
      :employer-id="currentEmployerId"
      :custom-form-validation="formIsValid"
      @on-submit="createOrUpdateProject"
      @validate-custom-form="validate"
      @cancel="$emit('close-modal')"
    >
      <template #custom-form>
        <b-row>
          <b-col sm="6">
            <small for="project-role-fi-input">Your role in the project (in Finnish) *</small>
            <b-form-group
              invalid-feedback="Required"
            >
              <b-form-input
                id="project-role-fi-input"
                v-model="editedProfileProject.role.fi"
                placeholder="esim. front-end kehittäjä, ohjelmistoarkkitehti"
                type="text"
                :state="inputStates.roleFi"
              />
            </b-form-group>
          </b-col>
          <b-col sm="6">
            <small for="project-role-en-input">Your role in the project (in English) *</small>
            <b-form-group
              invalid-feedback="Required"
            >
              <b-form-input
                id="project-role-en-input"
                v-model="editedProfileProject.role.en"
                placeholder="e.g. front-end developer, database admin, architect"
                type="text"
                :state="inputStates.roleEn"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row v-if="!isNewProject">
          <b-col>
            <CollapsableItem title="Project's related skills">
              <ProjectSkillForm :project-id="editableProject.id" />
            </CollapsableItem>
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
import { cloneDeep } from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import ApiErrorDetailsPanel from '@/components/helpers/ApiErrorDetailsPanel.vue'
import { ProjectForm, CollapsableItem } from '@/components/Common'
import { ProjectSkillForm } from '@/components/Project'

export default {
  name: 'EditEmployerProjectListItem',
  components: {
    ProjectForm,
    ApiErrorDetailsPanel,
    ProjectSkillForm,
    CollapsableItem
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
    },
    modalHeader: String
  },
  data () {
    return {
      showError: false,
      errorDetails: [],
      formId: 'work-history-project-form',
      editedProfileProject: cloneDeep(this.profileProject),
      validated: false
    }
  },
  computed: {
    ...mapGetters(['employers']),
    isNewProject () {
      return this.editableProject.id === null
    },
    formIsValid () {
      return this.inputStates.roleFi && this.inputStates.roleEn
    },
    inputStates () {
      return {
        roleFi: this.validated ? this.editedProfileProject.role.fi.length > 0 : undefined,
        roleEn: this.validated ? this.editedProfileProject.role.en.length > 0 : undefined
      }
    }
  },
  methods: {
    ...mapActions([
      'createProject',
      'updateProject',
      'newProjectProfile',
      'updateProfileProject'
    ]),
    validate () {
      this.validated = true
    },
    async createOrUpdateProject (project) {
      const editedProject = cloneDeep(project)
      this.errorDetails = []

      if (project.isInternal) {
        editedProject.customerName = {
          fi: '',
          en: ''
        }
      }
      try {
        let response
        if (this.isNewProject) {
          response = await this.createProject(editedProject)
        } else {
          await this.updateProject(editedProject)
        }
        this.createOrUpdateProfileProject(editedProject.id ? editedProject : response.data)
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
    async createOrUpdateProfileProject (relatedProject) {
      const profileProject = {
        id: this.profileProject.id,
        profileId: this.profileProject.profileId,
        projectId: relatedProject.id,
        workPercentage: 100,
        startDate: relatedProject.startDate,
        endDate: relatedProject.endDate,
        role: {
          fi: this.editedProfileProject.role.fi,
          en: this.editedProfileProject.role.en
        }
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
