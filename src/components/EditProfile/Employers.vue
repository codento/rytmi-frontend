<template>
  <form
    id="employers-form"
    class="animated fadeIn"
  >
    <b-modal
      :id="'delete-work-history-entry-modal'"
      name="delete-work-history-entry-modal"
      size="sm"
      hide-header
      centered
      ok-title="Delete"
      cancel-title="Cancel"
      @ok="deleteProfileEmployer"
    >
      <div>
        <b-row>
          <b-col>
            Are you sure you want to delete this work history entry?:
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <span class="employer-name">{{ selectedProfileEmployer ? getEmployerName(selectedProfileEmployer.employerId) : '' }}</span>
            <span>{{ getFormatedDate(selectedProfileEmployer.startDate) + ' - ' + getFormatedDate(selectedProfileEmployer.endDate) }}</span>
          </b-col>
        </b-row>
      </div>
    </b-modal>
    <b-modal
      :id="'project-modal'"
      v-model="showProjectModal"
      title="Add a new project"
      name="project-modal"
      size="lg"
      ok-only
      ok-title="Close"
      no-close-on-backdrop
    >
      <div>
        <ProjectForm
          v-if="employers && activeProject"
          :editable-project="activeProject"
          :create-profile-project-after-project-creation="true"
          no-redirect
          @projectCreated="projectCreated($event)"
        />
        <div v-else>
          Loading employers...
        </div>
      </div>
    </b-modal>
    <b-modal
      v-if="activeProject && activeProject.id"
      :id="'profile-project-modal'"
      v-model="showProfileProjectModal"
      :title="`Your role in the project: ${getDescriptionWithCurrentLanguage(activeProject).name}`"
      name="profile-project-modal"
      size="lg"
      ok-only
      ok-title="Close"
      no-close-on-backdrop
    >
      <div>
        <ProjectProfileForm
          :key="activeProfileProject ? activeProfileProject.id : 0"
          :profile-project="activeProfileProject"
          no-redirect
          is-in-modal
          @profileProjectCreatedOrUpdated="profileProjectCreatedOrUpdated()"
        />
      </div>
    </b-modal>
    <b-modal
      :id="'create-or-edit-profile-employer-modal'"
      :title="selectedProfileEmployer.id ? 'Edit an existing work history entry' : 'Add a new work history entry'"
      name="create-or-edit-profile-employer-modal"
      size="lg"
      ok-only
      ok-title="Close"
      no-close-on-backdrop
    >
      <div>
        <EditProfileEmployer
          :key="selectedProfileEmployer ? selectedProfileEmployer.id : 0"
          :profile-employer="selectedProfileEmployer"
          :vue-selects-employers="vueSelectsEmployers"
        />
      </div>
    </b-modal>
    <h1>Previous and current employers</h1>
    <hr>
    <b-row
      v-for="profileEmployer in profileEmployers"
      :key="profileEmployer.id"
    >
      <b-col>
        <div>
          <span
            v-b-modal="'create-or-edit-profile-employer-modal'"
            name="employer"
            class="employer-name clickable"
            @click="profileEmployerClicked(profileEmployer)"
          >
            {{ profileEmployer ? getEmployerName(profileEmployer.employerId) : '' }}</span> <span>{{ getFormatedDate(profileEmployer.startDate) + ' - ' + getFormatedDate(profileEmployer.endDate) }}</span>
          <i
            v-b-modal="'delete-work-history-entry-modal'"
            class="fa fa-trash icon"
            @click="profileEmployerClicked(profileEmployer)"
          />
        </div>
        <div class="details">
          <div class="title">
            {{ profileEmployer ? profileEmployer.title[currentLanguage] : '' }}
          </div>
          <div class="description">
            {{ profileEmployer ? profileEmployer.description[currentLanguage] : '' }}
          </div>
          <div class="employer-profile-projects">
            <small class="projects-label">Projects</small>
            <div
              v-if="profileProjectsWithProjectData.filter(ppwpd => ppwpd.project.employerId === profileEmployer.employerId).length === 0"
              class="no-projects"
            >
              No projects.
            </div>
            <div
              v-for="profileProjectWithProjectData in profileProjectsWithProjectData.filter(ppwpd => ppwpd.project.employerId === profileEmployer.employerId)"
              v-else
              :key="profileProjectWithProjectData.profileProject.id"
            >
              <EmployersProfileProject
                :profile-project="profileProjectWithProjectData.profileProject"
                :project="profileProjectWithProjectData.project"
                @projectClicked="projectClicked($event)"
                @profileProjectClicked="profileProjectClicked($event)"
              />
            </div>
          </div>
          <b-button
            v-b-modal="'project-modal'"
            @click="addNewProjectClicked(profileEmployer)"
          >
            Add a new project
          </b-button>
        </div>
      </b-col>
    </b-row>
    <b-button
      id="add-new-employer-button"
      v-b-modal="'create-or-edit-profile-employer-modal'"
      @click="addNewProfileEmployer"
    >
      Add a new work history entry
    </b-button>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { format, parse } from 'date-fns'
import { orderBy, cloneDeep } from 'lodash'
import EditProfileEmployer from './EditProfileEmployer'
import EmployersProfileProject from './EmployersProfileProject'
import { ProjectProfileForm } from '../Project'
import { ProjectForm } from '@/components/Common'
import sortBy from 'lodash/sortBy'

export default {
  name: 'Employers',
  components: {
    EditProfileEmployer,
    ProjectForm,
    EmployersProfileProject,
    ProjectProfileForm
  },
  props: {
    'profileId': Number
  },
  data () {
    return {
      selectedProfileEmployer: this.getEmptyProfileEmployer(),
      activeProject: null,
      showProjectModal: false,
      showProfileProjectModal: false,
      activeProfileProject: null
    }
  },
  computed: {
    ...mapGetters([
      'profileEmployersByProfileId',
      'currentLanguage',
      'employers',
      'profileProjectsByProfileId',
      'projects',
      'projectById'
    ]),
    profileEmployers () {
      const employers = this.profileEmployersByProfileId(this.profileId).map(employer => ({
        ...employer,
        startDate: employer.startDate ? parse(employer.startDate) : null,
        endDate: employer.endDate ? parse(employer.endDate) : null
      }))
      return orderBy(employers, ['startDate'], ['desc'])
    },
    profileProjectsWithProjectData () {
      return this.profileProjectsByProfileId(this.profileId).map(pp => ({
        profileProject: pp,
        project: Object.values(this.projects).find(project => project.id === pp.projectId)
      }))
    },
    vueSelectsEmployers () {
      return sortBy(Object.values(this.employers).map(employer => ({
        label: employer.name,
        id: employer.id
      })),
      ['label'])
    }
  },
  methods: {
    ...mapActions(['removeProfileEmployer']),
    getFormatedDate (date) {
      return date ? format(date, 'YYYY/MM') : ''
    },
    profileEmployerClicked (profileEmployer) {
      this.selectedProfileEmployer = cloneDeep(profileEmployer)
    },
    addNewProjectClicked (profileEmployer) {
      this.selectedProfileEmployer = cloneDeep(profileEmployer)
      this.activeProject = { employerId: this.selectedProfileEmployer.employerId }
    },
    addNewProfileEmployer () {
      this.selectedProfileEmployer = this.getEmptyProfileEmployer()
    },
    getEmployerName (employerId) {
      const employer = Object.values(this.employers).find(employer => employer.id === employerId)
      return employer ? employer.name : ''
    },
    getEmptyProfileEmployer () {
      return {
        id: null,
        profileId: this.profileId,
        employerId: null,
        description: {
          fi: '',
          en: ''
        },
        title: {
          fi: '',
          en: ''
        },
        startDate: null,
        endDate: null
      }
    },
    projectCreated (event) {
      this.activeProject = event.project
      this.activeProfileProject = {
        projectId: this.activeProject.id,
        profileId: this.profileId
      }
      this.showProjectModal = false
      this.showProfileProjectModal = true
    },
    profileProjectCreatedOrUpdated () {
      this.showProfileProjectModal = false
    },
    projectClicked (project) {
      this.showProjectModal = true
      this.activeProject = cloneDeep(project)
    },
    profileProjectClicked (profileProject) {
      this.activeProject = this.projectById(profileProject.projectId)
      this.activeProfileProject = {
        ...profileProject,
        startDate: format(profileProject.startDate, 'yyyy-MM-dd'),
        endDate: format(profileProject.endDate, 'yyyy-MM-dd')
      }
      this.showProfileProjectModal = true
    },
    deleteProfileEmployer () {
      this.removeProfileEmployer(this.selectedProfileEmployer)
        .then((data) => {
          this.$toasted.global.rytmi_success({
            message: 'Work history entry deleted.'
          })
          this.selectedProfileEmployer = this.getEmptyProfileEmployer()
          document.getElementById('employers-form').reset()
        })
    },
    getDescriptionWithCurrentLanguage (objectWithDescriptions) {
      if (!objectWithDescriptions || !objectWithDescriptions.descriptions || !objectWithDescriptions.descriptions.find(description => description.language === this.currentLanguage)) {
        return {
          language: this.currentLanguage,
          name: ''
        }
      }
      return objectWithDescriptions.descriptions.find(description => description.language === this.currentLanguage)
    }
  }
}
</script>

<style scoped >
.employer-name {
  font-weight: bold;
  margin-right: 5px;
}
.description {
  font-style: italic;
  white-space: pre-line;

}
.description:first-line {
  line-height: 0;
}
.details {
  padding-left: 15px;
  padding-bottom: 15px;
}
.employer-profile-projects {
  padding-left: 15px;
  padding-bottom: 15px;
}
.clickable {
  cursor: pointer;
}
.clickable:hover {
  text-decoration: underline;
}
#add-new-employer-button {
  margin-bottom: 10px;
}
.icon {
  margin-left: 15px;
}
.icon.fa-trash:hover {
  color: red;
}
.icon.fa-plus:hover {
  color: green;
}
.projects-label {
  text-decoration: underline;
}
.no-projects {
  font-style: italic;
  color: lightslategrey;
}
</style>
