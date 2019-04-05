<template>
  <b-container>
    <h2>Projects</h2>
    <b-input
      v-model="projectFilterTerm"
      type="text"
      placeholder="Filter projects (by name or project code)"
    />
    <b-table
      id="project-table"
      :items="results"
      :fields="fields"
      striped
      fixed
      @row-clicked="openProject"
    />
  </b-container>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProjectList',
  data () {
    return {
      projectFilterTerm: '',
      fields: [
        {
          key: 'code',
          sortable: true,
          tdClass: 'clickable'
        },
        {
          key: 'name',
          sortable: true,
          tdClass: 'clickable'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'projectFilter',
      'projectById'
    ]),
    results () {
      const projects = this.projectFilter(this.projectFilterTerm)
      return Object.keys(projects).map(projectId => this.projectById(projectId))
    }
  },
  methods: {
    openProject (project) {
      this.$router.push({ name: 'Project', params: { id: project.id } })
    }
  }
}
</script>
<style scoped>
.clickable {
  cursor: pointer;
}
</style>
