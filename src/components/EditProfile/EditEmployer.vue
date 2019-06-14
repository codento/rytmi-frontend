<template>
  <b-form
    id="employer-form"
    @submit="onSubmit"
  >
    <b-row>
      <b-col cols="6">
        <b-form-group invalid-feedback="An existing employer must be chosen or the name of a new employer must be given.">
          <small for="employer-select">Select employer or create new by typing</small>
          <v-select
            id="employer-select"
            v-model="selectedEmployer"
            :options="vueSelectsEmployers"
            taggable
            push-tags
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
          {{ shouldUpdateProfileEmployer ? 'Update work history entry' : 'Create a new work history entry' }}
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
import { isEmpty } from 'lodash'
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
      selectedEmployer: this.vueSelectsEmployers.find(employer => employer.id === this.profileEmployer.employerId),
      validated: false
    }
  },
  computed: {
    ...mapGetters([
      'employers',
      'employerByName'
    ]),
    internalCompanyId () {
      return this.employerByName(INTERNAL_COMPANY_NAME).id
    },
    shouldUpdateProfileEmployer () {
      return this.profileEmployer.id
    },
    shouldCreateANewEmployer () {
      return !this.selectedEmployer
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
        employer: this.validated ? !(!this.selectedEmployer && isEmpty(this.profileEmployer.newEmployerName)) : undefined
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
      'updateProfileEmployer'
    ]),
    async onSubmit (evt) {
      evt.preventDefault()
      this.validated = true
      if (!this.formIsValid) {
        return
      }
      this.validated = undefined
      if (this.shouldCreateANewEmployer) {
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
        const profileEmployer = { ...this.profileEmployer, employerId: this.employerByName(this.profileEmployer.newEmployerName).id }
        this.updateOrCreateProfileEmployer(profileEmployer)
      } else {
        const profileEmployer = { ...this.profileEmployer, employerId: this.selectedEmployer.id }
        this.updateOrCreateProfileEmployer(profileEmployer)
      }
    },
    async updateOrCreateProfileEmployer (profileEmployer) {
      // If the profileEmployer has an existing ID, update it; otherwise create a new profileEmployer
      if (this.shouldUpdateProfileEmployer) {
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
    }
  }
}
</script>
