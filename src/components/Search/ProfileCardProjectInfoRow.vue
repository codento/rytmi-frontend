<template>
  <div>
    <div
      v-for="project in futureProjectsOfProfile(profile.id)"
      :key="project.id"
    >
      <b-row class="project-info-row">
        <b-col lg="12" xl="8">
          <b>{{ `${projectById(project.projectId).name}` }}</b>
        </b-col>
        <b-col lg="12" xl="4">
          <b>End date: </b>
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
    formattedDate (date) {
      return format(date, 'D.M.YYYY')
    }
  }
}
</script>
