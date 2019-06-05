<template>
  <div>
    <div>
      <span
        v-b-modal="'create-or-edit-profile-employer-modal'"
        name="employer"
        class="employer-name"
        @click="profileEmployerClicked(profileEmployer)"
      >
        {{ profileEmployer ? getEmployerName(profileEmployer.employerId) : '' }}
      </span>
      <span>
        {{ profileEmployer ? profileEmployer.title[currentLanguage] : '' }}
      </span>
      <span>{{ getFormatedDate(profileEmployer.startDate) + ' - ' + getFormatedDate(profileEmployer.endDate) }}</span>
    </div>
  </div>
</template>

<script>
// TODO: Remove all unused functions and imports etc
import { mapActions, mapGetters } from 'vuex'
import { format, parse } from 'date-fns'
import { orderBy, cloneDeep } from 'lodash'
import EmployersProfileProject from './EmployersProfileProject'
import sortBy from 'lodash/sortBy'

export default {
  name: 'WorkHistoryEntry',
  components: {
    EmployersProfileProject
  },
  props: {
    profileEmployer: Object,
    profileId: Number
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
    ...mapGetters({
      userProfileId: 'profileId'
    }),
    ...mapGetters([
      'profileEmployersByProfileId',
      'currentLanguage',
      'employers',
      'profileProjectsByProfileId',
      'projects',
      'projectById',
      'isAdmin'
    ]),
    profileProjectsWithProjectData () {
      return this.profileProjectsByProfileId(this.profileId).map(pp => ({
        profileProject: pp,
        project: Object.values(this.projects).find(project => project.id === pp.projectId)
      }))
    }
  },
  methods: {
    ...mapActions(['removeProfileEmployer']),
    getFormatedDate (date) {
      return date ? format(date, 'MM/YYYY') : ''
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
#add-new-employer-button {
  margin-bottom: 10px;
}
.icon {
  margin-left: 15px;
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
.clickable:hover {
  cursor: pointer;
}
</style>
