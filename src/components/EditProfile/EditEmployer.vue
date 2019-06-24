<template>
  <b-form
    id="employer-form"
    @submit="onSubmit"
  >
    <b-row>
      <b-col cols="6">
        <b-form-group>
          <small for="employer-select">Select employer or create new by typing</small>
          <v-select
            id="employer-select"
            v-model="selectedEmployerOption"
            :class="!inputStates.selectedEmployer && inputStates.selectedEmployer !== undefined ? 'v-select-is-invalid' : ''"
            :options="vueSelectsEmployers"
            taggable
            push-tags
          />
          <i
            v-if="profileEmployer.employerId !== internalCompanyId"
            v-b-tooltip.hover
            title="Change name of existing employer"
            class="fa fa-pencil edit-employer-name-icon"
            v-b-modal.edit-employer-name
          />
          <b-modal
            id="edit-employer-name"
            title="Change employer name"
            @show="setEditableEmployer"
            @ok.prevent="handleUpdateEmployer"
          >
            <small :for="`edit-employer-name-input-${profileEmployer.id}`">Employer name</small>
            <b-input
              :id="`edit-employer-name-input-${profileEmployer.id}`"
              v-model="editedEmployerName"
              type="text"
              @keyup.enter="handleUpdateEmployer"
            />
          </b-modal>
          <small
            v-if="!inputStates.selectedEmployer && inputStates.selectedEmployer !== undefined"
            class="text-danger"
          >
            An existing employer must be chosen or the name of a new employer must be given.
          </small>
        </b-form-group>
      </b-col>
      <b-col cols="6">
        <b-button
          variant="danger"
          class="pull-right"
          @click="deleteEntry(profileEmployer)"
        >
          Delete entry
        </b-button>
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
        <small :for="`profile-employer-end-date${profileEmployer.id}`">{{ endDateLabel }}</small>
        <Datepicker
          :id="`profile-employer-end-date${profileEmployer.id}`"
          v-model="profileEmployer.endDate"
          :name="`profile-employer-end-date${profileEmployer.id}`"
          :is-valid="inputStates.endDate"
        />
        <small
          v-if="!inputStates.endDate && inputStates.endDate !== undefined"
          class="text-danger"
        >
          Required
        </small>
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
            placeholder="Job title in Finnish"
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
            placeholder="Job title in English"
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
            placeholder="Short description in Finnish about your role, tasks and projects while working for this employer"
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
            placeholder="Short description in English about your role, tasks and projects while working for this employer"
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
          {{ isNewEntry ? 'Create a new work history entry' : 'Update work history entry' }}
        </b-button>
      </b-col>
    </b-row>
    <EditEmployerProjectList
      v-if="profileEmployer.employerId && profileEmployer.employerId !== internalCompanyId"
      :employer-id="profileEmployer.employerId"
      :profile-id="profileEmployer.profileId"
    />
  </b-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Datepicker from '../helpers/Datepicker'
import vSelect from 'vue-select'
import EditEmployerProjectList from './EditEmployerProjectList'
import { INTERNAL_COMPANY_NAME } from '@/utils/constants'

export default {
  name: 'EditEmployer',
  components: {
    Datepicker,
    vSelect,
    EditEmployerProjectList
  },
  props: {
    profileEmployer: Object,
    vueSelectsEmployers: Array
  },
  data () {
    return {
      editedEmployerName: '',
      selectedEmployer: this.vueSelectsEmployers.find(employer => employer.id === this.profileEmployer.employerId),
      validated: false
    }
  },
  computed: {
    ...mapGetters([
      'employers',
      'employerByName'
    ]),
    selectedEmployerOption: {
      get () {
        return this.vueSelectsEmployers.find(employer => employer.id === this.profileEmployer.employerId)
      },
      set (item) {
        console.log(this.profileEmployer.employerId)
        this.selectedEmployer = item
        this.profileEmployer.employerId = item.id
      }
    },
    internalCompanyId () {
      return this.employerByName(INTERNAL_COMPANY_NAME).id
    },
    isNewEntry () {
      return !this.profileEmployer.id
    },
    shouldCreateNewEmployer () {
      return !this.selectedEmployer.id
    },
    endDateLabel () {
      if (this.selectedEmployer) {
        return `End date${this.selectedEmployer.label !== INTERNAL_COMPANY_NAME ? ' *' : ''}`
      } else return 'End date *'
    },
    inputStates () {
      return {
        titleFi: this.validated ? this.profileEmployer.title.fi.length > 0 : undefined,
        titleEn: this.validated ? this.profileEmployer.title.en.length > 0 : undefined,
        jobDescriptionFi: this.validated ? this.profileEmployer.description['fi'].length > 0 : undefined,
        jobDescriptionEn: this.validated ? this.profileEmployer.description['en'].length > 0 : undefined,
        startDate: this.validated ? new Date(this.profileEmployer.startDate) > 1 : undefined,
        endDate: this.validated ? this.endDateValidation : undefined,
        selectedEmployer: this.validated ? !!this.selectedEmployer : undefined
      }
    },
    endDateValidation () {
      if (this.selectedEmployer) {
        return this.selectedEmployer.label !== INTERNAL_COMPANY_NAME ? new Date(this.profileEmployer.endDate) > 1 : true
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
  methods: {
    ...mapActions([
      'createEmployer',
      'createProfileEmployer',
      'updateProfileEmployer',
      'removeProfileEmployer',
      'updateEmployer',
      'fetchEmployers'
    ]),
    async deleteEntry (profileEmployer) {
      const confirmation = confirm('Remove work history entry?')
      if (confirmation) {
        try {
          await this.removeProfileEmployer(profileEmployer)
        } catch (error) {
          this.$toasted.global.rytmi_error({
            message: `Could not remove work history entry. ${error}`
          })
        }
      }
    },
    async onSubmit (evt) {
      evt.preventDefault()
      this.validated = true
      if (this.formIsValid) {
        this.validated = undefined
        let employerId = this.selectedEmployer
        // Create new employer if needed
        if (this.shouldCreateNewEmployer) {
          try {
            const newEmployer = await this.createEmployer({ name: this.selectedEmployer.label })
            employerId = newEmployer.data
          } catch (error) {
            this.$toasted.global.rytmi_error({
              message: `Could not create a new employer. ${error}`
            })
          }
        }
        const profileEmployer = { ...this.profileEmployer, employerId: employerId.id }
        if (this.isNewEntry) {
          this.callCreateAction(profileEmployer)
        } else {
          this.callUpdateAction(profileEmployer)
        }
      }
    },
    async callCreateAction (profileEmployer) {
      try {
        const newProfileEmployer = this.createProfileEmployer(profileEmployer)
        this.$emit('new-profile-employer-created', newProfileEmployer)
      } catch (error) {
        this.$toasted.global.rytmi_error({
          message: `Could not create a new work history entry. ${error}`
        })
      }
    },
    async callUpdateAction (profileEmployer) {
      try {
        this.updateProfileEmployer(profileEmployer)
          .then(response => {
            this.$emit('new-profile-employer-created', response)
            this.$toasted.global.rytmi_success({
              message: 'Work history entry updated'
            })
            document.getElementById('employer-form').reset()
          })
      } catch (error) {
        this.$toasted.global.rytmi_error({
          message: `Could not update work history entry. ${error}`
        })
      }
    },
    async handleUpdateEmployer () {
      try {
        await this.updateEmployer({ id: this.selectedEmployer.id, name: this.editedEmployerName })
        this.$bvModal.hide('edit-employer-name')
        this.$toasted.global.rytmi_success({
          message: 'Employer name updated.'
        })
      } catch (error) {
        this.$toasted.global.rytmi_error({
          message: `Could not update employer name. Error: ${error.response.data.error.details.toString()}`
        })
      }
    },
    setEditableEmployer () {
      this.editedEmployerName = this.selectedEmployerOption.label
    }
  }
}
</script>

<style scoped>
  .v-select-is-invalid {
    border: 0;
    border-color: #f86c6b;
    padding-right: calc(1.5em + 0.75rem);
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='%23f86c6b' viewBox='-2 -2 7 7'%3e%3cpath stroke='%23f86c6b' d='M0 0l3 3m0-3L0 3'/%3e%3ccircle r='.5'/%3e%3ccircle cx='3' r='.5'/%3e%3ccircle cy='3' r='.5'/%3e%3ccircle cx='3' cy='3' r='.5'/%3e%3c/svg%3E");
    background-repeat: no-repeat;
    background-position: center right calc(0.375em + 0.1875rem);
    background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    outline: 1px #f86c6b solid;
    outline-offset: -1px;
  }
  #employer-form {
    cursor: default;
  }
  .edit-employer-name-icon {
    position: absolute;
    right: -4px;
    bottom: 30px;
    color: gray;
  }
  .edit-employer-name-icon:hover {
    cursor: pointer;
    color: black;
  }
</style>
<style>
  #employer-select {
    height: 35px;
  }
  #employer-select div.dropdown-toggle {
    height: 35px;
  }
</style>
