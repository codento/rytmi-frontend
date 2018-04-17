<template>
  <div class="animated fadeIn profile-editor">
      <h1>{{project.name}}</h1>
      <p>{{project.description}}</p>
      <p>Start: {{new Date(project.startDate).toLocaleString()}}</p>
      <p>End: {{new Date(project.endDate).toLocaleString()}}</p>
      <h1>Members</h1>
      <div v-for="profile in this.projectProfilesByProjectId(project.id)" :key="profile.id">
        {{this.profileById(profile.id).name}}
      </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {

} from '../components/Project'

export default {
  name: 'Project',
  data: {
    project: {}
  },
  computed: {
    ...mapGetters([
      'projectById',
      'projectProfilesByProjectId',
      'profileById'
    ]),
    ...mapActions([
      'fetchProjectProfiles'
    ]),
    project () {
      return this.projectById(this.$route.params.id)
    }
  },
  mounted () {
    this.$store.dispatch('fetchProjectProfiles', this.project)
  }
}
</script>

<style scoped />