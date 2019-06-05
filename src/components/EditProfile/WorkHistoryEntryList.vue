<template>
  <form
    id="employers-form"
    class="animated fadeIn"
  >
    <b-row
      v-for="profileEmployer in profileEmployers"
      :key="profileEmployer.id"
    >
      <b-col>
        <WorkHistoryEntry
          :profile-employer="profileEmployer"
          :profileId="profileId"
        />
      </b-col>
    </b-row>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { format, parse } from 'date-fns'
import { orderBy, cloneDeep } from 'lodash'
import EditProfileEmployer from './EditProfileEmployer'
import EmployersProfileProject from './EmployersProfileProject'
import WorkHistoryEntry from './WorkHistoryEntry'
import { ProjectProfileForm } from '../Project'
import sortBy from 'lodash/sortBy'

export default {
  name: 'WorkHistoryEntryList',
  components: {
    EditProfileEmployer,
    EmployersProfileProject,
    ProjectProfileForm,
    WorkHistoryEntry
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
      this.activeProject = { id: null }
      this.activeProfileProject = { id: null, profileId: this.profileId }
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
    closeProjectModal () {
      this.showProjectModal = false
    },
    projectClicked (project) {
      this.activeProject = cloneDeep(project)
      this.activeProfileProject = this.profileProjectsWithProjectData
        .filter(item => item.profileProject.projectId === project.id)
        .map(item => item.profileProject)[0]
      this.showProjectModal = true
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
