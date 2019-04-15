<template>
  <b-form
    id="employer-form"
    @submit="onSubmit"
  >
    <b-row>
      <b-col>
        <small for="employer-name">Employer name</small>
        <b-input
          v-model="employer.name"
          type="text"
          placeholder="Employer name"
          id="employer-name"
        />
      </b-col>
      <b-col>
        <small for="employer-start-date">Start date</small>
        <Datepicker
          v-model="employer.startDate"
          name="employer-start-date"
          id="employer-start-date"
        />
      </b-col>
      <b-col>
        <small for="employer-end-date">End date</small>
        <Datepicker
          v-model="employer.endDate"
          name="employer-end-date"
          id="employer-end-date"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <small for="title-fi">Title (Finnish)</small>
        <b-input
          v-model="descriptionFi.title"
          type="text"
          placeholder="Title (fi)"
          id="title-fi"
        />
      </b-col>
      <b-col>
        <small for="title-en">Title (English)</small>
        <b-input
          v-model="descriptionEn.title"
          type="text"
          placeholder="Title (en)"
          id="title-en"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <small for="description-fi">Description (Finnish)</small>
        <b-textarea
          v-model="descriptionFi.description"
          type="text"
          placeholder="Description (fi)"
          id="description-fi"
        />
      </b-col>
      <b-col>
        <small for="description-en">Description (English)</small>
        <b-textarea
          v-model="descriptionEn.description"
          type="text"
          placeholder="Description (en)"
          id="description-en"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-button
          class="form-control"
          type="submit"
          primary
        >
          {{ shouldUpdateEmployer() ? 'Update employer' : 'Create new employer' }}
        </b-button>
      </b-col>
    </b-row>
  </b-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { format } from 'date-fns'
import { sortBy, isEmpty, isDate } from 'lodash'
import Datepicker from '../helpers/Datepicker'

export default {
  name: 'EditEmployer',
  components: { Datepicker },
  props: {
    'employer': Object
  },
  data () {
    return {
      showError: false,
      errorDetails: [],
    }
  },
  computed: {
    ...mapGetters([

    ]),
    descriptionFi () {
      return this.getEmployerDescriptionByLanguage(this.employer, 'fi')
    },
    descriptionEn () {
      return this.getEmployerDescriptionByLanguage(this.employer, 'en')
    }
  },
  methods: {
    ...mapActions([
      'createEmployer',
      'updateEmployer'
    ]),
    getEmployerDescriptionByLanguage (employer, language) {
      return employer.descriptions.find(description => description.language === language)
    },
    onSubmit (evt) {
      evt.preventDefault()
      if (this.isDataValidForSubmit()) {
        this.errorDetails = []
        // If the employer has an ID, update; otherwise create a new employer
        if (this.shouldUpdateEmployer()) {
          this.updateEmployer(this.employer)
            .then((data) => {
              this.$toasted.global.rytmi_success({
                message: 'Employer updated!'
              })
              this.showError = false
            })
            .catch(err => {
              this.errorDetails = err.response.data.error.details
              this.showError = true
            })
        } else {
          this.createEmployer(this.employer)
            .then((data) => {
              this.$toasted.global.rytmi_success({
                message: 'Employer added!'
              })
              document.getElementById('employer-form').reset()
              this.showError = false
            }).catch(err => {
              if (Array.isArray(err.data.error.details)) {
                this.errorDetails = err.data.error.details
              } else {
                this.errorDetails.push(err.data.error.message)
              }
              this.showError = true
            })
        }
      }
    },
    shouldUpdateEmployer () {
      return this.employer.id
    },
    isDataValidForSubmit () {
      let isDataValid = true
      if (isEmpty(this.employer.name)) {
        this.$toasted.global.rytmi_error({
          message: 'Employer name must be given.'
        })
        isDataValid = false
      }
      if (!isDate(this.employer.startDate)) {
        this.$toasted.global.rytmi_error({
          message: 'Start date must be given and it must be a valid date.'
        })
        isDataValid = false
      }
      if (!isDate(this.employer.endDate)) {
        this.$toasted.global.rytmi_error({
          message: 'End date must be given and it must be a valid date.'
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
