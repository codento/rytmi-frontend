<template>
  <div>
    <div>
      <span
        v-b-modal="'create-or-edit-profile-employer-modal'"
        name="employer"
        class="employer-name"
      >
        {{ profileEmployer ? getEmployerName(profileEmployer.employerId) : '' }}
      </span>
      <span>
        {{ profileEmployer ? profileEmployer.title[currentLanguage] : '' }}
      </span>
      <span>{{ getFormatedDate(profileEmployer.startDate) + ' - ' + getFormatedDate(profileEmployer.endDate) }}</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'

export default {
  name: 'WorkHistoryEntry',
  props: {
    profileEmployer: Object,
    profileId: Number
  },
  computed: {
    ...mapGetters([
      'currentLanguage',
      'employers'
    ])
  },
  methods: {
    getFormatedDate (date) {
      return date ? format(date, 'MM/YYYY') : ''
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
    }
  }
}
</script>

<style scoped >
.employer-name {
  font-weight: bold;
  margin-right: 5px;
}
</style>
