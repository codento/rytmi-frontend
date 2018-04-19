<template>
  <div class="animated fadeIn profile-editor">
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
  computed: {
  }
}
</script>

<style scoped />
