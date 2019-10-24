<template>
  <b-container>
    <hr>
    <b-input
      v-model="projectFilterTerm"
      name="project-filter"
      type="text"
      placeholder="Filter projects (by name or project code)"
      class="mb-2"
    />
    <small>
      <span class="confidential">*</span> Confidential project
    </small>
    <b-table
      id="project-table"
      :items="results"
      :fields="fields"
      :sort-by.sync="sortBy"
      class="clickable"
      hover
      striped
      @row-clicked="openProject"
    >
      <template slot="name" slot-scope="data">
        {{ data.value.title }}
        <span v-if="data.value.isConfidential" class="confidential">
          {{ ' *' }}
        </span>
      </template>
    </b-table>
  </b-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { INTERNAL_COMPANY_NAME } from '@/utils/constants'

export default {
  name: 'ProjectList',
  data () {
    return {
      projectFilterTerm: '',
      sortBy: 'code',
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
      'projectFilter',
      'employerByName',
      'currentLanguage'
    ]),
    internalCompanyId () {
      return this.employerByName(INTERNAL_COMPANY_NAME).id
    },
    results () {
      const projects = this.projectFilter(this.projectFilterTerm)
      const thisCompanyProjects = Object.values(projects).filter(project => project.employerId === this.internalCompanyId)
      return thisCompanyProjects.map(project => {
        return {
          id: project.id,
          code: project.code,
          name: { title: project.name[this.currentLanguage], isConfidential: project.isConfidential }
        }
      })
    }
  },
  methods: {
    openProject (project) {
      this.$router.push({ name: 'project', params: { id: project.id } })
    }
  }
}
</script>
<style scoped>
.clickable {
  cursor: pointer;
}

.confidential {
  color: red;
}
</style>
