<template>
  <div class="animated fadeIn profile-editor">
      <h1>{{project.name}}</h1>
      <p>{{project.description}}</p>
      <span>Duration</span>
      <p><DateFormatter :date="project.startDate" /> -> <DateFormatter :date="project.endDate" /></p>
      <h1>Members</h1>
      <div v-if="this.members">
      <b-table 
        :items="this.projectProfilesByProjectId(project.id)"
        :fields="this.fields"
        hover
      >
        <template slot="ProfileId" slot-scope="data">
          {{printMember(data.value)}}
        </template>
        <template slot="startAt" slot-scope="data">
          <DateFormatter :date="data.value" />
        </template>
        <template slot="finishAt" slot-scope="data">
          <DateFormatter :date="data.value" />
        </template>
      </b-table>
      </div>
      <hr />
      <div class="project-profile-form-header">
        <h1 >Add a member
          <span style="float: right">
            <i class="fa fa-chevron-down" @click="toggleProfileForm"/>
          </span>
        </h1>
        <div v-if="profileFormOpen">
          <ProjectProfileForm :projectId="project.id" />
        </div>
      </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  ProjectProfileForm
} from '../components/Project'
import DateFormatter from '../components/helpers/DateFormatter.vue'

export default {
  name: 'Project',
  data () {
    return {
      profileFormOpen: false,
      fields: [
        { key: 'ProfileId', label: 'Name' },
        { key: 'startAt', label: 'Start Date' },
        { key: 'finishAt', label: 'End Date' },
        { key: 'workPercentage', label: 'Percentage' }
      ]
    }
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
    },
    members () {
      return this.projectProfilesByProjectId(this.project.id)
    }
  },
  components: {
    ProjectProfileForm,
    DateFormatter
  },
  mounted () {
    this.$store.dispatch('fetchProjectProfiles', this.project)
  },
  methods: {
    toggleProfileForm () {
      this.profileFormOpen = !this.profileFormOpen
    },
    printMember (profileId) {
      const member = this.profileById(profileId)
      return member.firstName + ' ' + member.lastName
    }
  }
}
</script>

<style scoped >
.project-profile-form-header {
}

</style>