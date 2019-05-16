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
    <h1>Previous and current employers</h1>
    <hr>
    <b-row
      v-for="employer in profileEmployers"
      :key="employer.id"
    >
      <b-col>
        <div>
          <span
            class="employer-name clickable"
            @click="employerClicked(employer)"
          >
            {{ employer ? getEmployerName(employer.employerId) : '' }}</span> <span>{{ getFormatedDate(employer.startDate) + ' - ' + getFormatedDate(employer.endDate) }}</span>
          <i
            v-b-modal="'delete-modal'"
            class="fa fa-trash icon"
            @click="employerClicked(employer)"
          />
        </div>
        <div class="details">
          <div class="title">
            {{ getEmployerDescriptionInCurrentLanguage(employer) ? getEmployerDescriptionInCurrentLanguage(employer).title : '' }}
          </div>
          <div class="description">
            {{ getEmployerDescriptionInCurrentLanguage(employer) ? getEmployerDescriptionInCurrentLanguage(employer).description : '' }}
          </div>
        </div>
      </b-col>
    </b-row>
    <b-button
      v-show="selectedProfileEmployer.id"
      id="add-new-employer-button"
      @click="addNewProfileEmployer"
    >
      Add new employer
    </b-button>
    <EditEmployer
      :employer="selectedProfileEmployer"
    />
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { format, getDate, getMonth, parse } from 'date-fns'
import { orderBy, cloneDeep } from 'lodash'
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
      selectedProfileEmployer: this.getEmptyProfileEmployer()
    }
  },
  computed: {
    ...mapGetters([
      'profileEmployersByProfileId',
      'currentLanguage',
      'employers'
    ]),
    profileEmployers () {
      const employers = this.profileEmployersByProfileId(this.profileId).map(employer => ({
        ...employer,
        startDate: employer.startDate ? parse(employer.startDate) : null,
        endDate: employer.endDate ? parse(employer.endDate) : null
      }))
      return orderBy(employers, ['startDate'], ['desc'])
    }
  },
  methods: {
    ...mapActions(['removeProfileEmployer']),
    getFormatedDate (date) {
      return date ? format(date, 'YYYY/MM') : ''
    },
    getEmployerDescriptionInCurrentLanguage (employer) {
      return employer.description[this.currentLanguage]
    },
    employerClicked (employer) {
      this.selectedProfileEmployer = cloneDeep(employer)
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
