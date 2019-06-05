<template>
  <form
    id="employers-form"
    class="animated fadeIn"
  >
    <b-row v-if="!shouldShowNewEmployerAddForm()">
      <b-col>
        <b-button
          class="pull-right mb-2"
          @click="addNewProfileEmployer"
        >
          <i class="fa fa-plus" />
          Add a new work history entry
        </b-button>
      </b-col>
    </b-row>
    <b-list-group>
      <b-list-group-item
        v-if="shouldShowNewEmployerAddForm()"
        class="clickable"
      >
        <b-row>
          <b-col>
            Add a new employer history entry
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div>
              <EditProfileEmployer
                :profile-employer="selectedProfileEmployer"
                :vue-selects-employers="vueSelectsEmployers"
              />
            </div>
          </b-col>
        </b-row>
      </b-list-group-item>
      <b-list-group-item
        v-for="(profileEmployer, index) in profileEmployers"
        :key="profileEmployer.id"
        class="clickable"
        @mouseover="showEditIconByIndex = index"
        @mouseout="showEditIconByIndex = null"
      >
        <b-row @click="openOrCloseEmployerForEditing(profileEmployer)">
          <b-col cols="11">
            <WorkHistoryEntry
              :profile-employer="profileEmployer"
              :profileId="profileId"
            />
          </b-col>
          <b-col
            v-show="showEditIconByIndex === index"
            cols="1"
          >
            <i class="fa fa-pencil pull-right" />
          </b-col>
        </b-row>
        <b-row v-if="selectedProfileEmployer && selectedProfileEmployer.id === profileEmployer.id">
          <b-col>
            <div>
              <EditProfileEmployer
                :key="profileEmployer ? profileEmployer.id : 0"
                :profile-employer="profileEmployer"
                :vue-selects-employers="vueSelectsEmployers"
              />
            </div>
          </b-col>
        </b-row>
      </b-list-group-item>
    </b-list-group>
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
  name: 'WorkHistoryEntryEditList',
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
      selectedProfileEmployer: null,
      activeProject: null,
      showProjectModal: false,
      showProfileProjectModal: false,
      activeProfileProject: null,
      showEditIconByIndex: null,
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
    addNewProfileEmployer () {
      this.selectedProfileEmployer = this.getEmptyProfileEmployer()
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
    getDescriptionWithCurrentLanguage (objectWithDescriptions) {
      if (!objectWithDescriptions || !objectWithDescriptions.descriptions || !objectWithDescriptions.descriptions.find(description => description.language === this.currentLanguage)) {
        return {
          language: this.currentLanguage,
          name: ''
        }
      }
      return objectWithDescriptions.descriptions.find(description => description.language === this.currentLanguage)
    },
    openOrCloseEmployerForEditing (profileEmployer) {
      this.selectedProfileEmployer = this.selectedProfileEmployer && this.selectedProfileEmployer.id === profileEmployer.id ? null : profileEmployer
    },
    shouldShowNewEmployerAddForm () {
      return this.selectedProfileEmployer && this.selectedProfileEmployer.id === null
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
