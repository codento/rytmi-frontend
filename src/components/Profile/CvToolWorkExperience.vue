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
    <h3>Codento</h3>
    <loading v-if="!profileProjects" />
    <b-row
      v-for="profileProject in profileProjects"
      :key="profileProject.id"
    >
      <b-col
        cols="1"
        align-self="center"
      >
        <input
          :id="'project-checkbox-' + profileProject.id"
          v-model="selectedProjects"
          type="checkbox"
          :value="profileProject.projectId"
          :disabled="isNotSelectable(profileProject.projectId)"
          @change="updateSelectedProjects"
        >
      </b-col>
      <b-col>
        <ProjectRow
          :profile-project="profileProject"
        />
      </b-col>
    </b-row>
    <h3>Other</h3>
  </b-card>
</template>
<script>
import ProjectRow from '@/components/Common/ProjectRow.vue'

export default {
  name: 'CvToolWorkExperience',
  components: {
    ProjectRow
  },
  props: {
    profileProjects: Array
  },
  data () {
    return {
      selectedProjects: [],
      maxSelected: 3
    }
  },
  computed: {},
  created: function () {
    const sortedProjects = this.profileProjects
      .sort((a, b) => {
        const date1 = new Date(a.endDate)
        const date2 = new Date(b.endDate)
        return date1 > date2 ? -1 : date1 < date2 ? 1 : 0
      })
    this.selectedProjects = sortedProjects.map(item => item.projectId).slice(0, this.maxSelected)
    this.$emit('update-selected-projects', this.selectedProjects)
  },
  methods: {
    isNotSelectable: function (projectId) {
      return this.selectedProjects.length >= this.maxSelected && !(this.selectedProjects.includes(projectId))
    },
    updateSelectedProjects: function () {
      this.$emit('update-selected-projects', this.selectedProjects)
    }
  }
}
</script>
