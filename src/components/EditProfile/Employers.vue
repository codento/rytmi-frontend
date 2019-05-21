<template>
  <form
    id="employers-form"
    class="animated fadeIn"
  >
    <b-modal
      :id="'delete-work-history-entry-modal'"
      name="delete-work-history-entry-modal"
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
      title="Add a new project"
      :id="'add-employer-project-modal'"
      name="add-employer-project-modal"
      ok-only
      ok-title="Close without saving"
    >
      <div>
        <ProjectForm
          v-if="employers"
          :editable-project="{ employerId: selectedProfileEmployer.employerId }"
          no-redirect
        />
        <div v-else>Loading employers...</div>
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
              v-for="profileProjectWithProjectData in profileProjectsWithProjectData.filter(ppwpd => ppwpd.project.employerId === profileEmployer.employerId)"
              :key="profileProjectWithProjectData.profileProject.id"
            >
              <EmployersProfileProject
                :profileProject="profileProjectWithProjectData.profileProject"
                :project="profileProjectWithProjectData.project"
              />
            </div>
          </div>
          <b-button
            v-b-modal="'add-employer-project-modal'"
            @click="profileEmployerClicked(profileEmployer)"
          >
            Add a new project
          </b-button>
        </div>
      </b-col>
    </b-row>
    <b-button
      v-show="selectedProfileEmployer.id"
      id="add-new-employer-button"
      @click="addNewProfileEmployer"
    >
      Add new work history entry
    </b-button>
    <EditProfileEmployer
      :profile-employer="selectedProfileEmployer"
    />
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { format, parse } from 'date-fns'
import { orderBy, cloneDeep } from 'lodash'
import EditProfileEmployer from './EditProfileEmployer'
import EmployersProfileProject from './EmployersProfileProject'
import { ProjectForm } from '../Project'

export default {
  name: 'Employers',
  components: {
    EditProfileEmployer,
    ProjectForm,
    EmployersProfileProject
  },
  props: {
    'profileId': Number
  },
  data () {
    return {
      selectedProfileEmployer: this.getEmptyProfileEmployer()
    }
  },
  computed: {
    ...mapGetters([
      'profileEmployersByProfileId',
      'currentLanguage',
      'employers',
      'profileProjectsByProfileId',
      'projects'
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
    deleteProfileEmployer () {
      this.removeProfileEmployer(this.selectedProfileEmployer)
        .then((data) => {
          this.$toasted.global.rytmi_success({
            message: 'Work history entry deleted.'
          })
          this.selectedProfileEmployer = this.getEmptyProfileEmployer()
          document.getElementById('employers-form').reset()
        })
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
</style>
