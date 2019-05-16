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
          :options="existingEmployers"
        />
        <small>Or enter a new employer name</small>
        <b-input
          id="employer-name"
          v-model="employer.name"
          type="text"
          placeholder="New employer name"
          @input="selectedExistingEmployer = null"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <small for="employer-start-date">Start date</small>
        <Datepicker
          id="employer-start-date"
          v-model="employer.startDate"
          name="employer-start-date"
        />
      </b-col>
      <b-col>
        <small for="employer-end-date">End date</small>
        <Datepicker
          id="employer-end-date"
          v-model="employer.endDate"
          name="employer-end-date"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <small for="title-fi">Title (Finnish)</small>
        <b-input
          id="title-fi"
          v-model="employer.title['fi']"
          type="text"
          placeholder="Title (fi)"
        />
      </b-col>
      <b-col>
        <small for="title-en">Title (English)</small>
        <b-input
          id="title-en"
          v-model="employer.title['en']"
          type="text"
          placeholder="Title (en)"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <small for="description-fi">Description (Finnish)</small>
        <b-textarea
          id="description-fi"
          v-model="employer.description['fi']"
          type="text"
          placeholder="Description (fi)"
        />
      </b-col>
      <b-col>
        <small for="description-en">Description (English)</small>
        <b-textarea
          id="description-en"
          v-model="employer.description['en']"
          type="text"
          placeholder="Description (en)"
        />
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col>
        <b-button
          class="form-control"
          type="submit"
          primary
        >
          {{ shouldUpdateProfileEmployer() ? 'Update work history entry' : 'Create a new work history entry' }}
        </b-button>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { isEmpty, isDate } from 'lodash'
import Datepicker from '../helpers/Datepicker'
import vSelect from 'vue-select'
import sortBy from 'lodash/sortBy'

export default {
  name: 'EditEmployer',
  components: { Datepicker, vSelect },
  props: {
    'employer': Object
  },
  data () {
    return {
      selectedExistingEmployer: null
    }
  },
  computed: {
    ...mapGetters(['employers']),
    existingEmployers () {
      return sortBy(Object.values(this.employers).map(employer => ({
        label: employer.name,
        id: employer.id
      })),
      ['label'])
    }
  },
  watch: {
    employer: function (val, oldVal) {
      this.selectedExistingEmployer = this.existingEmployers.find(employer => employer.id === val.employerId)
    },
    selectedExistingEmployer: function (val, oldVal) {
      this.employer.name = ''
    }
  },
  methods: {
    ...mapActions([
      'createEmployer',
      'updateEmployer',
      'createProfileEmployer',
      'updateProfileEmployer'
    ]),
    getEmployerId (employerName) {
      return Object.values(this.employers).find(employer => employer.name === employerName).id
    },
    onSubmit (evt) {
      evt.preventDefault()
      if (this.isDataValidForSubmit()) {
        if (this.shouldCreateANewEmployer()) {
          this.createEmployer({ name: this.employer.name })
            .then(() => {
              this.$toasted.global.rytmi_success({
                message: 'A new employer created!'
              })
              const profileEmployer = { ...this.employer, employerId: this.getEmployerId(this.employer.name) }
              this.updateOrCreateProfileEmployer(profileEmployer)
            })
        } else {
          const profileEmployer = { ...this.employer, employerId: this.selectedExistingEmployer.id }
          this.updateOrCreateProfileEmployer(profileEmployer)
        }
      }
    },
    updateOrCreateProfileEmployer (profileEmployer) {
      // If the profileEmployer has an existing ID, update it; otherwise create a new profileEmployer
      if (this.shouldUpdateProfileEmployer()) {
        this.updateProfileEmployer(profileEmployer).then(() => {
          this.$toasted.global.rytmi_success({
            message: 'Work history entry updated!'
          })
          document.getElementById('employer-form').reset()
        })
      } else {
        this.createProfileEmployer(profileEmployer).then(() => {
          this.$toasted.global.rytmi_success({
            message: 'A new work history entry created!'
          })
          document.getElementById('employer-form').reset()
        })
      }
    },
    shouldUpdateProfileEmployer () {
      return this.employer.id
    },
    shouldCreateANewEmployer () {
      return !this.selectedExistingEmployer
    },
    isDataValidForSubmit () {
      let isDataValid = true
      if (!this.selectedExistingEmployer && isEmpty(this.employer.name)) {
        this.$toasted.global.rytmi_error({
          message: 'An existing employer must be chosen or the name of a new employer must be given.'
        })
        isDataValid = false
      }
      if (!isDate(this.employer.startDate)) {
        this.$toasted.global.rytmi_error({
          message: 'Start date must be given and it must be a valid date.'
        })
        isDataValid = false
      }
      if (this.employer.endDate && !isDate(this.employer.endDate)) {
        this.$toasted.global.rytmi_error({
          message: 'End date must be a valid date.'
        })
        isDataValid = false
      }
      return isDataValid
    }
  }
}
</script>

<style scoped >
button {
  width: 100%;
}
</style>
