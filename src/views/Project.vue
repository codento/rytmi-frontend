<template>
  <div>
    <loading v-if="!project"/>
    <div
      v-else
      class="animated fadeIn project-container col-sm-12 col-md-7">
      <b-row>
        <b-col class="project-details">
          <b>{{ project.code }}</b>
          <h1>{{ project.name }}</h1>
          <div class="detail-container">
            <span class="detail detail-start">
              <small>Start date</small><br >
              <b><DateFormatter :date="project.startDate" /></b>
            </span>
            <span class="detail detail-end">
              <small>End date</small><br >
              <b><DateFormatter :date="project.endDate" /></b>
            </span>
            <span class="detail members">
              <small>Consultants</small><br >
              <b v-if="members">{{ members.length }}</b>
            </span>
          </div>
          <p>
            <small>Description</small><br >
            {{ project.description }}
          </p>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="project-members">
          <ProjectMemberTable :members="members" />
        </b-col>
      </b-row>
      <hr >
      <ProjectForm :editable-project="project" />
      <hr >
      <div>
        <h3
          class="project-profile-form-header"
          @click="toggleProfileForm">Add a consultant
          <i class="fa fa-chevron-down" />
        </h3>
        <div v-if="profileFormOpen">
          <ProjectProfileForm
            :toggle-form="toggleProfileForm"
            :project-id="project.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '../store'
import {
  ProjectProfileForm,
  ProjectMemberTable,
  ProjectForm
} from '../components/Project'
import DateFormatter from '../components/helpers/DateFormatter.vue'

export default {
  name: 'Project',
  components: {
    ProjectProfileForm,
    ProjectMemberTable,
    ProjectForm,
    DateFormatter
  },
  data () {
    return {
      profileFormOpen: false
    }
  },
  computed: {
    ...mapGetters([
      'projectById',
      'profileProjectsByProjectId'
    ]),
    project () {
      return this.projectById(this.$route.params.id)
    },
    members () {
      return this.profileProjectsByProjectId(this.project.id)
    }
  },
  beforeRouteEnter (to, from, next) {
    store.dispatch('fetchPPsOfProject', to.params.id)
    next()
  },
  methods: {
    // TODO: scroll to bottom when opening form
    toggleProfileForm () {
      this.profileFormOpen = !this.profileFormOpen
    }
  },
  wathc: {
    project: function (val, oldVal) {
      if (val) {
        document.title = 'Rytmi - ' + val.name
      }
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
