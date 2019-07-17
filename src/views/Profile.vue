<template>
  <b-container class="animated fadeIn profile mt-2">
    <loading v-if="!profile" />
    <b-row v-else>
      <b-col cols="12">
        <div
          id="disabled-open-cv-tool-button-wrapper"
          class="float-right"
        >
          <b-btn
            id="open-cv-tool-button"
            v-b-modal.cv-tool-modal
            type="button"
            class="open-cv-tool-button"
            :disabled="!isAllowedToOpenCvTool"
          >
            Open CV tool
          </b-btn>
          <b-tooltip
            :disabled.sync="isAllowedToOpenCvTool"
            target="disabled-open-cv-tool-button-wrapper"
          >
            {{ disabledButtonInfo }}
          </b-tooltip>
        </div>
      </b-col>
      <b-col cols="12">
        <UserProfile
          :profile="profile"
        />
        <CvTool
          :profile="profile"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '../store'
import {
  CvTool,
  UserProfile
} from '../components/Profile'
import { INTERNAL_COMPANY_NAME } from '@/utils/constants'

export default {
  name: 'Profile',
  components: {
    CvTool,
    UserProfile
  },
  data () {
    return {
      showCvTool: false
    }
  },
  computed: {
    ...mapGetters([
      'profileById',
      'profileSkillsByProfileId',
      'profileEmployersByProfileId',
      'employers',
      'profileProjectsByProfileId'
    ]),
    profile () {
      return this.profileById(this.$route.params.id)
    },
    isAllowedToOpenCvTool: {
      get: function () {
        return this.profileSkillsByProfileId(this.profile.id).length !== 0 &&
          this.hasCodentoAsEmployer() &&
          this.profileProjectsByProfileId(this.profile.id).length !== 0
      },
      set: function () {}
    },
    disabledButtonInfo: function () {
      const missingInfo = []
      if (this.profileSkillsByProfileId(this.profile.id).length === 0) {
        missingInfo.push('At least one skill is needed.')
      }
      if (!this.hasCodentoAsEmployer()) {
        missingInfo.push('Must have Codento Oy as an employer.')
      }
      if (this.profileProjectsByProfileId(this.profile.id).length === 0) {
        missingInfo.push('At least one project is needed.')
      }
      return 'Required info missing: •'.concat(missingInfo.join(' •'))
    }
  },
  watch: {
    profile: function (val, oldVal) {
      if (val) {
        document.title = `Rytmi - ${val.firstName} ${val.lastName}`
      }
    }
  },
  methods: {
    getEmployerName (employerId) {
      const employer = Object.values(this.employers).find(employer => employer.id === employerId)
      return employer ? employer.name : ''
    },
    hasCodentoAsEmployer () {
      const employerNames = this.profileEmployersByProfileId(this.profile.id).map(profileEmployer => this.getEmployerName(profileEmployer.employerId))
      return employerNames.includes(INTERNAL_COMPANY_NAME)
    }
  },
  beforeRouteEnter (to, from, next) {
    store.dispatch('fetchPPsOfProfile', to.params.id)
    next()
  }
}
</script>

<style scoped>
.open-cv-tool-button {
  margin-bottom: 8px;
}
#disabled-open-cv-tool-button-wrapper {
  display: inline-block;
}

#disabled-open-cv-tool-button-wrapper .btn :disabled {
  /* don't let button block mouse events from reaching wrapper */
  pointer-events: none;
}
</style>
