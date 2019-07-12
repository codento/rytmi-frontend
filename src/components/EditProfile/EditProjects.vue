<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col class="col-12 projects-table">
        <b-table
          v-if="projectList.length > 0"
          :items="projectList"
          :fields="fields"
          fixed
          caption-top
          stacked="sm"
        >
          <template slot="table-caption">
            Projects participated
          </template>
          <template
            slot="startDate"
            slot-scope="data"
          >
            {{ data.value | dateFilter }}
          </template>

          <template
            slot="endDate"
            slot-scope="data"
          >
            {{ data.value | dateFilter }}
          </template>

          <template
            slot="workPercentage"
            slot-scope="data"
          >
            <span>
              {{ data.value }} %
            </span>
          </template>

          <template
            slot="edit"
            slot-scope="data"
          >
            <b-btn
              size="sm"
              class="mr-1"
              variant="success"
              @click="openEditModal(data)"
            >
              Edit
            </b-btn>
          </template>
          <template
            slot="remove"
            slot-scope="data"
          >
            <b-btn
              name="remove"
              size="sm"
              class="mr-1"
              variant="danger"
              @click.stop="confirmDelete(data.item)"
            >
              Remove
            </b-btn>
          </template>
        </b-table>
      </b-col>
      <b-modal
        ref="profileProjectEditModal"
        title=""
        hide-header
        ok-only
        ok-title="Close"
        ok-variant="light"
      >
        <h3 v-if="selectedProfileProject.name">
          {{ selectedProfileProject.name[currentLanguage] }}
        </h3>
        <ProjectProfileForm
          :profile-project="selectedProfileProject"
          hide-project-select
          hide-profile-select
          no-redirect
          @profile-project-created-or-updated="closeEditModal()"
        />
      </b-modal>
    </b-row>
    <b-row>
      <b-col class="col-12 projects-form">
        <b-card
          class="newProject"
          title="Join a project"
        >
          <ProjectProfileForm
            :profile-project="{ profileId }"
            no-redirect
          />
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ProjectProfileForm } from '@/components/Common'
import { INTERNAL_COMPANY_NAME } from '@/utils/constants'

export default {
  name: 'EditProjects',
  components: {
    ProjectProfileForm
  },
  props: {
    profileId: Number
  },
  data () {
    return {
      selectedProfileProject: {
        role: { fi: '', en: '' }
      }
    }
  },
  computed: {
    ...mapGetters([
      'profileProjectsByProfileId',
      'projectById',
      'currentLanguage',
      'employerByName'
    ]),
    fields () {
      return [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: `role.${this.currentLanguage}`, label: 'Role' },
        { key: 'startDate', label: 'From' },
        { key: 'endDate', label: 'To' },
        { key: 'workPercentage', label: 'Utilization' },
        'edit',
        'remove'
      ]
    },
    internalCompanyId () {
      return this.employerByName(INTERNAL_COMPANY_NAME).id
    },
    projectList () {
      return this.profileProjectsByProfileId(this.profileId).map(profileProject => {
        const { code, name, employerId } = this.projectById(profileProject.projectId)
        return { ...profileProject, code, name: name[this.currentLanguage], employerId }
      }).filter(profileProject => profileProject.employerId === this.internalCompanyId)
    }
  },
  methods: {
    ...mapActions(['removeProfileProject']),
    confirmDelete (item) {
      const confirmation = confirm('Are you sure?')
      if (confirmation) {
        this.removeProfileProject(item)
      }
    },
    openEditModal (item) {
      this.selectedProfileProject = Object.assign({}, item.item)
      this.selectedProfileProject.name = this.projectById(item.item.projectId).name
      this.selectedProfileProject.startDate = new Date(this.selectedProfileProject.startDate)
      this.selectedProfileProject.endDate = this.selectedProfileProject.endDate ? new Date(this.selectedProfileProject.endDate) : null
      this.selectedProfileProject.index = item.index
      this.$refs.profileProjectEditModal.show()
    },
    closeEditModal () {
      this.$refs.profileProjectEditModal.hide()
    }
  }
}
</script>
