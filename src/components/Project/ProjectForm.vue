<template>
  <div>
    <h3 style="text-align: center">
      {{ editableProject ? 'Edit project' : 'Add a new project' }}
      <span @click="showProjectForm = !showProjectForm">
        <i
          v-if="!showProjectForm"
          class="fa fa-chevron-down"
        />
        <i
          v-else
          class="fa fa-chevron-up"
        />
      </span>
    </h3>
    <b-form
      v-if="showProjectForm"
      id="project_form"
      class="animated fadeIn"
      @submit="onSubmit"
    >
      <small>Project code</small>
      <b-input
        v-model="project.code"
        placeholder="Project code"
        required
        type="number"
        min="0"
        max="99999"
      />
      <small>Project name</small>
      <b-input
        v-model="project.name"
        placeholder="Project name"
        required
        type="text"
      />
      <small>Start date</small>
      <datepicker
        v-model="project.startDate"
        name="project-start-date"
      />
      <small>End date</small>
      <datepicker
        v-model="project.endDate"
        name="project-end-date"
      />
      <small>Description</small>
      <b-textarea
        v-model="project.description"
        class="form-control"
        placeholder="Project description"
        type="text"
        rows="6"
      />
      <b-button
        class="form-control"
        type="submit"
        primary
      >Submit
      </b-button>
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
import { mapActions } from 'vuex'
import ApiErrorDetailsPanel from '../helpers/ApiErrorDetailsPanel.vue'
import Datepicker from '../helpers/Datepicker'
export default {
  name: 'ProjectForm',
  components: {
    Datepicker,
    ApiErrorDetailsPanel
  },
  props: {
    editableProject: Object
  },
  data () {
    return {
      showProjectForm: false,
      showError: false,
      errorDetails: [],
      project: {}
    }
  },
  mounted () {
    if (this.editableProject) {
      this.project = this.editableProject
      this.project.endDate = new Date(this.editableProject.endDate)
      this.project.startDate = new Date(this.editableProject.startDate)
    }
  },
  methods: {
    ...mapActions([
      'createProject',
      'updateProject'
    ]),
    onSubmit (evt) {
      evt.preventDefault()
      // If the project has an ID, update; otherwise create a new project
      if (this.project.id) {
        this.updateProject(this.project)
          .then((data) => {
            this.$toasted.global.rytmi_success({
              message: 'Project updated!'
            })
            this.showError = false
            this.showProjectForm = false
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
            this.showProjectForm = false
          }).catch(err => {
            this.errorDetails = err.response.data.error.details
            this.showError = true
          })
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
.project-form-chevron {
  float: right;
}

</style>
