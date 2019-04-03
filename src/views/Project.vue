<template>
  <div>
    <loading v-if="!project" />
    <div
      v-else
      class="animated fadeIn project-container col-sm-12 col-md-7"
    >
      <b-row>
        <b-col class="project-details">
          <b>{{ project.code }}</b>
          <h1>{{ project.name }}</h1>
          <div class="detail-container">
            <span class="detail detail-start">
              <small>Start date</small><br>
              <b class="project-start-date">{{ project.startDate | dateFilter }}</b>
            </span>
            <span class="detail detail-end">
              <small>End date</small><br>
              <b class="project-end-date">{{ project.endDate | dateFilter }}</b>
            </span>
            <span class="detail members">
              <small>Consultants</small><br>
              <b v-if="members">{{ members.length }}</b>
            </span>
          </div>
          <p>
            <small>Description</small><br>
            {{ project.description }}
          </p>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="project-members">
          <ProjectMemberTable :members="members" />
        </b-col>
      </b-row>
      <hr>
      <ProjectForm :editable-project="rawProject" />
      <hr>
      <div>
        <h3
          class="project-profile-form-header"
          @click="toggleProfileForm"
        >
          Add a consultant
          <i class="fa fa-chevron-down" />
        </h3>
        <div v-if="profileFormOpen">
          <ProjectProfileForm
            :toggle-form="toggleProfileForm"
            :project-id="project.id"
          />
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
import { DEFAULT_LANGUAGE } from '@/utils/constants'

export default {
  name: 'Project',
  components: {
    ProjectProfileForm,
    ProjectMemberTable,
    ProjectForm
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
      const project = this.projectById(this.$route.params.id)
      const description = project.descriptions.find(description => description.language === DEFAULT_LANGUAGE)
      const mappedProject = {
        id: project.id,
        code: project.code,
        startDate: project.startDate,
        endDate: project.endDate,
        isSecret: project.isSecret,
        name: description ? description.name : '',
        description: description ? description.description : ''
      }
      return mappedProject
    },
    rawProject () {
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
  watch: {
    project: function (val, oldVal) {
      if (val) {
        document.title = 'Rytmi - ' + val.name
      }
    }
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
