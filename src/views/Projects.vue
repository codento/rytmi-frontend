<template>
  <div class="animated fadeIn col-sm-12 col-md-8 project-list-container">
      <ProjectForm />
      <ProjectList />
  </div>
</template>

<script>
import {
  ProjectForm,
  ProjectList
} from '../components/Project'

export default {
  name: 'Projects',
  components: {
    ProjectForm,
    ProjectList
  },
  mounted () {
    document.title = 'Rytmi - Project List'
  }
}
</script>

<style scoped >
.project-list-container {
  margin: 0 auto;
  padding: 1em 0;
}
</style>
