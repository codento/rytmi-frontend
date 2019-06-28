<template>
  <div>
    <div
      v-for="project in futureProjectsOfProfile(profile.id).filter(projectToFilter => projectById(projectToFilter.projectId).employerId === internalCompanyId && !projectById(projectToFilter.projectId).isInternal)"
      :key="project.id"
    >
      <b-row class="project-info-row">
        <b-col
          lg="12"
          xl="8"
        >
          <small><b>{{ `${projectById(project.projectId).name[currentLanguage]}` }}</b></small>
        </b-col>
        <b-col
          lg="12"
          xl="4"
        >
          <small>
            <b>End date: </b>
            <b>{{ `${project.endDate ? formattedDate(project.endDate) : '-'}` }}</b>
          </small>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'
import { INTERNAL_COMPANY_NAME } from '@/utils/constants'

export default {
  name: 'ProfileCardProjectInfoRow',
  props: {
    profile: Object
  },
  computed: {
    ...mapGetters([
      'futureProjectsOfProfile',
      'projectById',
      'currentLanguage',
      'employerByName'
    ]),
    internalCompanyId () {
      return this.employerByName(INTERNAL_COMPANY_NAME).id
    }
  },
  methods: {
    formattedDate (date) {
      return format(date, 'D.M.YYYY')
    }
  }
}
</script>
