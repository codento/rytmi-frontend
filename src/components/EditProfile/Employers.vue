<template>
  <form
    id="employers-form"
    class="animated fadeIn"
  >
    <b-modal
      :id="'delete-modal'"
      name="delete-modal"
      hide-header
      centered
      ok-title="Delete"
      cancel-title="Cancel"
      @ok="deleteEmployer"
    >
      <div>
        <b-row>
          <b-col>
            Are you sure you want to delete this employer record?:
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <span class="employer-name">{{ selectedEmployer ? selectedEmployer.name : '' }}</span> <span>{{ getFormatedDate(selectedEmployer.startDate) + ' - ' + getFormatedDate(selectedEmployer.endDate) }}</span>
          </b-col>
        </b-row>
      </div>
    </b-modal>
    <h1>Previous employers</h1>
    <hr>

    <b-button
      id="add-new-employer-button"
      @click="addNewEmployer"
    >
      Add new employer
    </b-button>
    <b-row
      v-for="employer in employers"
      :key="employer.id"
      class="clickable"
      @click="employerClicked(employer)"
    >
      <b-col>
        <div>
          <span class="employer-name">{{ employer ? employer.name : '' }}</span> <span>{{ getFormatedDate(employer.startDate) + ' - ' + getFormatedDate(employer.endDate) }}</span>
          <i
            v-b-modal="'delete-modal'"
            class="fa fa-trash icon"
          />
        </div>
        <div class="details">
          <div class="title">
            {{ getEmployerDescriptionInCurrentLanguage(employer) ? getEmployerDescriptionInCurrentLanguage(employer).title : '' }}
          </div>
          <!-- Description has "white-space: pre-line" so keep the text on the same line as the div -->
          <div class="description">{{ getEmployerDescriptionInCurrentLanguage(employer) ? getEmployerDescriptionInCurrentLanguage(employer).description : '' }}
          </div>
        </div>
      </b-col>
    </b-row>
    <EditEmployer
      :employer="selectedEmployer"
    />
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { format, getDate, getMonth, getYear } from 'date-fns'
import { sortBy, cloneDeep } from 'lodash'
import EditEmployer from './EditEmployer'

export default {
  name: 'Employers',
  components: {
    EditEmployer
  },
  props: {
    'profileId': Number
  },
  data () {
    return {
      selectedEmployer: this.getEmptyEmployer()
    }
  },
  computed: {
    ...mapGetters([
      'employersByProfileId',
      'currentLanguage'
    ]),
    employers () {
      return sortBy(this.employersByProfileId(this.profileId), ['-startDate'])
    }
  },
  methods: {
    ...mapActions(['removeEmployer']),
    getFormatedDate (date) {
      return format(date, 'YYYY/MM')
    },
    getEmployerDescriptionInCurrentLanguage (employer) {
      return employer.descriptions.find(description => description.language === this.currentLanguage)
    },
    employerClicked (employer) {
      const clonedEmployer = cloneDeep(employer)
      clonedEmployer.startDate = new Date(getYear(clonedEmployer.startDate), getMonth(clonedEmployer.startDate), getDate(clonedEmployer.startDate))
      clonedEmployer.endDate = new Date(getYear(clonedEmployer.endDate), getMonth(clonedEmployer.endDate), getDate(clonedEmployer.endDate))
      this.selectedEmployer = clonedEmployer
    },
    addNewEmployer () {
      this.selectedEmployer = this.getEmptyEmployer()
    },
    getEmptyEmployer () {
      return {
        descriptions: [
          {
            description: '',
            title: '',
            language: 'fi'
          },
          {
            description: '',
            title: '',
            language: 'en'
          }
        ],
        endDate: null,
        id: null,
        name: '',
        profileId: this.profileId,
        startDate: null
      }
    },
    deleteEmployer () {
      this.removeEmployer(this.selectedEmployer)
        .then((data) => {
          this.$toasted.global.rytmi_success({
            message: 'Employer record deleted.'
          })
          this.selectedEmployer = this.getEmptyEmployer()
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
.details {
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
.icon:hover {
  color: red;
}
</style>
