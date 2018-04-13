<template>
  <b-container>
    <h2>Projects</h2>
    <div v-for='project in projects' class="project-container" :key="project.id" @click="openProject(project)">
      {{project.name}}
    </div>
  </b-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ProjectList',
  computed: {
    ...mapGetters([
      'projects'
    ])
  },
  methods: {
    openProject (project) {
      this.$router.replace({name: 'Project', params: { id: project.id }})
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