<template>
  <div class="animated fadeIn profile-editor">
      <h1>{{project.name}}</h1>
      <p>{{project.description}}</p>
      <p>Start: {{new Date(project.startDate).toLocaleString()}}</p>
      <p>End: {{new Date(project.endDate).toLocaleString()}}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {

} from '../components/Project'

export default {
  name: 'Project',
  computed: {
    ...mapGetters([
      'projectById'
    ]),
    project () {
      return this.projectById(this.$route.params.id)
    }
  }
}
</script>

<style scoped />