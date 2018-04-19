<template>
  <b-container>
    <h2>Projects</h2>
    <b-input type="text" placeholder="Filter projects (by name or project code)" v-model="projectFilterTerm" />
    <b-table 
      id="project-table"
      striped
      :items="projects" 
      :fields="fields"
      fixed
      @row-clicked="openProject"
    ></b-table>
  </b-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ProjectList',
  data () {
    return {
      projectFilterTerm: '',
      projects: [],
      fields: [
        {
          key: 'code',
          sortable: true
        },
        {
          key: 'name',
          sortable: true
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'projectFilter'
    ])
  },
  watch: {
    projectFilterTerm: function (val) {
      this.projects = this.projectFilter(val)
    }
  },
  methods: {
    openProject (project) {
      this.$router.push({name: 'Project', params: { id: project.id }})
    }
  },
  mounted () {
    this.projects = this.projectFilter('')
  }
}
</script>