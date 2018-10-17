<template>
  <b-container>
    <h2>Projects</h2>
    <b-input
      v-model="projectFilterTerm"
      type="text"
      placeholder="Filter projects (by name or project code)" />
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
    ...mapGetters([
      'projectFilter'
    ]),
    results () {
      const r = this.projectFilter(this.projectFilterTerm)
      return Object.values(r)
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
