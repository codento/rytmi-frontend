<template>
  <b-form
    id="employer-form"
    @submit="onSubmit"
  >
    <b-row>
      <b-col cols="6">
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
          @input="selectedExistingEmployer = null"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <small :for="`profile-employer-start-date${profileEmployer.id}`">Start date</small>
        <Datepicker
          :id="`profile-employer-start-date${profileEmployer.id}`"
          v-model="profileEmployer.startDate"
          :name="`profile-employer-start-date${profileEmployer.id}`"
        />
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
        <small for="title-fi">Job title (in Finnish)</small>
        <b-input
          id="title-fi"
          v-model="profileEmployer.title['fi']"
          type="text"
          placeholder="Title (fi)"
        />
      </b-col>
      <b-col>
        <small for="title-en">Job title (in English)</small>
        <b-input
          id="title-en"
          v-model="profileEmployer.title['en']"
          type="text"
          placeholder="Title (en)"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <small for="description-fi">Job description (in Finnish)</small>
        <b-textarea
          id="description-fi"
          v-model="profileEmployer.description['fi']"
          type="text"
          placeholder="Description (fi)"
        />
      </b-col>
      <b-col>
        <small for="description-en">Job description (in English)</small>
        <b-textarea
          id="description-en"
          v-model="profileEmployer.description['en']"
          type="text"
          placeholder="Description (en)"
        />
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col>
        <b-button
          id="submit"
          class="form-control"
          type="submit"
          variant="primary"
        >
          {{ shouldUpdateProfileEmployer() ? 'Update work history entry' : 'Create a new work history entry' }}
        </b-button>
      </b-col>
    </b-row>
    <CollapsableItem
      v-if="profileEmployer.id"
      title="Projects for this employer"
      class="mt-2"
    >
      <b-row>
        <b-col>
          <div
            v-if="profileProjectsWithProjectData.length === 0"
            class="no-projects"
          >
            No projects.
          </div>
          <div
            v-for="profileProjectWithProjectData in profileProjectsWithProjectData"
            v-else
            :key="profileProjectWithProjectData.profileProject.id"
          >
            <EmployersProfileProject
              v-b-modal="`project-modal${profileProjectWithProjectData.profileProject.id}`"
              class="clickable"
              :profile-project="profileProjectWithProjectData.profileProject"
              :project="profileProjectWithProjectData.project"
              @projectClicked="projectClicked($event)"
            />
            <b-modal
              :id="`project-modal${profileProjectWithProjectData.profileProject.id}`"
              size="lg"
              hide-header
              ok-only
              ok-title="Close"
              ok-variant="light"
              no-close-on-backdrop
            >
              <WorkHistoryProjectFormWrapper
                :editable-project="profileProjectWithProjectData.project"
                :profile-project="profileProjectWithProjectData.profileProject"
                :current-employer-id="profileProjectWithProjectData.project.employerId ? profileProjectWithProjectData.project.employerId : profileEmployer.employerId"
              />
            </b-modal>
          </div>
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
            :editable-project="emptyProfileProjectWithProjectData.project"
            :profile-project="emptyProfileProjectWithProjectData.profileProject"
            :current-employer-id="emptyProfileProjectWithProjectData.project.employerId"
            @close-modal="closeNewProjectModal()"
          />
        </b-modal>
      </b-row>
    </CollapsableItem>
  </b-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { isEmpty, isDate } from 'lodash'
import Datepicker from '../helpers/Datepicker'
import vSelect from 'vue-select'
import EmployersProfileProject from './EmployersProfileProject'
import CollapsableItem from '@/components/Common/CollapsableItem'
import WorkHistoryProjectFormWrapper from './WorkHistoryProjectFormWrapper'

export default {
  name: 'EditProfileEmployer',
  components: {
    Datepicker,
    vSelect,
    EmployersProfileProject,
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
      emptyProfileProjectWithProjectData: {
        project: { id: null, employerId: this.profileEmployer.employerId },
        profileProject: { id: null, profileId: this.profileEmployer.profileId }
      },
      showNewProjectModal: false
    }
  },
  computed: {
    ...mapGetters([
      'employers',
      'projects',
      'profileProjectsByProfileId'
    ]),
    profileProjectsWithProjectData () {
      return this.profileProjectsByProfileId(this.profileEmployer.profileId).map(pp => ({
        profileProject: pp,
        project: Object.values(this.projects).find(project => project.id === pp.projectId)
      })).filter(pp => pp.project.employerId === this.profileEmployer.employerId)
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
    async onSubmit (evt) {
      evt.preventDefault()
      if (!this.isDataValidForSubmit()) {
        return
      }
      if (this.shouldCreateANewEmployer()) {
        try {
          await this.createEmployer({ name: this.profileEmployer.newEmployerName })
        } catch (error) {
          console.log(error)
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
          await this.createProfileEmployer(profileEmployer)
          this.$toasted.global.rytmi_success({
            message: 'A new work history entry created!'
          })
          document.getElementById('employer-form').reset()
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
    isDataValidForSubmit () {
      let isDataValid = true
      if (!this.selectedExistingEmployer && isEmpty(this.profileEmployer.newEmployerName)) {
        this.$toasted.global.rytmi_error({
          message: 'An existing employer must be chosen or the name of a new employer must be given.'
        })
        isDataValid = false
      }
      if (!isDate(this.profileEmployer.startDate)) {
        this.$toasted.global.rytmi_error({
          message: 'Start date must be given and it must be a valid date.'
        })
        isDataValid = false
      }
      if (this.profileEmployer.endDate && !isDate(this.profileEmployer.endDate)) {
        this.$toasted.global.rytmi_error({
          message: 'End date must be a valid date.'
        })
        isDataValid = false
      }
      return isDataValid
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
</style>
