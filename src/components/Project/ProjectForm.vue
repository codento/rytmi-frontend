<template>
  <b-container>
    <b-card>
      <h3>
        Add a new Project
        <span @click="showProjectForm = !showProjectForm" class="project-form-chevron">
          <i v-if="!showProjectForm" class="fa fa-chevron-down" />
          <i v-else class="fa fa-chevron-up" />
        </span>
      </h3>
      <b-form class="animated fadeIn" v-if="showProjectForm" id="project_form" @submit="onSubmit">
          <b-input
            placeholder="Project code"
            required
            type="number"
            min="0"
            max="99999"
            v-model="project.code"
          />
          <b-input 
            placeholder="Project name"
            required
            type="text"
            v-model="project.name"
          />
          <b-input 
            class="form-control" 
            placeholder="Project start date"
            required
            type="text"
            onfocus="(this.type='date')"
            v-model="project.startDate"
          />
          <b-input 
            class="form-control" 
            placeholder="Project end date"
            onfocus="(this.type='date')"
            type="text"
            v-model="project.endDate"
          />
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
    </b-card>
  </b-container>
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
  methods: {
    ...mapActions([
      'createProject'
    ]),
    onSubmit (evt) {
      evt.preventDefault()
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
