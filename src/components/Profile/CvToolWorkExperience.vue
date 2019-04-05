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
          :id="'project_checkbox_' + profileProject.id"
          v-model="selectedProjects"
          type="checkbox"
          :value="profileProject.projectId"
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
      selectedProjects: []
    }
  },
  computed: {},
  methods: {
    updateSelectedProjects: function () {
      this.$emit('update-selected-projects', this.selectedProjects)
    }
  }
}
</script>
