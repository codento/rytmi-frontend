<template>
  <b-container>
    <h2>Projects</h2>
    <b-input
      v-model="projectFilterTerm"
      type="text"
      placeholder="Filter projects (by name or project code)"
    />
    <b-table
      id="project-table"
      :items="results"
      :fields="fields"
      striped
      fixed
      @row-clicked="openProject"
    />
  </b-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { DEFAULT_LANGUAGE } from '@/utils/constants'
export default {
  name: 'ProjectList',
  data () {
    return {
      projectFilterTerm: '',
      fields: [
        {
          key: 'code',
          sortable: true,
          tdClass: 'clickable'
        },
        {
          key: 'name',
          sortable: true,
          tdClass: 'clickable'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['projectFilter']),
    results () {
      const projects = this.projectFilter(this.projectFilterTerm)
      const mappedProjects = Object.values(projects).map(project => {
        const description = project.descriptions.find(description => description.language === DEFAULT_LANGUAGE)
        return {
          id: project.id,
          code: project.code,
          startDate: project.startDate,
          endDate: project.endDate,
          isSecret: project.isSecret,
          name: description ? description.name : '',
          description: description ? description.description : ''
        }
      })
      return mappedProjects
    }
  },
  methods: {
    openProject (project) {
      this.$router.push({ name: 'Project', params: { id: project.id } })
    }
  }
}
</script>
<style scoped>
.clickable {
  cursor: pointer;
}
</style>
