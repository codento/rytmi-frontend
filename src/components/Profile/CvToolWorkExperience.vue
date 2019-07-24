<template>
  <b-card
    id="work-experience"
    class="mt-2 mb-2"
  >
    <h5
      slot="header"
      class="mb-0"
    >
      Work experience
    </h5>
    <div
      v-for="({ employerName, projects }, index) in projectsByEmployer"
      :key="employerName + '-' + index"
    >
      <h3>{{ employerName }}</h3>
      <b-row v-if="projects.length === 0">
        <b-col>
          <div class="text-muted pb-2">
            No projects for this employer.
          </div>
        </b-col>
      </b-row>
      <b-row
        v-for="project in projects"
        :key="project.projectId"
      >
        <b-col
          cols="1"
          align-self="center"
        >
          <input
            :id="'project-checkbox-' + project.projectId"
            v-model="selectedProjects"
            type="checkbox"
            :value="project.projectId"
            :disabled="isNotSelectable(project.projectId)"
            @change="updateSelectedProjects"
          >
        </b-col>
        <b-col>
          <ProjectRow
            :profile-project="project"
          />
        </b-col>
      </b-row>
    </div>
  </b-card>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import ProjectRow from '@/components/Common/ProjectRow.vue'

export default {
  name: 'CvToolWorkExperience',
  components: {
    ProjectRow
  },
  props: {
    profileId: {
      type: Number,
      required: true
    },
    profileProjects: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      selectedProjects: [],
      maxSelected: 3
    }
  },
  computed: {
    ...mapGetters([
      'profileEmployersByProfileId',
      'employerById'
    ]),
    projectsByEmployer () {
      return this.profileEmployersByProfileId(this.profileId)
        .map(item => { return { ...item, employerName: this.employerById(item.employerId).name } })
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        .map(item => {
          return {
            employerName: item.employerName,
            projects: this.profileProjects.filter(project => project.employerId === item.employerId)
          }
        })
    }
  },
  created: function () {
    const sortedProjects = []
    for (let entry of Object.values(this.projectsByEmployer.map(item => item.projects))) {
      Array.prototype.push.apply(sortedProjects, entry)
    }
    sortedProjects.sort((a, b) => {
      const date1 = new Date(a.endDate)
      const date2 = new Date(b.endDate)
      if (a.endDate && b.endDate) {
        return date2 - date1
      } else if (!a.endDate) {
        return -1
      } else {
        return 1
      }
    })

    this.selectedProjects = sortedProjects.map(item => item.projectId).slice(0, this.maxSelected)
    this.updateSelectedProjects()
  },
  methods: {
    ...mapActions(['updateTopProjects']),
    isNotSelectable: function (projectId) {
      return this.selectedProjects.length >= this.maxSelected && !(this.selectedProjects.includes(projectId))
    },
    updateSelectedProjects: function () {
      this.updateTopProjects(this.profileProjects.filter(item => this.selectedProjects.includes(item.projectId)))
    }
  }
}
</script>
