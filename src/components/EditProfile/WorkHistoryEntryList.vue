<template>
  <form
    id="employers-form"
    class="animated fadeIn"
  >
    <b-row
      v-for="profileEmployer in profileEmployers"
      :key="profileEmployer.id"
    >
      <b-col>
        <WorkHistoryEntry
          :profile-employer="profileEmployer"
          :profile-id="profileId"
        />
      </b-col>
    </b-row>
    <div
      v-if="profileEmployers.length === 0"
      class="text-muted"
    >
      No work history added
    </div>
  </form>
</template>

<script>
import { mapGetters } from 'vuex'
import { parse } from 'date-fns'
import { orderBy } from 'lodash'
import WorkHistoryEntry from './WorkHistoryEntry'

export default {
  name: 'WorkHistoryEntryList',
  components: {
    WorkHistoryEntry
  },
  props: {
    profileId: Number
  },
  data () {
    return {
      activeProject: null,
      showProjectModal: false,
      showProfileProjectModal: false,
      activeProfileProject: null
    }
  },
  computed: {
    ...mapGetters([
      'profileEmployersByProfileId',
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
  }
}
</script>

<style scoped >

</style>
