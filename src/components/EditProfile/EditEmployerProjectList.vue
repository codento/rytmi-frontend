<template>
  <div>
    <CollapsableItem
      :title="`Projects for ${employerById(employerId).name}`"
      class="mt-4"
      :initial-visibility="true"
    >
      <b-row v-if="profileProjectsWithProjectData.length === 0">
        <b-col class="no-projects">
          <AlertCircleIcon
            class="notice"
            size="1x"
          />
          No projects added
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col
          v-for="({ profileProject, project }, index) in profileProjectsWithProjectData"
          :key="profileProject.id"
          cols="12"
        >
          <div
            class="mt-2 mb-2"
          >
            <span class="icon-sized">
              <EditIcon
                v-show="showEditIconByIndex === index"
                size="1x"
              />
            </span>
            <span
              v-b-modal="'edit-project-modal'"
              class="project-name clickable mr-2"
              @click.prevent="selectProject(index)"
              @mouseover="showEditIconByIndex = index"
              @mouseout="showEditIconByIndex = null"
            >
              {{ project.name[currentLanguage] }} ({{ formatProjectDuration(profileProject.startDate, profileProject.endDate) }})
            </span>
            <span
              v-b-modal="'edit-project-modal'"
              class="project-role clickable"
              @mouseover="showEditIconByIndex = index"
              @mouseout="showEditIconByIndex = null"
            >
              {{ profileProject.role[currentLanguage] }}
            </span>
            <span>
              <TrashIcon
                class="clickable pull-right trash-icon"
                size="1x"
                @click="deleteProfileProject(profileProject)"
              />
            </span>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button
            v-b-modal="'new-project-modal'"
            class="pull-right mt-2"
          >
            Add a project
          </b-button>
        </b-col>
        <b-modal
          id="new-project-modal"
          v-model="showNewProjectModal"
          size="lg"
          hide-header
          ok-only
          ok-title="Close"
          ok-variant="light"
          no-close-on-backdrop
        >
          <EditEmployerProjectListItem
            :modal-header="`Add a project for ${employerById(employerId).name}`"
            :editable-project="{ id: null, employerId: employerId }"
            :profile-project="{ id: null, profileId: profileId, employerId: employerId, role: {en: '', fi: ''} }"
            :current-employer-id="employerId"
            @close-modal="newProjectModalClosed"
          />
        </b-modal>
      </b-row>
    </CollapsableItem>
    <b-modal
      v-if="selectedProject"
      id="edit-project-modal"
      v-model="showUpdateProjectModal"
      size="lg"
      hide-header
      ok-only
      ok-title="Close"
      ok-variant="light"
      no-close-on-backdrop
    >
      <EditEmployerProjectListItem
        :modal-header="`Edit ${selectedProject.project.name[currentLanguage]} (${employerById(employerId).name})`"
        :editable-project="selectedProject.project"
        :profile-project="selectedProject.profileProject"
        :current-employer-id="employerId"
        @close-modal="showUpdateProjectModal = false"
      />
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import format from 'date-fns/format'
import CollapsableItem from '@/components/Common/CollapsableItem'
import EditEmployerProjectListItem from './EditEmployerProjectListItem'
import { INTERNAL_COMPANY_NAME } from '@/utils/constants'
import { AlertCircleIcon, EditIcon, TrashIcon } from 'vue-feather-icons'

export default {
  name: 'EditEmployerProjectList',
  components: {
    CollapsableItem,
    EditEmployerProjectListItem,
    AlertCircleIcon,
    EditIcon,
    TrashIcon
  },
  props: {
    employerId: {
      type: Number,
      required: true
    },
    profileId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      showEditIconByIndex: null,
      selectedProject: undefined,
      showNewProjectModal: false,
      showUpdateProjectModal: false,
      internalCompany: INTERNAL_COMPANY_NAME
    }
  },
  computed: {
    ...mapGetters([
      'projects',
      'profileProjectsByProfileId',
      'currentLanguage',
      'employerById',
      'profileById'
    ]),
    fullName () {
      return `${this.profileById(this.profileId).firstName} ${this.profileById(this.profileId).lastName}`
    },
    profileProjectsWithProjectData () {
      return this.profileProjectsByProfileId(this.profileId).map(pp => ({
        profileProject: pp,
        project: Object.values(this.projects).find(project => project.id === pp.projectId)
      })).filter(pp => pp.project.employerId === this.employerId)
        .sort((a, b) => a.project.startDate - b.project.startDate)
    }
  },
  methods: {
    ...mapActions(['removeProfileProject']),
    deleteProfileProject (profileProject) {
      if (confirm(`Remove ${this.fullName} from ${profileProject.name.fi.length > 0 ? profileProject.name.fi : 'project'}?`)) {
        try {
          this.removeProfileProject(profileProject)
          this.$toasted.global.rytmi_success({
            message: `Project removed`
          })
        } catch (error) {
          this.$toasted.global.rytmi_error({
            message: `Error while removing project: ${error}`
          })
        }
      }
    },
    formatProjectDuration (startDate, endDate) {
      const formattedEndDate = endDate ? format(endDate, 'MM/YYYY') : ''
      return format(startDate, 'MM/YYYY') + '-' + formattedEndDate
    },
    selectProject (index) {
      this.selectedProject = this.profileProjectsWithProjectData[this.showEditIconByIndex]
    },
    newProjectModalClosed (newProfileProject) {
      this.showNewProjectModal = false
      this.selectedProject = Object.values(this.profileProjectsWithProjectData).find(profileProject => profileProject.project.id === newProfileProject.projectId)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';

.clickable {
  cursor: pointer;
}
.clickable:hover {
  text-decoration: underline;
}
.no-projects {
  font-style: italic;
  color: lightslategrey;
}
.notice {
  color: red;
  font-size: 150%;
}
.project-name {
  font-weight: bold;
}
.project-role {
  font-style: italic;
}
.icon-sized {
  display: inline-block;
  width: 14px;
}
.trash-icon {
  color: $c-violet-light;
}
.trash-icon:hover {
  color: $c-dark;
  cursor: pointer;
}
</style>
