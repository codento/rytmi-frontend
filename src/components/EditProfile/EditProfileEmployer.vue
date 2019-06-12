<template>
  <b-form
    id="employer-form"
    @submit="onSubmit"
  >
    <b-row>
      <b-col cols="6">
        <b-form-group invalid-feedback="An existing employer must be chosen or the name of a new employer must be given.">
          <small for="employer-select">Select an existing employer</small>
          <v-select
            id="employer-select"
            v-model="selectedExistingEmployer"
            :options="vueSelectsEmployers"
          />
          <small>Or enter a new employer name</small>
          <b-input
            id="new-employer-name"
            v-model="profileEmployer.newEmployerName"
            type="text"
            placeholder="New employer name"
            :state="inputStates.employer"
            @input="selectedExistingEmployer = null"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <small :for="`profile-employer-start-date${profileEmployer.id}`">Start date *</small>
        <Datepicker
          :id="`profile-employer-start-date${profileEmployer.id}`"
          v-model="profileEmployer.startDate"
          :name="`profile-employer-start-date${profileEmployer.id}`"
          :is-valid="inputStates.startDate"
        />
        <small
          v-if="!inputStates.startDate && inputStates.startDate !== undefined"
          class="text-danger"
        >
          Required
        </small>
      </b-col>
      <b-col>
        <small :for="`profile-employer-end-date${profileEmployer.id}`">End date</small>
        <Datepicker
          :id="`profile-employer-end-date${profileEmployer.id}`"
          v-model="profileEmployer.endDate"
          :name="`profile-employer-end-date${profileEmployer.id}`"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group invalid-feedback="Required">
          <small for="title-fi">Job title (in Finnish) *</small>
          <b-input
            id="title-fi"
            v-model="profileEmployer.title['fi']"
            type="text"
            placeholder="Title (fi)"
            :state="inputStates.titleFi"
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group invalid-feedback="Required">
          <small for="title-en">Job title (in English) *</small>
          <b-input
            id="title-en"
            v-model="profileEmployer.title['en']"
            type="text"
            placeholder="Title (en)"
            :state="inputStates.titleEn"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group invalid-feedback="Required">
          <small for="description-fi">Job description (in Finnish) *</small>
          <b-textarea
            id="description-fi"
            v-model="profileEmployer.description['fi']"
            type="text"
            placeholder="Description (fi)"
            :state="inputStates.jobDescriptionFi"
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group invalid-feedback="Required">
          <small for="description-en">Job description (in English) *</small>
          <b-textarea
            id="description-en"
            v-model="profileEmployer.description['en']"
            type="text"
            placeholder="Description (en)"
            :state="inputStates.jobDescriptionEn"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col>
        <b-button
          id="submit"
          block
          type="submit"
          variant="primary"
        >
          {{ shouldUpdateProfileEmployer() ? 'Update work history entry' : 'Create a new work history entry' }}
        </b-button>
      </b-col>
    </b-row>
    <CollapsableItem
      v-if="profileEmployer.id && profileEmployer.id !== getEmployerId(internalCompany)"
      title="Projects for this employer"
      class="mt-4"
      :initial-visibility="true"
    >
      <b-row v-if="profileProjectsWithProjectData.length === 0">
        <b-col class="no-projects">
          <i class="fa fa-exclamation-circle notice" />
          No projects.
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col
          v-for="({ profileProject, project }, index) in profileProjectsWithProjectData"
          :key="profileProject.id"
          cols="12"
        >
          <div
            v-b-modal="`project-modal${profileProject.id}`"
            class="clickable mt-2 mb-2"
            @mouseover="showEditIconByIndex = index"
            @mouseout="showEditIconByIndex = null"
          >
            <span class="project-name mr-2">
              {{ project.name[currentLanguage] }} ({{ formatProjectDuration(profileProject.startDate, profileProject.endDate) }})
            </span>
            <span class="project-role">
              {{ profileProject.role[currentLanguage] }}
            </span>
            <span v-show="showEditIconByIndex === index">
              <i class="fa fa-pencil pull-right" />
            </span>
          </div>
          <b-modal
            :id="`project-modal${profileProject.id}`"
            size="lg"
            hide-header
            ok-only
            ok-title="Close"
            ok-variant="light"
            no-close-on-backdrop
          >
            <WorkHistoryProjectFormWrapper
              :editable-project="project"
              :profile-project="profileProject"
              :current-employer-id="project.employerId ? project.employerId : profileEmployer.employerId"
            />
          </b-modal>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button
            v-b-modal="'new-project-modal'"
            class="pull-right mt-2"
          >
            <i class="fa fa-plus" />
            Add a project
          </b-button>
        </b-col>
        <b-modal
          :id="'new-project-modal'"
          v-model="showNewProjectModal"
          size="lg"
          hide-header
          ok-only
          ok-title="Close"
          ok-variant="light"
          no-close-on-backdrop
        >
          <WorkHistoryProjectFormWrapper
            :editable-project="{ id: null, employerId: profileEmployer.employerId }"
            :profile-project="{ id: null, profileId: profileEmployer.profileId, employerId: profileEmployer.employerId, role: {en: '', fi: ''} }"
            :current-employer-id="profileEmployer.employerId"
            @close-modal="closeNewProjectModal()"
          />
        </b-modal>
      </b-row>
    </CollapsableItem>
  </b-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { isEmpty } from 'lodash'
import format from 'date-fns/format'
import Datepicker from '../helpers/Datepicker'
import vSelect from 'vue-select'
import CollapsableItem from '@/components/Common/CollapsableItem'
import WorkHistoryProjectFormWrapper from './WorkHistoryProjectFormWrapper'
import { INTERNAL_COMPANY_NAME } from '@/utils/constants'

export default {
  name: 'EditProfileEmployer',
  components: {
    Datepicker,
    vSelect,
    CollapsableItem,
    WorkHistoryProjectFormWrapper
  },
  props: {
    profileEmployer: Object,
    vueSelectsEmployers: Array
  },
  data () {
    return {
      showEditIconByIndex: null,
      selectedExistingEmployer: this.vueSelectsEmployers.find(employer => employer.id === this.profileEmployer.employerId),
      showNewProjectModal: false,
      showEditIcon: [],
      validated: false,
      internalCompany: INTERNAL_COMPANY_NAME
    }
  },
  computed: {
    ...mapGetters([
      'employers',
      'projects',
      'profileProjectsByProfileId',
      'currentLanguage'
    ]),
    profileProjectsWithProjectData () {
      return this.profileProjectsByProfileId(this.profileEmployer.profileId).map(pp => ({
        profileProject: pp,
        project: Object.values(this.projects).find(project => project.id === pp.projectId)
      })).filter(pp => pp.project.employerId === this.profileEmployer.employerId)
        .sort((a, b) => a.project.startDate - b.project.startDate)
    },
    inputStates () {
      return {
        titleFi: this.validated ? this.profileEmployer.title.fi.length > 0 : undefined,
        titleEn: this.validated ? this.profileEmployer.title.en.length > 0 : undefined,
        jobDescriptionFi: this.validated ? this.profileEmployer.description['fi'].length > 0 : undefined,
        jobDescriptionEn: this.validated ? this.profileEmployer.description['en'].length > 0 : undefined,
        startDate: this.validated ? new Date(this.profileEmployer.startDate) > 1 : undefined,
        employer: this.validated ? !(!this.selectedExistingEmployer && isEmpty(this.profileEmployer.newEmployerName)) : undefined
      }
    },
    endDateValidation () {
      if (this.selectedExistingEmployer) {
        return this.selectedExistingEmployer.label !== INTERNAL_COMPANY_NAME ? new Date(this.profileEmployer.endDate) > 1 : true
      } else {
        return new Date(this.profileEmployer.endDate) > 1
      }
    },
    formIsValid () {
      const stateArray = []
      // Required always
      for (let entry of Object.entries(this.inputStates)) {
        stateArray.push(entry[1])
      }
      return stateArray.every(item => item)
    }
  },
  watch: {
    selectedExistingEmployer: function () {
      this.profileEmployer.newEmployerName = ''
    }
  },
  methods: {
    ...mapActions([
      'createEmployer',
      'createProfileEmployer',
      'updateProfileEmployer'
    ]),
    getEmployerId (employerName) {
      return Object.values(this.employers).find(employer => employer.name === employerName).id
    },
    formatProjectDuration (startDate, endDate) {
      const formattedEndDate = endDate ? format(endDate, 'MM/YYYY') : ''
      return format(startDate, 'MM/YYYY') + '-' + formattedEndDate
    },
    async onSubmit (evt) {
      evt.preventDefault()
      this.validated = true
      if (!this.formIsValid) {
        return
      }
      this.validated = undefined
      if (this.shouldCreateANewEmployer()) {
        try {
          await this.createEmployer({ name: this.profileEmployer.newEmployerName })
        } catch (error) {
          this.$toasted.global.rytmi_error({
            message: `Couldn't create a new employer. ${error}`
          })
          return
        }
        this.$toasted.global.rytmi_success({
          message: 'A new employer created!'
        })
        const profileEmployer = { ...this.profileEmployer, employerId: this.getEmployerId(this.profileEmployer.newEmployerName) }
        this.updateOrCreateProfileEmployer(profileEmployer)
      } else {
        const profileEmployer = { ...this.profileEmployer, employerId: this.selectedExistingEmployer.id }
        this.updateOrCreateProfileEmployer(profileEmployer)
      }
    },
    async updateOrCreateProfileEmployer (profileEmployer) {
      // If the profileEmployer has an existing ID, update it; otherwise create a new profileEmployer
      if (this.shouldUpdateProfileEmployer()) {
        try {
          await this.updateProfileEmployer(profileEmployer)
          this.$toasted.global.rytmi_success({
            message: 'Work history entry updated!'
          })
        } catch (error) {
          this.$toasted.global.rytmi_error({
            message: `Work history entry couldn't be updated. Error: ${error}`
          })
        }
      } else {
        try {
          this.createProfileEmployer(profileEmployer)
            .then(response => {
              this.$emit('new-profile-employer-created', response)
              this.$toasted.global.rytmi_success({
                message: 'A new work history entry created!'
              })
              document.getElementById('employer-form').reset()
            })
        } catch (error) {
          this.$toasted.global.rytmi_error({
            message: `A new work history entry couldn't be created. Error: ${error}`
          })
        }
      }
    },
    shouldUpdateProfileEmployer () {
      return this.profileEmployer.id
    },
    shouldCreateANewEmployer () {
      return !this.selectedExistingEmployer
    },
    closeNewProjectModal () {
      this.showNewProjectModal = false
    }
  }
}
</script>

<style scoped >
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
</style>
