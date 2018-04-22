<template>
  <div class="animated fadeIn project-container">
    <b-row>
      <b-col class="project-details col-sm-12 col-md-6">
        <h1>{{project.name}}</h1>
        <p>{{project.description}}</p>
        <span>Duration</span>
        <p><DateFormatter :date="project.startDate" /> -> <DateFormatter :date="project.endDate" /></p>
      </b-col>
      <b-col class="project-members col-sm-12 col-md-6">
        <h1>Members</h1>
        <div v-if="members">
          <b-table 
            :items="members"
            :fields="fields"
            hover
            striped
            responsive
          >
            <template slot="profileId" slot-scope="data">
              {{printMember(data.value)}}
            </template>
            <template slot="startAt" slot-scope="data">
              <DateFormatter :date="data.value" />
            </template>
            <template slot="finishAt" slot-scope="data">
              <DateFormatter :date="data.value" />
            </template>
            <template slot="workPercentage" slot-scope="data">
              {{data.value}} %
            </template>
          </b-table>
        </div>
        <div v-else>
          No members added yet
        </div>
      </b-col>
    </b-row>
    <hr />
    <div class="project-profile-form-header col-md-5 col-sm-12">
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
import store from '../store'
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
        { key: 'profileId', label: 'Name' },
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
  beforeRouteEnter (to, from, next) {
    store.dispatch('fetchProjectProfiles', to.params.id)
    next()
  },
  methods: {
    toggleProfileForm () {
      this.profileFormOpen = !this.profileFormOpen
    },
    printMember (profileId) {
      const member = this.profileById(profileId)
      if (member) {
        return member.firstName + ' ' + member.lastName
      } else {
        return 'Profile not found'
      }
    }
  }
}
</script>

<style scoped >
.project-container {
  padding: 1em;
}

</style>