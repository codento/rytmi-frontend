<template>
  <div style="width: 99vw">
    <div class="animated fadeIn project-container col-sm-12 col-md-7">
      <b-row>
        <b-col class="project-details">
          <b>{{project.code}}</b>
          <h1>{{project.name}}</h1>
          <div class="detail-container">
            <span class="detail detail-start">
              <small>Start date</small><br />
              <b><DateFormatter :date="project.startDate" /></b>
            </span>
            <span class="detail detail-end">
              <small>End date</small><br />
              <b><DateFormatter :date="project.endDate" /></b>
            </span>
            <span class="detail members">
              <small>Consultants</small><br />
              <b v-if="members">{{members.length}}</b>
            </span>
          </div>
          <p>
            <small>Description</small><br />
            {{project.description}}
          </p>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="project-members">
          <ProjectMemberTable :members="members" />
        </b-col>
      </b-row>
      <hr />
      <ProjectForm :editableProject="project" />
      <hr />
      <div>
        <h3 class="project-profile-form-header" @click="toggleProfileForm">Add a consultant
          <i class="fa fa-chevron-down" />
        </h3>
        <div v-if="profileFormOpen">
          <ProjectProfileForm :toggleForm="toggleProfileForm" :projectId="project.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import store from '../store'
import {
  ProjectProfileForm,
  ProjectMemberTable,
  ProjectForm
} from '../components/Project'
import DateFormatter from '../components/helpers/DateFormatter.vue'

export default {
  name: 'Project',
  data () {
    return {
      profileFormOpen: false
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
    ProjectMemberTable,
    ProjectForm,
    DateFormatter
  },
  beforeRouteEnter (to, from, next) {
    store.dispatch('fetchProjectProfiles', to.params.id)
    next()
  },
  methods: {
    // TODO: scroll to bottom when opening form
    toggleProfileForm () {
      this.profileFormOpen = !this.profileFormOpen
    }
  }
}
</script>

<style scoped >
.project-container {
  padding: 1em;
  margin: 0 auto;
}
.project-profile-form-header {
  text-align: center;
  cursor: pointer;
}
.detail-container {
  display: flex;
  justify-content: space-between;
  margin: 1.5em 0;
}
.detail {
  margin-right: 1em;
}

</style>