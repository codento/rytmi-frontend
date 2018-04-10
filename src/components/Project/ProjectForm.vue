<template>
  <div style="border: 1px solid black; width: 40%; padding: 1em;">
    <h3>Create a new project</h3>
    <b-form @submit="onSubmit" @reset="onReset">
        <input 
          class="form-control"
          placeholder="Project name"
          type="text"
          v-model="project.name"
        />
        <input 
          class="form-control" 
          placeholder="Project desc" 
          type="text"
          v-model="project.description"
        />
        <input 
          class="form-control" 
          placeholder="Project start"
          type="date"
          v-model="project.startDate"
        />
        <input 
          class="form-control" 
          placeholder="Project end"
          type="date"
          v-model="project.endDate"
        />
        <button
          class="form-control"
          type="submit"
        >submit
        </button>
    </b-form>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'ProjectForm',
  data () {
    return {
      project: {}
    }
  },
  methods: {
    ...mapActions([
      'createProject'
    ]),
    onSubmit (evt) {
      evt.preventDefault()
      console.log('submitted')
      this.createProject(this.project)
        .then(err => {
          console.log(err) // Error: "It broke"
        })
    },
    onReset (evt) {
      console.log('reset')
    }
  }
}
</script>
