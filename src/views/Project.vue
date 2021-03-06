<template>
  <div>
    <loading v-if="!project" />
    <div
      v-else
      class="animated fadeIn project-container col-xl-7"
    >
      <b-card>
        <b-row>
          <b-col class="project-details">
            <b>{{ project.code }}</b>
            <h1>{{ project.name[currentLanguage] }}</h1>
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
              {{ project.description[currentLanguage] }}
            </p>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="project-members">
            <ProjectMemberTable :members="members" />
          </b-col>
        </b-row>
      </b-card>
      <hr>
      <CollapsableItem title="Edit project">
        <ProjectFormWrapper
          v-if="Object.values(employers).length > 0"
          :editable-project="project"
        />
        <div v-else>
          Loading employers...
        </div>
      </CollapsableItem>
      <hr>
      <CollapsableItem :title="isAdmin ? 'Add a consultant' : 'Join project'">
        <ProjectProfileForm
          :profile-project="{ projectId: project.id, profileId: isAdmin ? null : profileId }"
          no-redirect
        />
      </CollapsableItem>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import { CollapsableItem, ProjectProfileForm } from '@/components/Common'
import {
  ProjectMemberTable,
  ProjectFormWrapper
} from '@/components/Project'

export default {
  name: 'Project',
  components: {
    ProjectProfileForm,
    ProjectMemberTable,
    ProjectFormWrapper,
    CollapsableItem
  },
  computed: {
    ...mapGetters([
      'profileId',
      'projectById',
      'profileProjectsByProjectId',
      'employers',
      'currentLanguage',
      'isAdmin'
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
  watch: {
    project: function (val, oldVal) {
      if (val) {
        document.title = 'Rytmi - ' + val.name[this.currentLanguage]
      }
    }
  },
  created () {
    this.project && (document.title = `Rytmi - ${this.project.name[this.currentLanguage]}`)
  }
}
</script>

<style scoped >
.project-container {
  padding: 1em;
  margin: 0 auto;
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
