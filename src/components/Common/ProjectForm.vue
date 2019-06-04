<template>
  <b-form
    :id="formId"
    class="animated fadeIn"
  >
    <b-row v-if="showProjectCode">
      <b-col>
        <small for="project-code-input">Project code</small>
        <b-form-group
          invalid-feedback="Required"
        >
          <b-form-input
            id="project-code-input"
            v-model="editedProject.code"
            placeholder="Project code"
            required
            type="number"
            min="0"
            max="99999"
            :state="inputStates.projectCode"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <small for="project-name-fi-input">Project name (in Finnish)</small>
        <b-form-group
          invalid-feedback="Required"
        >
          <b-form-input
            id="project-name-fi-input"
            v-model="getDescriptionByLanguage('fi').name"
            placeholder="Project name (fi)"
            required
            type="text"
            :state="inputStates.projectNameFi"
          />
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <small for="project-name-en-input">Project name (in English)</small>
        <b-form-group
          invalid-feedback="Required"
        >
          <b-form-input
            id="project-name-en-input"
            v-model="getDescriptionByLanguage('en').name"
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
        <small>Start date</small>
        <Datepicker
          v-model="editedProject.startDate"
          name="project-start-date"
          required
        />
        <small
          v-if="!inputStates.startDate"
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
        />
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
        <small for="project-customer-name-fi-input">Customer name (in Finnish)</small>
        <b-form-group
          invalid-feedback="Required if project is not internal"
        >
          <b-form-input
            id="project-customer-name-fi-input"
            v-model="getDescriptionByLanguage('fi').customerName"
            placeholder="Customer name (fi)"
            required
            type="text"
            :state="inputStates.customerName"
          />
        </b-form-group>
      </b-col>
      <b-col sm="6">
        <small for="project-customer-name-en-input">Customer name (in English)</small>
        <b-form-group
          invalid-feedback="Required if project is not internal"
        >
          <b-form-input
            id="project-customer-name-en-input"
            v-model="getDescriptionByLanguage('en').customerName"
            placeholder="Customer name (en)"
            required
            type="text"
            :state="inputStates.customerName"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <small for="project-description-fi-input">Description (in Finnish)</small>
        <b-textarea
          id="project-description-fi-input"
          v-model="getDescriptionByLanguage('fi').description"
          class="form-control"
          placeholder="Project description (fi)"
          type="text"
          rows="5"
        />
      </b-col>
      <b-col sm="6">
        <small for="project-description-en-input">Description (in English)</small>
        <b-textarea
          id="project-description-en-input"
          v-model="getDescriptionByLanguage('en').description"
          class="form-control"
          placeholder="Project description (en)"
          type="text"
          rows="5"
        />
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
    <b-row>
      <b-col>
        <b-button
          id="submit-edited-project"
          class="form-control"
          type="submit"
          primary
          :disabled="!formIsValid"
          @click.prevent="onSubmit()"
        >
          {{ isNewProject ? 'Create a new project' : 'Update project' }}
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
    }
  },
  data () {
    return {
      editedProject: {
        id: !this.isNewProject ? this.project.id : null,
        code: !this.isNewProject ? this.project.code : null,
        startDate: !this.isNewProject ? new Date(this.project.startDate) : null,
        endDate: !this.isNewProject && this.project.endDate ? new Date(this.project.endDate) : null,
        isSecret: !this.isNewProject ? this.project.isSecret : false,
        isInternal: !this.isNewProject ? this.project.isInternal : false,
        descriptions: !this.isNewProject && this.project.descriptions ? this.project.descriptions : [],
        employerId: this.employerId
      },
      selectedEmployer: !this.isNewProject ? this.project.employerId : null
    }
  },
  computed: {
    ...mapGetters(['employers']),
    showProjectCode () {
      const employerNameInProject = Object.values(this.employers).find(employer => employer.id === this.editedProject.employerId).title
      return employerNameInProject === INTERNAL_COMPANY_NAME
    },
    showCustomerName () {
      return !this.editedProject.isInternal
    },
    inputStates () {
      return {
        projectCode: this.editedProject.code !== null,
        startDate: new Date(this.editedProject.startDate) > 1000,
        projectNameFi: this.getDescriptionByLanguage('fi').name.length > 0,
        projectNameEn: this.getDescriptionByLanguage('en').name.length > 0,
        CustomerNameFi: this.getDescriptionByLanguage('fi').customerName.length > 0,
        CustomerNameEn: this.getDescriptionByLanguage('en').customerName.length > 0
      }
    },
    formIsValid () {
      const stateArray = []
      // Required always
      stateArray.push(this.inputStates.startDate, this.inputStates.projectNameFi, this.inputStates.projectNameEn)
      // Required sometimes
      if (this.inputStates.showProjectCode) {
        stateArray.push(this.inputStates.projectCode)
      }
      if (this.inputStates.showCustomerName) {
        stateArray.push(this.inputStates.CustomerNameFi, this.inputStates.CustomerNameEn)
      }
      return stateArray.every(item => item)
    }
  },
  methods: {
    onSubmit () {
      this.$emit('on-submit', this.editedProject)
    },
    getDescriptionByLanguage (language) {
      if (this.editedProject && this.editedProject.descriptions) {
        const paramsWithTranslations = this.editedProject.descriptions.find(description => description.language === language)
        if (!paramsWithTranslations) {
          this.editedProject.descriptions.push(
            {
              name: '',
              customerName: '',
              description: '',
              language: language
            }
          )
        }
        return this.editedProject.descriptions.find(description => description.language === language)
      }
      return {
        name: '',
        customerName: '',
        description: ''
      }
    }
  }
}
</script>
