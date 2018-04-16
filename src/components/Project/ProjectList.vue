<template>
  <b-container>
    <h2>Projects</h2>
    <b-input type="text" placeholder="Filter projects (by name or project code)" v-model="projectFilterTerm" />
    <div v-for='project in projects' class="project-container" :key="project.id" @click="openProject(project)">
      {{project.name}}
    </div>
  </b-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ProjectList',
  data () {
    return {
      projectFilterTerm: ''
    }
  },
  computed: {
    ...mapGetters([
      'projectFilter'
    ]),
    projects () {
      return this.projectFilter(this.projectFilterTerm)
    }
  },
  methods: {
    openProject (project) {
      this.$router.replace({name: 'Project', params: { id: project.id }})
    },
    filterProjects () {
      return this.projectFilter(this.projectFilterTerm)
    }
  }
}
</script>

<style scoped>
  .project-container {
    padding: 1em;
    border: 1px solid lightgray;
    cursor: pointer;
  }
</style>