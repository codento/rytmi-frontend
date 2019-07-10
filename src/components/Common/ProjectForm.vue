<template>
  <b-form
    :id="formId"
    class="animated fadeIn"
  >
    <b-row v-if="showProjectCode">
      <b-col>
        <small for="project-code-input">Project code *</small>
        <b-form-group
          :invalid-feedback="projectCodeState.filter(item => { return item.state !== undefined ? item.state === false : false }).map(item => item.feedback).join('\n')"
        >
          <b-form-input
            id="project-code-input"
            v-model="editedProject.code"
            placeholder="Project code"
            required
            type="number"
            min="0"
            max="99999"
            :state="isProjectCodeValid"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <small for="project-name-fi-input">Project name (in Finnish) *</small>
        <b-form-group
          invalid-feedback="Required"
        >
          <b-form-input
            id="project-name-fi-input"
            v-model="editedProject.name.fi"
            placeholder="Project name (fi)"
            required
            type="text"
            :state="inputStates.projectNameFi"
          />
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <small for="project-name-en-input">Project name (in English) *</small>
        <b-form-group
          invalid-feedback="Required"
        >
          <b-form-input
            id="project-name-en-input"
            v-model="editedProject.name.en"
            placeholder="Project name (en)"
            required
            type="text"
            :state="inputStates.projectNameEn"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <small>Start date *</small>
        <Datepicker
          v-model="editedProject.startDate"
          name="project-start-date"
          required
          :is-valid="inputStates.startDate"
        />
        <small
          v-if="!inputStates.startDate && inputStates.startDate !== undefined"
          class="text-danger"
        >
          Required
        </small>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <small>End date</small>
        <Datepicker
          v-model="editedProject.endDate"
          name="project-end-date"
          :is-valid="inputStates.endDate"
        />
        <small
          v-if="!inputStates.endDate && inputStates.endDate !== undefined"
          class="text-danger"
        >
          End date can't be before start date
        </small>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="mt-2 mb-2">
        <b-form-checkbox
          v-model="editedProject.isInternal"
        >
          Internal project, not done for a customer
        </b-form-checkbox>
      </b-col>
    </b-row>
    <b-row v-if="showCustomerName">
      <b-col sm="6">
        <small for="project-customer-name-fi-input">Customer name (in Finnish) *</small>
        <b-form-group
          invalid-feedback="Required if project is not internal"
        >
          <b-form-input
            id="project-customer-name-fi-input"
            v-model="editedProject.customerName.fi"
            placeholder="Customer name (fi)"
            required
            type="text"
            :state="inputStates.customerNameFi"
          />
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <small for="project-customer-name-en-input">Customer name (in English) *</small>
        <b-form-group
          invalid-feedback="Required if project is not internal"
        >
          <b-form-input
            id="project-customer-name-en-input"
            v-model="editedProject.customerName.en"
            placeholder="Customer name (en)"
            required
            type="text"
            :state="inputStates.customerNameEn"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-form-group invalid-feedback="Required">
          <small for="project-description-fi-input">Description (in Finnish) *</small>
          <b-textarea
            id="project-description-fi-input"
            v-model="editedProject.description.fi"
            placeholder="Kuvaile projektia ja mitä teit siinä"
            type="text"
            rows="5"
            :state="inputStates.projectDescriptionFi"
          />
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <b-form-group invalid-feedback="Required">
          <small for="project-description-en-input">Description (in English) *</small>
          <b-textarea
            id="project-description-en-input"
            v-model="editedProject.description.en"
            placeholder="Describe the project and what you did in it."
            type="text"
            rows="5"
            :state="inputStates.projectDescriptionEn"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="mt-2 mb-2">
        <b-form-checkbox
          v-model="editedProject.isSecret"
        >
          This is a secret project
        </b-form-checkbox>
      </b-col>
    </b-row>
    <slot name="custom-form" />
    <b-row class="mt-4 pull-right">
      <b-col>
        <b-button
          id="submit-project-edits-btn"
          class="mr-2"
          type="submit"
          @click.prevent="onSubmit()"
        >
          {{ isNewProject ? 'Create a new project' : 'Update project' }}
        </b-button>
        <b-button
          v-show="showCancel"
          id="cancel-project-edits-btn"
          type="button"
          variant="light"
          @click.prevent="$emit('cancel')"
        >
          Cancel
        </b-button>
      </b-col>
    </b-row>
  </b-form>
</template>
<script>
import { mapGetters } from 'vuex'
import Datepicker from '@/components/helpers/Datepicker'
import { INTERNAL_COMPANY_NAME } from '@/utils/constants'

export default {
  name: 'ProjectForm',
  components: {
    Datepicker
  },
  props: {
    project: Object,
    formId: {
      type: String,
      default: 'project-form'
    },
    isNewProject: {
      type: Boolean,
      default: false
    },
    employerId: {
      type: Number,
      required: true
    },
    customFormValidation: {
      type: Boolean,
      default: true
    },
    showCancel: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      editedProject: this.initProject(),
      validated: false
    }
  },
  computed: {
    ...mapGetters([
      'employerByName',
      'projects'
    ]),
    internalCompanyId () {
      return this.employerByName(INTERNAL_COMPANY_NAME).id
    },
    existingProjectCodes () {
      const projectCodes = Object.values(this.projects).filter(project => project.employerId === this.internalCompanyId).map(project => project.code)
      return this.isNewProject ? projectCodes : projectCodes.filter(projectCode => projectCode !== this.project.code)
    },
    showProjectCode () {
      return this.employerId === this.internalCompanyId
    },
    showCustomerName () {
      return !this.editedProject.isInternal
    },
    isProjectCodeValid () {
      if (!this.validated) {
        return undefined
      } else {
        return this.projectCodeState.every(item => item.state)
      }
    },
    projectCodeState () {
      return [
        {
          state: !!this.editedProject.code,
          feedback: 'Required'
        },
        {
          state: this.editedProject.code ? !this.existingProjectCodes.includes(parseInt(this.editedProject.code)) : undefined,
          feedback: 'Project code already exists, code must be unique'
        }
      ]
    },
    inputStates () {
      return {
        startDate: this.validated ? !!this.editedProject.startDate : undefined,
        endDate: this.validated ? !this.editedProject.endDate || this.editedProject.endDate >= this.editedProject.startDate : undefined,
        projectNameFi: this.validated ? this.editedProject.name.fi.length > 0 : undefined,
        projectNameEn: this.validated ? this.editedProject.name.en.length > 0 : undefined,
        customerNameFi: this.validated ? this.editedProject.customerName.fi.length > 0 || this.editedProject.isInternal : undefined,
        customerNameEn: this.validated ? this.editedProject.customerName.en.length > 0 || this.editedProject.isInternal : undefined,
        projectDescriptionFi: this.validated ? this.editedProject.description.fi.length > 0 : undefined,
        projectDescriptionEn: this.validated ? this.editedProject.description.en.length > 0 : undefined
      }
    },
    formIsValid () {
      const stateArray = []
      // Required always
      for (let entry of Object.entries(this.inputStates)) {
        stateArray.push(entry[1])
      }
      // Required sometimes
      if (this.showProjectCode) {
        Array.prototype.push.apply(stateArray, this.projectCodeState.map(item => item.state))
      }
      if (this.showCustomerName) {
        stateArray.push(this.inputStates.customerNameFi, this.inputStates.customerNameEn)
      }
      return stateArray.every(item => item)
    }
  },
  methods: {
    onSubmit () {
      this.$emit('validate-custom-form')
      this.validated = true
      if (this.formIsValid) {
        this.validated = undefined
        this.$emit('on-submit', this.editedProject)
        if (this.isNewProject) {
          this.editedProject = this.initProject()
        }
      }
    },
    initProject () {
      return {
        id: !this.isNewProject ? this.project.id : null,
        code: !this.isNewProject ? this.project.code : null,
        startDate: !this.isNewProject ? new Date(this.project.startDate) : null,
        endDate: !this.isNewProject && this.project.endDate ? new Date(this.project.endDate) : null,
        isSecret: !this.isNewProject ? this.project.isSecret : false,
        isInternal: !this.isNewProject ? this.project.isInternal : false,
        name: !this.isNewProject && this.project.name ? { ...this.project.name } : { fi: '', en: '' },
        description: !this.isNewProject && this.project.description ? { ...this.project.description } : { fi: '', en: '' },
        customerName: !this.isNewProject && this.project.customerName ? { ...this.project.customerName } : { fi: '', en: '' },
        employerId: this.employerId
      }
    }
  }
}
</script>
