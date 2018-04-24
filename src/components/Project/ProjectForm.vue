<template>
  <div>
      <h3 style="text-align: center">
        {{editableProject ? 'Edit project' : 'Add a new project'}}
        <span @click="showProjectForm = !showProjectForm">
          <i v-if="!showProjectForm" class="fa fa-chevron-down" />
          <i v-else class="fa fa-chevron-up" />
        </span>
      </h3>
      <b-form class="animated fadeIn" v-if="showProjectForm" id="project_form" @submit="onSubmit">
          <small>Project code</small>
          <b-input
            placeholder="Project code"
            required
            type="number"
            min="0"
            max="99999"
            v-model="project.code"
          />
          <small>Project name</small>
          <b-input 
            placeholder="Project name"
            required
            type="text"
            v-model="project.name"
          />
          <small>Start date</small>
          <b-input 
            class="form-control" 
            required
            type="date"
            v-model="project.startDate"
          />
          <small>End date</small>
          <b-input 
            class="form-control" 
            type="date"
            v-model="project.endDate"
          />
          <small>Description</small>
          <b-textarea 
            class="form-control" 
            placeholder="Project description" 
            type="text"
            rows="6"
            v-model="project.description"
          />
          <b-button
            class="form-control"
            type="submit"
            primary
          >Submit
          </b-button>
      </b-form>
      <div v-if="showError" class="project-creation-error">
        Creating a project failed because:
        <ApiErrorDetailsPanel :errorDetails="errorDetails" />
      </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import ApiErrorDetailsPanel from '../helpers/ApiErrorDetailsPanel.vue'
export default {
  name: 'ProjectForm',
  data () {
    return {
      showProjectForm: false,
      showError: false,
      errorDetails: [],
      project: {}
    }
  },
  props: {
    editableProject: Object
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
  },
  mounted () {
    if (this.editableProject) {
      this.project = this.editableProject
      this.project.endDate = new Date(this.editableProject.endDate).toISOString().substring(0, 10)
      this.project.startDate = new Date(this.editableProject.startDate).toISOString().substring(0, 10)
    }
  },
  components: {
    ApiErrorDetailsPanel
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
