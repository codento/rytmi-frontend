<template>
  <div>
    <div
      v-for="project in currentProjects(profile.id)"
      :key="project.id"
    >
      <b-row class="project-info-row">
        <b-col cols="8">
          <b>{{ `${projectById(project.projectId).name}` }}</b>
        </b-col>
        <b-col cols="2">
          <b>End date:</b>
        </b-col>
        <b-col cols="2">
          <b>{{ `${project.endDate ? formattedDate(project.endDate) : 'undefined'}` }}</b>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'

export default {
  name: 'ProfileCardProjectInfoRow',
  props: {
    profile: Object
  },
  computed: {
    ...mapGetters([
      'futureProjectsOfProfile',
      'projectById'
    ])
  },
  methods: {
    currentProjects (id) {
      return this.futureProjectsOfProfile(id).length > 0 ? this.futureProjectsOfProfile(id) : undefined
    },
    formattedDate (date) {
      return format(date, 'D.M.YYYY')
    }
  }
}
</script>
