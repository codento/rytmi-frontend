<template>
  <div>
    <b-form
      id="project_form"
      class="animated fadeIn"
      @submit="onSubmit"
    >
      <b-row>
        <b-col>
          <small>Employer</small>
          <v-select
            v-if="employers"
            id="employer-select"
            :value="selectedEmployer"
            :options="employerList"
            @input="employerSelected"
            label="name"
          />
        </b-col>
      </b-row>
      <b-row v-if="shouldShowCode()">
        <b-col>
          <small>Project code</small>
          <b-input
            v-model="project.code"
            placeholder="Project code"
            required
            type="number"
            min="0"
            max="99999"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <small>Project name (Finnish)</small>
          <b-input
            v-model="getDescriptionByLanguage('fi').name"
            placeholder="Project name (fi)"
            required
            type="text"
          />
        </b-col>
        <b-col sm="6">
          <small>Project name (English)</small>
          <b-input
            v-model="getDescriptionByLanguage('en').name"
            placeholder="Project name (en)"
            required
            type="text"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <small>Start date</small>
          <datepicker
            v-model="project.startDate"
            name="project-start-date"
            required
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <small>End date</small>
          <datepicker
            v-model="project.endDate"
            name="project-end-date"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-2 mb-2">
          <b-form-checkbox
            v-model="project.isInternal"
          >
            Internal project, not done for a customer
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row v-if="shouldShowCustomerName()">
        <b-col sm="6">
          <small>Customer name (Finnish)</small>
          <b-input
            v-model="getDescriptionByLanguage('fi').customerName"
            placeholder="Customer name (fi)"
            type="text"
          />
        </b-col>
        <b-col sm="6">
          <small>Customer name (English)</small>
          <b-input
            v-model="getDescriptionByLanguage('en').customerName"
            placeholder="Customer name (en)"
            type="text"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <small>Description (Finnish)</small>
          <b-textarea
            v-model="getDescriptionByLanguage('fi').description"
            class="form-control"
            placeholder="Project description (fi)"
            type="text"
            rows="5"
          />
        </b-col>
        <b-col sm="6">
          <small>Description (English)</small>
          <b-textarea
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
            v-model="project.isSecret"
          >
            This is a secret project
          </b-form-checkbox>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button
            id="submit-project"
            class="form-control"
            type="submit"
            primary
          >
            {{ shouldUpdateProject() ? 'Update project' : 'Create a new project' }}
          </b-button>
        </b-col>
      </b-row>
    </b-form>
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
import { mapActions, mapGetters } from 'vuex'
import ApiErrorDetailsPanel from '../helpers/ApiErrorDetailsPanel.vue'
import Datepicker from '../helpers/Datepicker'
import vSelect from 'vue-select'
import sortBy from 'lodash/sortBy'
import constants from '@/utils/constants'
const { INTERNAL_COMPANY_NAME } = constants

export default {
  name: 'ProjectForm',
  components: {
    Datepicker,
    ApiErrorDetailsPanel,
    vSelect
  },
  props: {
    editableProject: Object,
    createProfileProjectAfterProjectCreation: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showError: false,
      errorDetails: [],
      project: {},
      selectedEmployer: null
    }
  },
  computed: {
    ...mapGetters(['employers']),
    employerList () {
      return sortBy(Object.values(this.employers), ['name'])
    }
  },
  mounted () {
    this.setProject()
  },
  watch: {
    editableProject: function () {
      this.setProject()
    }
  },
  methods: {
    ...mapActions([
      'createProject',
      'updateProject'
    ]),
    shouldShowCode () {
      const selectedEmployer = this.employerList.find(employer => employer.id === this.project.employerId)
      return this.project && this.employerList && selectedEmployer && selectedEmployer.name === INTERNAL_COMPANY_NAME
    },
    shouldShowCustomerName () {
      return this.project && !this.project.isInternal
    },
    employerSelected (selectedValue) {
      this.project.employerId = selectedValue.id
    },
    setProject () {
      this.project = {
        id: this.editableProject && this.editableProject.id ? this.editableProject.id : null,
        code: this.editableProject && this.editableProject.code ? this.editableProject.code : null,
        startDate: this.editableProject && this.editableProject.startDate ? new Date(this.editableProject.startDate) : null,
        endDate: this.editableProject && this.editableProject.endDate ? new Date(this.editableProject.endDate) : null,
        isSecret: this.editableProject && this.editableProject.isSecret ? this.editableProject.isSecret : false,
        isInternal: this.editableProject && this.editableProject.isInternal ? this.editableProject.isInternal : false,
        descriptions: this.editableProject && this.editableProject.descriptions ? this.editableProject.descriptions : [],
        employerId: this.editableProject && this.editableProject.employerId ? this.editableProject.employerId : null
      }

      this.selectedEmployer =
        this.project && this.project.employerId
          ? this.employerList.find(employer => employer.id === this.project.employerId)
          : null
    },
    shouldUpdateProject () {
      return this.project.id ? true : false
    },
    onSubmit (evt) {
      evt.preventDefault()
      this.errorDetails = []

      if (this.project.isInternal) {
        this.project.descriptions.forEach(description => description.customerName = '')
      }

      // If the project has an ID, update; otherwise create a new project
      if (this.shouldUpdateProject()) {
        this.updateProject(this.project)
          .then((data) => {
            this.$toasted.global.rytmi_success({
              message: 'Project updated!'
            })
            this.showError = false
          })
          .catch(err => {
            this.errorDetails = err.response.data.error.details
            this.showError = true
          })
      } else {
        this.createProject(this.project)
          .then((data) => {
            this.$toasted.global.rytmi_success({
              message: 'Project added!'
            })
            document.getElementById('project_form').reset()
            this.showError = false
            if(this.createProfileProjectAfterProjectCreation) {
              this.$emit('projectCreated', { project: data.data })
            }
          }).catch(err => {
            if (Array.isArray(err.data.error.details)) {
              this.errorDetails = err.data.error.details
            } else {
              this.errorDetails.push(err.data.error.message)
            }
            this.showError = true
          })
      }
    },
    getDescriptionByLanguage (language) {
      if (this.project && this.project.descriptions) {
        const paramsWithTranslations = this.project.descriptions.find(description => description.language === language)
        if (!paramsWithTranslations) {
          this.project.descriptions.push(
            {
              name: '',
              customerName: '',
              description: '',
              language: language
            }
          )
        }
        return this.project.descriptions.find(description => description.language === language)
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

<style scoped>
#project_form {
  padding: 1em;
}
.project-creation-error {
  color: red;
}
</style>
